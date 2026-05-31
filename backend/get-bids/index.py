"""
Получение откликов и входящих заявок.
GET /?request_id=123          — отклики по заявке клиента
GET /?master_id=N&mode=incoming — входящие заявки для мастера (новые, не закрытые)
GET /?master_id=N&mode=mybids   — мои отклики (история откликов мастера)
"""
import json
import os
import psycopg2

SCHEMA = "t_p3896276_service_station_app"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    params = event.get("queryStringParameters") or {}
    request_id = params.get("request_id")
    master_id = params.get("master_id")
    mode = params.get("mode", "incoming")

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    # ── Режим: входящие заявки для мастера ────────────────────────────────────
    if master_id and mode == "incoming":
        cur.execute(
            f"""
            SELECT r.id, r.service, r.category, r.car, r.description,
                   r.status, r.created_at, r.target_master_id,
                   EXISTS(
                     SELECT 1 FROM {SCHEMA}.bids b2
                     WHERE b2.request_id = r.id AND b2.master_id = %s
                   ) AS already_bid
            FROM {SCHEMA}.requests r
            WHERE r.status = 'open'
              AND (r.target_master_id IS NULL OR r.target_master_id = %s)
            ORDER BY r.created_at DESC
            LIMIT 50
            """,
            (master_id, master_id),
        )
        rows = cur.fetchall()
        requests = []
        for row in rows:
            requests.append({
                "id": row[0], "service": row[1], "category": row[2],
                "car": row[3], "description": row[4], "status": row[5],
                "created_at": str(row[6]), "target_master_id": row[7],
                "already_bid": row[8],
            })
        cur.close(); conn.close()
        return {
            "statusCode": 200, "headers": CORS,
            "body": json.dumps({"requests": requests, "count": len(requests)}, ensure_ascii=False),
        }

    # ── Режим: мои отклики (история) ──────────────────────────────────────────
    if master_id and mode == "mybids":
        cur.execute(
            f"""
            SELECT b.id, b.price, b.comment, b.status, b.created_at,
                   r.id, r.service, r.category, r.car, r.description, r.status, r.created_at
            FROM {SCHEMA}.bids b
            JOIN {SCHEMA}.requests r ON r.id = b.request_id
            WHERE b.master_id = %s
            ORDER BY b.created_at DESC
            LIMIT 50
            """,
            (master_id,),
        )
        rows = cur.fetchall()
        bids = []
        for row in rows:
            bids.append({
                "bid_id": row[0], "price": row[1], "comment": row[2],
                "bid_status": row[3], "bid_created_at": str(row[4]),
                "request": {
                    "id": row[5], "service": row[6], "category": row[7],
                    "car": row[8], "description": row[9],
                    "status": row[10], "created_at": str(row[11]),
                },
            })
        cur.close(); conn.close()
        return {
            "statusCode": 200, "headers": CORS,
            "body": json.dumps({"bids": bids, "count": len(bids)}, ensure_ascii=False),
        }

    # ── Режим: отклики по конкретной заявке ───────────────────────────────────
    if not request_id:
        cur.close(); conn.close()
        return {
            "statusCode": 400, "headers": CORS,
            "body": json.dumps({"error": "request_id или master_id обязателен"}),
        }

    cur.execute(
        f"""
        SELECT r.id, r.service, r.category, r.car, r.description, r.status, r.created_at, r.target_master_id
        FROM {SCHEMA}.requests r WHERE r.id = %s
        """,
        (request_id,),
    )
    req = cur.fetchone()
    if not req:
        cur.close(); conn.close()
        return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Запрос не найден"})}

    request_data = {
        "id": req[0], "service": req[1], "category": req[2],
        "car": req[3], "description": req[4], "status": req[5],
        "created_at": str(req[6]), "target_master_id": req[7],
    }

    cur.execute(
        f"""
        SELECT b.id, b.price, b.comment, b.status, b.created_at,
               m.id, m.name, m.station, m.specialty, m.rating,
               m.reviews_count, m.completed_orders, m.online, m.avatar
        FROM {SCHEMA}.bids b
        JOIN {SCHEMA}.masters m ON m.id = b.master_id
        WHERE b.request_id = %s
        ORDER BY b.price ASC, b.created_at ASC
        """,
        (request_id,),
    )
    bids = []
    for row in cur.fetchall():
        bids.append({
            "bid_id": row[0], "price": row[1], "comment": row[2],
            "status": row[3], "created_at": str(row[4]),
            "master": {
                "id": row[5], "name": row[6], "station": row[7],
                "specialty": row[8], "rating": float(row[9]),
                "reviews_count": row[10], "completed_orders": row[11],
                "online": row[12], "avatar": row[13],
            },
        })

    cur.close(); conn.close()
    return {
        "statusCode": 200, "headers": CORS,
        "body": json.dumps({
            "request": request_data, "bids": bids, "bids_count": len(bids),
        }, ensure_ascii=False),
    }
