import smtplib
from email.mime.text import MIMEText
from flask import current_app


def send_otp_email(to_email, otp):
    """
    Sends OTP to the given email address
    """

    subject = "OTP for Login"
    body = f"""
Your OTP for login is: {otp}

This OTP is valid for 5 minutes.
Do not share it with anyone.
"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = current_app.config.get("FROM_EMAIL")
    msg["To"] = to_email

    server = smtplib.SMTP(
        current_app.config.get("SMTP_HOST"),
        current_app.config.get("SMTP_PORT", 587)
    )

    try:
        server.starttls()
        server.login(
            current_app.config.get("SMTP_USER"),
            current_app.config.get("SMTP_PASSWORD")
        )
        server.sendmail(msg["From"], [to_email], msg.as_string())
    finally:
        server.quit()