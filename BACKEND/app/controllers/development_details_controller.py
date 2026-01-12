import os
import logging
import json
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.models.development_details import DevelopmentDetailsModel

development_details_bp = Blueprint(
    "development_details_bp", __name__
)

BASE_UPLOAD_FOLDER = "uploads"
EXCEL_UPLOAD_FOLDER = os.path.join(BASE_UPLOAD_FOLDER, "excel")


@development_details_bp.route("/development-details", methods=["POST"])
def save_development_details():
       
    logging.info("Received request to /development-details")
    # ---------- CREATE UPLOAD FOLDERS ----------
    os.makedirs(EXCEL_UPLOAD_FOLDER, exist_ok=True)

    # ---------- READ FORM DATA ----------
    project_id = request.form.get("project_id")
    project_type = request.form.get("project_type")
    work_description = request.form.get("work_description")
    work_type = request.form.get("work_type")

    development_details = json.loads(
        request.form.get("development_details", "{}")
    )

    external_development_work = json.loads(
        request.form.get("external_development_work", "{}")
    )

    # ---------- FILE HANDLING & JSON UPDATE ----------
    for project_key in development_details.keys():

        file_field_name = f"{project_key}_file"

        if file_field_name in request.files:
            file = request.files[file_field_name]

            if file and file.filename:
                safe_name = secure_filename(file.filename)

                saved_path = os.path.join(
                    EXCEL_UPLOAD_FOLDER,
                    f"{project_id}_{project_key}_{safe_name}"
                )

                file.save(saved_path)

                # 🔥 inject file_path into SAME JSON
                development_details[project_key]["file_path"] = saved_path

    # ---------- SAVE TO DATABASE ----------
    row = DevelopmentDetailsModel.insert({
        "project_id": project_id,
        "project_type": project_type,
        "development_details": json.dumps(development_details),
        "external_development_work": json.dumps(external_development_work),
        "work_description": work_description,
        "work_type": work_type
    })

    return jsonify({
        "message": "Development details saved successfully",
        "id": row.id
    }), 201