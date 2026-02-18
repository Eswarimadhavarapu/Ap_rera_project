from flask import Blueprint, jsonify, request

# 🔥 IMPORT PREVIEW BUILDER (MODEL / DATA FILE)
from app.models.othertheninduvidual_project_preview_model import (
    build_project_preview_data
)

from app.models.othertheninduvidual_project_registration_model import (
    get_othertheninduvidual_project_registration
)

# --------------------------------------------------
# Blueprint
# --------------------------------------------------
othertheninduvidual_project_preview_bp = Blueprint(
    "othertheninduvidual_project_preview_bp",
    __name__
)

# --------------------------------------------------
# Preview API (USED BY FRONTEND)
# --------------------------------------------------
@othertheninduvidual_project_preview_bp.route(
    "/othertheninduvidual/project/preview",
    methods=["POST"]
)
def othertheninduvidual_project_preview_controller():

    print("🔥 OTHER THAN INDIVIDUAL PREVIEW HIT 🔥")

    raw_data = request.get_json()
    print("🔥 RAW JSON:", raw_data)

    preview_data = build_project_preview_data(raw_data)

    return jsonify({
        "success": True,
        "data": preview_data
    })


# --------------------------------------------------
# Registration Fetch API (OPTIONAL / DEBUG)
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
            return jsonify({"message": "No project found"}), 404

        return jsonify({
            "success": True,
            "data": data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500