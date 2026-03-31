from flask import Blueprint, request, jsonify
from app.models.database import db
from sqlalchemy import text
from werkzeug.security import check_password_hash
import traceback

admin_bp = Blueprint("admin_bp", __name__)

@admin_bp.route("/admin/login", methods=["POST"])
def admin_login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Request body is missing"}), 400

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        # ✅ Faster query (added LIMIT 1)
        result = db.session.execute(
            text("""
                SELECT id, username, email, photo, password 
                FROM admins 
                WHERE username = :u 
                LIMIT 1
            """),
            {"u": username}
        ).mappings().fetchone()

        # ✅ Proper checking (IMPORTANT CHANGE)
        if not result:
            return jsonify({"error": "Invalid username or password"}), 401

        if result["password"] != password:
            return jsonify({"error": "Invalid username or password"}), 401

        # ✅ Success response
        return jsonify({
            "message": "Login successful",
            "admin": {
                "id": result["id"],
                "username": result["username"],
                "email": result["email"],
                "photo": result["photo"]
            }
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "error": "Internal server error"
        }), 500