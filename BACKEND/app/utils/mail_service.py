import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication


def send_email_otp(to_email, otp):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("FROM_EMAIL")

    subject = "AP RERA OTP Verification"
    body = f"""
Dear Applicant,

Your OTP for verification is: {otp}

This OTP is valid for 5 minutes.

Regards,
AP RERA
"""

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(from_email, to_email, msg.as_string())
    server.quit()

    #code addded by ravi 

def send_approval_email(to_email, application_no, expiry_date, certificate_path):

    try:

        smtp_host = os.getenv("SMTP_HOST")
        smtp_port = int(os.getenv("SMTP_PORT"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_password = os.getenv("SMTP_PASSWORD")
        from_email = os.getenv("FROM_EMAIL")

        print("===== MAIL DEBUG =====")
        print("SMTP HOST:", smtp_host)
        print("SMTP PORT:", smtp_port)
        print("SMTP USER:", smtp_user)
        print("TO EMAIL:", to_email)
        print("CERTIFICATE:", certificate_path)

        subject = "AP RERA Renewal Approved"

        body = f"""
Dear Applicant,

Your renewal application has been APPROVED.

Application Number : {application_no}
Expiry Date : {expiry_date}

Please find your certificate attached.

Regards,
AP RERA
"""

        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "plain"))

        with open(certificate_path, "rb") as f:
            part = MIMEApplication(f.read(), Name=os.path.basename(certificate_path))
            part["Content-Disposition"] = f'attachment; filename="{os.path.basename(certificate_path)}"'
            msg.attach(part)

        print("Connecting SMTP...")

        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()

        print("Logging in SMTP...")

        server.login(smtp_user, smtp_password)

        print("Sending email...")

        server.sendmail(from_email, to_email, msg.as_string())

        print("EMAIL SENT SUCCESSFULLY")

        server.quit()

    except Exception as e:

        print("EMAIL ERROR:", str(e))



    
def send_rejection_email(to_email, application_no, remarks):

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("FROM_EMAIL")

    subject = "AP RERA Renewal Rejected"

    body = f"""
Dear Applicant,

Your renewal application has been REJECTED.

Application Number : {application_no}

Remarks:
{remarks}

Regards,
AP RERA
"""

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(from_email, to_email, msg.as_string())
    server.quit()