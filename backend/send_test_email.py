
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def send_test_email():
    sender_email = os.getenv("SMTP_USERNAME")
    sender_password = os.getenv("SMTP_PASSWORD")
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT", 465))
    use_ssl = os.getenv("SMTP_USE_SSL", "True").lower() == "true"
    
    recipient = "rahulgskumar12@gmail.com"
    
    print(f"Sending test email from {sender_email} via {smtp_server}:{smtp_port}...")
    
    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient
        msg['Subject'] = "AstroPinch SMTP Test"

        body = "This is a test email from AstroPinch Backend to verify SMTP configuration."
        msg.attach(MIMEText(body, 'plain'))

        if use_ssl:
            server = smtplib.SMTP_SSL(smtp_server, smtp_port)
        else:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        print("Test email sent successfully!")
        
    except Exception as e:
        print(f"Failed to send email: {e}")

if __name__ == "__main__":
    send_test_email()
