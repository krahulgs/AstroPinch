import requests
import json

url = "https://astropinch-api.onrender.com/api/report/consolidated"
payload = {
    "name": "Test User",
    "year": 1990,
    "month": 1,
    "day": 1,
    "hour": 12,
    "minute": 0,
    "lat": 28.6139,
    "lng": 77.2090,
    "city": "New Delhi",
    "lang": "en"
}

try:
    print(f"Sending POST request to {url}...")
    response = requests.post(url, json=payload)
    response.raise_for_status()
    
    data = response.json()
    
    # Check for chart_svg
    vedic = data.get("vedic_astrology", {})
    chart_svg = vedic.get("chart_svg")
    
    if chart_svg:
        print("SUCCESS: chart_svg found in response.")
        print(f"SVG length: {len(chart_svg)} characters")
        print("Snippet:", chart_svg[:100], "...")
    else:
        print("FAILURE: chart_svg NOT found in response.")
        
except Exception as e:
    print(f"Error: {e}")
    if 'response' in locals():
        print(response.text)
