from flask import Blueprint, request, jsonify
from app.models.database import db

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

        
        entity = AgentOtherThanIndividualEntity(
            designation=form.get("entity_designation"),
            name=form.get("entity_name"),
            email_id=form.get("entity_email"),
            mobile_number=form.get("entity_mobile"),
            state_ut=form.get("entity_state"),
            district=form.get("entity_district"),
            address_line1=form.get("entity_address_line1"),
            address_line2=form.get("entity_address_line2"),
            pincode=form.get("entity_pincode"),
            pan_card_number=form.get("entity_pan_number"),
            pan_card_doc=save_file(files.get("entity_pan_doc"), "entity_pan"),
            aadhaar_number=form.get("entity_aadhaar_number"),
            aadhaar_doc=save_file(files.get("entity_aadhaar_doc"), "entity_aadhaar"),
            photograph=save_file(files.get("entity_photo"), "entity_photo"),
            address_proof=save_file(files.get("entity_address_proof"), "entity_address"),
            entity_type=form.get("entity_type"),
            din_number=form.get("din_number")
        )
        db.session.add(entity)
        db.session.flush()

       
        authorized = AgentOtherThanIndividualAuthorized(
            name=form.get("authorized_name"),
            email_id=form.get("authorized_email"),
            mobile_number=form.get("authorized_mobile"),
            photo=save_file(files.get("authorized_photo"), "authorized_photo"),
            board_resolution=save_file(files.get("board_resolution"), "board_resolution")
        )
        db.session.add(authorized)
        db.session.flush()

        litigation = AgentOtherThanIndividualLitigation(
            case_no=form.get("case_no"),
            tribunal_name_place=form.get("tribunal_name_place"),
            petitioner_name=form.get("petitioner_name"),
            respondent_name=form.get("respondent_name"),
            case_facts=form.get("case_facts"),
            present_status=form.get("present_status"),
           interim_order = save_file(
    files.get("interim_certificate"),
    "litigation_interim_order"
),

final_order_details = save_file(
    files.get("final_certificate"),
    "litigation_final_order"
),

self_declared_affidavit = save_file(
    files.get("self_affidavit"),
    "litigation_affidavit"
)
           
        )
        db.session.add(litigation)
        db.session.flush()

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
            landline_number=form.get("landline_number"),
            gst_number=form.get("gst_number"),
            gst_doc = save_file(files.get("gst_doc"), "gst") if files.get("gst_doc") else None,
            legal_document = save_file(
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
            last_five_year_projects=json.loads(form.get("last_five_year_projects"))
                if form.get("last_five_year_projects") else None,
            other_state_rera_details=json.loads(form.get("other_state_rera_details"))
                if form.get("other_state_rera_details") else None,
            itr_year1_doc=save_file(files.get("itr_year1_doc"), "itr1"),
            itr_year2_doc=save_file(files.get("itr_year2_doc"), "itr2"),
            itr_year3_doc=save_file(files.get("itr_year3_doc"), "itr3"),
            entity_details_id=entity.id,
            authorized_details_id=authorized.id,
            litigation_details_id=litigation.id,
            status="SUBMITTED"
        )

        db.session.add(organisation)
        db.session.commit()

        return jsonify({
            "status": "success",
            "organisation_id": organisation.organisation_id,
            "application_id": organisation.application_id,
            "organization_pan_curd": organisation.pan_card_number
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error("ERROR", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500
    
@agent_other_than_individual_registration_bp.route("/agent/other-than-individual/details", methods=["GET"])
def get_agent_other_than_individual_details():
    try:
        organisation_id = request.args.get("organisation_id")
        pan_card_number = request.args.get("pan_card_number")

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

        entity = AgentOtherThanIndividualEntity.query.get(
            organisation.entity_details_id
        )

        authorized = AgentOtherThanIndividualAuthorized.query.get(
            organisation.authorized_details_id
        )

        litigation = AgentOtherThanIndividualLitigation.query.get(
            organisation.litigation_details_id
        )

      
        return jsonify({
            "status": "success",
            "organisation": organisation.to_dict(),
            "entity": entity.to_dict() if entity else None,
            "authorized": authorized.to_dict() if authorized else None,
            "litigation": litigation.to_dict() if litigation else None
        }), 200

    except Exception as e:
        logger.error("FETCH ERROR", exc_info=True)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


        

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