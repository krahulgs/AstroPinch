import requests
import json

url = "http://127.0.0.1:8000/api/chart"
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

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:200]}...")
except Exception as e:
    print(f"Error: {e}")
