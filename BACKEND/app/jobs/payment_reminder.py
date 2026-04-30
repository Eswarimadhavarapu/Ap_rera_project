from sqlalchemy import text
from app.models.database import db
from app.utils.mail_service import send_email
from apscheduler.schedulers.background import BackgroundScheduler


def send_payment_reminders(app):
    with app.app_context():

        print("🔄 Running payment reminder job...")

        query = text(
            """
            SELECT 
                id,
                renewal_application_no,
                payment_status,
                email
            FROM agent_renewal_t
            WHERE payment_status = 'PENDING'
        """
        )

        results = db.session.execute(query).fetchall()

        print(f"Found {len(results)} pending payments")

        for row in results:
            print("📧 Sending email to:", row.email)

            subject = "Payment Reminder - AP RERA Renewal"

            message = f"""
Dear Applicant,

Your renewal application {row.renewal_application_no} is still pending payment.

Please complete your payment as soon as possible.

Regards,
AP RERA
"""

            send_email(row.email, subject, message)

            print("✅ Email sent")


def check_rera_status(app):

    with app.app_context():

        try:
            print("⏳ Running RERA auto-update job...")

            query = text(
                """
    UPDATE project_unregistered_details_t u
    SET 
        rera_registered = TRUE,
        rera_registration_no = sub.application_number,
        pan_number = sub.pan_number   -- 🔥 ADD THIS
    FROM (
        SELECT building_plan_no, application_number, pan_number
        FROM othertheninduvidual_project_registration

        UNION

        SELECT building_plan_no, application_number, pan_number
        FROM project_registration
    ) sub
    WHERE 
        (u.ba_no = sub.building_plan_no OR u.lp_no = sub.building_plan_no)
        AND u.rera_registered = FALSE
"""
            )
            db.session.execute(query)
            db.session.commit()

            print("✅ RERA update done")

        except Exception as e:
            db.session.rollback()
            print("❌ Error:", e)


def check_exemption_status(app):

    with app.app_context():

        try:
            print("⏳ Running Exemption auto-update job...")

            query = text(
                """
                UPDATE project_unregistered_details_t u
                SET exemption_id = e.id
                FROM project_exemption e
                WHERE 
                    (u.ba_no = e.ba_number OR u.lp_no = e.ba_number)
                    AND u.exemption_id IS NULL
            """
            )

            db.session.execute(query)
            db.session.commit()

            print("✅ Exemption update done")

        except Exception as e:
            db.session.rollback()
            print("❌ Error:", e)


def start_scheduler(app):
    print("🚀 Scheduler started...")

    scheduler = BackgroundScheduler()

    # ✅ Existing Job
    scheduler.add_job(send_payment_reminders, trigger="interval", hours=124, args=[app])

    # ✅ ADD THIS NEW JOB (🔥 YOUR LOGIC)
    scheduler.add_job(check_rera_status, trigger="interval", hours=1, args=[app])
    scheduler.add_job(check_exemption_status, trigger="interval", hours=1, args=[app])

    scheduler.start()