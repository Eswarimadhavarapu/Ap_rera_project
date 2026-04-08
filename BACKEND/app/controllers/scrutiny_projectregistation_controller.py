from flask import Blueprint, jsonify, request

from app.models.scrutiny_projectregistation_model import (
    get_scrutiny_project_registration_by_application,
    get_scrutiny_project_registrations,
)


scrutiny_bp = Blueprint("scrutiny_bp", __name__)


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