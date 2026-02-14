
import urllib.request
import json
import ssl

def test_forgot_password():
    url = "http://localhost:8000/api/auth/forgot-password"
    payload = {"email": "rahulgskumar12@gmail.com"}
    
    print(f"Requesting password reset for {payload['email']}...")
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    try:
        with urllib.request.urlopen(req, context=ctx) as f:
            print(f"Status: {f.status}")
            print(f"Response: {f.read().decode('utf-8')}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_forgot_password()
