
import random
from flask import Blueprint, request, jsonify, current_app
from app.models.database import db
from sqlalchemy import text
from werkzeug.security import check_password_hash
from app.utils.mail_utils import send_otp_email
from app.models.admin_model import Admin
from app import limiter
from flask_jwt_extended import create_access_token
admin_bp = Blueprint("admin_bp", __name__)

# Temporary OTP store
otp_store = {}


@admin_bp.route("/admin/login", methods=["POST"])
@limiter.limit(
    "10 per hour",
    key_func=lambda: request.get_json(silent=True).get("username", "")
)
def admin_login():
    try:
        data = request.get_json()

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        result = (
            db.session.execute(
                text(
                    """
                SELECT
                    id,
                    username,
                    full_name,
                    role,
                    department
                FROM admin_master_t
                WHERE username = :u
                LIMIT 1
            """
                ),
                {"u": username},
            )
            .mappings()
            .fetchone()
        )

        if not result:
            return jsonify({"error": "Invalid username"}), 401

        # ✅ Plain password check
        if result["password"] != password:
            return jsonify({"error": "Invalid password"}), 401

        # OTP generation
        otp = str(random.randint(100000, 999999))
        otp_store[username] = otp

        send_otp_email(result["email"], otp)

        return (
            jsonify({"message": "OTP sent to registered email", "username": username}),
            200,
        )

    except Exception as e:
        current_app.logger.exception("Unexpected error")
        return jsonify({"error": "Internal server error"}), 500


# -------------------------------
# VERIFY OTP → RETURN FULL DATA
# -------------------------------
@admin_bp.route("/admin/verify-otp", methods=["POST"])
@limiter.limit(
    "5 per 15 minutes",
    key_func=lambda: request.get_json(silent=True).get("username", "")
)
def verify_otp():
    try:
        data = request.get_json()

        username = data.get("username")
        otp = data.get("otp")

        if not username or not otp:
            return jsonify({"error": "Username and OTP required"}), 400

        if otp_store.get(username) != otp:
            return jsonify({"error": "Invalid OTP"}), 401

        result = (
            db.session.execute(
                text(
                    """
                SELECT
                    id,
                    username,
                    full_name,
                    role,
                    department
                FROM admin_master_t
                WHERE username = :u
            """
                ),
                {"u": username},
            )
            .mappings()
            .fetchone()
        )

        if not result:
            return jsonify({"error": "Admin not found"}), 404

        # remove OTP after success
        otp_store.pop(username, None)
        # Create JWT Token
        access_token = create_access_token(
        identity=str(result["id"])
        )

        return (
            jsonify(
                {
                    "message": "Login successful",
                    "access_token": access_token,
                    "admin": {
                        "id": result["id"],
                        "username": result["username"],
                        "full_name": result["full_name"],
                        "email": result["email"],
                        "phone": result["phone"],
                        "role": result["role"],
                        "department": result["department"],
                        "photo": result["photo"],
                        "employee_id": result["employee_id"],
                        "state": result["state"],
                        "district": result["district"],
                        "mandal": result["mandal"],
                        "village": result["village"],
                        "pincode": result["pincode"],
                    },
                }
            ),
            200,
        )

    except Exception as e:
        current_app.logger.exception("Unexpected error")
        return jsonify({"error": "Internal server error"}), 500

@admin_bp.route("/userDetails/<int:id>", methods=["GET"])
def get_admin_by_id(id):
    try:
        admin = Admin.query.get(id)

        print("🔥 API HIT")
        print("🔥 ID:", id)
        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        return (
            jsonify(
                {
                    "success": True,
                    "admin": {
                        "id": admin.id,
                        "username": admin.username,
                        "full_name": admin.full_name,
                        "first_name": admin.first_name,
                        "last_name": admin.last_name,
                        "email": admin.email,
                        "phone": admin.phone,
                        "role": admin.role,
                        "department": admin.department,
                        "employee_id": admin.employee_id,
                        "photo": admin.photo,
                        "state": admin.state,
                        "district": admin.district,
                        "mandal": admin.mandal,
                        "village": admin.village,
                        "pincode": admin.pincode,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        current_app.logger.exception("Unexpected error")
        return jsonify({"error": "Internal server error"}), 500