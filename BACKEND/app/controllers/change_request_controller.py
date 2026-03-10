import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.models.database import db
from app.models.change_request_model import ChangeRequest

change_request_bp = Blueprint("change_request_bp", __name__)

UPLOAD_FOLDER = "uploads/change_requests"


@change_request_bp.route("/change-request", methods=["POST"])
def create_change_request():

    application_no = request.form.get("application_no")
    change_type = request.form.get("change_type")
    description = request.form.get("description")

    file = request.files.get("document")

    filename = None

    if file:
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))

    new_request = ChangeRequest(
        application_no=application_no,
        change_type=change_type,
        description=description,
        document=filename
    )

    db.session.add(new_request)
    db.session.commit()

    return jsonify({"message": "Change request submitted successfully"})