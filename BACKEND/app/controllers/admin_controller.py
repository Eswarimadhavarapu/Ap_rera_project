from flask import Blueprint, request, jsonify
from app.models.database import db
from sqlalchemy import text
# from werkzeug.security import check_password_hash
import traceback

admin_bp = Blueprint("admin_bp", __name__)

@admin_bp.route("/admin/login", methods=["POST"])
def admin_login():
    print("🔥 ADMIN CONTROLLER RUNNING 🔥")   # ✅ ADD HERE
    try:
        data = request.get_json()

        # ✅ Check request body
        if not data:
            return jsonify({"error": "Request body is missing"}), 400

        username = data.get("username")
        password = data.get("password")

        # ✅ Validate input
        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        # ✅ Fetch admin by username only
        result = db.session.execute(
    text("SELECT id, username, email, photo, password FROM admins WHERE username=:u"),
    {"u": username}
).mappings().fetchone()

        # ✅ Check password (hashed)
        if result and result["password"] == password:
            return jsonify({
                "message": "Login successful",
                "admin": {
                    "id": result["id"],
                    "username": result["username"],
                    "email": result["email"],
                    "photo": result["photo"]
                }
            }), 200

        return jsonify({"error": "Invalid username or password"}), 401

    except Exception as e:
        print("Admin Login Error:")
        traceback.print_exc()

        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500