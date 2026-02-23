from flask import Blueprint, request, jsonify
from app.models.database import db
from flask import Blueprint, request, jsonify, send_from_directory

from app.models.agent_other_than_individual_registration_entity_model import (
    AgentOtherThanIndividualEntity
)
from app.models.agent_other_than_individual_registration_authorized_model import (
    AgentOtherThanIndividualAuthorized
)
from app.models.agent_other_than_individual_registration_litigation_model import (
    AgentOtherThanIndividualLitigation
)
from app.models.agent_other_than_individual_registration_organisation_model import (
    AgentOtherThanIndividualOrganisation
)
 
import os
import json
import logging
from werkzeug.utils import secure_filename
from datetime import datetime


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads", "agent_doc")
LOG_FILE = os.path.join(BASE_DIR, "logs", "agent_other_than_individual_registration.log")

os.makedirs(UPLOAD_DIR, exist_ok=True)


logger = logging.getLogger("agent_other_than_individual_registration")
logger.setLevel(logging.INFO)

if not logger.handlers:
    fh = logging.FileHandler(LOG_FILE)
    fh.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
    logger.addHandler(fh)


agent_other_than_individual_registration_bp = Blueprint(
    "agent_other_than_individual_registration_bp",
    __name__
)

def save_file(file_obj, prefix):
    if not file_obj:
        return None
    filename = secure_filename(file_obj.filename)
    final_name = f"{prefix}_{filename}"
    file_obj.save(os.path.join(UPLOAD_DIR, final_name))
    return f"agent_doc/{final_name}"

def generate_application_id():
    return datetime.now().strftime("%d%m%y%H%M%S")

@agent_other_than_individual_registration_bp.route(
    "/agent/other-than-individual",
    methods=["POST"]
)
def register_agent():

    try:
        form = request.form
        files = request.files

        # ================= ORGANISATION =================

        organisation = AgentOtherThanIndividualOrganisation(
            application_id=generate_application_id(),
            organisation_type=form.get("organisation_type"),
            organisation_name=form.get("organisation_name"),
            registration_identifier=form.get("registration_number"),
            registration_date=form.get("registration_date"),
            registration_cert_doc=save_file(files.get("registration_cert_doc"), "registration_cert"),
            pan_card_number=form.get("pan_card_number"),
            pan_card_doc=save_file(files.get("pan_card_doc"), "org_pan"),
            email_id=form.get("email_id"),
            mobile_number=form.get("mobile_number"),
            gst_number=form.get("gst_number"),
            gst_doc=save_file(files.get("gst_doc"), "gst") if files.get("gst_doc") else None,
            legal_document=save_file(
                files.get("memorandum_doc") or files.get("partnership_deed"),
                "legal_document"
            ),
            address_line1=form.get("address_line1"),
            address_line2=form.get("address_line2"),
            state=form.get("state"),
            district=form.get("district"),
            mandal=form.get("mandal"),
            village=form.get("village"),
            pincode=form.get("pincode"),
            address_proof_doc=save_file(files.get("address_proof_doc"), "address_proof"),
            last_five_year_projects=json.loads(form.get("last_five_year_projects", "null")),
            other_state_rera_details=json.loads(form.get("other_state_rera_details", "null")),
            status="SUBMITTED"
        )

        db.session.add(organisation)
        db.session.flush()
        org_id = organisation.organisation_id

        # ================= ENTITIES =================

        entities_data = json.loads(form.get("entities", "[]"))

        for index, e in enumerate(entities_data):

            aadhaar_file = files.get(f"entity_aadhaar_doc_{index}")
            pan_file = files.get(f"entity_pan_doc_{index}")
            address_file = files.get(f"entity_address_proof_{index}")
            photo_file = files.get(f"entity_photo_{index}")

            entity = AgentOtherThanIndividualEntity(
                designation=e.get("designation"),
                name=e.get("name"),
                email_id=e.get("email"),
                mobile_number=e.get("mobile"),
                state_ut=e.get("state"),
                district=e.get("district"),
                address_line1=e.get("address1"),
                address_line2=e.get("address2"),
                pincode=e.get("pincode"),
                pan_card_number=e.get("pan"),
                aadhaar_number=e.get("aadhaar"),
                entity_type=e.get("nationality"),
                din_number=e.get("din"),

                photograph=save_file(photo_file, f"entity_photo_{index}") if photo_file else None,
                aadhaar_doc=save_file(aadhaar_file, f"entity_aadhaar_{index}") if aadhaar_file else None,
                pan_card_doc=save_file(pan_file, f"entity_pan_{index}") if pan_file else None,
                address_proof=save_file(address_file, f"entity_address_{index}") if address_file else None,

                organisation_id=org_id
            )

            db.session.add(entity)

        # ================= AUTHORIZED =================

        authorized_data = json.loads(form.get("authorized_persons", "[]"))

        for index, a in enumerate(authorized_data):

            authorized = AgentOtherThanIndividualAuthorized(
                name=a.get("name"),
                email_id=a.get("email"),
                mobile_number=a.get("mobile"),
                photo=save_file(files.get(f"authorized_photo_{index}"), f"authorized_photo_{index}"),
                board_resolution=save_file(files.get(f"board_resolution_{index}"), f"board_resolution_{index}"),
                organisation_id=org_id
            )

            db.session.add(authorized)

        # ================= LITIGATIONS =================

       # ================= LITIGATIONS =================

        litigations_data = json.loads(form.get("litigations", "[]"))

# 🔹 CASE 1 → If litigation exists
        if litigations_data:

          for index, l in enumerate(litigations_data):

           interim_file = files.get(f"interim_certificate_{index}")
           final_file = files.get(f"final_certificate_{index}")

           litigation = AgentOtherThanIndividualLitigation(
            case_no=l.get("case_no"),
            tribunal_name_place=l.get("tribunal_name_place"),
            petitioner_name=l.get("petitioner_name"),
            respondent_name=l.get("respondent_name"),
            case_facts=l.get("case_facts"),
            present_status=l.get("present_status"),

            interim_order=save_file(interim_file, f"interim_order_{index}") if interim_file else None,
            final_order_details=save_file(final_file, f"final_order_{index}") if final_file else None,
            self_declared_affidavit=None,

            organisation_id=org_id
           )

          db.session.add(litigation)

# 🔹 CASE 2 → If NO litigation
        else:

         affidavit_file = files.get("self_affidavit")

         litigation = AgentOtherThanIndividualLitigation(
        case_no=None,
        tribunal_name_place=None,
        petitioner_name=None,
        respondent_name=None,
        case_facts=None,
        present_status=None,
        interim_order=None,
        final_order_details=None,
        self_declared_affidavit=save_file(affidavit_file, "self_affidavit") if affidavit_file else None,
        organisation_id=org_id
        )

         db.session.add(litigation)

        db.session.commit()

        return jsonify({
            "status": "success",
            "organisation_id": org_id,
            "application_id": organisation.application_id,
            "PAN_card_number": organisation.pan_card_number
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error("REGISTER ERROR", exc_info=True)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@agent_other_than_individual_registration_bp.route(
    "/agent/other-than-individual/details",
    methods=["GET"]
)
def get_agent_other_than_individual_details():

    organisation_id = request.args.get("organisation_id")

    organisation = AgentOtherThanIndividualOrganisation.query.get(organisation_id)

    if not organisation:
        return jsonify({"status": "error", "message": "Not found"}), 404

    entities = AgentOtherThanIndividualEntity.query.filter_by(
        organisation_id=organisation_id
    ).all()

    authorized = AgentOtherThanIndividualAuthorized.query.filter_by(
        organisation_id=organisation_id
    ).all()

    litigations = AgentOtherThanIndividualLitigation.query.filter_by(
        organisation_id=organisation_id
    ).all()

    return jsonify({
        "status": "success",
        "organisation": organisation.to_dict(),
        "entities": [e.to_dict() for e in entities],
        "authorized": [a.to_dict() for a in authorized],
        "litigations": [l.to_dict() for l in litigations]
    }), 200

        

@agent_other_than_individual_registration_bp.route(
    "/agent/other-than-individual/itr",
    methods=["PATCH"]
)
def update_agent_itr_documents():
    try:
        form = request.form
        files = request.files

        organisation_id = form.get("organisation_id")
        pan_card_number = form.get("pan_card_number")

        if not organisation_id or not pan_card_number:
            return jsonify({
                "status": "error",
                "message": "organisation_id and pan_card_number are required"
            }), 400

      
        organisation = AgentOtherThanIndividualOrganisation.query.filter_by(
            organisation_id=organisation_id,
            pan_card_number=pan_card_number
        ).first()

        if not organisation:
            return jsonify({
                "status": "error",
                "message": "Organisation not found"
            }), 404

 
        if files.get("itr_year1_doc"):
            organisation.itr_year1_doc = save_file(
                files.get("itr_year1_doc"),
                "itr1"
            )

        if files.get("itr_year2_doc"):
            organisation.itr_year2_doc = save_file(
                files.get("itr_year2_doc"),
                "itr2"
            )

        if files.get("itr_year3_doc"):
            organisation.itr_year3_doc = save_file(
                files.get("itr_year3_doc"),
                "itr3"
            )

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "ITR documents updated successfully",
            "itr_documents": {
                "itr_year1_doc": organisation.itr_year1_doc,
                "itr_year2_doc": organisation.itr_year2_doc,
                "itr_year3_doc": organisation.itr_year3_doc
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.error("ITR PATCH ERROR", exc_info=True)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500  
    
@agent_other_than_individual_registration_bp.route(
    "/agent_doc/<path:filename>",
    methods=["GET"]
)
def serve_agent_files(filename):
    return send_from_directory(UPLOAD_DIR, filename)

    



