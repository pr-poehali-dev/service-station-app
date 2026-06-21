"""
Скачивает GIF по URL и сохраняет в S3, возвращает CDN URL.
POST {url: str, key: str} — скачивает файл и кладёт в S3
"""
import json
import os
import urllib.request
import boto3

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    url = body.get("url", "")
    key = body.get("key", "assets/file.gif")

    with urllib.request.urlopen(url) as response:
        data = response.read()
        content_type = response.headers.get("Content-Type", "image/gif")

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    s3.put_object(Bucket="files", Key=key, Body=data, ContentType=content_type)

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"url": cdn_url}),
    }
