import requests
import uuid
import sys

BASE_URL = "https://astropinch-api.onrender.com/api/auth"

def test_auth():
    # 1. Register
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    password = "password123"
    full_name = "Test User"
    
    print(f"Attempting to register user: {email}")
    
    try:
        reg_resp = requests.post(f"{BASE_URL}/register", json={
            "email": email,
            "password": password,
            "full_name": full_name,
            "preferred_lang": "en"
        })
        
        print(f"Register Status: {reg_resp.status_code}")
        if reg_resp.status_code != 200:
            print(f"Register Failed: {reg_resp.text}")
            return False
            
        print("Registration Successful")
        
        # 2. Login
        print("Attempting to login...")
        login_resp = requests.post(f"{BASE_URL}/login", data={
            "username": email,
            "password": password
        })
        
        print(f"Login Status: {login_resp.status_code}")
        if login_resp.status_code != 200:
            print(f"Login Failed: {login_resp.text}")
            return False
            
        token = login_resp.json().get("access_token")
        if not token:
            print("No access token in response")
            return False
            
        print(f"Login Successful. Token: {token[:10]}...")
        
        # 3. Verify /me
        print("Verifying /me endpoint...")
        me_resp = requests.get(f"{BASE_URL}/me", headers={
            "Authorization": f"Bearer {token}"
        })
        
        print(f"Me Status: {me_resp.status_code}")
        if me_resp.status_code != 200:
            print(f"Me Failed: {me_resp.text}")
            return False
            
        print(f"User validated: {me_resp.json()}")
        return True
        
    except Exception as e:
        print(f"Exception during test: {e}")
        return False

if __name__ == "__main__":
    success = test_auth()
    if success:
        print("✅ Auth Flow Test PASSED")
        sys.exit(0)
    else:
        print("❌ Auth Flow Test FAILED")
        sys.exit(1)
