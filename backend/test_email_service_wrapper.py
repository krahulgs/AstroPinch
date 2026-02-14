
import asyncio
import os
from dotenv import load_dotenv
from services.email_service import send_reset_email

# Ensure .env is loaded
load_dotenv()

async def test_wrapper():
    email = "rahulgskumar12@gmail.com" # Target from user request
    token = "TEST_TOKEN_12345"
    
    print(f"Testing send_reset_email for {email}...")
    
    # Check Env Vars directly first
    print(f"SMTP_SERVER from Env: {os.getenv('SMTP_SERVER')}")
    print(f"SMTP_USERNAME from Env: {os.getenv('SMTP_USERNAME')}")
    
    success = await send_reset_email(email, token)
    
    if success:
        print("Service returned True. Email should have been sent.")
    else:
        print("Service returned False. Check logs above.")

if __name__ == "__main__":
    asyncio.run(test_wrapper())
