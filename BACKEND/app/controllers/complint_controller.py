from flask import Blueprint, request, jsonify
from app.models.database import db
from app.models.complint_complainant import ComplintComplainant
from app.models.complint_respondent import ComplintRespondent
from app.models.complint_complaint import ComplintComplaint
from datetime import datetime


import os
import uuid
import logging
import traceback

complint_bp = Blueprint("complint_bp", __name__)

# =====================================================
# PATH CONFIG
# =====================================================
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LOG_DIR = os.path.join(BASE_DIR, "logs")
UPLOAD_DIR = os.path.join(BASE_DIR, "app", "uploads", "complint_doc")

os.makedirs(LOG_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# =====================================================
# LOGGER
# =====================================================
logger = logging.getLogger("complint_logger")
if not logger.handlers:
    handler = logging.FileHandler(os.path.join(LOG_DIR, "complint.log"))
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

# =====================================================
# 1️⃣ CREATE COMPLAINT (JSON ONLY)
# =====================================================


def generate_complaint_id():
    now = datetime.now()
    return int(now.strftime("%d%m%y%H%M%S"))
@complint_bp.route("/complint/create", methods=["POST"])
def create_complint():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "JSON body required"}), 400

        c = data.get("complainant", {})
        r = data.get("respondent", {})
        comp = data.get("complaint", {})

        # ---------- Complainant ----------
        complainant = ComplintComplainant(
            complainant_registered_id=c.get("registered_id"),
            complainant_type=c.get("type"),
            name=c.get("name"),
            mobile_no=c.get("mobile"),
            email=c.get("email"),
            address_line1=c.get("address_line1"),
            address_line2=c.get("address_line2"),
            state=c.get("state"),
            district=c.get("district"),
            pincode=c.get("pincode"),
        )
        db.session.add(complainant)
        db.session.flush()

        # ---------- Respondent ----------
        respondent = ComplintRespondent(
            registered_id=r.get("registered_id"),
            respondent_type=r.get("type"),
            # ⭐ ADD HERE
            is_rera_registered=r.get("is_rera_registered", False),
            registration_id=r.get("registration_id"),
            name=r.get("name"),
            phone=r.get("phone"),
            email=r.get("email"),
            project_name=r.get("project_name"),
            address_line1=r.get("address_line1"),
            address_line2=r.get("address_line2"),
            state=r.get("state"),
            district=r.get("district"),
            pincode=r.get("pincode"),
        )
        db.session.add(respondent)
        db.session.flush()

        # ---------- Complaint ----------
        complaint = ComplintComplaint(
            complaint_id=generate_complaint_id(),
            complainant_id=complainant.complainant_id,
            respondent_id=respondent.respondent_id,
            subject=comp.get("subject"),
            relief_sought=comp.get("relief_sought"),
            complaint_regarding=comp.get("complaint_regarding"),
            application_type=comp.get("application_type"),
            description=comp.get("description"),            # ALWAYS
            complaint_facts=comp.get("complaint_facts"),    # OPTIONAL
            complaint_documents={},                          # FIXED-KEY OBJECT
            supporting_documents=[]                          # ARRAY
        )

        db.session.add(complaint)
        db.session.commit()

        logger.info(f"Complaint created | ID={complaint.complaint_id}")

        return jsonify({
            "status": "success",
            "complaint_id": complaint.complaint_id
        })

    except Exception:
        db.session.rollback()
        logger.error(traceback.format_exc())
        return jsonify({"status": "error"}), 500

# =====================================================
# 2️⃣ UPLOAD SYSTEM COMPLAINT DOCUMENTS (FIXED KEYS)
# =====================================================
@complint_bp.route("/complint/upload-complaint-documents", methods=["POST"])
def upload_complaint_documents():
    try:
        complaint_id = request.form.get("complaint_id")
        doc_type = request.form.get("type")
        file = request.files.get("document")

        if not complaint_id or not doc_type or not file:
            return jsonify({
                "status": "error",
                "message": "complaint_id, type, document required"
            }), 400

        complaint = ComplintComplaint.query.get(complaint_id)
        if not complaint:
            return jsonify({"status": "error", "message": "Complaint not found"}), 404

        filename = f"{uuid.uuid4()}_{file.filename}"
        file.save(os.path.join(UPLOAD_DIR, filename))

        docs = complaint.complaint_documents or {}

        # FIXED-KEY ASSIGNMENT
        docs[doc_type] = filename

        complaint.complaint_documents = docs
        db.session.commit()

        logger.info(f"Complaint document uploaded | {doc_type} | ID={complaint_id}")

        return jsonify({
            "status": "success",
            "complaint_documents": docs
        })

    except Exception:
        db.session.rollback()
        logger.error(traceback.format_exc())
        return jsonify({"status": "error"}), 500

# =====================================================
# 3️⃣ UPLOAD SUPPORTING DOCUMENTS (ARRAY)
# =====================================================
@complint_bp.route("/complint/upload-supporting-documents", methods=["POST"])
def upload_supporting_documents():
    try:
        complaint_id = request.form.get("complaint_id")
        descriptions = request.form.getlist("document_description")
        files = request.files.getlist("documents")

        if not complaint_id:
            return jsonify({"status": "error", "message": "complaint_id required"}), 400

        if len(descriptions) != len(files):
            return jsonify({
                "status": "error",
                "message": "Description & file count mismatch"
            }), 400

        complaint = ComplintComplaint.query.get(complaint_id)
        if not complaint:
            return jsonify({"status": "error", "message": "Complaint not found"}), 404

        docs = complaint.supporting_documents or []

        for desc, file in zip(descriptions, files):
            filename = f"{uuid.uuid4()}_{file.filename}"
            file.save(os.path.join(UPLOAD_DIR, filename))

            docs.append({
                "description": desc,
                "document": filename
            })

        complaint.supporting_documents = docs
        db.session.commit()

        logger.info(f"Supporting documents uploaded | ID={complaint_id}")

        return jsonify({
            "status": "success",
            "count": len(docs),
            "documents": docs
        })

    except Exception:
        db.session.rollback()
        logger.error(traceback.format_exc())
        return jsonify({"status": "error"}), 500

# =====================================================
# 4️⃣ GET SINGLE COMPLAINT (FULL DETAILS)
# =====================================================
@complint_bp.route("/complint/<complaint_id>", methods=["GET"])
def get_complaint(complaint_id):
    try:
        complaint = ComplintComplaint.query.get_or_404(complaint_id)

        complainant = ComplintComplainant.query.get(complaint.complainant_id)
        respondent = ComplintRespondent.query.get(complaint.respondent_id)

        return jsonify({

            # ================= COMPLAINT =================
            "complaint": {
                "complaint_id": complaint.complaint_id,
                "subject": complaint.subject,
                "relief_sought": complaint.relief_sought,
                "application_type": complaint.application_type,
                "description": complaint.description,
                "complaint_facts": complaint.complaint_facts,
                "complaint_documents": complaint.complaint_documents,
                "supporting_documents": complaint.supporting_documents,
                "created_at": complaint.created_at.strftime("%d-%m-%Y %H:%M:%S")
                if complaint.created_at else None
            },

            # ================= COMPLAINANT =================
            "complainant": {
                "name": complainant.name,
                "type": complainant.complainant_type,
                "mobile": complainant.mobile_no,
                "email": complainant.email,
                "address": {
                "line1": complainant.address_line1,
                    "line2": complainant.address_line2,
                    "state": complainant.state,
                    "district": complainant.district,
                    "pincode": complainant.pincode
                }
            },

            # ================= RESPONDENT =================
            "respondent": {
                "name": respondent.name,
                "type": respondent.respondent_type,
                "project_name": respondent.project_name,
                "mobile": respondent.phone,
                "email": respondent.email,
                # ⭐ ADD HERE
                "is_rera_registered": respondent.is_rera_registered,
                "registration_id": respondent.registration_id,
                "address": {
                    "line1": respondent.address_line1,
                    "line2": respondent.address_line2,
                    "state": respondent.state,
                    "district": respondent.district,
                    "pincode": respondent.pincode
                }
            }

        })

    except Exception as e:
        logger.error(traceback.format_exc())
        return jsonify({
            "status": "error",
            "message": "Unable to fetch complaint details"
        }), 500

# =====================================================
# 5️⃣ LIST ALL COMPLAINTS
# =====================================================
@complint_bp.route("/complint/list", methods=["GET"])
def list_complaints():
    try:
        complaints = ComplintComplaint.query.order_by(
            ComplintComplaint.created_at.desc()
        ).all()

        data = [{
            "complaint_id": c.complaint_id,
            "subject": c.subject,
            "created_at": c.created_at
        } for c in complaints]

        return jsonify({
            "status": "success",
            "total": len(data),
            "data": data
        })

    except Exception:
        logger.error(traceback.format_exc())
        return jsonify({"status": "error"}), 500

@complint_bp.route("/complint/document/<filename>", methods=["GET"])
def view_complaint_document(filename):
    try:
        upload_dir = current_app.config["UPLOAD_FOLDER"]
        return send_from_directory(upload_dir, filename, as_attachment=False)
    except Exception:
        logger.error(traceback.format_exc())
        return jsonify({"error": "File not found"}), 404
