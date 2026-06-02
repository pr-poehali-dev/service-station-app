"""
API для управления автомобилями пользователя.
GET  ?user_id=N       — список авто пользователя
POST {action:'add'}   — добавить авто
POST {action:'delete'} — удалить авто
"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    method = event.get("httpMethod", "GET")

    if method == "GET":
        params = event.get("queryStringParameters") or {}
        user_id = params.get("user_id")
        if not user_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "user_id обязателен"})}

        cur.execute(
            """
            SELECT id, brand, model, year, vin, created_at
            FROM t_p3896276_service_station_app.user_cars
            WHERE user_id = %s
            ORDER BY created_at DESC
            """,
            (int(user_id),),
        )
        cols = ["id", "brand", "model", "year", "vin", "created_at"]
        cars = []
        for row in cur.fetchall():
            car = dict(zip(cols, row))
            car["created_at"] = str(car["created_at"])
            cars.append(car)

        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"cars": cars})}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        action = body.get("action", "add")

        if action == "add":
            user_id = body.get("user_id")
            brand = body.get("brand", "").strip()
            model = body.get("model", "").strip()
            year = body.get("year")
            vin = body.get("vin", "").strip() or None

            if not user_id or not brand or not model or not year:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "user_id, brand, model, year обязательны"})}

            cur.execute(
                """
                INSERT INTO t_p3896276_service_station_app.user_cars (user_id, brand, model, year, vin)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, brand, model, year, vin, created_at
                """,
                (int(user_id), brand, model, int(year), vin),
            )
            row = cur.fetchone()
            car = {"id": row[0], "brand": row[1], "model": row[2], "year": row[3], "vin": row[4], "created_at": str(row[5])}
            conn.commit()
            cur.close()
            conn.close()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"car": car})}

        if action == "delete":
            car_id = body.get("car_id")
            user_id = body.get("user_id")
            if not car_id or not user_id:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "car_id и user_id обязательны"})}

            cur.execute(
                "UPDATE t_p3896276_service_station_app.user_cars SET id = id WHERE id = %s AND user_id = %s RETURNING id",
                (int(car_id), int(user_id)),
            )
            if not cur.fetchone():
                conn.close()
                return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Автомобиль не найден"})}

            cur.execute(
                "DELETE FROM t_p3896276_service_station_app.user_cars WHERE id = %s AND user_id = %s",
                (int(car_id), int(user_id)),
            )
            conn.commit()
            cur.close()
            conn.close()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "Метод не поддерживается"})}
