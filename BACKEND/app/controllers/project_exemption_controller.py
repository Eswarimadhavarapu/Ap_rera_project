import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime

from flask import Blueprint, current_app, request, jsonify
from werkzeug.utils import secure_filename
from app import db
from app.models.project_exemption_model import ProjectExemption

# ReportLab for PDF certificate generation
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT


project_exemption_bp = Blueprint("project_exemption", __name__)

# ── Folders ──────────────────────────────────────────────
UPLOAD_SUBFOLDER      = "exemption"
CERTIFICATE_SUBFOLDER = "certificates"
LEGACY_UPLOAD_ROOT    = os.path.join("backend", "uploads")

for folder in [
    os.path.join(LEGACY_UPLOAD_ROOT, UPLOAD_SUBFOLDER),
    os.path.join(LEGACY_UPLOAD_ROOT, CERTIFICATE_SUBFOLDER),
]:
    os.makedirs(folder, exist_ok=True)

# ── Email config — set these via environment variables ──
SMTP_HOST     = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT     = int(os.getenv("SMTP_PORT", 587))
SMTP_USER     = os.getenv("SMTP_USER", "your_email@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your_app_password")
SENDER_NAME   = os.getenv("SENDER_NAME", "Exemption Portal")


def _upload_root() -> str:
    return current_app.config.get(
        "UPLOAD_FOLDER",
        os.path.join(current_app.root_path, "uploads"),
    )


def _upload_file_path(*parts: str) -> str:
    return os.path.join(_upload_root(), *parts)


def _public_upload_path(*parts: str) -> str:
    return "/".join(["uploads", *parts])


def _resolve_stored_file_path(stored_path: str) -> str:
    normalized = (stored_path or "").replace("\\", "/").lstrip("/")
    if os.path.isabs(normalized):
        return normalized

    candidates = []
    if normalized.startswith("uploads/"):
        candidates.append(os.path.join(_upload_root(), normalized[len("uploads/"):]))
    if normalized.startswith("backend/uploads/"):
        candidates.append(
            os.path.abspath(os.path.join(current_app.root_path, "..", normalized))
        )

    candidates.append(os.path.abspath(os.path.join(os.getcwd(), normalized)))

    for candidate in candidates:
        if os.path.exists(candidate):
            return candidate
    return candidates[0] if candidates else normalized


# ════════════════════════════════════════════════════════
#  HELPER — generate certificate PDF with ReportLab
# ════════════════════════════════════════════════════════
def generate_certificate(record: ProjectExemption) -> str:
    """
    Generates a professional exemption certificate PDF.
    Returns the file path (relative) where the PDF was saved.
    """
    filename  = f"certificate_{record.id}.pdf"
    filepath  = _upload_file_path(CERTIFICATE_SUBFOLDER, filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    rel_path  = _public_upload_path(CERTIFICATE_SUBFOLDER, filename)

    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    # ── Colour palette ──
    NAVY    = colors.HexColor("#1a3557")
    GOLD    = colors.HexColor("#c8960c")
    LIGHT   = colors.HexColor("#f0f4f9")
    WHITE   = colors.white
    DARK    = colors.HexColor("#0f1f35")
    GREY    = colors.HexColor("#5a6e85")

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "CertTitle",
        parent=styles["Title"],
        fontSize=22,
        textColor=NAVY,
        spaceAfter=4,
        alignment=TA_CENTER,
        fontName="Helvetica-Bold",
    )
    sub_style = ParagraphStyle(
        "CertSub",
        parent=styles["Normal"],
        fontSize=11,
        textColor=GREY,
        spaceAfter=2,
        alignment=TA_CENTER,
        fontName="Helvetica",
    )
    label_style = ParagraphStyle(
        "Label",
        parent=styles["Normal"],
        fontSize=9,
        textColor=GREY,
        fontName="Helvetica-Bold",
        spaceBefore=2,
    )
    value_style = ParagraphStyle(
        "Value",
        parent=styles["Normal"],
        fontSize=11,
        textColor=DARK,
        fontName="Helvetica",
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=10,
        textColor=DARK,
        leading=16,
        fontName="Helvetica",
        alignment=TA_LEFT,
        spaceBefore=6,
        spaceAfter=6,
    )
    footer_style = ParagraphStyle(
        "Footer",
        parent=styles["Normal"],
        fontSize=8,
        textColor=GREY,
        alignment=TA_CENTER,
        fontName="Helvetica",
    )

    cert_no   = f"EXMPT/{record.id:05d}/{datetime.now().year}"
    issue_date = datetime.now().strftime("%d %B %Y")

    story = []

    # ── Header block ──
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("GOVERNMENT EXEMPTION PORTAL", sub_style))
    story.append(Paragraph("Certificate of Project Exemption", title_style))
    story.append(HRFlowable(width="100%", thickness=2, color=GOLD, spaceAfter=4))
    story.append(HRFlowable(width="100%", thickness=0.5, color=NAVY, spaceAfter=10))

    # ── Certificate number & date ──
    meta_data = [
        [
            Paragraph("<b>Certificate No.</b>", label_style),
            Paragraph(cert_no, value_style),
            Paragraph("<b>Issue Date</b>", label_style),
            Paragraph(issue_date, value_style),
        ]
    ]
    meta_table = Table(meta_data, colWidths=["22%", "28%", "22%", "28%"])
    meta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
        ("BOX",        (0, 0), (-1, -1), 0.5, NAVY),
        ("INNERGRID",  (0, 0), (-1, -1), 0.25, colors.HexColor("#d1dce9")),
        ("PADDING",    (0, 0), (-1, -1), 6),
        ("VALIGN",     (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8 * mm))

    # ── Body text ──
    story.append(Paragraph(
        "This is to certify that the application for <b>Project Exemption</b> submitted by the "
        "following applicant has been duly reviewed by the designated authorities and has been "
        "<b>approved</b> in accordance with the applicable regulations.",
        body_style,
    ))
    story.append(Spacer(1, 4 * mm))

    # ── Applicant details table ──
    det_data = [
        [Paragraph("<b>APPLICANT DETAILS</b>", ParagraphStyle(
            "TH", parent=styles["Normal"], fontSize=9, textColor=WHITE,
            fontName="Helvetica-Bold", alignment=TA_CENTER,
        )), ""],
        [Paragraph("Full Name", label_style), Paragraph(record.name or "—", value_style)],
        [Paragraph("Mobile Number", label_style), Paragraph(record.mobile_no or "—", value_style)],
        [Paragraph("Email Address", label_style), Paragraph(record.email or "—", value_style)],
        [Paragraph("Address", label_style), Paragraph(record.address or "—", value_style)],
        [Paragraph("BA Number", label_style), Paragraph(record.ba_number or "—", value_style)],
    ]
    det_table = Table(det_data, colWidths=["35%", "65%"])
    det_table.setStyle(TableStyle([
        # Header row
        ("BACKGROUND",  (0, 0), (-1, 0), NAVY),
        ("SPAN",        (0, 0), (-1, 0)),
        ("TEXTCOLOR",   (0, 0), (-1, 0), WHITE),
        # Data rows
        ("BACKGROUND",  (0, 1), (-1, -1), WHITE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT]),
        ("BOX",         (0, 0), (-1, -1), 0.5, NAVY),
        ("INNERGRID",   (0, 1), (-1, -1), 0.25, colors.HexColor("#d1dce9")),
        ("PADDING",     (0, 0), (-1, -1), 8),
        ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(det_table)
    story.append(Spacer(1, 8 * mm))

    # ── Reviewer remarks ──
    if record.remark_s1 or record.remark_s2:
        rmk_data = [
            [Paragraph("<b>REVIEW REMARKS</b>", ParagraphStyle(
                "TH2", parent=styles["Normal"], fontSize=9, textColor=WHITE,
                fontName="Helvetica-Bold", alignment=TA_CENTER,
            )), ""],
        ]
        if record.remark_s1:
            rmk_data.append([
                Paragraph("S1 Engineer Remarks", label_style),
                Paragraph(record.remark_s1, value_style),
            ])
        if record.remark_s2:
            rmk_data.append([
                Paragraph("S2 Authority Remarks", label_style),
                Paragraph(record.remark_s2, value_style),
            ])

        rmk_table = Table(rmk_data, colWidths=["35%", "65%"])
        rmk_table.setStyle(TableStyle([
            ("BACKGROUND",  (0, 0), (-1, 0), colors.HexColor("#2a4f7c")),
            ("SPAN",        (0, 0), (-1, 0)),
            ("TEXTCOLOR",   (0, 0), (-1, 0), WHITE),
            ("BACKGROUND",  (0, 1), (-1, -1), WHITE),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT]),
            ("BOX",         (0, 0), (-1, -1), 0.5, NAVY),
            ("INNERGRID",   (0, 1), (-1, -1), 0.25, colors.HexColor("#d1dce9")),
            ("PADDING",     (0, 0), (-1, -1), 8),
            ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
        ]))
        story.append(rmk_table)
        story.append(Spacer(1, 8 * mm))

    # ── Approval stamp area ──
    stamp_data = [[
        Paragraph(
            f"<b>Approved by S2 Authority</b><br/>Officer ID: {record.s2_authority_id or '—'}<br/>"
            f"Date: {record.s2_authority_checked_date.strftime('%d %B %Y') if record.s2_authority_checked_date else issue_date}",
            ParagraphStyle("Stamp", parent=styles["Normal"], fontSize=9,
                           textColor=NAVY, fontName="Helvetica", alignment=TA_CENTER),
        ),
        Paragraph(
            f"<b>Certificate No:</b> {cert_no}<br/>"
            f"<b>Status:</b> APPROVED<br/>"
            f"<b>Valid from:</b> {issue_date}",
            ParagraphStyle("Ref", parent=styles["Normal"], fontSize=9,
                           textColor=NAVY, fontName="Helvetica", alignment=TA_CENTER),
        ),
    ]]
    stamp_table = Table(stamp_data, colWidths=["50%", "50%"])
    stamp_table.setStyle(TableStyle([
        ("BOX",        (0, 0), (-1, -1), 1, GOLD),
        ("INNERGRID",  (0, 0), (-1, -1), 0.5, GOLD),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fffbf0")),
        ("PADDING",    (0, 0), (-1, -1), 12),
        ("VALIGN",     (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(stamp_table)
    story.append(Spacer(1, 8 * mm))

    # ── Footer ──
    story.append(HRFlowable(width="100%", thickness=0.5, color=NAVY, spaceAfter=6))
    story.append(Paragraph(
        "This certificate is digitally generated by the Government Exemption Portal and is valid without a physical signature. "
        f"Certificate No: {cert_no} | Generated on: {issue_date}",
        footer_style,
    ))

    doc.build(story)
    return rel_path


# ════════════════════════════════════════════════════════
#  HELPER — send email with PDF attachment
# ════════════════════════════════════════════════════════
def send_certificate_email(record: ProjectExemption, cert_path: str):
    """
    Sends the certificate PDF to the applicant via SMTP.
    cert_path is the relative path (e.g. uploads/certificates/certificate_1.pdf)
    """
    msg = MIMEMultipart("mixed")
    msg["From"]    = f"{SENDER_NAME} <{SMTP_USER}>"
    msg["To"]      = record.email
    msg["Subject"] = f"Your Project Exemption Certificate — {record.name}"

    body_html = f"""
    <html><body style="font-family: Arial, sans-serif; color: #0f1f35; max-width: 600px; margin: auto;">
      <div style="background: #1a3557; padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #ffffff; margin: 0; font-size: 18px;">Exemption Portal</h2>
        <p style="color: #c8960c; margin: 4px 0 0; font-size: 13px; letter-spacing: 1px;">
          PROJECT EXEMPTION CERTIFICATE
        </p>
      </div>
      <div style="background: #ffffff; padding: 28px 32px; border: 1px solid #d1dce9; border-top: none;">
        <p>Dear <strong>{record.name}</strong>,</p>
        <p>
          We are pleased to inform you that your application for <strong>Project Exemption</strong>
          (BA Number: <strong>{record.ba_number}</strong>) has been reviewed and <strong>approved</strong>
          by the concerned authorities.
        </p>
        <p>
          Please find your <strong>Exemption Certificate</strong> attached to this email.
          Kindly keep this certificate for your records as it may be required for future reference.
        </p>
        <div style="background: #f0f4f9; border-left: 4px solid #c8960c; padding: 14px 18px;
                    border-radius: 0 6px 6px 0; margin: 20px 0;">
          <strong>Application Summary</strong><br/>
          Name: {record.name}<br/>
          Mobile: {record.mobile_no}<br/>
          BA Number: {record.ba_number}<br/>
          Status: <span style="color: #0f7b55; font-weight: 700;">APPROVED</span>
        </div>
        <p>If you have any questions, please contact the Exemption Portal helpdesk.</p>
        <p style="margin-top: 24px; color: #5a6e85; font-size: 12px;">
          This is an automated email from the Government Exemption Portal.<br/>
          Please do not reply to this email.
        </p>
      </div>
    </body></html>
    """

    msg.attach(MIMEText(body_html, "html"))

    # ── Attach PDF ──
    abs_cert_path = _resolve_stored_file_path(cert_path)
    if os.path.exists(abs_cert_path):
        with open(abs_cert_path, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition",
            f"attachment; filename=Exemption_Certificate_{record.ba_number}.pdf",
        )
        msg.attach(part)

    # ── Send ──
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, record.email, msg.as_string())


# ════════════════════════════════════════════════════════
#  ROUTES
# ════════════════════════════════════════════════════════

# ── CREATE ──
@project_exemption_bp.route("/project_exemption/create", methods=["POST"])
def create_project_exemption():
    try:
        data = request.form

        def save_file(file_key):
            file = request.files.get(file_key)
            if file:
                filename = secure_filename(file.filename)
                filepath = _upload_file_path(UPLOAD_SUBFOLDER, filename)
                os.makedirs(os.path.dirname(filepath), exist_ok=True)
                file.save(filepath)
                return _public_upload_path(UPLOAD_SUBFOLDER, filename)
            return None

        new_record = ProjectExemption(
            name=data.get("name"),
            mobile_no=data.get("mobile_no"),
            email=data.get("email"),
            address=data.get("address"),
            ba_number=data.get("ba_number"),
            plan_proceedings_path=save_file("plan_proceedings"),
            request_letter_path=save_file("request_letter"),
            land_document_path=save_file("land_document"),
            advocate_document_path=save_file("advocate_document"),
            approver_status="pending",
        )

        db.session.add(new_record)
        db.session.commit()
        return jsonify({"message": "Created Successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── GET ALL ──
@project_exemption_bp.route("/project_exemption/all", methods=["GET"])
def get_all():
    records = ProjectExemption.query.all()
    result = []
    for r in records:
        result.append({
            "id": r.id,
            "name": r.name,
            "mobile_no": r.mobile_no,
            "email": r.email,
            "address": r.address,
            "ba_number": r.ba_number,
            "approver_status": r.approver_status,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        })
    return jsonify(result)


# ── GET BY ID ── (FIXED — returns ALL fields)
@project_exemption_bp.route("/project_exemption/<int:id>", methods=["GET"])
def get_by_id(id):
    record = ProjectExemption.query.get(id)
    if not record:
        return jsonify({"message": "Not found"}), 404

    return jsonify({
        "id": record.id,
        "name": record.name,
        "mobile_no": record.mobile_no,
        "email": record.email,
        "address": record.address,
        "ba_number": record.ba_number,
        "approver_status": record.approver_status,
        # Documents
        "plan_proceedings_path": record.plan_proceedings_path,
        "request_letter_path": record.request_letter_path,
        "land_document_path": record.land_document_path,
        "advocate_document_path": record.advocate_document_path,
        "certificate_path": record.certificate_path,
        # Stage 1
        "remark_s1": record.remark_s1,
        "s1_authority_id": record.s1_authority_id,
        "s1_authority_checked_date": (
            record.s1_authority_checked_date.isoformat()
            if record.s1_authority_checked_date else None
        ),
        # Stage 2
        "remark_s2": record.remark_s2,
        "s2_authority_id": record.s2_authority_id,
        "s2_authority_checked_date": (
            record.s2_authority_checked_date.isoformat()
            if record.s2_authority_checked_date else None
        ),
        # Meta
        "created_at": record.created_at.isoformat() if record.created_at else None,
    })


# ── UPDATE ──
@project_exemption_bp.route("/project_exemption/update/<int:id>", methods=["PUT"])
def update(id):
    record = ProjectExemption.query.get(id)
    if not record:
        return jsonify({"message": "Not found"}), 404
    data = request.json
    record.name      = data.get("name", record.name)
    record.mobile_no = data.get("mobile_no", record.mobile_no)
    record.email     = data.get("email", record.email)
    db.session.commit()
    return jsonify({"message": "Updated Successfully"})


# ── DELETE ──
@project_exemption_bp.route("/project_exemption/delete/<int:id>", methods=["DELETE"])
def delete(id):
    record = ProjectExemption.query.get(id)
    if not record:
        return jsonify({"message": "Not found"}), 404
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Deleted Successfully"})


# ════════════════════════════════════════════════════════
#  STAGE 1 — S1 Engineer submits remarks
#  PATCH /api/project_exemption/<id>/stage1
#  Body: { remark_s1: str, authority_id: int }
# ════════════════════════════════════════════════════════
@project_exemption_bp.route("/project_exemption/<int:id>/stage1", methods=["PATCH"])
def stage1_update(id):
    record = ProjectExemption.query.get(id)
    if not record:
        return jsonify({"message": "Not found"}), 404

    # Guard — only allow if not already reviewed
    if record.remark_s1:
        return jsonify({"message": "Stage 1 already completed"}), 400

    data = request.json
    remark = (data.get("remark_s1") or "").strip()
    if not remark:
        return jsonify({"message": "remark_s1 is required"}), 422

    record.remark_s1                 = remark
    record.s1_authority_id           = data.get("authority_id")
    record.s1_authority_checked_date = datetime.utcnow()
    record.approver_status           = "s1_accepted"

    db.session.commit()
    return jsonify({"message": "Stage 1 completed — forwarded to S2"})


# ════════════════════════════════════════════════════════
#  STAGE 2 — S2 Planning Authority approves / rejects
#  PATCH /api/project_exemption/<id>/stage2
#  Body: { decision: "approved"|"rejected", remark_s2: str, authority_id: int }
# ════════════════════════════════════════════════════════
@project_exemption_bp.route("/project_exemption/<int:id>/stage2", methods=["PATCH"])
def stage2_update(id):
    record = ProjectExemption.query.get(id)
    if not record:
        return jsonify({"message": "Not found"}), 404

    # Guard — only allow after S1, before S2
    if not record.remark_s1:
        return jsonify({"message": "Stage 1 not yet completed"}), 400
    if record.remark_s2:
        return jsonify({"message": "Stage 2 already completed"}), 400

    data     = request.json
    decision = (data.get("decision") or "").strip().lower()
    remark   = (data.get("remark_s2") or "").strip()

    if decision not in ("approved", "rejected"):
        return jsonify({"message": "decision must be 'approved' or 'rejected'"}), 422
    if not remark:
        return jsonify({"message": "remark_s2 is required"}), 422

    record.remark_s2                 = remark
    record.s2_authority_id           = data.get("authority_id")
    record.s2_authority_checked_date = datetime.utcnow()

    if decision == "approved":
        record.approver_status = "s2_approved"
        # ── Auto-generate certificate PDF ──
        try:
            cert_path              = generate_certificate(record)
            record.certificate_path = cert_path
        except Exception as e:
            db.session.commit()
            return jsonify({
                "message": "Stage 2 approved but certificate generation failed",
                "error": str(e),
            }), 500
    else:
        record.approver_status = "s2_rejected"

    db.session.commit()
    return jsonify({
        "message": f"Stage 2 completed — {decision}",
        "certificate_path": record.certificate_path if decision == "approved" else None,
    })


# ════════════════════════════════════════════════════════
#  STAGE 3 — S3 sends certificate email to applicant
#  PATCH /api/project_exemption/<id>/stage3
#  Body: { authority_id: int }
# ════════════════════════════════════════════════════════
@project_exemption_bp.route("/project_exemption/<int:id>/stage3", methods=["PATCH"])
def stage3_update(id):
    record = ProjectExemption.query.get(id)
    if not record:
        return jsonify({"message": "Not found"}), 404

    # Guard — only allow if s2_approved
    if record.approver_status != "s2_approved":
        return jsonify({
            "message": f"Cannot dispatch — current status is '{record.approver_status}'"
        }), 400

    if not record.certificate_path:
        return jsonify({"message": "Certificate not found — regenerate from Stage 2"}), 400

    # ── Send email ──
    try:
        send_certificate_email(record, record.certificate_path)
    except Exception as e:
        return jsonify({
            "message": "Mail sending failed",
            "error": str(e),
        }), 500

    record.approver_status = "completed"
    db.session.commit()

    return jsonify({"message": "Certificate emailed to applicant. Process completed."})


# ════════════════════════════════════════════════════════
#  SEND REJECTION EMAIL — S1 sends rejection to applicant
#  POST /api/project_exemption/<id>/send-rejection-email
#  Body: { email: str, reason: str, authority_id: int }
# ════════════════════════════════════════════════════════
@project_exemption_bp.route("/project_exemption/<int:id>/send-rejection-email", methods=["POST"])
def send_rejection_email(id):
    record = ProjectExemption.query.get(id)
    if not record:
        return jsonify({"message": "Not found"}), 404

    # Guard — only allow if s2_rejected
    if record.approver_status != "s2_rejected":
        return jsonify({
            "message": f"Cannot send rejection — current status is '{record.approver_status}'"
        }), 400

    data = request.json
    reason = (data.get("reason") or "").strip()
    if not reason:
        return jsonify({"message": "rejection reason is required"}), 422

    # ── Send rejection email ──
    try:
        msg = MIMEMultipart("mixed")
        msg["From"]    = f"{SENDER_NAME} <{SMTP_USER}>"
        msg["To"]      = record.email
        msg["Subject"] = f"Your Project Exemption Application Status — {record.name}"

        body_html = f"""
        <html><body style="font-family: Arial, sans-serif; color: #0f1f35; max-width: 600px; margin: auto;">
          <div style="background: #c41e3a; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #ffffff; margin: 0; font-size: 18px;">Exemption Portal</h2>
            <p style="color: #fff0f0; margin: 4px 0 0; font-size: 13px; letter-spacing: 1px;">
              APPLICATION STATUS UPDATE
            </p>
          </div>
          <div style="background: #ffffff; padding: 28px 32px; border: 1px solid #f0d7d7; border-top: none;">
            <p>Dear <strong>{record.name}</strong>,</p>
            <p>
              We regret to inform you that your application for <strong>Project Exemption</strong>
              (BA Number: <strong>{record.ba_number}</strong>) has been <strong style="color: #c41e3a;">REJECTED</strong>
              after review by the concerned authorities.
            </p>
            <div style="background: #fff3f3; border-left: 4px solid #c41e3a; padding: 14px 18px;
                        border-radius: 0 6px 6px 0; margin: 20px 0;">
              <strong>Reason for Rejection:</strong><br/>
              {reason}
            </div>
            <p>
              If you believe this decision is made in error or would like to appeal, please contact 
              the Exemption Portal helpdesk with your application details.
            </p>
            <p style="margin-top: 24px; color: #5a6e85; font-size: 12px;">
              This is an automated email from the Government Exemption Portal.<br/>
              Please do not reply to this email.
            </p>
          </div>
        </body></html>
        """

        msg.attach(MIMEText(body_html, "html"))

        # ── Send ──
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, record.email, msg.as_string())

    except Exception as e:
        return jsonify({
            "message": "Rejection email sending failed",
            "error": str(e),
        }), 500

    record.approver_status = "completed"
    db.session.commit()

    return jsonify({"message": "Rejection email sent to applicant. Process completed."})