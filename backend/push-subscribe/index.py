"""
Управление Web Push подписками мастеров и клиентов.
POST {action:'subscribe', master_id|user_id, endpoint, p256dh, auth} — сохранить подписку
POST {action:'unsubscribe', endpoint} — удалить подписку
GET  ?vapid_public_key=1 — получить публичный VAPID ключ
"""
import json
import os
import psycopg2

SCHEMA = "t_p3896276_service_station_app"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def ok(data):
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data)}


def err(msg, code=400):
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": msg})}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    if method == "GET" and params.get("vapid_public_key"):
        return ok({"vapid_public_key": os.environ.get("VAPID_PUBLIC_KEY", "")})

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        action = body.get("action")
        endpoint = body.get("endpoint")

        if not endpoint:
            return err("endpoint обязателен")

        master_id = body.get("master_id")
        user_id = body.get("user_id")

        if not master_id and not user_id:
            return err("master_id или user_id обязателен")

        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()

        if action == "subscribe":
            p256dh = body.get("p256dh", "")
            auth = body.get("auth", "")
            if not p256dh or not auth:
                cur.close(); conn.close()
                return err("p256dh и auth обязательны")
            cur.execute(
                f"""
                INSERT INTO {SCHEMA}.push_subscriptions (master_id, user_id, endpoint, p256dh, auth)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (endpoint) DO UPDATE
                  SET master_id = EXCLUDED.master_id,
                      user_id   = EXCLUDED.user_id,
                      p256dh    = EXCLUDED.p256dh,
                      auth      = EXCLUDED.auth
                """,
                (
                    int(master_id) if master_id else 0,
                    int(user_id) if user_id else None,
                    endpoint, p256dh, auth,
                ),
            )
            conn.commit(); cur.close(); conn.close()
            return ok({"ok": True})

        if action == "unsubscribe":
            cur.execute(
                f"DELETE FROM {SCHEMA}.push_subscriptions WHERE endpoint = %s",
                (endpoint,),
            )
            conn.commit(); cur.close(); conn.close()
            return ok({"ok": True})

        cur.close(); conn.close()
        return err("Неизвестное действие")

    return err("Метод не поддерживается", 405)