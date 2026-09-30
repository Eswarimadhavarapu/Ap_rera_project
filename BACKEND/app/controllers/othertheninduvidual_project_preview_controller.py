from flask import Blueprint, jsonify, request, current_app
from app.utils.validation_schemas import validate_registration
# --------------------------------------------------
# 🔥 IMPORT PREVIEW BUILDER
# (THIS CALLS organization_profile_model FUNCTIONS)
# --------------------------------------------------
from app.models.othertheninduvidual_project_preview_model import (
    build_project_preview_data
)

# --------------------------------------------------
# OPTIONAL DEBUG API (FETCH RAW REGISTRATION DATA)
# --------------------------------------------------
from app.models.othertheninduvidual_project_registration_model import (
    get_othertheninduvidual_project_registration
)

# --------------------------------------------------
# Blueprint Declaration
# --------------------------------------------------
othertheninduvidual_project_preview_bp = Blueprint(
    "othertheninduvidual_project_preview_bp",
    __name__
)

# --------------------------------------------------
# ✅ MAIN PREVIEW API (USED BY FRONTEND)
# --------------------------------------------------
@othertheninduvidual_project_preview_bp.route(
    "/othertheninduvidual/project/preview",
    methods=["POST"]
)
def othertheninduvidual_project_preview_controller():

    try:
        print("🔥 OTHER THAN INDIVIDUAL PREVIEW HIT 🔥")

        # -----------------------------
        # GET REQUEST JSON
        # -----------------------------
        raw_data = request.get_json()

        if not raw_data:
            return jsonify({
                "success": False,
                "message": "Request body is missing"
            }), 400

        print("🔥 RAW JSON:", raw_data)
        validation_error = validate_registration({
            "pan": raw_data.get("pan_number")
        })
        
        if validation_error:
            return validation_error
        # -----------------------------
        # BUILD PREVIEW DATA
        # -----------------------------
        preview_data = build_project_preview_data(raw_data)

        # -----------------------------
        # SUCCESS RESPONSE
        # -----------------------------
        return jsonify({
            "success": True,
            "data": preview_data
        }), 200

    except Exception as e:
        current_app.logger.exception("Unexpected error")
        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500


# --------------------------------------------------
# ✅ OPTIONAL DEBUG API
# (FETCH REGISTRATION DATA DIRECTLY)
# --------------------------------------------------
@othertheninduvidual_project_preview_bp.route(
    "/othertheninduvidual-project-registration/<application_number>/<pan_number>",
    methods=["GET"]
)
def get_othertheninduvidual_project_registration_controller(
        application_number,
        pan_number):

    try:
        data = get_othertheninduvidual_project_registration(
            application_number,
            pan_number
        )

        if not data:
            return jsonify({
                "success": False,
                "message": "No project found"
            }), 404

        return jsonify({
            "success": True,
            "data": data
        }), 200

    except Exception as e:
        current_app.logger.exception("Unexpected error")
        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500