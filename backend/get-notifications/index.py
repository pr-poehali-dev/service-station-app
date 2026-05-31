"""
Получение уведомлений для пользователя или мастера.
GET /?master_id=1   — уведомления мастера
GET /?user_id=1     — уведомления клиента
POST {"ids": [1,2,3]} — пометить прочитанными
"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
}

SCHEMA = "t_p3896276_service_station_app"


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    if event.get("httpMethod") == "POST":
        body = json.loads(event.get("body") or "{}")
        ids = body.get("ids", [])
        if ids:
            cur.execute(
                f"UPDATE {SCHEMA}.notifications SET is_read = TRUE WHERE id = ANY(%s)",
                (ids,),
            )
            conn.commit()
        cur.close(); conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    params = event.get("queryStringParameters") or {}
    master_id = params.get("master_id")
    user_id = params.get("user_id")

    if master_id:
        cur.execute(
            f"""
            SELECT id, type, title, text, request_id, is_read, created_at
            FROM {SCHEMA}.notifications
            WHERE master_id = %s
            ORDER BY created_at DESC
            LIMIT 50
            """,
            (master_id,),
        )
    elif user_id:
        cur.execute(
            f"""
            SELECT id, type, title, text, request_id, is_read, created_at
            FROM {SCHEMA}.notifications
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 50
            """,
            (user_id,),
        )
    else:
        cur.close(); conn.close()
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "master_id или user_id обязателен"})}

    rows = cur.fetchall()
    cur.close(); conn.close()

    notifs = []
    for r in rows:
        created = r[6]
        notifs.append({
            "id": r[0],
            "type": r[1],
            "title": r[2],
            "text": r[3],
            "request_id": r[4],
            "is_read": r[5],
            "created_at": str(created),
        })

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"notifications": notifs, "unread": sum(1 for n in notifs if not n["is_read"])}, ensure_ascii=False),
    }
