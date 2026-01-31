"""
Test the actual API endpoint
"""
import requests
import json
import base64

payload = {
    "name": "Lovisha Gumber",
    "year": 1997,
    "month": 10,
    "day": 17,
    "hour": 19,
    "minute": 55,
    "city": "Jalandhar",
    "lat": 31.3260,
    "lng": 75.5762,
    "timezone": "Asia/Kolkata"
}

print("Testing API endpoint: /api/chart/lagna/north")
print("="*60)

try:
    response = requests.post(
        "http://localhost:8000/api/chart/lagna/north",
        json=payload
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✓ API call successful!")
        print(f"Response keys: {list(data.keys())}")
        
        if 'image' in data:
            img_data = data['image']
            if img_data.startswith('data:image/png;base64,'):
                print("✓ Received base64 PNG image")
                # Save it
                img_base64 = img_data.split(',')[1]
                img_bytes = base64.b64decode(img_base64)
                with open('api_test_chart.png', 'wb') as f:
                    f.write(img_bytes)
                print("✓ Saved as: api_test_chart.png")
            else:
                print("✗ Unexpected image format")
        else:
            print("✗ No 'image' key in response")
            print(f"Response: {data}")
    else:
        print(f"✗ API call failed with status {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
