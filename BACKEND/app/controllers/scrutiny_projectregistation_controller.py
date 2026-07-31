import os
from datetime import datetime

from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename
from sqlalchemy import text
from app.models.database import db
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from app.utils.role_required import roles_required
from app.models.scrutiny_projectregistation_model import (
    create_verification_remark,
    delete_verification_remark,
    create_scrutiny_file as create_scrutiny_file_record,
    get_document_shortfall_remarks,
    get_final_shortfall_remarks,
    get_project_contact_by_application,
    generate_project_registration_number,
    get_verification_remarks,
    get_scrutiny_fpms_dashboard_data,
    get_scrutiny_project_registration_by_application,
    get_scrutiny_project_registrations,
    update_project_scrutiny_status,
)
from app.utils.mail_service import send_email


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


def _parse_bool(value):
    if isinstance(value, bool):
        return value
    return str(value or "").strip().lower() in {"true", "1", "yes", "y"}


@scrutiny_bp.route("/scrutiny/project-registrations", methods=["GET", "OPTIONS"])
@jwt_required()
@roles_required(
    "SCRUTINY",
    "LEGAL_L1",
    "LEGAL_L2",
    "PLANNING",
    "AUDIT",
    "ENGINEER",
    "AD",
    "DIRECTOR",
    "CHAIRMAN",
    "ADMIN",
    "SUPER_ADMIN",
    "SENIARADIT"
)
def scrutiny_project_registrations():
    try:
        dept = request.args.get("dept")   # 👈 ADD THIS LINE
        data = get_scrutiny_project_registrations(dept)   # 👈 MODIFY
        return jsonify(data), 200
    except Exception as exc:
        return jsonify({"error": "Internal server error"}), 500


from app.models.scrutiny_projectregistation_model import create_final_verification


def _format_shortfall_email(application_no, applicant_name, final_shortfalls, document_shortfalls):
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

    return f"""Dear {applicant_name or 'Promoter'},

Shortfalls have been identified for project application {application_no}.

General shortfall remarks:
{chr(10).join(final_lines)}

Document shortfall remarks:
{chr(10).join(document_lines)}

Please address the above shortfalls and submit the required corrections/documents as per AP RERA instructions.

Regards,
AP RERA Authority
"""

@scrutiny_bp.route("/scrutiny/verification-remarks/<int:remark_id>", methods=["DELETE"])
@jwt_required()
@roles_required(
    "SCRUTINY",
    "LEGAL_L1",
    "LEGAL_L2",
    "PLANNING",
    "AUDIT",
    "ENGINEER",
    "AD",
    "DIRECTOR",
    "CHAIRMAN",
    "ADMIN",
    "SUPER_ADMIN",
    "SENIARADIT"
)
def delete_verification_remark_api(remark_id):
    try:
        application_no = request.args.get("application_no") or request.args.get("applicationNo")

        if not str(application_no or "").strip():
            return jsonify({"error": "application_no is required"}), 400

        application_no = str(application_no).strip()
        existing_remarks = get_verification_remarks(application_no=application_no)
        target_remark = next(
            (row for row in existing_remarks if int(row.get("id") or 0) == remark_id),
            None,
        )

        if not target_remark:
            return jsonify({"error": "Remark not found"}), 404

        target_team = str(target_remark.get("verification_team") or "").strip().lower()
        if target_team == "scrutiny":
            target_team = "verification"

        final_query = text("""
            SELECT verified_by
            FROM verification_final_status
            WHERE TRIM(application_no) = TRIM(:application_no)
        """)
        final_rows = db.session.execute(final_query, {"application_no": application_no}).mappings().all()
        for row in final_rows:
            verified_by = str(row.get("verified_by") or "").strip().lower()
            if verified_by == "scrutiny":
                verified_by = "verification"
            if verified_by == target_team:
                return jsonify({"error": "Final submit already completed. Remarks are locked."}), 409

        deleted_row = delete_verification_remark(
            remark_id=remark_id,
            application_no=application_no,
        )

        if not deleted_row:
            return jsonify({"error": "Remark not found"}), 404

        return jsonify({"message": "Remark removed successfully"}), 200
    except Exception as exc:
        return jsonify({"error": "Internal server error"}), 500
@scrutiny_bp.route("/scrutiny/final-submit", methods=["POST"])
@jwt_required()
@roles_required(
    "SCRUTINY",
    "LEGAL_L1",
    "LEGAL_L2",
    "PLANNING",
    "AUDIT",
    "ENGINEER",
    "AD",
    "DIRECTOR",
    "CHAIRMAN",
    "ADMIN",
    "SUPER_ADMIN",
    "SENIARADIT"
)
def final_submit():
    try:
        data = request.get_json()

        payload = {
            "application_no": data.get("application_no"),
            "status": "verified",   # ✅ THIS LINE ADD CHEY
            "is_shortfall": True if str(data.get("is_shortfall")).lower() == "yes" else False,
            "verified_by": data.get("department"),
            "remarks": data.get("remarks"),
            "registration_number": None,
        }

        if not payload["application_no"]:
            return jsonify({"error": "application_no required"}), 400

        result = create_final_verification(payload)

        response_payload = {
            "message": "Final Verification Done",
            "data": result,
        }

        is_director = str(payload["verified_by"] or "").strip().lower() == "director"

        if is_director and payload["is_shortfall"]:
            contact = get_project_contact_by_application(payload["application_no"])
            final_shortfalls = get_final_shortfall_remarks(payload["application_no"])
            document_shortfalls = get_document_shortfall_remarks(payload["application_no"])

            if not contact or not contact.get("email"):
                return jsonify({"error": "Promoter email not found"}), 404

            email_sent = send_email(
                contact["email"],
                f"Shortfall Notice - {payload['application_no']}",
                _format_shortfall_email(
                    payload["application_no"],
                    contact.get("applicant_name"),
                    final_shortfalls,
                    document_shortfalls,
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
        return jsonify({"error": "Internal server error"}), 500


@scrutiny_bp.route("/scrutiny/chairman-decision", methods=["POST"])
@jwt_required()
@roles_required(
    "SCRUTINY",
    "LEGAL_L1",
    "LEGAL_L2",
    "PLANNING",
    "AUDIT",
    "ENGINEER",
    "AD",
    "DIRECTOR",
    "CHAIRMAN",
    "ADMIN",
    "SUPER_ADMIN",
    "SENIARADIT"
)
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
            contact = get_project_contact_by_application(application_no)
            if not contact or not contact.get("email"):
                return jsonify({"error": "Promoter email not found"}), 404

        registration_number = (
            generate_project_registration_number() if decision == "approved" else None
        )

        result = create_final_verification(
            {
                "application_no": application_no,
                "status": decision,
                "is_shortfall": False,
                "verified_by": "chairman",
                "remarks": remarks,
                "registration_number": registration_number,
            }
        )

        updated_registration = update_project_scrutiny_status(application_no, decision)
        if not updated_registration:
            return jsonify({"error": "Project registration not found"}), 404

        email_sent = None
        if decision == "approved":
            approval_body = f"""Dear {contact.get('applicant_name') or 'Promoter'},

Your project application {application_no} has been approved by AP RERA.

Registration Number: {registration_number}

Regards,
AP RERA Authority
"""

            email_sent = send_email(
                contact["email"],
                f"Project Registration Approved - {registration_number}",
                approval_body,
            )

        return (
            jsonify(
                {
                    "message": (
                        f"Application approved by chairman. Registration number {registration_number} created"
                        if decision == "approved"
                        else "Application rejected by chairman"
                    ),
                    "data": result,
                    "updated_registration": updated_registration,
                    "registration_number": registration_number,
                    "email_sent": email_sent,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

@scrutiny_bp.route("/scrutiny/final-status", methods=["GET"])
@jwt_required()
@roles_required(
    "SCRUTINY",
    "LEGAL_L1",
    "LEGAL_L2",
    "PLANNING",
    "AUDIT",
    "ENGINEER",
    "AD",
    "DIRECTOR",
    "CHAIRMAN",
    "ADMIN",
    "SUPER_ADMIN",
    "SENIARADIT"
)
def get_final_status():
    try:
        application_no = request.args.get("application_no")

        query = text("""
            SELECT 
                application_no,
                status,
                is_shortfall,
                verified_by,

                     
                verified_at,
                remarks
            FROM verification_final_status
            WHERE TRIM(application_no) = TRIM(:application_no)
        """)

        rows = db.session.execute(query, {
            "application_no": application_no
        }).mappings().all()

        # ✅ FIX HERE
        data = [dict(row) for row in rows]

        return jsonify({"rows": data}), 200

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
@scrutiny_bp.route(
    "/scrutiny/project-registrations/details",
    methods=["GET", "OPTIONS"],
)
@jwt_required()
@roles_required(
    "SCRUTINY",
    "LEGAL_L1",
    "LEGAL_L2",
    "PLANNING",
    "AUDIT",
    "ENGINEER",
    "AD",
    "DIRECTOR",
    "CHAIRMAN",
    "ADMIN",
    "SUPER_ADMIN",
    "SENIARADIT"
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
        return jsonify({"error": "Internal server error"}), 500


# -----------------create file posting api ------------------
# ----------------------------------------------------------------


@scrutiny_bp.route("/scrutiny/create-file", methods=["POST"])
@jwt_required()
@roles_required(
    "SCRUTINY",
    "LEGAL_L1",
    "LEGAL_L2",
    "PLANNING",
    "AUDIT",
    "ENGINEER",
    "AD",
    "DIRECTOR",
    "CHAIRMAN",
    "ADMIN",
    "SUPER_ADMIN",
    "SENIARADIT",
    "STAFF"
)
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
        return jsonify({"error": "Internal server error"}), 500




# ---------------- fpms dashboard  get api ------------------
# ------------------------------------------------------------


@scrutiny_bp.route("/scrutiny/fpms-dashboard", methods=["GET", "OPTIONS"])
@jwt_required()
@roles_required(
    "SCRUTINY",
    "LEGAL_L1",
    "LEGAL_L2",
    "PLANNING",
    "AUDIT",
    "ENGINEER",
    "AD",
    "DIRECTOR",
    "CHAIRMAN",
    "ADMIN",
    "SUPER_ADMIN",
    "SENIARADIT",
    "STAFF"
)
def scrutiny_fpms_dashboard():
    try:
        data = get_scrutiny_fpms_dashboard_data()
        return jsonify(data), 200
    except Exception as exc:
        return jsonify({"error": "Internal server error"}), 500


# ------------------remarks api ----------------------
# ---------------------------------------------------


@scrutiny_bp.route("/scrutiny/verification-remarks", methods=["POST"])
@jwt_required()
@roles_required(
    "SCRUTINY",
    "LEGAL_L1",
    "LEGAL_L2",
    "PLANNING",
    "AUDIT",
    "ENGINEER",
    "AD",
    "DIRECTOR",
    "CHAIRMAN",
    "ADMIN",
    "SUPER_ADMIN",
    "SENIARADIT"
)
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
            return (
                jsonify(
                    {
                        "error": "Missing required fields",
                        "missing_fields": missing_fields,
                    }
                ),
                400,
            )

        allowed_teams = {"verification", "audit", "planning", "legal", "engineer", "ad", "dd", "director"}
        allowed_statuses = {"pending", "approved", "rejected"}

        data["verification_team"] = str(data["verification_team"]).strip().lower()
        if data["verification_team"] == "scrutiny":
           data["verification_team"] = "verification"
        data["status"] = str(data["status"] or "pending").strip().lower()

        if data["verification_team"] not in allowed_teams:
            return (
                jsonify(
                    {
                        "error": "Invalid verification_team",
                        "allowed_values": sorted(allowed_teams),
                    }
                ),
                400,
            )

        if data["status"] not in allowed_statuses:
            return (
                jsonify(
                    {
                        "error": "Invalid status",
                        "allowed_values": sorted(allowed_statuses),
                    }
                ),
                400,
            )

        created_row = create_verification_remark(data)

        return (
            jsonify(
                {
                    "message": "Verification remark saved successfully",
                    "data": created_row,
                }
            ),
            201,
        )
    except Exception as exc:
        return jsonify({"error": "Internal server error"}), 500

# ------------------remarks get api ----------------------
# ---------------------------------------------------


@scrutiny_bp.route("/scrutiny/verification-remarks", methods=["GET"])
@jwt_required()
@roles_required(
    "SCRUTINY",
    "LEGAL_L1",
    "LEGAL_L2",
    "PLANNING",
    "AUDIT",
    "ENGINEER",
    "AD",
    "DIRECTOR",
    "CHAIRMAN",
    "ADMIN",
    "SUPER_ADMIN",
    "SENIARADIT"
)
def get_verification_remark_api():
    try:
        application_no = request.args.get("application_no") or request.args.get("applicationNo")
        document_name = request.args.get("document_name") or request.args.get("documentName")
        verification_team = request.args.get("verification_team") or request.args.get("verificationTeam")

        if not str(application_no or "").strip():
            return jsonify({"error": "application_no is required"}), 400

        if verification_team is not None:
            verification_team = str(verification_team).strip().lower() or None

        rows = get_verification_remarks(
            application_no=str(application_no).strip(),
            document_name=document_name,
            verification_team=verification_team,
        )

        return jsonify({"rows": rows}), 200
    except Exception as exc:
        return jsonify({"error": "Internal server error"}), 500