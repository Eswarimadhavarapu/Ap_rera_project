import json
import os
from werkzeug.utils import secure_filename

from flask import Blueprint, request, jsonify
from app.models.database import db
from app.models.agent_change_request_model import AgentRegistrationDetails, AgentChangeRequest

agent_change_request_bp = Blueprint("agent_change_request_bp", __name__)

UPLOAD_FOLDER = "uploads/change_requests"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def save_change_request_file(file, prefix=None):
    if not file or file.filename == "":
        return None

    safe_name = secure_filename(file.filename)
    if prefix:
        safe_name = f"{prefix}_{safe_name}"

    filepath = os.path.join(UPLOAD_FOLDER, safe_name)
    file.save(filepath)
    return safe_name


# =========================
# GET APPLICATION NUMBERS
# =========================

@agent_change_request_bp.route("/change-request/get-applications", methods=["POST"])
def get_application_numbers():

    try:

        data = request.get_json(force=True)
        pan = data.get("panNumber")

        if not pan:
            return jsonify({"error": "PAN number required"}), 400

        result = AgentRegistrationDetails.get_applications_by_pan(pan)

        if not result["success"]:
            return jsonify({
                "error": result["message"]
            }), 500

        return jsonify({"applications": result["applications"]}), 200

    except Exception as e:

        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500


@agent_change_request_bp.route(
    "/change-request/get-application-details/<application_no>",
    methods=["GET"]
)
def get_application_details(application_no):

    try:

        result = AgentRegistrationDetails.get_application_details_by_application_no(
            application_no
        )

        if result["success"]:
            return jsonify(result), 200

        return jsonify({
            "error": result["message"]
        }), 404

    except Exception as e:

        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500


# =========================
# SAVE CHANGE REQUEST
# =========================
UPLOAD_FOLDER = "uploads/change_requests"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@agent_change_request_bp.route("/change-request/save", methods=["POST"])
def save_change_request():

    try:

        data = request.form

        # -------------------------
        # PARSE JSON FIELD CHANGES
        # -------------------------

        individual_field_changes = json.loads(
            data.get("individualFieldChanges", "[]")
        )

        organization_field_changes = json.loads(
            data.get("organizationFieldChanges", "[]")
        )

        individual_field_documents = {}
        organization_field_documents = {}

        # -------------------------
        # SAVE INDIVIDUAL FIELD DOCUMENTS
        # -------------------------

        for i, field in enumerate(individual_field_changes):
            file = request.files.get(f"individualFieldDocument_{i}")
            saved_name = save_change_request_file(file, f"individualFieldDocument_{i}")

            if saved_name:
                individual_field_documents[field.get("label", f"field_{i}")] = {
                    "stored_name": saved_name,
                    "original_name": file.filename
                }

        # -------------------------
        # SAVE ORGANIZATION FIELD DOCUMENTS
        # -------------------------

        for i, field in enumerate(organization_field_changes):
            file = request.files.get(f"organizationFieldDocument_{i}")
            saved_name = save_change_request_file(file, f"organizationFieldDocument_{i}")

            if saved_name:
                organization_field_documents[field.get("label", f"field_{i}")] = {
                    "stored_name": saved_name,
                    "original_name": file.filename
                }

        # -------------------------
        # GENERAL UPLOADS
        # -------------------------

        individual_document_name = save_change_request_file(
            request.files.get("individualDocument")
        )
        organization_document_name = save_change_request_file(
            request.files.get("organizationDocument")
        )

        # -------------------------
        # REPLACEMENT FILES
        # -------------------------

        individual_replace_name = save_change_request_file(
            request.files.get("individualReplacementFile"),
            "individualReplacement"
        )
        organization_replace_name = save_change_request_file(
            request.files.get("organizationReplacementFile"),
            "organizationReplacement"
        )

        # -------------------------
        # SAVE TO DATABASE
        # -------------------------

        change_request = AgentChangeRequest(

            pan_number=data.get("panNumber"),
            application_no=data.get("applicationNo"),
            applicant_type=data.get("applicantType"),

            individual_issue_type=data.get("individualIssueType"),
            individual_issue=data.get("individualIssue"),
            individual_description=data.get("individualDescription"),
            individual_document=individual_document_name,
            individual_change_document=data.get("individualChangeDocument"),
            individual_replace_reason=data.get("individualReplaceReason"),
            individual_replacement_file=individual_replace_name,

            organization_issue_type=data.get("organizationIssueType"),
            organization_issue=data.get("organizationIssue"),
            organization_description=data.get("organizationDescription"),
            organization_document=organization_document_name,
            organization_change_document=data.get("organizationChangeDocument"),
            organization_replace_reason=data.get("organizationReplaceReason"),
            organization_replacement_file=organization_replace_name,

            # JSON DATA
            individual_field_changes=individual_field_changes,
            organization_field_changes=organization_field_changes,

            individual_field_documents=individual_field_documents,
            organization_field_documents=organization_field_documents
        )

        db.session.add(change_request)
        db.session.commit()

        return jsonify({
            "message": "Change request saved successfully"
        }), 201

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500