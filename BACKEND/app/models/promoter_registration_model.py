from app.models.database import db
from datetime import datetime

class PromoterRegistration(db.Model):
    __tablename__ = "promoter_registration"

    promoter_id = db.Column(db.Integer, primary_key=True)

    pan_number = db.Column(db.String(10), unique=True, nullable=False)
    user_type = db.Column(db.String(50), nullable=False)
    select_category = db.Column(db.String(50), nullable=False)

    name_applicant = db.Column(db.String(150), nullable=False)
    father_name = db.Column(db.String(150))

    mobile_number = db.Column(db.String(15), nullable=False)
    email_id = db.Column(db.String(150), nullable=False)

    state = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=False)

    upload_document = db.Column(db.String(255), nullable=False)

    name_organisation = db.Column(db.String(200))
    type_of_promoter = db.Column(db.String(100))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
