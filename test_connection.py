import requests
import os
from dotenv import load_dotenv

load_dotenv()

def test_connection():
    api_url = os.getenv("VITE_API_BASE_URL")
    print(f"Testing connection to: {api_url}")
    
    try:
        # Test root endpoint (defined in main.py)
        response = requests.get(f"{api_url}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        if response.status_code == 200:
            print("✅ Connection Successful!")
        else:
            print("⚠️ Server reached but returned non-200 status.")
    except Exception as e:
        print(f"❌ Connection Failed: {e}")

if __name__ == "__main__":
    test_connection()
