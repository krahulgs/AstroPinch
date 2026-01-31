import requests
import json

url = "http://localhost:8000/api/report/consolidated"
# Dummy data based on BirthDetails model
data = {
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
    "lang": "en"
}

try:
    print(f"Testing connection to {url}...")
    response = requests.post(url, json=data, timeout=30)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("✅ Success! Server is reachable and returned data.")
        # print(json.dumps(response.json(), indent=2)[:500])
    else:
        print(f"❌ Server returned error: {response.text}")
except Exception as e:
    print(f"❌ Connection Failed: {e}")
