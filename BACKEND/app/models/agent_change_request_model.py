from sqlalchemy import text
from sqlalchemy.dialects.postgresql import JSONB

from app.models.database import db


class AgentRegistrationDetails(db.Model):

    __tablename__ = "agentregistration_details_t"

    __table_args__ = {"extend_existing": True}

    id = db.Column(db.Integer, primary_key=True)

    pan = db.Column(db.String(20), nullable=False)

    application_no = db.Column(db.String(50), nullable=False)

    def to_dict(self):

        return {
            "application_no": self.application_no
        }

    @staticmethod
    def get_applications_by_pan(pan):
        try:
            query = text("""
                SELECT application_no
                FROM agentregistration_details_t
                WHERE UPPER(pan) = :pan
                ORDER BY id DESC
            """)

            rows = db.session.execute(
                query, {"pan": pan.strip().upper()}
            ).mappings().all()

            return {
                "success": True,
                "applications": [dict(row) for row in rows]
            }

        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    @staticmethod
    def get_application_details_by_application_no(application_no):
        try:
            query = text("""
                SELECT
                    a.agent_type,
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
                    a.landline,
                    a.license_number,
                    a.license_date,
                    a.address1,
                    a.address2,
                    a.pincode,
                    a.state_id,
                    sm.state_name AS state_name,
                    a.district,
                    dm.district_name AS district_name,
                    a.mandal,
                    mm.mandal_name AS mandal_name,
                    a.village,
                    vm.village_name AS village_name,
                    a.photograph,
                    a.pan_proof,
                    a.address_proof,
                    a.self_declared_affidavit,
                    a.itr_year1,
                    a.itr_year2,
                    a.itr_year3,
                    a.last_five_years_project_details,
                    a.any_civil_criminal_cases,
                    a.registration_other_states
                FROM agentregistration_details_t a
                LEFT JOIN occupation_master_t o
                    ON CAST(a.occupation_id AS text) = CAST(o.occupation_id AS text)
                LEFT JOIN state_master_t sm
                    ON CAST(a.state_id AS text) = CAST(sm.id AS text)
                LEFT JOIN districts_t dm
                    ON CAST(a.district AS text) = CAST(dm.id AS text)
                LEFT JOIN mandals_t mm
                    ON CAST(a.mandal AS text) = CAST(mm.id AS text)
                LEFT JOIN villages_t vm
                    ON CAST(a.village AS text) = CAST(vm.id AS text)
                WHERE a.application_no = :application_no
                LIMIT 1
            """)

            agent_row = db.session.execute(
                query, {"application_no": application_no}
            ).mappings().first()

            if not agent_row:
                return {
                    "success": False,
                    "message": "Application not found"
                }

            agent_id = agent_row["agent_id"]

            project_query = text("""
                SELECT id, project_name
                FROM agent_projects_t
                WHERE agent_id = :agent_id
                ORDER BY id
            """)

            litigation_query = text("""
                SELECT
                    id,
                    case_no,
                    tribunal_place,
                    petitioner_name,
                    respondent_name,
                    case_facts,
                    present_status,
                    interim_order,
                    final_order,
                    interim_order_certificate,
                    disposed_certificate
                FROM agent_litigations_t
                WHERE agent_id = :agent_id
                ORDER BY id
            """)

            other_state_query = text("""
                SELECT
                    id,
                    registration_number,
                    state_id,
                    state_name,
                    district
                FROM agent_other_state_rera_t
                WHERE agent_id = :agent_id
                ORDER BY id
            """)

            projects = db.session.execute(
                project_query, {"agent_id": agent_id}
            ).mappings().all()
            litigations = db.session.execute(
                litigation_query, {"agent_id": agent_id}
            ).mappings().all()
            other_states = db.session.execute(
                other_state_query, {"agent_id": agent_id}
            ).mappings().all()

            return {
                "success": True,
                "data": {
                    "agent_details": dict(agent_row),
                    "projects": [dict(project) for project in projects],
                    "litigations": [dict(litigation) for litigation in litigations],
                    "other_state_rera": [dict(state) for state in other_states]
                }
            }

        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }
       
       
        

class AgentChangeRequest(db.Model):

    __tablename__ = "agent_change_requests_t"

    id = db.Column(db.Integer, primary_key=True)

    pan_number = db.Column(db.String(20))
    application_no = db.Column(db.String(50))

    applicant_type = db.Column(db.String(50))

    individual_issue_type = db.Column(db.String(100))
    individual_issue = db.Column(db.String(200))
    individual_description = db.Column(db.Text)
    individual_document = db.Column(db.String(255))
    individual_change_document = db.Column(db.String(200))
    individual_replace_reason = db.Column(db.Text)
    individual_replacement_file = db.Column(db.String(255))

    organization_issue_type = db.Column(db.String(100))
    organization_issue = db.Column(db.String(200))
    organization_description = db.Column(db.Text)
    organization_document = db.Column(db.String(255))
    organization_change_document = db.Column(db.String(200))
    organization_replace_reason = db.Column(db.Text)
    organization_replacement_file = db.Column(db.String(255))

    # NEW JSON FIELDS
    individual_field_changes = db.Column(JSONB)
    organization_field_changes = db.Column(JSONB)

    individual_field_documents = db.Column(JSONB)
    organization_field_documents = db.Column(JSONB)

    status = db.Column(db.String(50), default="PENDING")

    created_at = db.Column(db.DateTime, server_default=db.func.now())