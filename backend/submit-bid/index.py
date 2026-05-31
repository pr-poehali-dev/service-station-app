"""
Мастер оставляет отклик на запрос клиента с предложенной ценой.
После отклика клиенту автоматически отправляется уведомление.
"""
import json
import os
import psycopg2

SCHEMA = "t_p3896276_service_station_app"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    request_id = body.get("request_id")
    master_id = body.get("master_id")
    price = body.get("price")
    comment = body.get("comment", "")

    if not all([request_id, master_id, price]):
        return {
            "statusCode": 400,
            "headers": CORS,
            "body": json.dumps({"error": "request_id, master_id и price обязательны"}),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    # Проверяем запрос и получаем client_id за один запрос
    cur.execute(
        f"SELECT status, client_id, service FROM {SCHEMA}.requests WHERE id = %s",
        (request_id,),
    )
    row = cur.fetchone()
    if not row:
        cur.close(); conn.close()
        return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Запрос не найден"})}
    if row[0] != "open":
        cur.close(); conn.close()
        return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Запрос уже закрыт"})}

    client_id = row[1]
    service_name = row[2]

    cur.execute(
        f"SELECT id FROM {SCHEMA}.bids WHERE request_id = %s AND master_id = %s",
        (request_id, master_id),
    )
    if cur.fetchone():
        cur.close(); conn.close()
        return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Вы уже откликались на этот запрос"})}

    # Создаём отклик
    cur.execute(
        f"""
        INSERT INTO {SCHEMA}.bids (request_id, master_id, price, comment, status)
        VALUES (%s, %s, %s, %s, 'pending')
        RETURNING id, created_at
        """,
        (request_id, master_id, price, comment),
    )
    bid_id, created_at = cur.fetchone()

    # Получаем данные мастера
    cur.execute(
        f"SELECT name, station FROM {SCHEMA}.masters WHERE id = %s",
        (master_id,),
    )
    master = cur.fetchone()
    master_name = master[0] if master else "Мастер"
    station = master[1] if master else ""

    # Уведомляем клиента, если есть client_id
    if client_id:
        price_fmt = f"{int(price):,}".replace(",", " ") + " ₽"
        notif_text = f"{master_name} ({station}) предлагает {price_fmt}"
        if comment:
            notif_text += f" — «{comment[:80]}»"
        cur.execute(
            f"""
            INSERT INTO {SCHEMA}.notifications
                (user_id, type, title, text, request_id)
            VALUES (%s, 'new_bid', %s, %s, %s)
            """,
            (client_id, f"Новый отклик на «{service_name}»", notif_text, request_id),
        )

    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({
            "bid_id": bid_id,
            "request_id": request_id,
            "master_name": master_name,
            "station": station,
            "price": price,
            "comment": comment,
            "created_at": str(created_at),
        }, ensure_ascii=False),
    }
