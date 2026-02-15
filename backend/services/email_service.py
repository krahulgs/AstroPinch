
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

        logo_url = "https://astropinch.com/logo.png" # Ideally hosted asset
        
        body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }}
                .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }}
                .header {{ background-color: #7c3aed; padding: 30px; text-align: center; }}
                .logo {{ font-size: 24px; font-weight: bold; color: white; text-decoration: none; }}
                .content {{ padding: 40px; }}
                h2 {{ color: #1f2937; margin-top: 0; font-size: 24px; }}
                p {{ margin-bottom: 20px; color: #4b5563; }}
                .button {{ display: inline-block; background-color: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }}
                .footer {{ background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                   <div class="logo">AstroPinch</div>
                </div>
                <div class="content">
                    <h2>Reset Your Password</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset the password for your AstroPinch account. If you made this request, please click the button below to secure your account:</p>
                    <div style="text-align: center;">
                        <a href="{reset_link}" class="button" style="color: white;">Reset Password</a>
                    </div>
                    <p>This link will expire in 1 hour for security purposes.</p>
                    <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                    <p>Best regards,<br>The AstroPinch Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 AstroPinch. All rights reserved.</p>
                    <p>This is an automated message, please do not reply to this email.</p>
                </div>
            </div>
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
        print(f"DEBUG: Sending from {msg['From']} to {msg['To']}")
        result = server.send_message(msg)
        print(f"DEBUG: send_message result: {result}")
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
