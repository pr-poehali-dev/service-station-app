"""
Отправка Web Push уведомлений мастерам и клиентам.
POST {master_ids: [int], title, body, data} — отправить push мастерам
POST {user_ids: [int], title, body, data}   — отправить push клиентам
"""
import json
import os
import psycopg2
from pywebpush import webpush, WebPushException

SCHEMA = "t_p3896276_service_station_app"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    master_ids = body.get("master_ids", [])
    user_ids = body.get("user_ids", [])
    title = body.get("title", "Уведомление")
    body_text = body.get("body", "")
    data = body.get("data", {})

    if not master_ids and not user_ids:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "master_ids или user_ids обязателен"})}

    vapid_private = os.environ.get("VAPID_PRIVATE_KEY", "")
    vapid_public = os.environ.get("VAPID_PUBLIC_KEY", "")
    vapid_email = os.environ.get("VAPID_EMAIL", "mailto:admin@autotech.app")

    if not vapid_private or not vapid_public:
        return {"statusCode": 500, "headers": CORS, "body": json.dumps({"error": "VAPID ключи не настроены"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    subscriptions = []

    if master_ids:
        placeholders = ",".join(["%s"] * len(master_ids))
        cur.execute(
            f"SELECT endpoint, p256dh, auth FROM {SCHEMA}.push_subscriptions WHERE master_id IN ({placeholders})",
            master_ids,
        )
        subscriptions += cur.fetchall()

    if user_ids:
        placeholders = ",".join(["%s"] * len(user_ids))
        cur.execute(
            f"SELECT endpoint, p256dh, auth FROM {SCHEMA}.push_subscriptions WHERE user_id IN ({placeholders})",
            user_ids,
        )
        subscriptions += cur.fetchall()

    cur.close(); conn.close()

    payload = json.dumps({"title": title, "body": body_text, "data": data})
    sent = 0
    for endpoint, p256dh, auth in subscriptions:
        try:
            webpush(
                subscription_info={"endpoint": endpoint, "keys": {"p256dh": p256dh, "auth": auth}},
                data=payload,
                vapid_private_key=vapid_private,
                vapid_claims={"sub": vapid_email},
            )
            sent += 1
        except WebPushException:
            pass

    return {"statusCode": 200, "headers": CORS, "body": json.dumps({"sent": sent, "total": len(subscriptions)})}
