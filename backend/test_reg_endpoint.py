
import urllib.request
import json
import ssl

def test_register():
    url = "http://localhost:8000/api/auth/register"
    payload = {
        "email": "agent_test_urllib@example.com",
        "password": "testpassword",
        "full_name": "API Tester",
        "preferred_lang": "en"
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    # Ignore SSL if local (though http doesn't use it)
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
    test_register()
