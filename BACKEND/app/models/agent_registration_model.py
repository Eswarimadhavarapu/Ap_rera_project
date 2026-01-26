from app.models.database import db
from sqlalchemy import text
from datetime import datetime, timedelta
import json
import random


class AgentModel:

    # ================= STEP 1 : CREATE REGISTRATION =================
    @staticmethod
    def create_agent_registration_step1(data):
        try:
            application_no = datetime.now().strftime("%Y%m%d") + str(random.randint(10000, 99999))

            query = text("""
                INSERT INTO agentregistration_details_t (
                    application_no,
                    agent_name,
                    father_name,
                    occupation_id,
                    email,
                    aadhaar,
                    pan,
                    mobile,
                    landline,
                    license_number,
                    license_date,
                    address1,
                    address2,
                    state_id,
                    district,
                    mandal,
                    village,
                    pincode,
                    photograph,
                    pan_proof,
                    address_proof,
                    declaration
                )
                VALUES (
                    :application_no,
                    :agent_name,
                    :father_name,
                    :occupation_id,
                    :email,
                    :aadhaar,
                    :pan,
                    :mobile,
                    :landline,
                    :license_number,
                    :license_date,
                    :address1,
                    :address2,
                    :state_id,
                    :district,
                    :mandal,
                    :village,
                    :pincode,
                    CAST(:photograph AS jsonb),
                    CAST(:pan_proof AS jsonb),
                    CAST(:address_proof AS jsonb),
                    TRUE
                )
                RETURNING id, application_no
            """)

            params = {
                **data,
                "application_no": application_no,
                "photograph": json.dumps(data["photograph"]),
                "pan_proof": json.dumps(data["pan_proof"]),
                "address_proof": json.dumps(data["address_proof"]),
            }

            row = db.session.execute(query, params).fetchone()
            db.session.commit()

            return {
                "success": True,
                "agent_id": row.id,
                "application_no": row.application_no
            }

        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": str(e)}

    # ================= STEP 2 : UPDATE ITR =================
    @staticmethod
    def update_itr_documents(agent_id, itr_year1, itr_year2, itr_year3):
        try:
            query = text("""
                UPDATE agentregistration_details_t
                SET
                    itr_year1 = CAST(:itr_year1 AS jsonb),
                    itr_year2 = CAST(:itr_year2 AS jsonb),
                    itr_year3 = CAST(:itr_year3 AS jsonb)
                WHERE id = :agent_id
            """)

            db.session.execute(query, {
                "agent_id": agent_id,
                "itr_year1": json.dumps(itr_year1),
                "itr_year2": json.dumps(itr_year2),
                "itr_year3": json.dumps(itr_year3),
            })

            db.session.commit()
            return {"success": True}

        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": str(e)}

    # ================= PREVIEW (USE agent_id ONLY) =================
    @staticmethod
    def get_agent_preview(agent_id):
        try:
            query = text("""
                SELECT
                    a.id AS agent_id,
                    a.application_no,
                    a.agent_name,
                    a.father_name,
                    a.occupation_id,
                    o.occupation_name,
                    a.email,
                    a.aadhaar,
                    a.pan,
                    a.mobile,
                    a.address1,
                    a.address2,
                    a.pincode,
                    a.photograph,
                    a.pan_proof,
                    a.address_proof,
                    a.itr_year1,
                    a.itr_year2,
                    a.itr_year3
                FROM agentregistration_details_t a
                LEFT JOIN occupation_master_t o
                    ON a.occupation_id = o.occupation_id
                WHERE a.id = :agent_id
            """)

            row = db.session.execute(
                query, {"agent_id": agent_id}
            ).mappings().first()

            if not row:
                return {"success": False, "message": "Agent not found"}

            return {"success": True, "data": dict(row)}

        except Exception as e:
            return {"success": False, "message": str(e)}

    # ================= PAN CHECK =================
    @staticmethod
    def get_agent_by_pan(pan):
        try:
            query = text("""
                SELECT id
                FROM agentregistration_details_t
                WHERE UPPER(pan) = :pan
                LIMIT 1
            """)

            row = db.session.execute(
                query, {"pan": pan.upper()}
            ).fetchone()

            return {
                "success": True,
                "exists": bool(row)
            }

        except Exception as e:
            return {"success": False, "message": str(e)}

    # ================= SEND OTP (MOBILE) =================
    @staticmethod
    def send_otp(agent_id):
        try:
            row = db.session.execute(
                text("SELECT mobile FROM agentregistration_details_t WHERE id = :id"),
                {"id": agent_id}
            ).fetchone()

            if not row:
                return {"success": False, "message": "Agent not found"}

            otp = str(random.randint(100000, 999999))

            db.session.execute(
                text("DELETE FROM agent_otp_t WHERE agent_id = :id"),
                {"id": agent_id}
            )

            db.session.execute(
                text("""
                    INSERT INTO agent_otp_t (agent_id, mobile, otp, created_at)
                    VALUES (:agent_id, :mobile, :otp, NOW())
                """),
                {"agent_id": agent_id, "mobile": row.mobile, "otp": otp}
            )

            db.session.commit()

            print("OTP:", otp)  # remove in production

            return {"success": True, "message": "OTP sent"}

        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": str(e)}

    # ================= VERIFY OTP =================
    @staticmethod
    def verify_otp(agent_id, otp):
        try:
            query = text("""
                SELECT a.application_no, a.agent_name
                FROM agent_otp_t o
                JOIN agentregistration_details_t a
                    ON a.id = o.agent_id
                WHERE o.agent_id = :agent_id
                AND o.otp = :otp
                AND o.created_at >= NOW() - INTERVAL '5 minutes'
                LIMIT 1
            """)

            row = db.session.execute(query, {
                "agent_id": agent_id,
                "otp": otp
            }).fetchone()

            if not row:
                return {"success": False, "message": "Invalid or expired OTP"}

            return {
                "success": True,
                "application_no": row.application_no,
                "agent_name": row.agent_name
            }

        except Exception as e:
            return {"success": False, "message": str(e)}

    # ================= CREATE PAYMENT =================
    @staticmethod
    def create_payment(agent_id):
        try:
            transaction_id = "TXN" + str(random.randint(100000000, 999999999))

            query = text("""
                INSERT INTO agent_payment_t (
                    agent_id,
                    application_no,
                    transaction_id,
                    amount,
                    payment_for,
                    mobile,
                    status,
                    created_at
                )
                SELECT
                    id,
                    application_no,
                    :transaction_id,
                    10000,
                    'Agent Registration Fee',
                    mobile,
                    'PENDING',
                    NOW()
                FROM agentregistration_details_t
                WHERE id = :agent_id
                RETURNING id, application_no
            """)

            row = db.session.execute(query, {
                "agent_id": agent_id,
                "transaction_id": transaction_id
            }).fetchone()

            db.session.commit()

            return {
                "success": True,
                "payment_id": row.id,
                "application_no": row.application_no,
                "transaction_id": transaction_id
            }

        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": str(e)}

    # ================= PARTIAL APPLICATIONS =================
    @staticmethod
    def get_partial_applications(pan):
        query = text("""
            SELECT
                application_no,
                agent_name,
                'Individual' AS name_type,
                'Yet To Pay Reg Fee' AS status
            FROM agentregistration_details_t
            WHERE UPPER(pan) = :pan
        """)

        rows = db.session.execute(query, {"pan": pan.upper()}).fetchall()
        return [dict(r._mapping) for r in rows]

    # ================= GET BY APPLICATION NO =================
    @staticmethod
    def agent_details_application_no(application_no):
        try:
            query = text("""
                SELECT *
                FROM agentregistration_details_t
                WHERE application_no = :application_no
            """)

            row = db.session.execute(
                query, {"application_no": str(application_no)}
            ).mappings().first()

            if not row:
                return {"success": False, "message": "Application not found"}

            return {"success": True, "data": dict(row)}

        except Exception as e:
            return {"success": False, "message": str(e)}
