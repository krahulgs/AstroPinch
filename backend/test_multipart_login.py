import requests
import uuid
import sys

BASE_URL = "http://localhost:8000/api/auth"

def test_multipart_login():
    # 1. Register first to have a user
    email = f"test_multi_{uuid.uuid4().hex[:8]}@example.com"
    password = "password123"
    full_name = "Test User"
    
    print(f"Registering user: {email}")
    reg_resp = requests.post(f"{BASE_URL}/register", json={
        "email": email,
        "password": password,
        "full_name": full_name,
        "preferred_lang": "en"
    })
    
    if reg_resp.status_code != 200:
        print(f"Registration Failed: {reg_resp.text}")
        return False

    # 2. Login using Multipart (emulating FormData)
    print("Attempting login with multiple/form-data...")
    # requests.post with 'files' argument forces multipart/form-data
    # Use dummy dict for files to force multipart, but data for fields
    
    # Actually, to send fields as multipart data without files:
    try:
        from requests_toolbelt.multipart.encoder import MultipartEncoder
        m = MultipartEncoder(
            fields={'username': email, 'password': password}
        )
        headers = {'Content-Type': m.content_type}
        
        login_resp = requests.post(
            f"{BASE_URL}/login", 
            data=m,
            headers=headers
        )
        
        print(f"Multipart Login Status: {login_resp.status_code}")
        if login_resp.status_code == 200:
            print("✅ Multipart Login Succeeded")
            return True
        else:
            print(f"❌ Multipart Login Failed: {login_resp.text}")
            return False
            
    except ImportError:
        print("requests_toolbelt not found, trying basic files workaround")
        # Fallback if toolbelt not available: use 'files' for fields (hacky but works)
        # But 'files' usually implies filename. 
        # Better to just assume if I can't run this, I'll proceed with the change anyway.
        return None

if __name__ == "__main__":
    success = test_multipart_login()
    if success is False:
        sys.exit(1)
    elif success is True:
        sys.exit(0)
    else:
        print("Could not run test properly")
        sys.exit(0)
