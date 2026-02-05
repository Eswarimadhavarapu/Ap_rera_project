import os
import logging
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

from app.models.database import db
from app.models.project_upload_documents import ProjectRegistrationDocument
from app.models.project_registration_consultant import ProjectRegistrationConsultant

logger = logging.getLogger(__name__)

project_upload_documents_bp = Blueprint(
    "project_upload_documents",
    __name__
)

# =====================================================
# API 1️⃣ : UPLOAD DOCUMENTS
# =====================================================
@project_upload_documents_bp.route(
    "/project/documents/upload",
    methods=["POST"]
)
def upload_documents():
    try:
        application_number = request.form.get("application_number")
        files = request.files

        if not application_number:
            return jsonify({
                "status": "error",
                "message": "application_number required"
            }), 400

        logger.info(f"UPLOAD START | application_number={application_number}")

        base_path = os.path.join(
            current_app.root_path,
            "uploads",
            "project_documents",
            str(application_number)
        )
        os.makedirs(base_path, exist_ok=True)

        documents_json = {}

        for key in files:
            if key.startswith("doc_"):
                doc_id = key.split("_")[1]
                file = files[key]

                filename = secure_filename(file.filename)
                saved_path = os.path.join(base_path, filename)
                file.save(saved_path)

                documents_json[doc_id] = saved_path
                logger.info(f"SAVED FILE | {doc_id} -> {saved_path}")

        # Fetch by correct column
        record = ProjectRegistrationDocument.query.filter_by(
            application_number=application_number
        ).first()

        if record:
            old_docs = record.documents or {}
            old_docs.update(documents_json)
            record.documents = old_docs
        else:
            record = ProjectRegistrationDocument(
                application_number=application_number,
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
    "/project/consultant-declaration/save",
    methods=["POST"]
)
def save_consultant_declaration():
    try:
        data = request.json
        logger.info(f"SAVE CONSULTANT+DECLARATION | {data}")

        application_number = data.get("application_number")

        if not application_number:
            return jsonify({
                "status": "error",
                "message": "application_number required"
            }), 400

        record = ProjectRegistrationConsultant.query.filter_by(
            application_number=application_number
        ).first()

        if record:
            # UPDATE
            for field, value in data.items():
                setattr(record, field, value)
        else:
            # INSERT
            record = ProjectRegistrationConsultant(**data)
            db.session.add(record)

        db.session.commit()

        return jsonify({
            "status": "success"
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.exception("SAVE FAILED")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# =====================================================
# API 3️⃣ : GET ALL PROJECT DETAILS
# =====================================================
@project_upload_documents_bp.route(
    "/project/details/<string:application_number>",
    methods=["GET"]
)
def get_project_full_details(application_number):
    try:
        logger.info(f"FETCH PROJECT DETAILS | application_number={application_number}")

        # 🔹 Documents
        document_record = ProjectRegistrationDocument.query.filter_by(
            application_number=application_number
        ).first()

        documents_data = {}
        if document_record:
            documents_data = document_record.documents or {}

        # 🔹 Consultant + Declaration
        consultant_record = ProjectRegistrationConsultant.query.filter_by(
            application_number=application_number
        ).first()

        consultant_data = {}
        if consultant_record:
            consultant_data = {
                "consultancy_name": consultant_record.consultancy_name,
                "consultant_name": consultant_record.consultant_name,
                "mobile_number": consultant_record.mobile_number,
                "email_id": consultant_record.email_id,
                "address": consultant_record.address,

                "declaration_name": consultant_record.declaration_name,
                "declaration_accept": consultant_record.declaration_accept,
                "note1_accept": consultant_record.note1_accept,
                "note2_accept": consultant_record.note2_accept,

                "created_on": consultant_record.created_on
            }

        return jsonify({
            "status": "success",
            "application_number": application_number,
            "documents": documents_data,
            "consultant_declaration": consultant_data
        }), 200

    except Exception as e:
        logger.exception("FETCH PROJECT DETAILS FAILED")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500