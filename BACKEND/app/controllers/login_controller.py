import hmac
import os
import logging
from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from sqlalchemy import text
from app import limiter
from app.models.database import db
from app.models.login_model import (
    get_emails_by_pan,
    get_projects_by_pan
)
from app.utils.otp_utils import generate_otp, verify_otp
from app.utils.mail_utils import send_otp_email
from app.utils.otp_utils import generate_otp, hash_otp


# =====================================================
# LOGGER SETUP (LOGIN CONTROLLER)
# =====================================================
from flask_jwt_extended import create_access_token
from app.utils.validation_schemas import validate_registration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "logs"))
os.makedirs(LOG_DIR, exist_ok=True)

LOG_FILE = os.path.join(LOG_DIR, "login_controller.log")

logger = logging.getLogger("login_controller")
logger.setLevel(logging.INFO)

file_handler = logging.FileHandler(LOG_FILE)
formatter = logging.Formatter(
    "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
file_handler.setFormatter(formatter)

if not logger.handlers:
    logger.addHandler(file_handler)

login_bp = Blueprint("login_bp", __name__)

@login_bp.route("/login/test", methods=["GET"])
def login_test():
    logger.info("TEST API HIT")
    return jsonify({
        "status": "success",
        "message": "Login API is working"
    }), 200

@login_bp.route("/login/send-otp", methods=["POST"])
@limiter.limit(
    "3 per 15 minutes",
    key_func=lambda: (request.get_json(silent=True) or {}).get("pan_number", "")
)
def send_otp():
    logger.info("========== /login/send-otp API HIT ==========")

    try:
        data = request.get_json(force=True)
        logger.info(f"Request JSON: {data}")

        pan = (data.get("pan_number") or "").strip().upper()

        if not pan:
            logger.warning("PAN missing in request")
            return jsonify({
                "message": "pan_number is required"
            }), 400
        
        validation_error = validate_registration({
            "pan": pan
        })
        
        if validation_error:
            return validation_error
        emails = get_emails_by_pan(pan)
        logger.info(f"Emails fetched for PAN {pan}: {emails}")

        if not emails:
            logger.warning(f"PAN NOT FOUND: {pan}")
            return jsonify({
                "message": "PAN is not existing"
            }), 404

        otp = generate_otp(pan)
        otp_hash = hash_otp(otp)
        expiry = datetime.utcnow() + timedelta(minutes=5)

        result = db.session.execute(
            text("""
                UPDATE project_registrations
                SET
                    otp_hash = :otp_hash,
                    otp_expires_at = :expiry,
                    otp_attempts = 0,
                    lock_until = NULL,
                    otp_verified = false
                WHERE UPPER(TRIM(pan_number)) = :pan
            """),
            {
                "otp_hash": otp_hash,
                "expiry": expiry,
                "pan": pan
            }
        )

        if result.rowcount == 0:
            db.session.rollback()
            logger.warning(f"No project_registrations row updated for PAN {pan}")
            return jsonify({
                "message": "PAN is not existing"
            }), 404

        db.session.commit()
        logger.info(f"OTP generated and stored for PAN {pan}")

        for email in emails:
            logger.info(f"Sending OTP to {email}")
            send_otp_email(email, otp)

        logger.info(f"OTP sent successfully for PAN {pan}")

        return jsonify({
            "message": "OTP sent successfully to registered email"
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.exception("🔥 ERROR in send-otp")
        return jsonify({
            "message": "Internal Server Error",
            "error": str(e)
        }), 500

@login_bp.route("/login/verify-otp", methods=["POST"])
@limiter.limit(
    "5 per 15 minutes",
    key_func=lambda: request.get_json(silent=True).get("pan_number", "")
)
def verify_login_otp():
    logger.info("========== /login/verify-otp API HIT ==========")

    try:
        data = request.get_json(force=True)
        logger.info(f"Verify OTP Request: {data}")

        pan = (data.get("pan_number") or "").strip().upper()
        otp = (data.get("otp") or "").strip()

        if not pan or not otp:
            return jsonify({
                "message": "pan_number and otp are required"
            }), 400
        validation_error = validate_registration({
            "pan": pan
        })
        
        if validation_error:
            return validation_error
        
        # is_valid = verify_otp(pan, otp)
        row = db.session.execute(
            text("""
                SELECT
                    otp_hash,
                    otp_expires_at,
                    otp_attempts,
                    lock_until
                FROM project_registrations
                WHERE UPPER(TRIM(pan_number)) = :pan
                LIMIT 1
            """),
            {"pan": pan}
        ).mappings().fetchone()

        if not row or not row["otp_hash"]:
            return jsonify({
                "message": "OTP not found"
            }), 404

        if row["lock_until"] and row["lock_until"] > datetime.utcnow():
            return jsonify({
                "message": "Account locked for 15 minutes"
            }), 403

        if row["otp_expires_at"] and row["otp_expires_at"] < datetime.utcnow():
            db.session.execute(
                text("""
                    UPDATE project_registrations
                    SET otp_hash = NULL
                    WHERE UPPER(TRIM(pan_number)) = :pan
                """),
                {"pan": pan}
            )
            db.session.commit()
            return jsonify({
                "message": "OTP expired"
            }), 400

        if not hmac.compare_digest(hash_otp(otp), row["otp_hash"]):
            attempts = (row["otp_attempts"] or 0) + 1
            lock_until = (
                datetime.utcnow() + timedelta(hours=9)
                if attempts >= 5
                else None
            )

            db.session.execute(
                text("""
                    UPDATE project_registrations
                    SET
                        otp_attempts = :attempts,
                        lock_until = :lock_until
                    WHERE UPPER(TRIM(pan_number)) = :pan
                """),
                {
                    "attempts": attempts,
                    "lock_until": lock_until,
                    "pan": pan
                }
            )
            db.session.commit()

            if attempts >= 5:
                return jsonify({
                    "message": "Account locked for 15 minutes due to 5 invalid OTP attempts"
                }), 403
            return jsonify({
                "message": f"Invalid OTP. Attempt {attempts} of 5"
            }), 401

        logger.info(f"OTP VERIFIED SUCCESSFULLY for PAN {pan}")

        # Optional: Fetch projects after login
        db.session.execute(
            text("""
                UPDATE project_registrations
                SET
                    otp_verified = true,
                    otp_attempts = 0,
                    lock_until = NULL
                WHERE UPPER(TRIM(pan_number)) = :pan
            """),
            {"pan": pan}
        )
        db.session.commit()
        projects = get_projects_by_pan(pan)

        # Create JWT access token
        access_token = create_access_token(identity=pan)

        return jsonify({
            "message": "OTP verified successfully",
            "pan_number": pan,
            "projects": projects
        }),200
        response.set_cookie(
            "access_token",
    access_token,
    httponly=True,
    secure=True,
    samesite="None",
    max_age=3600
        )
        return response, 200

    except Exception as e:
        db.session.rollback()
        logger.exception("🔥 ERROR in verify-otp")
        return jsonify({
            "message": "Internal Server Error",
            "error": str(e)
        }), 500