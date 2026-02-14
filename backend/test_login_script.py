
import urllib.request
import urllib.parse
import json
import ssl

def test_login():
    url = "http://localhost:8000/api/auth/login"
    login_data = {
        "username": "rahulgskumar12@gmail.com",
        "password": "India@123"
    }
    
    # Form data
    data = urllib.parse.urlencode(login_data).encode('utf-8')
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')

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
    test_login()
