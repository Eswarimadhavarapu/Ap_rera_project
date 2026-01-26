from datetime import datetime
from sqlalchemy import text
from app.models.database import db
import os

from app.models.project_upload_documents import ProjectRegistrationDocument
from app.models.project_registration_model import get_project_registration
from app.models.development_details import DevelopmentDetailsModel
from app.models.application_associate import ApplicationAssociate
from app.models.architect import Architect
from app.models.engineer import Engineer
from app.models.accountant import Accountant
from app.models.project_agent import AgentModel
from app.models.application_associate import ApplicationAssociate
from app.models.project_engineer import ProjectEngineer
from app.models.contractor import Contractor




# --------------------------------------------------
# MASTER LOOKUPS
# --------------------------------------------------
def get_district_name(district_id):
    if not district_id:
        return "N/A"

    row = db.session.execute(
        text("""
            SELECT district_name
            FROM district_master_t
            WHERE district_id = :id
        """),
        {"id": district_id}
    ).fetchone()

    return row[0] if row else "N/A"


def get_mandal_name(mandal_id):
    if not mandal_id:
        return "N/A"

    row = db.session.execute(
        text("""
            SELECT mandal_name
            FROM mandal_master_t
            WHERE mandal_id = :id
        """),
        {"id": mandal_id}
    ).fetchone()

    return row[0] if row else "N/A"


def get_village_name(village_id):
    if not village_id:
        return "N/A"

    row = db.session.execute(
        text("""
            SELECT village_name
            FROM village_master_t
            WHERE village_id = :id
        """),
        {"id": village_id}
    ).fetchone()

    return row[0] if row else "N/A"


PROJECT_TYPE_MAP = {
    1: "Residential",
    2: "Commercial",
    3: "Mixed Development"
}


# --------------------------------------------------
# HELPERS
# --------------------------------------------------
def format_date(date_val):
    if not date_val:
        return "N/A"
    if isinstance(date_val, str):
        try:
            date_val = datetime.fromisoformat(date_val.replace("Z", ""))
        except Exception:
            return date_val
    return date_val.strftime("%d-%m-%Y")


# --------------------------------------------------
# DOCUMENTS (FINAL FIXED)
# --------------------------------------------------
def map_documents(application_number, pan_number):
    if not application_number or not pan_number:
        return []

    record = ProjectRegistrationDocument.query.filter_by(
        application_number=str(application_number),
        pan_number=str(pan_number)
    ).first()

    print("📄 DOC RECORD FOUND:", record)

    if not record or not record.documents:
        return []

    formatted_docs = []

    for doc_id, file_path in record.documents.items():
        formatted_docs.append({
            "document_name": doc_id,
            "file_path": file_path
        })

    return formatted_docs



# --------------------------------------------------
# PREVIEW BUILDER (FINAL + STABLE)
# --------------------------------------------------
def build_project_preview_data(raw):
    application_id = raw.get("applicationNumber")
    pan_number = raw.get("panNumber")

    if not application_id or not pan_number:
        return {
            "project_details": {},
            "promoter_details": {},
            "associate_details": {
                "architects": [],
                "engineers": [],
                "accountants": [],
                "agents": [],
            },
            "development_details": {},
            "project_upload_documents": [],
        }

    # -----------------------------
    # CORE DATA
    # -----------------------------
    registration = get_project_registration(application_id, pan_number)

    development = DevelopmentDetailsModel.get_by_application_and_pan(
        application_id, pan_number
    )

    documents_data = map_documents(application_id, pan_number)

    # -----------------------------
    # ASSOCIATES (CORRECT & SAFE)
    # -----------------------------
    associate_details = {
        "architects": [],
        "engineers": [],
        "accountants": [],
        "agents": [],
        "project_engineers": [],  # ✅ ADD
        "contractors": []         # ✅ ADD
    }

    associates = ApplicationAssociate.query.filter_by(
        application_number=application_id,
        pan_number=pan_number
    ).all()

    for a in associates:
        atype = (a.associate_type or "").lower()

        # 🔹 AGENT
        if atype == "agent":
            ag = AgentModel.query.get(a.associate_id)
            if ag:
                associate_details["agents"].append({
                    "name": ag.agent_name,
                    "address": ag.agent_address,
                    "mobile": ag.mobile_number,
                    "registration_number": ag.rera_registration_no,
                })

        for a in associates:
              atype = (a.associate_type or "").lower()

    # 🔹 AGENT
    if atype == "agent":
        ag = AgentModel.query.get(a.associate_id)
        if ag:
            associate_details["agents"].append({
                "name": ag.agent_name,
                "address": ag.agent_address,
                "mobile": ag.mobile_number,
                "registration_number": ag.rera_registration_no,
            })

    # 🔹 ARCHITECT
    elif atype == "architect":
        arch = Architect.query.get(a.associate_id)
        if arch:
            associate_details["architects"].append({
                "name": arch.architect_name,
                "email": arch.email_id,
                "address": arch.address_line1,
                "address2": arch.address_line2,
                "state": arch.state_ut,
                "district": arch.district,
                "pin_code": arch.pin_code,
                "mobile": arch.mobile_number,
                "reg_number": arch.coa_registration_number,
                "year_of_establishment": arch.year_of_establishment,
                "number_of_key_projects": arch.number_of_key_projects,
            })

    # 🔹 STRUCTURAL ENGINEER
    elif atype == "engineer":
        eng = Engineer.query.get(a.associate_id)
        if eng:
            associate_details["engineers"].append({
                "name": eng.engineer_name,
                "email": eng.email_id,
                "address": eng.address_line1,
                "address2": eng.address_line2,
                "state": eng.state_ut,
                "district": eng.district,
                "pin_code": eng.pin_code,
                "mobile": eng.mobile_number,
                "licence_number": eng.licence_number,
                "number_of_key_projects": eng.number_of_key_projects,
            })

    # 🔹 CHARTERED ACCOUNTANT
    elif atype == "accountant":
        acc = Accountant.query.get(a.associate_id)
        if acc:
            associate_details["accountants"].append({
                "name": acc.accountant_name,
                "email": acc.email_id,
                "address": acc.address_line1,
                "address2": acc.address_line2,
                "state": acc.state_ut,
                "district": acc.district,
                "pin_code": acc.pin_code,
                "mobile": acc.mobile_number,
                "icai_member_id": acc.icai_member_id,
                "number_of_key_projects": acc.number_of_key_projects,
            })

    # 🔹 PROJECT ENGINEER
    elif atype == "project_engineer":
        pe = ProjectEngineer.query.get(a.associate_id)
        if pe:
            associate_details["project_engineers"].append({
                "engineer_name": pe.engineer_name,
                "email_id": pe.email_id,
                "address_line1": pe.address_line1,
                "address_line2": pe.address_line2,
                "state_ut": pe.state_ut,
                "district": pe.district,
                "pin_code": pe.pin_code,
                "mobile_number": pe.mobile_number,
                "number_of_key_projects": pe.number_of_key_projects,
            })

    # 🔹 CONTRACTOR
    elif atype == "contractor":
        con = Contractor.query.get(a.associate_id)
        if con:
            associate_details["contractors"].append({
                "nature_of_work": con.nature_of_work,
                "contractor_name": con.contractor_name,
                "email_id": con.email_id,
                "address_line1": con.address_line1,
                "state_ut": con.state_ut,
                "district": con.district,
                "pin_code": con.pin_code,
                "year_of_establishment": con.year_of_establishment,
                "number_of_key_projects": con.number_of_key_projects,
                "mobile_number": con.mobile_number,
            })



    # -----------------------------
    # PROJECT DETAILS
    # -----------------------------
    project_details = {
        "Application Number": application_id,
        "Project Name": registration.get("project_name") if registration else "N/A",
        "Project Description": registration.get("project_description") if registration else "N/A",
        "Project Type": PROJECT_TYPE_MAP.get(registration.get("project_type"), "N/A") if registration else "N/A",
        "Project Status": registration.get("project_status") if registration else "New Project",
        "Building Plan No": registration.get("building_plan_no") if registration else "N/A",
        "Survey No": registration.get("survey_no") if registration else "N/A",
        "Building Permission Validity From": format_date(registration.get("building_permission_from")) if registration else "N/A",
        "Building Permission Validity To": format_date(registration.get("building_permission_upto")) if registration else "N/A",
        "Project Starting Date": format_date(registration.get("date_of_commencement")) if registration else "N/A",
        "Proposed Completion Date": format_date(registration.get("proposed_completion_date")) if registration else "N/A",
        "Total Area of Land (Sq.m)": registration.get("total_area_of_land") if registration else "N/A",
        "Height of Building (m)": registration.get("building_height") if registration else "0.00",
        "Total Plinth Area (Sq.m)": registration.get("total_plinth_area") if registration else "N/A",
        "Total Open Area (Sq.m)": registration.get("total_open_area") if registration else "N/A",
        "Total Built-up Area (Sq.m)": registration.get("total_built_up_area") if registration else "N/A",
        "Estimated Cost of Construction": registration.get("estimated_construction_cost") if registration else "N/A",
        "Cost of Land": registration.get("cost_of_land") if registration else "N/A",
        "Total Project Cost (₹)": registration.get("total_project_cost") if registration else "N/A",
        "Project Address": ", ".join(filter(None, [
            registration.get("project_address1") if registration else None,
            registration.get("project_address2") if registration else None,
        ])),
        "District": get_district_name(registration.get("project_district")) if registration else "N/A",
        "Mandal": get_mandal_name(registration.get("project_mandal")) if registration else "N/A",
        "Village": get_village_name(registration.get("project_village")) if registration else "N/A",
        "Pincode": registration.get("project_pincode") if registration else "N/A",
    }

    # -----------------------------
    # PROMOTER DETAILS
    # -----------------------------
    promoter_details = {
        "Promoter Name": registration.get("promoter_name") if registration else "N/A",
        "Father Name": registration.get("promoter_father_name") if registration else "N/A",
        "Mobile Number": registration.get("promoter_mobile") if registration else "N/A",
        "Email": registration.get("promoter_email") if registration else "N/A",
        "PAN": pan_number,
        "Aadhaar": registration.get("promoter_aadhaar") if registration else "N/A",
        "State": registration.get("promoter_state") if registration else "N/A",
        "District": registration.get("promoter_district") if registration else "N/A",
        "Landline": registration.get("promoter_landline") if registration else "N/A",
        "Promoter Website": registration.get("promoter_website") if registration else "N/A",
        "Bank State": registration.get("bank_state") if registration else "N/A",
        "Bank Name": registration.get("bank_name") if registration else "N/A",
        "Branch Name": registration.get("branch_name") if registration else "N/A",
        "Account Number": registration.get("account_no") if registration else "N/A",
        "IFSC Code": registration.get("ifsc") if registration else "N/A",
        "Account Holder Name": registration.get("account_holder") if registration else "N/A",
    }

    # -----------------------------
    # DEVELOPMENT DETAILS
    # -----------------------------
    external_work = (
        development.get("external_development_work", {})
        if development and isinstance(development.get("external_development_work"), dict)
        else {}
    )

    dev_details = {
        "Project Type": development.get("project_type").capitalize() if development else "N/A",
        "Development Details": development.get("development_details") if development else {},
        "External Development Works": [
            k.replace("_", " ")
            for k, v in external_work.items()
            if v == 1
        ],
    }

    # -----------------------------
    # FINAL RESPONSE
    # -----------------------------
    return {
        "project_details": project_details,
        "promoter_details": promoter_details,
        "associate_details": associate_details,
        "development_details": dev_details,
        "project_upload_documents": documents_data
    }