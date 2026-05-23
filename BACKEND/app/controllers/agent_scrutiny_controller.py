import os
from datetime import datetime
from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename
from sqlalchemy import text

from app.models.agent_scrutiny_model import (
    get_agent_scrutiny_registrations,
    get_agent_scrutiny_registration_by_application,
    get_agent_scrutiny_full_details,
    create_agent_scrutiny_file,
    get_agent_scrutiny_fpms_dashboard_data,
    create_agent_verification_remark,
    get_agent_verification_remarks,
    create_agent_final_verification,
    get_agent_final_status,
    get_agent_final_shortfall_remarks,
    get_agent_document_shortfall_remarks,
    get_agent_contact_by_application,
    generate_agent_registration_number,
)
from app.utils.mail_service import send_email

agent_scrutiny_bp = Blueprint("agent_scrutiny_bp", __name__, url_prefix="/api")

def _save_scrutiny_file(file_obj):
    if not file_obj or not getattr(file_obj, "filename", ""):
        return None

    upload_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "agent_scrutiny_files")
    os.makedirs(upload_dir, exist_ok=True)

    original_name = secure_filename(file_obj.filename)
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    filename = f"{timestamp}_{original_name}" if original_name else timestamp

    absolute_path = os.path.join(upload_dir, filename)
    file_obj.save(absolute_path)

    return f"uploads/agent_scrutiny_files/{filename}"

def _parse_bool(value):
    if isinstance(value, bool):
        return value
    return str(value or "").strip().lower() in {"true", "1", "yes", "y"}


def _format_agent_shortfall_email(application_no, applicant_name, final_shortfalls, document_shortfalls):
    final_lines = [
        f"{index}. {row.get('verified_by') or 'Department'}: {row.get('remarks') or 'No remarks'}"
        for index, row in enumerate(final_shortfalls, 1)
    ] or ["No general shortfall remarks recorded."]

    document_lines = [
        (
            f"{index}. {row.get('document_name') or 'Document'}"
            f" - {row.get('verified_by') or row.get('verification_team') or 'Department'}:"
            f" {row.get('remarks') or 'No remarks'}"
        )
        for index, row in enumerate(document_shortfalls, 1)
    ] or ["No document shortfall remarks recorded."]

    return f"""Dear {applicant_name or 'Agent'},

Shortfalls have been identified for agent application {application_no}.

General shortfall remarks:
{chr(10).join(final_lines)}

Document shortfall remarks:
{chr(10).join(document_lines)}

Please address the above shortfalls and submit the required corrections/documents as per AP RERA instructions.

Regards,
AP RERA Authority
"""

@agent_scrutiny_bp.route("/agent-scrutiny/registrations", methods=["GET", "OPTIONS"])
def scrutiny_registrations():
    try:
        dept = request.args.get("dept")
        data = get_agent_scrutiny_registrations(dept)
        return jsonify(data), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

@agent_scrutiny_bp.route("/agent-scrutiny/registrations/details", methods=["GET", "OPTIONS"])
def scrutiny_registration_detail():
    try:
        application_no = request.args.get("application_no")
        if not application_no:
            return jsonify({"error": "application_no is required"}), 400

        summary_data = get_agent_scrutiny_registration_by_application(application_no)
        if not summary_data:
            return jsonify({"error": "Agent not found"}), 404

        full_details = get_agent_scrutiny_full_details(application_no)
        if full_details and full_details.get("success"):
             summary_data["full_data"] = full_details.get("data")
        else:
             summary_data["full_details_error"] = full_details.get("message") if full_details else "No response from full details function"

        return jsonify(summary_data), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

@agent_scrutiny_bp.route("/agent-scrutiny/create-file", methods=["POST"])
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
            return jsonify({"error": "Missing required fields", "missing_fields": missing_fields}), 400

        data["file_path"] = _save_scrutiny_file(upload)
        created_row = create_agent_scrutiny_file(data)

        return jsonify({"message": "Agent Scrutiny file created successfully", "data": created_row}), 201
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

@agent_scrutiny_bp.route("/agent-scrutiny/fpms-dashboard", methods=["GET", "OPTIONS"])
def scrutiny_fpms_dashboard():
    try:
        data = get_agent_scrutiny_fpms_dashboard_data()
        return jsonify(data), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

@agent_scrutiny_bp.route("/agent-scrutiny/verification-remarks", methods=["POST"])
def create_verification_remark_api():
    try:
        payload = request.form if request.form else (request.get_json(silent=True) or {})

        data = {
            "application_no": payload.get("application_no") or payload.get("applicationNo"),
            "document_name": payload.get("document_name") or payload.get("documentName"),
            "verification_team": payload.get("verification_team") or payload.get("verificationTeam"),
            "is_shortfall": _parse_bool(payload.get("is_shortfall") if "is_shortfall" in payload else payload.get("isShortfall")),
            "status": payload.get("status") or "pending",
            "remarks": payload.get("remarks"),
            "document_path": payload.get("document_path") or payload.get("documentPath"),
            "verified_by": payload.get("verified_by") or payload.get("verifiedBy"),
        }

        required_fields = {
            "application_no": "application_no",
            "document_name": "document_name",
            "verification_team": "verification_team",
        }

        missing_fields = [
            label for key, label in required_fields.items()
            if not str(data.get(key) or "").strip()
        ]

        if missing_fields:
            return jsonify({"error": "Missing required fields", "missing_fields": missing_fields}), 400

        allowed_teams = {"verification", "audit", "planning", "legal", "engineer", "ad", "dd", "directory"}
        allowed_statuses = {"pending", "approved", "rejected"}

        data["verification_team"] = str(data["verification_team"]).strip().lower()
        if data["verification_team"] == "scrutiny":
           data["verification_team"] = "verification"
        data["status"] = str(data["status"] or "pending").strip().lower()

        if data["verification_team"] not in allowed_teams:
            return jsonify({"error": "Invalid verification_team", "allowed_values": sorted(allowed_teams)}), 400

        if data["status"] not in allowed_statuses:
            return jsonify({"error": "Invalid status", "allowed_values": sorted(allowed_statuses)}), 400

        created_row = create_agent_verification_remark(data)
        return jsonify({"message": "Agent Verification remark saved successfully", "data": created_row}), 201
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

@agent_scrutiny_bp.route("/agent-scrutiny/verification-remarks", methods=["GET"])
def get_verification_remark_api():
    try:
        application_no = request.args.get("application_no") or request.args.get("applicationNo")
        document_name = request.args.get("document_name") or request.args.get("documentName")
        verification_team = request.args.get("verification_team") or request.args.get("verificationTeam")

        if not str(application_no or "").strip():
            return jsonify({"error": "application_no is required"}), 400

        if verification_team is not None:
            verification_team = str(verification_team).strip().lower() or None

        rows = get_agent_verification_remarks(
            application_no=str(application_no).strip(),
            document_name=document_name,
            verification_team=verification_team,
        )

        return jsonify({"rows": rows}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

@agent_scrutiny_bp.route("/agent-scrutiny/final-submit", methods=["POST"])
def final_submit():
    try:
        data = request.get_json()

        payload = {
            "application_no": data.get("application_no"),
            "status": "verified",
            "is_shortfall": True if str(data.get("is_shortfall")).lower() == "yes" else False,
            "verified_by": data.get("department"),
            "remarks": data.get("remarks"),
            "registration_number": None,
        }

        if not payload["application_no"]:
            return jsonify({"error": "application_no required"}), 400

        result = create_agent_final_verification(payload)

        response_payload = {
            "message": "Final Verification Done",
            "data": result,
        }

        is_director = str(payload["verified_by"] or "").strip().lower() in {"director", "directory"}

        if is_director and payload["is_shortfall"]:
            contact = get_agent_contact_by_application(payload["application_no"])
            if not contact or not contact.get("email"):
                return jsonify({"error": "Agent email not found"}), 404

            email_sent = send_email(
                contact["email"],
                f"Agent Shortfall Notice - {payload['application_no']}",
                _format_agent_shortfall_email(
                    payload["application_no"],
                    contact.get("applicant_name"),
                    get_agent_final_shortfall_remarks(payload["application_no"]),
                    get_agent_document_shortfall_remarks(payload["application_no"]),
                ),
            )
            response_payload.update(
                {
                    "message": "Final Verification Done and shortfall email sent"
                    if email_sent
                    else "Final Verification Done but shortfall email failed",
                    "email_sent": email_sent,
                }
            )
        elif is_director and not payload["is_shortfall"]:
            response_payload["message"] = "Final Verification Done and forwarded to chairman"
            response_payload["forwarded_to"] = "chairman"

        return jsonify(response_payload), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@agent_scrutiny_bp.route("/agent-scrutiny/chairman-decision", methods=["POST"])
def chairman_decision():
    try:
        data = request.get_json() or {}
        application_no = str(data.get("application_no") or "").strip()
        decision = str(data.get("decision") or "").strip().lower()
        remarks = str(data.get("remarks") or "").strip()

        if not application_no:
            return jsonify({"error": "application_no required"}), 400
        if decision not in {"approved", "rejected"}:
            return jsonify({"error": "decision must be approved or rejected"}), 400
        if not remarks:
            return jsonify({"error": "remarks required"}), 400

        contact = None
        if decision == "approved":
            contact = get_agent_contact_by_application(application_no)
            if not contact or not contact.get("email"):
                return jsonify({"error": "Agent email not found"}), 404

        registration_number = (
            generate_agent_registration_number() if decision == "approved" else None
        )

        result = create_agent_final_verification(
            {
                "application_no": application_no,
                "status": decision,
                "is_shortfall": False,
                "verified_by": "chairman",
                "remarks": remarks,
                "registration_number": registration_number,
            }
        )

        email_sent = None
        if decision == "approved":
            email_sent = send_email(
                contact["email"],
                f"Agent Registration Approved - {registration_number}",
                f"""Dear {contact.get('applicant_name') or 'Agent'},

Your agent application {application_no} has been approved by AP RERA.

Registration Number: {registration_number}

Regards,
AP RERA Authority
""",
            )

        return jsonify(
            {
                "message": (
                    f"Application approved by chairman. Registration number {registration_number} created"
                    if decision == "approved"
                    else "Application rejected by chairman"
                ),
                "data": result,
                "registration_number": registration_number,
                "email_sent": email_sent,
            }
        ), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@agent_scrutiny_bp.route("/agent-scrutiny/final-status", methods=["GET"])
def get_final_status():
    try:
        application_no = request.args.get("application_no")
        rows = get_agent_final_status(application_no)
        return jsonify({"rows": rows}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500