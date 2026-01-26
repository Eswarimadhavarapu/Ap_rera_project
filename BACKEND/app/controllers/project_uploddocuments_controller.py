import os
import logging
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

from app.models.database import db
from app.models.project_upload_documents import ProjectRegistrationDocument
from app.models.project_registration_consultant import ProjectRegistrationConsultant

logger = logging.getLogger(__name__)

project_upload_documents_bp = Blueprint(
    "project_upload_documents", __name__
)

# =====================================================
# API 1️⃣ : UPLOAD PROJECT DOCUMENTS
# =====================================================
@project_upload_documents_bp.route(
    "/project/documents/upload", methods=["POST"]
)
def upload_documents():
    try:
        application_number = request.form.get("application_number")
        pan_number = request.form.get("pan_number")
        files = request.files

        if not application_number or not pan_number:
            return jsonify({
                "status": "error",
                "message": "application_number and pan_number are required"
            }), 400

        logger.info(
            f"UPLOAD START | app={application_number}, pan={pan_number}"
        )

        # -----------------------------
        # FILE STORAGE PATH
        # -----------------------------
        base_path = os.path.join(
            current_app.root_path,
            "uploads",
            "project_documents",
            application_number
        )
        os.makedirs(base_path, exist_ok=True)

        documents_json = {}

        # -----------------------------
        # SAVE FILES
        # -----------------------------
        for key in files:
            if key.startswith("doc_"):
                doc_id = key.split("_", 1)[1]
                file = files[key]

                filename = secure_filename(file.filename)
                abs_path = os.path.join(base_path, filename)
                file.save(abs_path)

                # IMPORTANT: store RELATIVE path (browser friendly)
                documents_json[doc_id] = (
                    f"/uploads/project_documents/"
                    f"{application_number}/{filename}"
                )

                logger.info(
                    f"SAVED FILE | {doc_id} -> {abs_path}"
                )

        # -----------------------------
        # UPSERT DATABASE
        # -----------------------------
        record = ProjectRegistrationDocument.query.filter_by(
            application_number=application_number,
            pan_number=pan_number
        ).first()

        if record:
            old_docs = record.documents or {}
            old_docs.update(documents_json)
            record.documents = old_docs
        else:
            record = ProjectRegistrationDocument(
                application_number=application_number,
                pan_number=pan_number,
                documents=documents_json
            )
            db.session.add(record)

        db.session.commit()

        return jsonify({
            "status": "success",
            "documents": documents_json
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.exception("UPLOAD FAILED")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# =====================================================
# API 2️⃣ : SAVE CONSULTANT + DECLARATION
# =====================================================
@project_upload_documents_bp.route(
    "/project/consultant-declaration/save", methods=["POST"]
)
def save_consultant_declaration():
    try:
        data = request.json or {}

        application_number = data.get("application_number")
        pan_number = data.get("pan_number")

        if not application_number or not pan_number:
            return jsonify({
                "status": "error",
                "message": "application_number and pan_number required"
            }), 400

        logger.info(
            f"SAVE CONSULTANT | app={application_number}, pan={pan_number}"
        )

        record = ProjectRegistrationConsultant.query.filter_by(
            application_number=application_number,
            pan_number=pan_number
        ).first()

        if record:
            for field, value in data.items():
                setattr(record, field, value)
        else:
            record = ProjectRegistrationConsultant(**data)
            db.session.add(record)

        db.session.commit()

        return jsonify({"status": "success"}), 200

    except Exception as e:
        db.session.rollback()
        logger.exception("CONSULTANT SAVE FAILED")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500