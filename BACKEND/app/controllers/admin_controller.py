from flask import Blueprint, request, jsonify
from app.models.database import db
from sqlalchemy import text
import traceback

admin_bp = Blueprint("admin_bp", __name__)

@admin_bp.route("/admin/login", methods=["POST"])
def admin_login():

    try:
        data = request.get_json()

        # check request body
        if not data:
            return jsonify({"error": "Request body is missing"}), 400

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        result = db.session.execute(
            text("SELECT * FROM admins WHERE username=:u AND password=:p"),
            {"u": username, "p": password}
        ).fetchone()

        if result:
            return jsonify({
                "message": "Login successful",
                "admin": {
                    "id": result.id,
                    "username": result.username
                }
            })

        return jsonify({"error": "Invalid username or password"}), 401

    except Exception as e:
        # print error in terminal
        print("Admin Login Error:")
        traceback.print_exc()

        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500