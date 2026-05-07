# import random
# from flask import Blueprint, request, jsonify
# from app.models.database import db
# from sqlalchemy import text
# from werkzeug.security import check_password_hash
# from app.utils.mail_utils import send_otp_email

# admin_bp = Blueprint("admin_bp", __name__)

# # Temporary OTP store
# otp_store = {}


# @admin_bp.route("/admin/login", methods=["POST"])
# def admin_login():
#     try:
#         data = request.get_json()

#         username = data.get("username")
#         password = data.get("password")

#         if not username or not password:
#             return jsonify({"error": "Username and password required"}), 400

#         result = (
#             db.session.execute(
#                 text(
#                     """
#                 SELECT * FROM admin_master_t
#                 WHERE username = :u AND role IN ('admin','SUPER_ADMIN')
#                 LIMIT 1
#             """
#                 ),
#                 {"u": username},
#             )
#             .mappings()
#             .fetchone()
#         )

#         if not result:
#             return jsonify({"error": "Invalid username"}), 401

#         # ✅ Plain password check
#         if result["password"] != password:
#             return jsonify({"error": "Invalid password"}), 401

#         # OTP generation
#         otp = str(random.randint(100000, 999999))
#         otp_store[username] = otp

#         send_otp_email(result["email"], otp)

#         return (
#             jsonify({"message": "OTP sent to registered email", "username": username}),
#             200,
#         )

#     except Exception as e:
#         print(e)
#         return jsonify({"error": "Internal server error"}), 500


# # -------------------------------
# # VERIFY OTP → RETURN FULL DATA
# # -------------------------------
# @admin_bp.route("/admin/verify-otp", methods=["POST"])
# def verify_otp():
#     try:
#         data = request.get_json()

#         username = data.get("username")
#         otp = data.get("otp")

#         if not username or not otp:
#             return jsonify({"error": "Username and OTP required"}), 400

#         if otp_store.get(username) != otp:
#             return jsonify({"error": "Invalid OTP"}), 401

#         result = (
#             db.session.execute(
#                 text(
#                     """
#                 SELECT * FROM admin_master_t
#                 WHERE username = :u AND role IN ('admin','SUPER_ADMIN')
#             """
#                 ),
#                 {"u": username},
#             )
#             .mappings()
#             .fetchone()
#         )

#         if not result:
#             return jsonify({"error": "Admin not found"}), 404

#         # remove OTP after success
#         otp_store.pop(username, None)

#         return (
#             jsonify(
#                 {
#                     "message": "Login successful",
#                     "admin": {
#                         "id": result["id"],
#                         "username": result["username"],
#                         "full_name": result["full_name"],
#                         "email": result["email"],
#                         "phone": result["phone"],
#                         "role": result["role"],
#                         "department": result["department"],
#                         "photo": result["photo"],
#                         "employee_id": result["employee_id"],
#                         "state": result["state"],
#                         "district": result["district"],
#                         "mandal": result["mandal"],
#                         "village": result["village"],
#                         "pincode": result["pincode"],
#                     },
#                 }
#             ),
#             200,
#         )

#     except Exception as e:
#         print(e)
#         return jsonify({"error": "Internal server error"}), 500
    

# @admin_bp.route("/userDetails/<int:id>", methods=["GET"])
# def get_admin_by_id(id):
#     try:
#         admin = Admin.query.get(id)

#         if not admin:
#             return jsonify({"error": "Admin not found"}), 404

#         return (
#             jsonify(
#                 {
#                     "success": True,
#                     "admin": {
#                         "id": admin.id,
#                         "username": admin.username,
#                         "full_name": admin.full_name,
#                         "first_name": admin.first_name,
#                         "last_name": admin.last_name,
#                         "email": admin.email,
#                         "phone": admin.phone,
#                         "role": admin.role,
#                         "department": admin.department,
#                         "employee_id": admin.employee_id,
#                         "photo": admin.photo,
#                         "state": admin.state,
#                         "district": admin.district,
#                         "mandal": admin.mandal,
#                         "village": admin.village,
#                         "pincode": admin.pincode,
#                     },
#                 }
#             ),
#             200,
#         )

#     except Exception as e:
#         print(e)
#         return jsonify({"error": "Internal server error"}), 500
    
    
# @admin_bp.route("/department/login", methods=["POST"])
# def department_login():
#     data = request.get_json()
#     username = data.get("username")
#     password = data.get("password")

#     result = db.session.execute(
#         text("""
#             SELECT * FROM admin_master_t
#             WHERE username = :u AND LOWER(role) NOT IN ('admin','super_admin')
#         """),
#         {"u": username},
#     ).mappings().fetchone()

#     if not result or result["password"] != password:
#         return jsonify({"error": "Invalid credentials"}), 401

#     otp = str(random.randint(100000, 999999))
#     otp_store[username] = otp
#     send_otp_email(result["email"], otp)

#     return jsonify({"message": "OTP sent"}), 200

# @admin_bp.route("/department/verify-otp", methods=["POST"])
# def department_verify_otp():
#     data = request.get_json()
#     username = data.get("username")
#     otp = data.get("otp")
    
#     stored_otp = str(otp_store.get(username)).strip()
#     entered_otp = str(otp).replace(" ", "").strip()
#     print("Stored OTP:", stored_otp)
#     print("Entered OTP:", entered_otp)
#     if stored_otp != entered_otp:
#         return jsonify({"error": "Invalid OTP"}), 401

#     result = db.session.execute(
#         text("""
#             SELECT * FROM admin_master_t
#             WHERE username = :u AND LOWER(role) NOT IN ('admin','super_admin')
#         """),
#         {"u": username},
#     ).mappings().fetchone()

#     otp_store.pop(username, None)

#     return jsonify({
#         "message": "Login successful",
#         "admin": {
#             "id": result["id"],
#             "username": result["username"],
#             "full_name": result["full_name"],
#             "email": result["email"],
#             "phone": result["phone"],
#             "role": result["role"],
#             "department": result["department"],
#             "employee_id": result["employee_id"],
#             "photo": result["photo"],
#             "state": result["state"],
#             "district": result["district"],
#             "mandal": result["mandal"],
#             "village": result["village"],
#             "pincode": result["pincode"],
#         }
#     }), 200

import random
from flask import Blueprint, request, jsonify
from app.models.database import db
from sqlalchemy import text
from werkzeug.security import check_password_hash
from app.utils.mail_utils import send_otp_email

admin_bp = Blueprint("admin_bp", __name__)

# Temporary OTP store
otp_store = {}


@admin_bp.route("/admin/login", methods=["POST"])
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
                SELECT * FROM admin_master_t
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
        print(e)
        return jsonify({"error": "Internal server error"}), 500


# -------------------------------
# VERIFY OTP → RETURN FULL DATA
# -------------------------------
@admin_bp.route("/admin/verify-otp", methods=["POST"])
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
                SELECT * FROM admin_master_t
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

        return (
            jsonify(
                {
                    "message": "Login successful",
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
        print(e)
        return jsonify({"error": "Internal server error"}), 500