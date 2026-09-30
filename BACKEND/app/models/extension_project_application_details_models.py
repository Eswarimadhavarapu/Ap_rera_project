# app/models/extension_project_application_details_models.py

from app.models.database import db
from sqlalchemy.sql import func


class ExtensionProjectApplicationDetails(db.Model):

    __tablename__ = "extension_project_application_details"

    id = db.Column(db.Integer, primary_key=True)

    application_number = db.Column(db.String(100))
    project_id = db.Column(db.String(100))
    project_name = db.Column(db.String(500))
    promoter_email = db.Column(db.String(30))
    promoter_pan_number = db.Column(db.String(10))
    validity_from = db.Column(db.Date)
    validity_to = db.Column(db.Date)

    new_validity_from = db.Column(db.Date)
    new_validity_to = db.Column(db.Date)

    # Documents
    representation_letter = db.Column(db.String(500))
    form_b = db.Column(db.String(500))
    consent_letter = db.Column(db.String(500))
    form_e = db.Column(db.String(500))
    form_p4 = db.Column(db.String(500))
    extension_proceeding = db.Column(db.String(500))

    form_1 = db.Column(db.String(500))
    form_2 = db.Column(db.String(500))
    form_3 = db.Column(db.String(500))

    # Payment Details
    payment_status = db.Column(db.String(100))
    payment_amount = db.Column(db.Numeric(10, 2))
    transaction_id = db.Column(db.String(200))
    payment_reference_no = db.Column(db.String(200))
    payment_mode = db.Column(db.String(100))

    bank_name = db.Column(db.String(200))
    payment_date = db.Column(db.DateTime)

    gateway_response = db.Column(db.Text)
    receipt_path = db.Column(db.String(500))
    project_district = db.Column(db.String(100))
    # Workflow
    current_stage = db.Column(db.String(100))
    application_status = db.Column(db.String(100))

    # Planning Team
    planning_team = db.Column(db.String(50))
    planning_team_remarks = db.Column(db.Text)
    planning_team_authority_id = db.Column(db.String(100))
    planning_team_replay_date = db.Column(db.Date)
    # AD
    ad_remarks = db.Column(db.Text)
    ad_id = db.Column(db.String(100))

    # DD
    dd_remarks = db.Column(db.Text)
    dd_id = db.Column(db.String(100))
    ad_or_dd_replay_date = db.Column(db.Date)
    # Director
    director_remarks = db.Column(db.Text)
    director_id = db.Column(db.String(100))
    director_replay_date = db.Column(db.Date)

    # Chairman
    chairman_remarks = db.Column(db.Text)
    chairman_id = db.Column(db.String(100))
    chairman_replay_date = db.Column(db.Date)
    # Shortfall
    shortfall_reason = db.Column(db.Text)

    # Final
    final_status = db.Column(db.String(100))
    certificate_path = db.Column(db.String(500))

    # Audit
    created_by = db.Column(db.String(100))
    created_on = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_on = db.Column(
        db.DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    def to_dict(self):

        return {
            "id": self.id,
            "application_number": self.application_number,
            "project_id": self.project_id,
            "project_name": self.project_name,
            "promoter_pan_number": self.promoter_pan_number,
            "promoter_email": self.promoter_email,
            "validity_from": str(self.validity_from) if self.validity_from else None,
            "validity_to": str(self.validity_to) if self.validity_to else None,

            "new_validity_from": str(self.new_validity_from) if self.new_validity_from else None,
            "new_validity_to": str(self.new_validity_to) if self.new_validity_to else None,

            "representation_letter": self.representation_letter,
            "form_b": self.form_b,
            "consent_letter": self.consent_letter,
            "form_e": self.form_e,
            "form_p4": self.form_p4,
            "extension_proceeding": self.extension_proceeding,
            "form_1": self.form_1,
            "form_2": self.form_2,
            "form_3": self.form_3,

            "payment_status": self.payment_status,
            "payment_amount": str(self.payment_amount) if self.payment_amount else None,
            "transaction_id": self.transaction_id,
            "payment_reference_no": self.payment_reference_no,
            "payment_mode": self.payment_mode,
            "bank_name": self.bank_name,
            "payment_date": str(self.payment_date) if self.payment_date else None,
            "gateway_response": self.gateway_response,
            "receipt_path": self.receipt_path,
            "project_district": self.project_district,
            "current_stage": self.current_stage,
            "application_status": self.application_status,

            "planning_team": self.planning_team,
            "planning_team_remarks": self.planning_team_remarks,
            "planning_team_authority_id": self.planning_team_authority_id,
            "planning_team_replay_date": str(self.planning_team_replay_date) if self.planning_team_replay_date else None,

            "ad_remarks": self.ad_remarks,
            "ad_id": self.ad_id,

            "dd_remarks": self.dd_remarks,
            "dd_id": self.dd_id,
            "ad_or_dd_replay_date": str(self.ad_or_dd_replay_date) if self.ad_or_dd_replay_date else None,
            "director_remarks": self.director_remarks,
            "director_id": self.director_id,
            "director_replay_date": str(self.director_replay_date) if self.director_replay_date else None,
            "chairman_remarks": self.chairman_remarks,
            "chairman_id": self.chairman_id,
            "chairman_replay_date": str(self.chairman_replay_date) if self.chairman_replay_date else None,
            "shortfall_reason": self.shortfall_reason,

            "final_status": self.final_status,
            "certificate_path": self.certificate_path,

            "created_by": self.created_by,
            "created_on": str(self.created_on) if self.created_on else None,
            "updated_on": str(self.updated_on) if self.updated_on else None
            
        }