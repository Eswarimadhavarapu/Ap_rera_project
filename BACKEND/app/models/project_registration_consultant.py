from app.models.database import db
from datetime import datetime

class ProjectRegistrationConsultant(db.Model):
    __tablename__ = "project_registration_consultant_details"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)

    application_number = db.Column(db.String(50), nullable=False)
    pan_number = db.Column(db.String(20), nullable=False)

    consultancy_name = db.Column(db.String(200))
    consultant_name = db.Column(db.String(150))
    mobile_number = db.Column(db.String(10))
    email_id = db.Column(db.String(100))
    address = db.Column(db.String(500))

    declaration_name = db.Column(db.String(200))
    declaration_accept = db.Column(db.String(1))
    note1_accept = db.Column(db.String(1))
    note2_accept = db.Column(db.String(1))

    created_on = db.Column(db.DateTime, default=datetime.utcnow)