import os
from datetime import datetime

from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename

from app.models.scrutiny_projectregistation_model import (
    create_scrutiny_file as create_scrutiny_file_record,
    get_scrutiny_fpms_dashboard_data,
    get_scrutiny_project_registration_by_application,
    get_scrutiny_project_registrations,
)


scrutiny_bp = Blueprint("scrutiny_bp", __name__)


def _save_scrutiny_file(file_obj):
    if not file_obj or not getattr(file_obj, "filename", ""):
        return None

    upload_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "scrutiny_files")
    os.makedirs(upload_dir, exist_ok=True)

    original_name = secure_filename(file_obj.filename)
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    filename = f"{timestamp}_{original_name}" if original_name else timestamp

    absolute_path = os.path.join(upload_dir, filename)
    file_obj.save(absolute_path)

    return f"uploads/scrutiny_files/{filename}"


@scrutiny_bp.route("/scrutiny/project-registrations", methods=["GET", "OPTIONS"])
def scrutiny_project_registrations():
    try:
        data = get_scrutiny_project_registrations()
        return jsonify(data), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@scrutiny_bp.route(
    "/scrutiny/project-registrations/details",
    methods=["GET", "OPTIONS"],
)
def scrutiny_project_registration_detail():
    try:
        application_no = request.args.get("application_no")
        promoter_type = request.args.get("promoter_type")

        if not application_no:
            return jsonify({"error": "application_no is required"}), 400

        data = get_scrutiny_project_registration_by_application(
            application_no,
            promoter_type,
        )

        if not data:
            return jsonify({"error": "Project not found"}), 404

        return jsonify(data), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


# -----------------create file posting api ------------------
# ----------------------------------------------------------------


@scrutiny_bp.route("/scrutiny/create-file", methods=["POST"])
def create_scrutiny_file_api():
    try:
        payload = request.form if request.form else (request.get_json(silent=True) or {})
        upload = (
            request.files.get("file")
            or request.files.get("upload_document")
            or request.files.get("document")
            or request.files.get("file_path")
        )

        data = {
            "file_number": payload.get("file_number") or payload.get("fileNumber"),
            "inward_no": payload.get("inward_no") or payload.get("inwardNo"),
            "memo_number": payload.get("memo_number") or payload.get("memoNumber"),
            "file_date": payload.get("file_date") or payload.get("fileDate"),
            "type": payload.get("type"),
            "from_where": payload.get("from_where") or payload.get("fromWhere"),
            "to_whom": payload.get("to_whom") or payload.get("toWhom"),
            "assign_to": payload.get("assign_to") or payload.get("assignTo"),
            "description": payload.get("description"),
            "remarks": payload.get("remarks"),
            "document_desc": payload.get("document_desc") or payload.get("documentDesc"),
        }

        required_fields = {
            "file_number": "file_number",
            "inward_no": "inward_no",
            "file_date": "file_date",
            "type": "type",
            "from_where": "from_where",
            "to_whom": "to_whom",
            "assign_to": "assign_to",
            "description": "description",
        }

        missing_fields = [
            label for key, label in required_fields.items()
            if not str(data.get(key) or "").strip()
        ]

        if missing_fields:
            return (
                jsonify(
                    {
                        "error": "Missing required fields",
                        "missing_fields": missing_fields,
                    }
                ),
                400,
            )

        data["file_path"] = _save_scrutiny_file(upload)

        created_row = create_scrutiny_file_record(data)

        return (
            jsonify(
                {
                    "message": "Scrutiny file created successfully",
                    "data": created_row,
                }
            ),
            201,
        )
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500




# ---------------- fpms dashboard  get api ------------------
# ------------------------------------------------------------


@scrutiny_bp.route("/scrutiny/fpms-dashboard", methods=["GET", "OPTIONS"])
def scrutiny_fpms_dashboard():
    try:
        data = get_scrutiny_fpms_dashboard_data()
        return jsonify(data), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500