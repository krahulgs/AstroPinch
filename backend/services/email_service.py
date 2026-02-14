
import os

async def send_reset_email(email: str, token: str):
    """
    Mock email service. In production, integrate SendGrid/SES/SMTP here.
    """
    reset_link = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token={token}"
    
    # In production, this would send an actual email
    print("==========================================")
    print(f"PASSWORD RESET EMAIL FOR: {email}")
    print(f"Reset Link: {reset_link}")
    print("==========================================")
    
    return True
