
import os
import smtplib
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def _send_smtp_email(email: str, reset_link: str):
    """Synchronous SMTP logic to run in thread."""
    smtp_username = os.getenv("SMTP_USERNAME").strip() if os.getenv("SMTP_USERNAME") else None
    sender_email = os.getenv("SMTP_FROM", smtp_username).strip() if os.getenv("SMTP_FROM") or smtp_username else None
    sender_password = os.getenv("SMTP_PASSWORD").strip() if os.getenv("SMTP_PASSWORD") else None
    smtp_server = os.getenv("SMTP_SERVER").strip() if os.getenv("SMTP_SERVER") else None
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    use_ssl = os.getenv("SMTP_USE_SSL", "False").lower() == "true"
    use_tls = os.getenv("SMTP_USE_TLS", "True").lower() == "true"
    
    if not smtp_username or not sender_password:
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

        # ✅ Always connect explicitly via constructor
        if use_ssl:
            server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=30)
        else:
            server = smtplib.SMTP(smtp_server, smtp_port, timeout=30)
            if use_tls:
                server.starttls()

        server.login(smtp_username, sender_password)
        server.send_message(msg)
        server.quit()

        print(f"Reset email sent to {email}")
        return True

    
    except Exception as e:
        with open("email_error.log", "w") as f:
            f.write(f"EMAIL ERROR: {str(e)}")
        print(f"Failed to send email: {e}")
        # Fallback log
        print(f"RESET LINK (Fallback): {reset_link}")
        return False

async def send_reset_email(email: str, token: str):
    """
    Send password reset email using configured SMTP server (Async wrapper).
    """
    frontend_url = os.getenv("FRONTEND_URL", "http://127.0.0.1:3000") # Default to IPv4 safe
    if "localhost" in frontend_url and os.getenv("RENDER"):
         # Fix for render if not set
         frontend_url = "https://astropinch.com"
         
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    # Run blocking SMTP in thread
    return await asyncio.to_thread(_send_smtp_email, email, reset_link)
