import requests
import time

BASE_URL = "http://localhost:8000"
TEST_EMAIL = "test_login_user@example.com"
TEST_PASSWORD = "TestPassword123!"
TEST_NAME = "Login Tester"

def test_login_flow():
    print("--- Starting Login Flow Test ---")
    
    # 1. Register
    print("\n1. Attempting Registration...")
    register_payload = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "full_name": TEST_NAME,
        "preferred_lang": "en"
    }
    
    try:
        reg_res = requests.post(f"{BASE_URL}/api/auth/register", json=register_payload)
        
        if reg_res.status_code == 200:
            print("   Registration Successful")
            print(f"   Response: {reg_res.json()}")
        elif reg_res.status_code == 400 and "Email already registered" in reg_res.text:
            print("   User already registered. Proceeding to login.")
        else:
            print(f"   Registration Failed: {reg_res.status_code} - {reg_res.text}")
            return
            
    except Exception as e:
        print(f"   Registration Error: {e}")
        return

    # 2. Login
    print("\n2. Attempting Login...")
    login_payload = {
        "username": TEST_EMAIL, # OAuth2 form expects 'username'
        "password": TEST_PASSWORD
    }
    
    try:
        login_res = requests.post(f"{BASE_URL}/api/auth/login", data=login_payload)
        
        if login_res.status_code == 200:
            token_data = login_res.json()
            access_token = token_data.get("access_token")
            print("   Login Successful!")
            print(f"   Token received: {access_token[:10]}...")
            
            # 3. Verify Token
            print("\n3. Verifying Token (/api/auth/me)...")
            headers = {"Authorization": f"Bearer {access_token}"}
            me_res = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
            
            if me_res.status_code == 200:
                print("   User Verification Successful")
                print(f"   User Data: {me_res.json()}")
            else:
                print(f"   User Verification Failed: {me_res.status_code} - {me_res.text}")
        else:
            print(f"   Login Failed: {login_res.status_code} - {login_res.text}")

    except Exception as e:
        print(f"   Login Error: {e}")

if __name__ == "__main__":
    test_login_flow()
