from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
import random
import smtplib
import hmac
import hashlib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy import text
from app.utils.mail_service import send_email_otp as send_email_otp_message

from app.models.database import db
from app.models.agent_model import Agent
from app.models.agent_registration_model import AgentModel
from app.models.otp_model import AgentOTP
from app import limiter

otp_bp = Blueprint("otp_bp", __name__)
SECRET_KEY = "AP_RERA_SECRET_KEY"

def hash_otp(otp):
    return hmac.new(
        SECRET_KEY.encode(),
        otp.encode(),
        hashlib.sha256
    ).hexdigest()

# =================================================
# SEND EMAIL OTP (FINAL — NO app.utils)
# =================================================
@otp_bp.route("/send-email", methods=["POST"])
@limiter.limit(
    "3 per 15 minutes",
    key_func=lambda: request.get_json().get("panNumber")
)
def send_email_otp():
    try:
        data = request.json
        pan = data.get("panNumber")

        if not pan:
            return jsonify({"error": "PAN number required"}), 400

        # ✅ STEP 1: Check PAN + email
        query = text("""
            SELECT id, email
            FROM agentregistration_details_t
            WHERE UPPER(pan) = :pan
            LIMIT 1
        """)

        row = db.session.execute(
            query, {"pan": pan.upper()}
        ).fetchone()

        if not row:
            return jsonify({"error": "PAN not registered"}), 404

        agent_id = row.id
        email = row.email

        if not email:
            return jsonify({"error": "Email not available"}), 400

        # ✅ STEP 2: Generate OTP
        otp = str(random.randint(100000, 999999))
        otp_hash = hash_otp(otp)
        expiry = datetime.utcnow() + timedelta(minutes=5)

        # delete old otp
        db.session.execute(
            text("DELETE FROM agent_otp_t WHERE agent_id = :id"),
            {"id": agent_id}
        )

        # insert new otp
        db.session.execute(
            text("""
                INSERT INTO agent_otp_t
                    (agent_id, otp_hash, created_at, otp_attempts)
                    VALUES
                    (:agent_id, :otp_hash, NOW(), 0)
                """),
                {"agent_id": agent_id,
                "otp_hash": otp_hash
            }
        )

        db.session.commit()

        send_email_otp_message(email, otp)
        
        # =================================================
        # ✅ STEP 3: SEND EMAIL (INLINE)
        # =================================================
        config = current_app.config

        msg = MIMEMultipart()
        msg["From"] = config["FROM_EMAIL"]
        msg["To"] = email
        msg["Subject"] = "AP RERA OTP Verification"

        msg.attach(MIMEText(f"""
Dear Applicant,

Your OTP for Agent Registration verification is:

{otp}

This OTP is valid for 5 minutes.

Regards,
AP RERA
""", "plain"))

        server = smtplib.SMTP(
            config["SMTP_HOST"],
            config["SMTP_PORT"]
        )

        if config["SMTP_USE_TLS"]:
            server.starttls()

        server.login(
            config["SMTP_USER"],
            config["SMTP_PASSWORD"]
        )

        server.sendmail(
            config["FROM_EMAIL"],
            email,
            msg.as_string()
        )

        server.quit()
        
        return jsonify({
            "message": "OTP sent to registered email"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": str(e)
        }), 500
@otp_bp.route("/verify", methods=["POST"])
def verify_otp():
    try:
        data = request.json
        pan = data.get("panNumber")
        otp = data.get("otp")
        
        otp_hash = hash_otp(otp)
        if not pan or not otp:
            return jsonify({"error": "PAN and OTP are required"}), 400

        # 🔍 Get agent id
        query = text("""
            SELECT id
            FROM agentregistration_details_t
            WHERE UPPER(pan) = :pan
            LIMIT 1
        """)

        row = db.session.execute(
            query, {"pan": pan.upper()}
        ).fetchone()

        if not row:
            return jsonify({"error": "PAN not registered"}), 404

        agent_id = row.id
        
        # Get latest OTP record
        latest_otp = db.session.execute(
            text("""
                SELECT id, otp_attempts, otp_locked_until
                FROM agent_otp_t
                WHERE agent_id = :agent_id
                ORDER BY id DESC
                LIMIT 1
            """),
            {"agent_id": agent_id}
        ).mappings().fetchone()

        # Check lock status
        if (
            latest_otp
            and latest_otp["otp_locked_until"]
            and latest_otp["otp_locked_until"] > datetime.utcnow()
        ):
            return jsonify({
                "error": "Account locked for 15 minutes due to 5 invalid OTP attempts"
            }), 403

        # 🔐 Validate OTP
        otp_row = db.session.execute(
            text("""
                SELECT id
                FROM agent_otp_t
                WHERE agent_id = :agent_id
                  AND otp_hash = :otp_hash
                  AND created_at >= NOW() - INTERVAL '5 minutes'
                ORDER BY created_at DESC
                LIMIT 1
            """),
            {
                "agent_id": agent_id,
                "otp_hash": otp_hash
            }
        ).fetchone()

        if not otp_row:
            attempts = (latest_otp["otp_attempts"] or 0) + 1

            # Lock account after 5 attempts
            if attempts >= 5:

                lock_time = datetime.utcnow() + timedelta(hours=9)

                db.session.execute(
                    text("""
                        UPDATE agent_otp_t
                        SET otp_attempts = :attempts,
                            otp_locked_until = :lock_time
                        WHERE id = :id
                    """),
                    {
                        "attempts": attempts,
                        "lock_time": lock_time,
                        "id": latest_otp["id"]
                    }
                )

                db.session.commit()

                return jsonify({
                    "error": "Account locked for 15 minutes due to 5 invalid OTP attempts."
                }), 403

            # Increase attempt count
            db.session.execute(
                text("""
                    UPDATE agent_otp_t
                    SET otp_attempts = :attempts
                    WHERE id = :id
                """),
                {
                    "attempts": attempts,
                    "id": latest_otp["id"]
                }
            )

            db.session.commit()
            
        return jsonify({
                "error": f"Invalid OTP. Attempt {attempts} of 5."
            }), 401

        # ✅ Mark OTP verified
        db.session.execute(
            text("""
                UPDATE agent_otp_t
                SET is_verified = true,
                 otp_attempts = 0,
                    otp_locked_until = NULL
                WHERE id = :id
            """),
            {"id": otp_row.id}
        )

        db.session.commit()

        return jsonify({
            "message": "OTP verified successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": str(e)
        }), 500


@otp_bp.route("/project/send-email", methods=["POST"])
@limiter.limit(
    "3 per 15 minutes",
    key_func=lambda: request.get_json().get("panNumber")
)
def send_project_otp():
    print("AAAAAAAAAAAA PROJECT API ENTER AYYINDI")

    try:
        data = request.json

        pan_number = data.get("panNumber")

        if not pan_number:
            return jsonify({
                "error": "PAN Number required"
            }), 400

        row = db.session.execute(
            text("""
                SELECT pan_number
FROM project_registrations
WHERE UPPER(TRIM(pan_number)) = UPPER(TRIM(:pan_number))
LIMIT 1
            """),
            {
                "pan_number": pan_number
            }
        ).fetchone()

        if not row:
            return jsonify({
                "error": "Project not found"
            }), 404

        otp = str(random.randint(100000, 999999))
        print("GENERATED OTP =", otp)
        

        otp_hash = hash_otp(otp)

        expiry = datetime.utcnow() + timedelta(minutes=5)

        result = db.session.execute(
            text("""
                UPDATE project_registrations
                SET
                    otp_hash = :otp_hash,
                    otp_expires_at = :expiry,
                    otp_attempts = 0,
                    otp_verified = false,
                    lock_until = null
                WHERE UPPER(TRIM(pan_number)) = UPPER(TRIM(:pan_number))
            """),
            {
                "otp_hash": otp_hash,
                "expiry": expiry,
                "pan_number": pan_number
            }
        )

        print("================================")
        print("PAN =", pan_number)
        print("OTP =", otp)
        print("HASH =", otp_hash)
        print("Rows Updated =", result.rowcount)
        print("***** PROJECT OTP API HIT *****")
        print("================================")

        db.session.commit()

        print("OTP Updated Successfully")

        return jsonify({
            "message": "OTP generated successfully",
            
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": str(e)
        }), 500
    
@otp_bp.route("/project/verify", methods=["POST"])
def verify_project_otp():

    try:
        data = request.json

        pan_number = data.get("panNumber")
        otp = data.get("otp")

        if not pan_number or not otp:
            return jsonify({
                "error": "PAN Number and OTP required"
            }), 400

        row = db.session.execute(
            text("""
                SELECT
                    otp_hash,
                    otp_expires_at,
                    otp_attempts,
                    lock_until
                FROM project_registrations
                WHERE UPPER(TRIM(pan_number)) = UPPER(TRIM(:pan_number))
                LIMIT 1
            """),
            {
                "pan_number": pan_number
            }
        ).mappings().fetchone()

        if not row:
            return jsonify({
                "error": "Project not found"
            }), 404

        if (
            row["lock_until"]
            and row["lock_until"] > datetime.utcnow()
        ):
            return jsonify({
                "error": "Account locked for 15 minutes due to 5 invalid OTP attempts"
            }), 403

        if (
            row["otp_expires_at"]
            and row["otp_expires_at"] < datetime.utcnow()
        ):
            return jsonify({
                "error": "OTP expired"
            }), 400

        entered_hash = hash_otp(otp)

        if entered_hash != row["otp_hash"]:

            attempts = (row["otp_attempts"] or 0) + 1

            if attempts >= 5:

                db.session.execute(
                    text("""
                        UPDATE project_registrations
                        SET
                            otp_attempts = :attempts,
                            lock_until = :lock_until
                        WHERE UPPER(TRIM(pan_number)) = UPPER(TRIM(:pan_number))
                    """),
                    {
                        "attempts": attempts,
                        "lock_until": datetime.utcnow() + timedelta(hours=9),
                        "pan_number": pan_number
                    }
                )

                db.session.commit()

                return jsonify({
                    "error": "Account locked for 15 minutes due to 5 invalid OTP attempts"
                }), 403

            db.session.execute(
                text("""
                    UPDATE project_registrations
                    SET otp_attempts = :attempts
                    WHERE UPPER(TRIM(pan_number)) = UPPER(TRIM(:pan_number))
                """),
                {
                    "attempts": attempts,
                    "pan_number": pan_number
                }
            )

            db.session.commit()

            return jsonify({
                "error": f"Invalid OTP. Attempt {attempts} of 5"
            }), 401

        db.session.execute(
            text("""
                UPDATE project_registrations
                SET
                    otp_verified = true,
                    otp_attempts = 0,
                    otp_hash = null,
                    lock_until = null
                WHERE UPPER(TRIM(pan_number)) = UPPER(TRIM(:pan_number))
            """),
            {
                "pan_number": pan_number
            }
        )

        db.session.commit()

        return jsonify({
            "message": "OTP verified successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": str(e)
        }), 500