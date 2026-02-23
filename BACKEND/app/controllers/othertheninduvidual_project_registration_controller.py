# import os
# from flask import Blueprint, request, jsonify, current_app
# from werkzeug.utils import secure_filename

# from app.models.othertheninduvidual_project_registration_model import (
#     insert_othertheninduvidual_project_registration
# )

# # ---------------------------------------------------------
# # BLUEPRINT
# # ---------------------------------------------------------
# othertheninduvidual_project_registration_bp = Blueprint(
#     "othertheninduvidual_project_registration_bp",
#     __name__
# )


# # ---------------------------------------------------------
# # FILE SAVE FUNCTION
# # ---------------------------------------------------------
# def save_file(file, subfolder):

#     if not file:
#         return None

#     upload_base = current_app.config["UPLOAD_FOLDER"]
#     folder = os.path.join(upload_base, subfolder)
#     os.makedirs(folder, exist_ok=True)

#     filename = secure_filename(file.filename)
#     file_path = os.path.join(folder, filename)
#     file.save(file_path)

#     # store relative path in DB
#     return f"uploads/{subfolder}/{filename}"


# # ---------------------------------------------------------
# # OTHER THAN INDIVIDUAL PROJECT REGISTRATION API
# # ---------------------------------------------------------
# @othertheninduvidual_project_registration_bp.route(
#     "/othertheninduvidual-project-registration",
#     methods=["POST"]
# )
# def othertheninduvidual_project_registration():

#     try:
#         form = request.form
#         files = request.files

#         data = {

#             # 🔹 BASIC
#             "application_number": form.get("applicationNumber"),
#             "pan_number": form.get("panNumber"),

#             "project_name": form.get("projectName"),
#             "project_description": form.get("projectDescription"),
#             "project_type": form.get("projectType"),
#             "project_status": form.get("projectStatus"),

#             # 🔹 PERMISSION DETAILS
#             "building_plan_no": form.get("buildingPlanNo"),
#             "building_permission_from": form.get("buildingPermissionFrom"),
#             "building_permission_upto": form.get("buildingPermissionUpto"),
#             "date_of_commencement": form.get("dateOfCommencement"),
#             "proposed_completion_date": form.get("proposedCompletionDate"),

#             # 🔹 AREA DETAILS
#             "total_area_of_land": form.get("totalAreaOfLand"),
#             "building_height": form.get("buildingHeight"),
#             "total_plinth_area": form.get("totalPlinthArea"),
#             "total_built_up_area": form.get("totalBuiltUpArea"),

#             "garages_available_for_sale": form.get("garagesAvailableForSale"),
#             "total_garage_area": form.get("totalGarageArea"),
#             "open_parking_spaces": form.get("openParkingSpaces"),
#             "total_open_parking_area": form.get("totalOpenParkingArea"),
#             "covered_parking_spaces": form.get("coveredParkingSpaces"),
#             "total_covered_parking_area": form.get("totalCoveredParkingArea"),

#             "estimated_construction_cost": form.get("estimatedConstructionCost"),
#             "cost_of_land": form.get("costOfLand"),
#             "total_open_area": form.get("totalOpenArea"),
#             "total_project_cost": form.get("totalProjectCost"),

#             # 🔹 PROJECT ADDRESS
#             "project_address1": form.get("projectAddress1"),
#             "project_address2": form.get("projectAddress2"),
#             "project_district": form.get("projectDistrict"),
#             "project_mandal": form.get("projectMandal"),
#             "project_village": form.get("projectVillage"),
#             "project_pincode": form.get("projectPincode"),
#             "project_latitude": form.get("projectLatitude"),
#             "project_longitude": form.get("projectLongitude"),
#             "plan_approving_authority": form.get("planApprovingAuthority"),
#             "survey_no": form.get("surveyNo"),

#             "address_proof_path": save_file(
#                 files.get("addressProof"),
#                 "address_proofs"
#             ),

#             # 🔹 LOCAL ADDRESS
#             "local_address1": form.get("localAddress1"),
#             "local_address2": form.get("localAddress2"),
#             "local_area": form.get("localArea"),
#             "local_landmark": form.get("localLandmark"),
#             "local_district": form.get("localDistrict"),
#             "local_mandal": form.get("localMandal"),
#             "local_village": form.get("localVillage"),
#             "local_pincode": form.get("localPincode"),
#             "project_website_url": form.get("projectWebsiteURL"),

#             # 🔹 CONSTRUCTION STATUS
#             "development_completed": form.get("developmentCompleted"),
#             "development_pending": form.get("developmentPending"),
#             "amount_collected": form.get("amountCollected"),
#             "amount_spent": form.get("amountSpent"),
#             "balance_amount": form.get("balanceAmount"),
#             "plan_modified": form.get("planModified") == "true",

#             "architect_certificate_path": save_file(
#                 files.get("architectCertificate"),
#                 "certificates"
#             ),

#             "engineer_certificate_path": save_file(
#                 files.get("engineerCertificate"),
#                 "certificates"
#             ),

#             "ca_certificate_path": save_file(
#                 files.get("caCertificate"),
#                 "certificates"
#             ),

#             # 🔹 MATERIAL FACTS
#             "project_delayed": form.get("projectDelayed") == "true",
#             "number_of_units": form.get("numberOfUnits"),
#             "units_advance_taken": form.get("unitsAdvanceTaken"),
#             "units_agreement_sale": form.get("unitsAgreementSale"),
#             "units_sold": form.get("unitsSold"),

#             "legal_declaration_accepted":
#                 form.get("legalDeclarationAccepted") == "true",

#             # =====================================================
#             # 🔥 EXTRA 6 FIELDS (AUTHORIZED SIGNATORY)
#             # =====================================================

#             "authorized_signatory_name":
#                 form.get("authorizedSignatoryName"),

#             "authorized_signatory_mobile":
#                 form.get("authorizedSignatoryMobile"),

#             "authorized_signatory_email":
#                 form.get("authorizedSignatoryEmail"),

#             "is_existing_director":
#                 form.get("isExistingDirector"),

#             "authorized_signatory_photo_path": save_file(
#                 files.get("authorizedSignatoryPhoto"),
#                 "authorized_signatory"
#             ),

#             "board_resolution_copy_path": save_file(
#                 files.get("boardResolutionCopy"),
#                 "authorized_signatory"
#             ),
#         }

#         # 🔹 INSERT DATA
#         insert_othertheninduvidual_project_registration(data)

#         return jsonify({
#             "message": "Other Than Individual Project Registered Successfully"
#         }), 201

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

from app.models.othertheninduvidual_project_registration_model import (
    insert_othertheninduvidual_project_registration
)

# =========================================================
# BLUEPRINT
# =========================================================
othertheninduvidual_project_registration_bp = Blueprint(
    "othertheninduvidual_project_registration_bp",
    __name__
)


# =========================================================
# FILE SAVE FUNCTION
# =========================================================
def save_file(file, subfolder):

    if not file:
        return None

    upload_base = current_app.config["UPLOAD_FOLDER"]
    folder = os.path.join(upload_base, subfolder)
    os.makedirs(folder, exist_ok=True)

    filename = secure_filename(file.filename)
    file_path = os.path.join(folder, filename)
    file.save(file_path)

    return f"uploads/{subfolder}/{filename}"


# =========================================================
# API ROUTE
# =========================================================
@othertheninduvidual_project_registration_bp.route(
    "/othertheninduvidual-project-registration",
    methods=["POST"]
)
def othertheninduvidual_project_registration():

    try:
        form = request.form
        files = request.files

        data = {

            "application_number": form.get("applicationNumber"),
            "pan_number": form.get("panNumber"),

            "project_name": form.get("projectName"),
            "project_description": form.get("projectDescription"),
            "project_type": form.get("projectType"),
            "project_status": form.get("projectStatus"),

            "building_plan_no": form.get("buildingPlanNo"),
            "building_permission_from": form.get("buildingPermissionFrom"),
            "building_permission_upto": form.get("buildingPermissionUpto"),
            "date_of_commencement": form.get("dateOfCommencement"),
            "proposed_completion_date": form.get("proposedCompletionDate"),

            "total_area_of_land": form.get("totalAreaOfLand"),
            "building_height": form.get("buildingHeight"),
            "total_plinth_area": form.get("totalPlinthArea"),
            "total_built_up_area": form.get("totalBuiltUpArea"),

            "garages_available_for_sale": form.get("garagesAvailableForSale"),
            "total_garage_area": form.get("totalGarageArea"),
            "open_parking_spaces": form.get("openParkingSpaces"),
            "total_open_parking_area": form.get("totalOpenParkingArea"),
            "covered_parking_spaces": form.get("coveredParkingSpaces"),
            "total_covered_parking_area": form.get("totalCoveredParkingArea"),

            "estimated_construction_cost": form.get("estimatedConstructionCost"),
            "cost_of_land": form.get("costOfLand"),
            "total_open_area": form.get("totalOpenArea"),
            "total_project_cost": form.get("totalProjectCost"),

            "project_address1": form.get("projectAddress1"),
            "project_address2": form.get("projectAddress2"),
            "project_district": form.get("projectDistrict"),
            "project_mandal": form.get("projectMandal"),
            "project_village": form.get("projectVillage"),
            "project_pincode": form.get("projectPincode"),
            "project_latitude": form.get("projectLatitude"),
            "project_longitude": form.get("projectLongitude"),
            "plan_approving_authority": form.get("planApprovingAuthority"),
            "survey_no": form.get("surveyNo"),

            "address_proof_path": save_file(files.get("addressProof"), "address_proofs"),

            "local_address1": form.get("localAddress1"),
            "local_address2": form.get("localAddress2"),
            "local_area": form.get("localArea"),
            "local_landmark": form.get("localLandmark"),
            "local_district": form.get("localDistrict"),
            "local_mandal": form.get("localMandal"),
            "local_village": form.get("localVillage"),
            "local_pincode": form.get("localPincode"),
            "project_website_url": form.get("projectWebsiteURL"),

            "development_completed": form.get("developmentCompleted"),
            "development_pending": form.get("developmentPending"),
            "amount_collected": form.get("amountCollected"),
            "amount_spent": form.get("amountSpent"),
            "balance_amount": form.get("balanceAmount"),
            "plan_modified": form.get("planModified") == "true",

            "architect_certificate_path": save_file(files.get("architectCertificate"), "certificates"),
            "engineer_certificate_path": save_file(files.get("engineerCertificate"), "certificates"),
            "ca_certificate_path": save_file(files.get("caCertificate"), "certificates"),

            "project_delayed": form.get("projectDelayed") == "true",
            "number_of_units": form.get("numberOfUnits"),
            "units_advance_taken": form.get("unitsAdvanceTaken"),
            "units_agreement_sale": form.get("unitsAgreementSale"),
            "units_sold": form.get("unitsSold"),

            "legal_declaration_accepted": form.get("legalDeclarationAccepted") == "true",

            # 🔥 AUTHORIZED SIGNATORY
            "authorized_signatory_name": form.get("authorizedSignatoryName"),
            "authorized_signatory_mobile": form.get("authorizedSignatoryMobile"),
            "authorized_signatory_email": form.get("authorizedSignatoryEmail"),
            "is_existing_director": form.get("isExistingDirector"),

            "authorized_signatory_photo_path": save_file(
                files.get("authorizedSignatoryPhoto"),
                "authorized_signatory"
            ),

            "board_resolution_copy_path": save_file(
                files.get("boardResolutionCopy"),
                "authorized_signatory"
            ),
        }

        insert_othertheninduvidual_project_registration(data)

        return jsonify({
            "message": "Other Than Individual Project Registered Successfully"
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500