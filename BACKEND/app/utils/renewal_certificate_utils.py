from reportlab.pdfgen import canvas
import os
from datetime import datetime
from email.mime.application import MIMEApplication


def generate_certificate(agent_name, registration_no, expiry_date):

    folder = "app/uploads/certificates"

    os.makedirs(folder, exist_ok=True)

    file_path = f"{folder}/renewal_{registration_no}.pdf"

    c = canvas.Canvas(file_path)

    c.setFont("Helvetica-Bold", 16)
    c.drawString(180, 750, "AP RERA RENEWAL CERTIFICATE")

    c.setFont("Helvetica", 12)

    c.drawString(100, 680, f"Agent Name: {agent_name}")
    c.drawString(100, 650, f"Registration No: {registration_no}")
    c.drawString(100, 620, f"Renewal Valid Till: {expiry_date.date()}")

    c.drawString(100, 580, "Your RERA Agent Registration has been renewed.")

    c.save()

    return file_path


def generate_certificate2(agent_name, registration_no, expiry_date):

    try:

        folder = "app/uploads/certificates"

        os.makedirs(folder, exist_ok=True)

        file_path = f"{folder}/renewal_{registration_no}.pdf"

        c = canvas.Canvas(file_path)

        # Title
        c.setFont("Helvetica-Bold", 18)
        c.drawCentredString(300, 750, "AP RERA RENEWAL CERTIFICATE")

        # Sub heading
        c.setFont("Helvetica", 12)
        c.drawCentredString(300, 720, "Andhra Pradesh Real Estate Regulatory Authority")

        # Certificate Body
        c.setFont("Helvetica", 12)

        c.drawString(100, 650, f"Agent Name : {agent_name}")
        c.drawString(100, 620, f"Registration Number : {registration_no}")
        c.drawString(100, 590, f"Renewal Valid Till : {expiry_date}")

        c.drawString(100, 550, "This is to certify that the above mentioned agent")
        c.drawString(100, 530, "has successfully renewed their RERA Registration.")

        c.drawString(100, 500, "This certificate is issued by AP RERA.")

        # Issue Date
        today = datetime.today().strftime("%d-%m-%Y")
        c.drawString(100, 450, f"Issue Date : {today}")

        # Signature area
        c.drawString(400, 400, "Authorized Signatory")
        c.drawString(400, 380, "AP RERA")

        c.save()

        print("Certificate generated:", file_path)

        return file_path

    except Exception as e:

        print("Certificate generation error:", str(e))

        return None