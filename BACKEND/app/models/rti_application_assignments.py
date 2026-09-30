# app/models/rti_application_assignments.py

from app.models.database import db
from sqlalchemy.sql import func


class RTIAssignment(db.Model):

    __tablename__ = "rti_application_assignments_t"

    id = db.Column(db.BigInteger, primary_key=True)

    rti_application_id = db.Column(db.BigInteger, nullable=False)

    assigned_department = db.Column(db.String(200))

    assigned_to_id = db.Column(db.BigInteger)

    assigned_by_id = db.Column(db.BigInteger)

    assigned_date = db.Column(db.DateTime, server_default=func.now())

    assignment_status = db.Column(db.String(50), default="PENDING")

    reply_comments = db.Column(db.Text)

    reply_document = db.Column(db.JSON)

    replied_by_id = db.Column(db.BigInteger)
    rti_document=db.Column(db.Text)
    rti_comments=db.Column(db.Text)

    replied_date = db.Column(db.DateTime)

    is_active = db.Column(db.String(5), default="Y")

    created_on = db.Column(db.DateTime, server_default=func.now())