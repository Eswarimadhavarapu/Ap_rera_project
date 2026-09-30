# app/models/rti_application.py

from app.models.database import db
from sqlalchemy.sql import func


class RTIApplication(db.Model):

    __tablename__ = "rti_applications_t"

    id = db.Column(db.BigInteger, primary_key=True)

    rti_number = db.Column(db.String(50), unique=True)

    application_type = db.Column(db.String(100))

    applicant_name = db.Column(db.String(200))

    gender = db.Column(db.String(20))

    address_line1 = db.Column(db.String(300))

    address_line2 = db.Column(db.String(300))

    pincode = db.Column(db.String(20))

    locality_type = db.Column(db.String(20))

    education_status = db.Column(db.String(50))

    phone_number = db.Column(db.String(20))

    alter_mobile_number = db.Column(db.String(20))

    email_id = db.Column(db.String(150))

    citizenship = db.Column(db.String(50))

    mode_of_information = db.Column(db.String(50))

    below_poverty_line = db.Column(db.String(10))

    subject = db.Column(db.String(500))

    rti_request_text = db.Column(db.Text)

    supporting_document_name = db.Column(db.JSON)

    status = db.Column(db.String(50))

    application_comment = db.Column(db.Text)

    reply_comment = db.Column(db.Text)

    reply_text = db.Column(db.Text)

    reply_document = db.Column(db.JSON)

    assigned_department_name = db.Column(db.String(200))

    assigned_to_authority_id = db.Column(db.BigInteger)

    assigned_by_id = db.Column(db.BigInteger)

    replied_from_authority_id = db.Column(db.BigInteger)

    application_coming_from_rti = db.Column(db.String(200))

    application_received_date = db.Column(db.DateTime)

    application_submitted_date = db.Column(db.DateTime)

    assigned_date = db.Column(db.DateTime)

    authority_replied_date = db.Column(db.DateTime)

    replied_rti_date = db.Column(db.DateTime)

    current_handler_role = db.Column(db.String(100))

    priority_level = db.Column(db.String(20))

    is_active = db.Column(db.String(5), default="Y")

    is_deleted = db.Column(db.String(5), default="N")

    created_by = db.Column(db.BigInteger)

    created_on = db.Column(db.DateTime, server_default=func.now())

    updated_by = db.Column(db.BigInteger)

    updated_on = db.Column(db.DateTime)

    apio_id = db.Column(db.BigInteger)

    apio_comments = db.Column(db.Text)

    application_coming_to_apio_date = db.Column(db.DateTime)

    apio_replied_date = db.Column(db.DateTime)

    pio_id = db.Column(db.BigInteger)

    pio_comments = db.Column(db.Text)

    application_coming_to_pio_date = db.Column(db.DateTime)

    pio_replied_date = db.Column(db.DateTime)

    dd_id = db.Column(db.BigInteger)

    dd_comments = db.Column(db.Text)

    dd_replied_date = db.Column(db.DateTime)

    rti_replaid_person_id = db.Column(db.Integer)


    payment_transaction_id = db.Column(db.String(200))

    payment_order_id = db.Column(db.String(200))

    payment_amount = db.Column(db.Numeric(10, 2))

    payment_status = db.Column(db.String(50))

    payment_mode = db.Column(db.String(100))

    bank_name = db.Column(db.String(200))

    payment_date = db.Column(db.DateTime)

    payment_response = db.Column(db.JSON)

    receipt_number = db.Column(db.String(100))

    receipt_document = db.Column(db.JSON)