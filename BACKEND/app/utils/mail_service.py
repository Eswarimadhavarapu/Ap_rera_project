from flask import current_app
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from datetime import datetime


def get_smtp_config():
    smtp_host = current_app.config.get("SMTP_HOST") or os.getenv("SMTP_HOST")
    smtp_port = current_app.config.get("SMTP_PORT") or os.getenv("SMTP_PORT")
    smtp_user = current_app.config.get("SMTP_USER") or os.getenv("SMTP_USER")
    smtp_password = current_app.config.get("SMTP_PASSWORD") or os.getenv("SMTP_PASSWORD")
    from_email = current_app.config.get("FROM_EMAIL") or os.getenv("FROM_EMAIL")
    smtp_use_tls = current_app.config.get("SMTP_USE_TLS", True)
    smtp_use_ssl = current_app.config.get("SMTP_USE_SSL", False)

    missing = [
        name
        for name, value in [
            ("SMTP_HOST", smtp_host),
            ("SMTP_PORT", smtp_port),
            ("SMTP_USER", smtp_user),
            ("SMTP_PASSWORD", smtp_password),
            ("FROM_EMAIL", from_email),
        ]
        if not value
    ]
    if missing:
        raise RuntimeError(
            "SMTP credentials are not configured: " + ", ".join(missing)
        )

    return {
        "smtp_host": smtp_host,
        "smtp_port": int(smtp_port),
        "smtp_user": smtp_user,
        "smtp_password": smtp_password,
        "from_email": from_email,
        "smtp_use_tls": bool(smtp_use_tls),
        "smtp_use_ssl": bool(smtp_use_ssl),
    }


def send_email_otp(to_email, otp):
    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]

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

def send_change_request_approval_email(to_email, application_no):
    send_email(
        to_email,
        "Change Request Approved",
        f"Your change request for application {application_no} has been approved."
    )    

    #code addded by ravi 

def send_approval_email(to_email, application_no, expiry_date, certificate_path):

    try:

        config = get_smtp_config()
        smtp_host = config["smtp_host"]
        smtp_port = config["smtp_port"]
        smtp_user = config["smtp_user"]
        smtp_password = config["smtp_password"]
        from_email = config["from_email"]
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

        current_app.logger.exception("Unexpected error")



    
def send_rejection_email(to_email, application_no, remarks):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
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
    
    
    
def send_project_approval_email(to_email, application_no, project_name, certificate_path):

    try:

        config = get_smtp_config()
        smtp_host = config["smtp_host"]
        smtp_port = config["smtp_port"]
        smtp_user = config["smtp_user"]
        smtp_password = config["smtp_password"]
        from_email = config["from_email"]

        subject = "AP RERA Project Approved"

        body = f"""
Dear Applicant,

Your PROJECT REGISTRATION has been APPROVED.

Application Number : {application_no}
Project Name       : {project_name}

Please find your APPROVAL CERTIFICATE attached.

Congratulations! Your project is now registered under AP RERA.

Regards,

AP RERA
"""

        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "plain"))

        # ✅ Attach certificate
        with open(certificate_path, "rb") as f:
            part = MIMEApplication(f.read(), Name=os.path.basename(certificate_path))
            part["Content-Disposition"] = f'attachment; filename="{os.path.basename(certificate_path)}"'
            msg.attach(part)

        print("Sending Project Approval Email...")

        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()

        print("PROJECT APPROVAL EMAIL SENT ✅")

    except Exception as e:
        current_app.logger.exception("Unexpected error")
        
        


def send_project_rejection_email(to_email, application_no, project_name, remarks):

    try:

        config = get_smtp_config()
        smtp_host = config["smtp_host"]
        smtp_port = config["smtp_port"]
        smtp_user = config["smtp_user"]
        smtp_password = config["smtp_password"]
        from_email = config["from_email"]

        body = f"""
Dear Applicant,

Your PROJECT REGISTRATION has been REJECTED.

Application Number : {application_no}
Project Name       : {project_name}

Reason for Rejection:
{remarks}

Please review the remarks and re-apply after corrections.

Regards,
AP RERA
"""

        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "plain"))

        print("Sending Project Rejection Email...")

        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()

        print("PROJECT REJECTION EMAIL SENT ❌")

    except Exception as e:
        current_app.logger.exception("Unexpected error")
        
def send_email(to_email, subject, body):

    try:
        config = get_smtp_config()
        smtp_host = config["smtp_host"]
        smtp_port = config["smtp_port"]
        smtp_user = config["smtp_user"]
        smtp_password = config["smtp_password"]
        from_email = config["from_email"]
        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "plain"))

        print("Sending reminder email...")

        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        return True

        print("✅ Reminder email sent")

    except Exception as e:
        return False
        current_app.logger.exception("Unexpected error")


def send_agent_change_request_approval_email(
    to_email, application_no, changed_fields=None
):
    changed_fields = changed_fields or []
    if changed_fields:
        lines = "\n".join(
            f"{index}. {field}" for index, field in enumerate(changed_fields, 1)
        )
        details_block = f"""
Updated Details:
{lines}
"""
    else:
        details_block = ""

    body = f"""
Dear Applicant,

Your agent change request has been APPROVED.

Application Number : {application_no}

{details_block}
Your requested details have been updated successfully.

Regards,
AP RERA
"""

    return send_email(
        to_email,
        f"AP RERA Agent Change Request Approved - {application_no}",
        body
    )


def send_agent_change_request_rejection_email(to_email, application_no):
    body = f"""
Dear Applicant,

Your agent change request has been REJECTED.

Application Number : {application_no}

Please login to the portal for more details.

Regards,
AP RERA
"""

    return send_email(
        to_email,
        f"AP RERA Agent Change Request Rejected - {application_no}",
        body
    )

def send_approval_email(to_email, application_no, expiry_date, certificate_path):

    try:

        config = get_smtp_config()
        smtp_host = config["smtp_host"]
        smtp_port = config["smtp_port"]
        smtp_user = config["smtp_user"]
        smtp_password = config["smtp_password"]
        from_email = config["from_email"]
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
            part["Content-Disposition"] = (
                f'attachment; filename="{os.path.basename(certificate_path)}"'
            )
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

        current_app.logger.exception("Unexpected error")


def send_rejection_email(to_email, application_no, remarks):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
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


def send_change_request_approval_email(email, ref_no, changes):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    subject = f"Change Request Approved - {ref_no}"

    change_text = ""
    for i, c in enumerate(changes, 1):
        change_text += f"""
{i}. {c['field']}
   Old: {c['old']}
   New: {c['new']}
"""

    body = f"""
Dear User,

Your change request ({ref_no}) has been APPROVED.

Changed Details:
{change_text}

Regards,
AP RERA
"""

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(from_email, email, msg.as_string())
    server.quit()


def send_complaint_rejection_email(
    email, name, subject_text, complaint_desc, admin_remark
):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    subject = f"Complaint Rejected - {subject_text}"

    body = f"""
Dear {name},

Your complaint has been REJECTED.

----------------------------------------
Complaint Details
----------------------------------------

Subject:
{subject_text}

Description:
{complaint_desc}

Admin Remarks:
{admin_remark}

----------------------------------------

If you have any queries, please contact support.

Regards,
AP RERA Team
"""

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(from_email, email, msg.as_string())
    server.quit()


def send_complaint_approval_mail_complainant(
    email, name, subject_text, complaint_desc, admin_remark
):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    subject = f"Complaint Accepted - {subject_text}"

    body = f"""
Dear {name},

We are pleased to inform you that your complaint has been ACCEPTED by AP RERA.

----------------------------------------
Complaint Details
----------------------------------------

Subject:
{subject_text}

Description:
{complaint_desc}

Authority Remarks:
{admin_remark}

----------------------------------------

Further proceedings will be initiated, and you will be notified accordingly.

Regards,
AP RERA Authority
"""

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(from_email, email, msg.as_string())
    server.quit()


def send_complaint_approval_mail_respondent(
    email, respondent_name, complainant_name, subject_text, complaint_desc, admin_remark
):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    subject = f"Notice: Complaint Filed Against You - {subject_text}"

    body = f"""
Dear {respondent_name},

This is to inform you that a complaint has been ACCEPTED by AP RERA against you.

----------------------------------------
Complaint Details
----------------------------------------

Complainant Name:
{complainant_name}

Subject:
{subject_text}

Description:
{complaint_desc}

Authority Remarks:
{admin_remark}

----------------------------------------

You are requested to respond as per AP RERA guidelines.

Regards,
AP RERA Authority
"""

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(from_email, email, msg.as_string())
    server.quit()


def send_complaint_approval_mail_respondent_with_pdf(
    email,
    respondent_name,
    complainant_name,
    subject_text,
    complaint_desc,
    admin_remark,
    pdf_file,
):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    subject = f"Notice: Complaint Filed Against You - {subject_text}"

    body = f"""
Dear {respondent_name},

This is to inform you that a complaint has been ACCEPTED by AP RERA against you.

----------------------------------------
Complaint Details
----------------------------------------

Complainant Name:
{complainant_name}

Subject:
{subject_text}

Description:
{complaint_desc}

Authority Remarks:
{admin_remark}

----------------------------------------

Please find the attached notice.

Regards,
AP RERA Authority
"""

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    # ✅ attach PDF from request directly
    if pdf_file:
        part = MIMEApplication(pdf_file.read(), Name=pdf_file.filename)
        part["Content-Disposition"] = f'attachment; filename="{pdf_file.filename}"'
        msg.attach(part)

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(from_email, email, msg.as_string())
    server.quit()


def send_complaint_closed_mail_complainant(
    email, name, subject_text, complaint_desc, admin_remark
):
    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    subject = f"Complaint Closed - {subject_text}"

    body = f"""
Dear {name},

Your complaint has been CLOSED by AP RERA.

----------------------------------------
Complaint Details
----------------------------------------

Subject:
{subject_text}

Description:
{complaint_desc}

Final Remarks:
{admin_remark}

----------------------------------------

Thank you for using AP RERA services.

Regards,
AP RERA Authority
"""

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(from_email, email, msg.as_string())
    server.quit()


# ================= CLOSED MAIL - RESPONDENT =================
def send_complaint_closed_mail_respondent(
    email, respondent_name, complainant_name, subject_text, complaint_desc, admin_remark
):
    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    subject = f"Complaint Closed - {subject_text}"

    body = f"""
Dear {respondent_name},

The complaint filed against you has been CLOSED by AP RERA.

----------------------------------------
Complaint Details
----------------------------------------

Complainant Name:
{complainant_name}

Subject:
{subject_text}

Description:
{complaint_desc}

Final Remarks:
{admin_remark}

----------------------------------------

No further action is required.

Regards,
AP RERA Authority
"""

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(from_email, email, msg.as_string())
    server.quit()
    
def send_email_with_attachment(to_email, subject, body, attachments=None):
    try:
        config = get_smtp_config()
        smtp_host = config["smtp_host"]
        smtp_port = config["smtp_port"]
        smtp_user = config["smtp_user"]
        smtp_password = config["smtp_password"]
        from_email = config["from_email"]
        smtp_use_tls = config["smtp_use_tls"]

        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "plain"))

        # ✅ Attach files
        if attachments:
            for file_path in attachments:
                with open(file_path, "rb") as f:
                    part = MIMEApplication(f.read(), Name=os.path.basename(file_path))
                    part["Content-Disposition"] = f'attachment; filename="{os.path.basename(file_path)}"'
                    msg.attach(part)

        print("Sending email with attachment...")

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls() if smtp_use_tls else None
            server.login(smtp_user, smtp_password)
            server.sendmail(from_email, to_email, msg.as_string())

        print("✅ Email with attachment sent")

        return True

    except Exception as e:
        current_app.logger.exception("Unexpected error")
        return False


def send_html_email(to_email, subject, html_body, attachments=None):
    try:
        config = get_smtp_config()
        smtp_host = config["smtp_host"]
        smtp_port = config["smtp_port"]
        smtp_user = config["smtp_user"]
        smtp_password = config["smtp_password"]
        from_email = config["from_email"]
        smtp_use_tls = config["smtp_use_tls"]

        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(html_body, "html"))

        if attachments:
            for file_path in attachments:
                with open(file_path, "rb") as f:
                    part = MIMEApplication(f.read(), Name=os.path.basename(file_path))
                    part["Content-Disposition"] = f'attachment; filename="{os.path.basename(file_path)}"'
                    msg.attach(part)

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.ehlo()
            if smtp_use_tls:
                server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(from_email, to_email, msg.as_string())

        return True

    except Exception as e:
        current_app.logger.exception("Unexpected error")
        return False

# ================= SEND NOTICE - COMPLAINANT =================

def send_notice_mail_complainant(
    to_email,
    complainant_name,
    respondent_name,
    complaint_id,
    message,
    notice_date,
    venue
):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    subject = f"AP RERA Notice - Complaint {complaint_id}"

    formatted_date = datetime.fromisoformat(
        notice_date
    ).strftime("%d-%b-%Y at %I:%M %p")

    body = f"""
To  
{complainant_name}

Subject: Notice Issued – Complaint No. {complaint_id}

Sir/Madam,

This is to inform you that your complaint has been taken up by the Andhra Pradesh Real Estate Regulatory Authority (AP RERA).

Complaint Details:
--------------------------------------------------

Complaint No : {complaint_id}

Respondent Name : {respondent_name}

Notice / Remarks :
{message}

Date of Appearance :
{formatted_date}

Venue :
{venue}

--------------------------------------------------

You are requested to appear before the Authority on the scheduled date along with all supporting documents related to the complaint.

Regards,  
AP RERA Authority  
Government of Andhra Pradesh
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



# ================= SEND NOTICE - RESPONDENT =================

def send_notice_mail_respondent(
    to_email,
    respondent_name,
    complainant_name,
    complaint_id,
    message,
    notice_date,
    venue
):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    subject = f"AP RERA Legal Notice - Complaint {complaint_id}"

    formatted_date = datetime.fromisoformat(
        notice_date
    ).strftime("%d-%b-%Y at %I:%M %p")

    body = f"""
To  
{respondent_name}

Subject: Notice Regarding Complaint No. {complaint_id}

Sir/Madam,

This is to inform you that a complaint has been filed before the Andhra Pradesh Real Estate Regulatory Authority (AP RERA) against you.

Complaint Details:
--------------------------------------------------

Complaint No : {complaint_id}

Complainant Name : {complainant_name}

Notice / Remarks :
{message}

Date of Appearance :
{formatted_date}

Venue :
{venue}

--------------------------------------------------

You are hereby directed to appear before the Authority on the above mentioned date and venue along with all supporting documents relevant to the case.

Failing to appear may result in further proceedings as per AP RERA regulations.

Regards,  
AP RERA Authority  
Government of Andhra Pradesh
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


# ================= CASE REGISTERED - COMPLAINANT =================

def send_case_registered_mail_complainant(
    to_email,
    complainant_name,
    case_no,
    hearing_date,
    venue
):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    formatted_date = datetime.fromisoformat(
        hearing_date
    ).strftime("%d-%b-%Y at %I:%M %p")

    subject = f"AP RERA Case Registered - {case_no}"

    body = f"""
To
{complainant_name}

Subject: Case Registered before AP RERA

Sir/Madam,

Your complaint has been officially registered before AP RERA Authority.

--------------------------------------------------

Case Number :
{case_no}

First Hearing Date :
{formatted_date}

Venue :
{venue}

--------------------------------------------------

You are requested to attend the hearing along with supporting documents.

Regards,
AP RERA Authority
Government of Andhra Pradesh
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


# ================= CASE REGISTERED - RESPONDENT =================

def send_case_registered_mail_respondent(
    to_email,
    respondent_name,
    case_no,
    hearing_date,
    venue
):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    formatted_date = datetime.fromisoformat(
        hearing_date
    ).strftime("%d-%b-%Y at %I:%M %p")

    subject = f"AP RERA Case Registered - {case_no}"

    body = f"""
To
{respondent_name}

Subject: Case Registered before AP RERA

Sir/Madam,

This is to inform you that the complaint has been officially registered before AP RERA Authority.

--------------------------------------------------

Case Number :
{case_no}

First Hearing Date :
{formatted_date}

Venue :
{venue}

--------------------------------------------------

You are directed to attend the hearing along with supporting documents.

Regards,
AP RERA Authority
Government of Andhra Pradesh
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



# ================= HEARING UPDATE - COMPLAINANT =================

def send_hearing_update_mail_complainant(
    to_email,
    complainant_name,
    case_no,
    status,
    remarks,
    next_hearing_date,
    hearing_place
):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    formatted_date = datetime.fromisoformat(
        next_hearing_date
    ).strftime("%d-%b-%Y at %I:%M %p")

    subject = f"AP RERA Hearing Update - {case_no}"

    body = f"""
Dear {complainant_name},

Your hearing details have been updated.

Case Number:
{case_no}

Current Hearing Status:
{status}

Hearing Remarks:
{remarks}

Next Hearing Date:
{formatted_date}

Venue:
{hearing_place}

Regards,
AP RERA Authority
"""

    msg = MIMEMultipart()

    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()

    server.login(smtp_user, smtp_password)

    server.sendmail(
        from_email,
        to_email,
        msg.as_string()
    )

    server.quit()


# ================= HEARING UPDATE - RESPONDENT =================

def send_hearing_update_mail_respondent(
    to_email,
    respondent_name,
    case_no,
    status,
    remarks,
    next_hearing_date,
    hearing_place
):

    config = get_smtp_config()
    smtp_host = config["smtp_host"]
    smtp_port = config["smtp_port"]
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    from_email = config["from_email"]
    formatted_date = datetime.fromisoformat(
        next_hearing_date
    ).strftime("%d-%b-%Y at %I:%M %p")

    subject = f"AP RERA Hearing Update - {case_no}"

    body = f"""
Dear {respondent_name},

Your hearing details have been updated.

Case Number:
{case_no}

Current Hearing Status:
{status}

Hearing Remarks:
{remarks}

Next Hearing Date:
{formatted_date}

Venue:
{hearing_place}

Regards,
AP RERA Authority
"""

    msg = MIMEMultipart()

    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()

    server.login(smtp_user, smtp_password)

    server.sendmail(
        from_email,
        to_email,
        msg.as_string()
    )

    server.quit()