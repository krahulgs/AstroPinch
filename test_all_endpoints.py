import requests
import json

url_base = "http://127.0.0.1:8000"
endpoints = [
    "/api/chart",
    "/api/chart/svg",
    "/api/chart/svg/lunar",
    "/api/chart/svg/kundali",
    "/api/chart/analysis",
    "/api/predictions/best",
    "/api/numerology"
]

payload = {
    "name": "Test User",
    "year": 1990,
    "month": 1,
    "day": 1,
    "hour": 12,
    "minute": 0,
    "city": "London",
    "lat": 51.5074,
    "lng": -0.1278,
    "timezone": "UTC",
    "profession": "Engineer",
    "marital_status": "Single"
}

for ep in endpoints:
    try:
        response = requests.post(f"{url_base}{ep}", json=payload, timeout=10)
        print(f"Endpoint: {ep} | Status: {response.status_code}")
        if response.status_code != 200:
            print(f"  Error Response: {response.text}")
    except Exception as e:
        print(f"Endpoint: {ep} | Error: {e}")
