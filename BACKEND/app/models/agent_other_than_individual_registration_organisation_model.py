from app.models.database import db
from datetime import datetime

class AgentOtherThanIndividualOrganisation(db.Model):
    __tablename__ = "agent_organisation_details_t"  
    organisation_id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.String(50), unique=True, nullable=False)   
    organisation_type = db.Column(db.String(50))        
    organisation_name = db.Column(db.String(200))
    registration_identifier = db.Column(db.String(100))
    registration_date = db.Column(db.Date)
    registration_cert_doc = db.Column(db.String(255))  
    pan_card_number = db.Column(db.String(10))
    pan_card_doc = db.Column(db.String(255))
    gst_number = db.Column(db.String(15))
    gst_doc = db.Column(db.String(255))
    legal_document = db.Column(db.String(255))   
    email_id = db.Column(db.String(150))
    mobile_number = db.Column(db.String(15))
    landline_number = db.Column(db.String(20))
    address_line1 = db.Column(db.String(200))
    address_line2 = db.Column(db.String(200))
    state = db.Column(db.String(100))
    district = db.Column(db.String(100))
    mandal = db.Column(db.String(100))
    village = db.Column(db.String(100))
    pincode = db.Column(db.String(10))
    address_proof_doc = db.Column(db.String(255))
    entity_details_id = db.Column(
        db.Integer,
        db.ForeignKey("agent_entity_details_t.id"),
        nullable=False
    )

    authorized_details_id = db.Column(
        db.Integer,
        db.ForeignKey("agent_authorized_details_t.id")
    )

    litigation_details_id = db.Column(
        db.Integer,
        db.ForeignKey("agent_litigations_details_t.id")
    )

    
    last_five_year_projects = db.Column(db.JSON)
    other_state_rera_details = db.Column(db.JSON)
    itr_year1_doc = db.Column(db.String(255))
    itr_year2_doc = db.Column(db.String(255))
    itr_year3_doc = db.Column(db.String(255))

   
    status = db.Column(db.String(30), default="DRAFT")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


       
    def to_dict(self):
        return {
            "organisation_id": self.organisation_id,
            "application_id": self.application_id,
            "organisation_type": self.organisation_type,
            "organisation_name": self.organisation_name,
            "registration_identifier": self.registration_identifier,
            "registration_date": self.registration_date.strftime("%Y-%m-%d") if self.registration_date else None,
            "registration_cert_doc": self.registration_cert_doc,
            "pan_card_number": self.pan_card_number,
            "pan_card_doc": self.pan_card_doc,
            "gst_number": self.gst_number,
            "gst_doc": self.gst_doc,
            "legal_document": self.legal_document,
            "email_id": self.email_id,
            "mobile_number": self.mobile_number,
            "landline_number": self.landline_number,
            "address_line1": self.address_line1,
            "address_line2": self.address_line2,
            "state": self.state,
            "district": self.district,
            "mandal": self.mandal,
            "village": self.village,
            "pincode": self.pincode,
            "address_proof_doc": self.address_proof_doc,
            "last_five_year_projects": self.last_five_year_projects,
            "other_state_rera_details": self.other_state_rera_details,
            "status": self.status,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            "itr_year1_doc": self.itr_year1_doc,
            "itr_year2_doc": self.itr_year2_doc,
            "itr_year3_doc": self.itr_year3_doc

        }