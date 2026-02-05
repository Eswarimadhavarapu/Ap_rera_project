from flask import Blueprint, request, jsonify
from app.models.project_registration_extensionprocess import (
    get_project_basic_details_by_pan
)

preview_extensionprocess_bp = Blueprint(
    "preview_extensionprocess_bp",
    __name__
)

@preview_extensionprocess_bp.route(
    "/project/basic-details-by-pan",
    methods=["GET"]
)
def get_project_basic_details_by_pan_controller():
    pan_number = request.args.get("pan")

    if not pan_number:
        return jsonify({
            "success": False,
            "message": "pan is required"
        }), 400

    data = get_project_basic_details_by_pan(pan_number)

    return jsonify({
        "success": True,
        "data": data
    }), 200
