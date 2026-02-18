from app.models.database import db
from datetime import datetime

class AgentOtherThanIndividualLitigation(db.Model):
    __tablename__ = "agent_litigations_details_t"

    id = db.Column(db.Integer, primary_key=True)
    case_no = db.Column(db.String(100))
    tribunal_name_place = db.Column(db.String(200))
    petitioner_name = db.Column(db.String(150))
    respondent_name = db.Column(db.String(150))
    case_facts = db.Column(db.Text)
    present_status = db.Column(db.String(100))
    interim_order = db.Column(db.Text)
    final_order_details = db.Column(db.Text)
    self_declared_affidavit = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    def to_dict(self):
         return {
            "id": self.id,
            "case_no": self.case_no,
            "tribunal_name_place": self.tribunal_name_place,
            "petitioner_name": self.petitioner_name,
            "respondent_name": self.respondent_name,
            "case_facts": self.case_facts,
            "present_status": self.present_status,
            "interim_order": self.interim_order,
            "final_order_details": self.final_order_details,
            "self_declared_affidavit": self.self_declared_affidavit,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }