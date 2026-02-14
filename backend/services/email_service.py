
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

async def send_reset_email(email: str, token: str):
    """
    Send password reset email using configured SMTP server.
    """
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    if "localhost" in frontend_url and os.getenv("RENDER"):
         # Fix for render if not set
         frontend_url = "https://astropinch.com"
         
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    sender_email = os.getenv("SMTP_USERNAME")
    sender_password = os.getenv("SMTP_PASSWORD")
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT", 465))
    use_ssl = os.getenv("SMTP_USE_SSL", "True").lower() == "true"
    
    if not sender_email or not sender_password:
        print("SMTP Credentials missing. Printing link to console.")
        print(f"RESET LINK: {reset_link}")
        return True

    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = email
        msg['Subject'] = "Reset Your AstroPinch Password"

        body = f"""
        <html>
            <body>
                <h2>Password Reset Request</h2>
                <p>You requested a password reset for your AstroPinch account.</p>
                <p>Click the link below to reset your password:</p>
                <p><a href="{reset_link}">Reset Password</a></p>
                <p>This link is valid for 1 hour.</p>
                <p>If you did not request this, please ignore this email.</p>
            </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))

        if use_ssl:
            server = smtplib.SMTP_SSL(smtp_server, smtp_port)
        else:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        print(f"Reset email sent to {email}")
        return True
        
    except Exception as e:
        print(f"Failed to send email: {e}")
        # Fallback log
        print(f"RESET LINK (Fallback): {reset_link}")
        return False
