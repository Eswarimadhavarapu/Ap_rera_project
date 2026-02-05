# from app.models.database import db
# from sqlalchemy import text

# # ---------------------------------------------------------
# # INSERT PROJECT REGISTRATION (EXISTING - UNCHANGED)
# # ---------------------------------------------------------
# def insert_project_registration(data):
#     query = text("""
#         INSERT INTO project_registration (
#             application_number, pan_number,

#             project_name, project_description, project_type, project_status,
#             building_plan_no, building_permission_from, building_permission_upto,
#             date_of_commencement, proposed_completion_date,

#             total_area_of_land, building_height, total_plinth_area, total_built_up_area,
#             garages_available_for_sale, total_garage_area,
#             open_parking_spaces, total_open_parking_area,
#             covered_parking_spaces, total_covered_parking_area,

#             estimated_construction_cost, cost_of_land,
#             total_open_area, total_project_cost,

#             project_address1, project_address2,
#             project_district, project_mandal, project_village,
#             project_pincode, project_latitude, project_longitude,
#             plan_approving_authority, survey_no, address_proof_path,

#             local_address1, local_address2, local_area, local_landmark,
#             local_district, local_mandal, local_village,
#             local_pincode, project_website_url,

#             development_completed, development_pending,
#             amount_collected, amount_spent, balance_amount, plan_modified,

#             architect_certificate_path, engineer_certificate_path, ca_certificate_path,

#             project_delayed, number_of_units, units_advance_taken,
#             units_agreement_sale, units_sold, legal_declaration_accepted
#         )
#         VALUES (
#             :application_number, :pan_number,

#             :project_name, :project_description, :project_type, :project_status,
#             :building_plan_no, :building_permission_from, :building_permission_upto,
#             :date_of_commencement, :proposed_completion_date,

#             :total_area_of_land, :building_height, :total_plinth_area, :total_built_up_area,
#             :garages_available_for_sale, :total_garage_area,
#             :open_parking_spaces, :total_open_parking_area,
#             :covered_parking_spaces, :total_covered_parking_area,

#             :estimated_construction_cost, :cost_of_land,
#             :total_open_area, :total_project_cost,

#             :project_address1, :project_address2,
#             :project_district, :project_mandal, :project_village,
#             :project_pincode, :project_latitude, :project_longitude,
#             :plan_approving_authority, :survey_no, :address_proof_path,

#             :local_address1, :local_address2, :local_area, :local_landmark,
#             :local_district, :local_mandal, :local_village,
#             :local_pincode, :project_website_url,

#             :development_completed, :development_pending,
#             :amount_collected, :amount_spent, :balance_amount, :plan_modified,

#             :architect_certificate_path, :engineer_certificate_path, :ca_certificate_path,

#             :project_delayed, :number_of_units, :units_advance_taken,
#             :units_agreement_sale, :units_sold, :legal_declaration_accepted
#         )
#     """)

#     db.session.execute(query, data)
#     db.session.commit()


# # ---------------------------------------------------------
# # FETCH PROJECT REGISTRATION (NEW - FOR PREVIEW & PDF)
# # ---------------------------------------------------------
# def get_project_registration(application_number, pan_number):
#     query = text("""
#         SELECT
#             -- ======================
#             -- PROJECT (project_registration)
#             -- ======================
#             pr.application_number,
#             pr.pan_number,
#             pr.project_name,
#             pr.project_description,
#             pr.project_type,
#             pr.project_status,
#             pr.building_plan_no,
#             pr.building_permission_from,
#             pr.building_permission_upto,
#             pr.date_of_commencement,
#             pr.proposed_completion_date,
#             pr.total_area_of_land,
#             pr.building_height,
#             pr.total_plinth_area,
#             pr.total_built_up_area,
#             pr.total_open_area,
#             pr.estimated_construction_cost,
#             pr.cost_of_land,
#             pr.total_project_cost,
#             pr.project_address1,
#             pr.project_address2,
#             pr.project_district,
#             pr.project_mandal,
#             pr.project_village,
#             pr.project_pincode,
#             pr.project_latitude,
#             pr.project_longitude,
#             pr.plan_approving_authority,
#             pr.survey_no,
#             pr.number_of_units,
#             pr.units_advance_taken,
#             pr.units_agreement_sale,
#             pr.units_sold,
#             pr.legal_declaration_accepted,

#             -- ======================
#             -- PROMOTER (project_registrations)
#             -- ======================
#             preg.name                AS promoter_name,
#             preg.father_name         AS promoter_father_name,
#             preg.aadhaar             AS promoter_aadhaar,
#             preg.mobile              AS promoter_mobile,
#             preg.email               AS promoter_email,
#             preg.landline            AS promoter_landline,
#             preg.state_ut            AS promoter_state,
#             preg.district            AS promoter_district,
#             preg.promoter_website    AS promoter_website,
#             preg.litigation          AS promoter_litigation,

#             -- ======================
#             -- BANK DETAILS
#             -- ======================
#             preg.bank_state,
#             preg.bank_name,
#             preg.branch_name,
#             preg.account_no,
#             preg.account_holder,
#             preg.ifsc

#         FROM project_registration pr
#         LEFT JOIN project_registrations preg
#                ON pr.application_number = preg.application_no
#               AND pr.pan_number = preg.pan_number

#         WHERE pr.application_number = :application_number
#           AND pr.pan_number = :pan_number
#     """)

#     result = db.session.execute(
#         query,
#         {
#             "application_number": application_number,
#             "pan_number": pan_number
#         }
#     ).mappings().first()

#     return dict(result) if result else None

from app.models.database import db
from sqlalchemy import text


# ---------------------------------------------------------
# INSERT PROJECT REGISTRATION (EXISTING - UNCHANGED)
# ---------------------------------------------------------
def insert_project_registration(data):
    query = text("""
        INSERT INTO project_registration (
            application_number, pan_number,

            project_name, project_description, project_type, project_status,
            building_plan_no, building_permission_from, building_permission_upto,
            date_of_commencement, proposed_completion_date,

            total_area_of_land, building_height, total_plinth_area, total_built_up_area,
            garages_available_for_sale, total_garage_area,
            open_parking_spaces, total_open_parking_area,
            covered_parking_spaces, total_covered_parking_area,

            estimated_construction_cost, cost_of_land,
            total_open_area, total_project_cost,

            project_address1, project_address2,
            project_district, project_mandal, project_village,
            project_pincode, project_latitude, project_longitude,
            plan_approving_authority, survey_no, address_proof_path,

            local_address1, local_address2, local_area, local_landmark,
            local_district, local_mandal, local_village,
            local_pincode, project_website_url,

            development_completed, development_pending,
            amount_collected, amount_spent, balance_amount, plan_modified,

            architect_certificate_path, engineer_certificate_path, ca_certificate_path,

            project_delayed, number_of_units, units_advance_taken,
            units_agreement_sale, units_sold, legal_declaration_accepted
        )
        VALUES (
            :application_number, :pan_number,

            :project_name, :project_description, :project_type, :project_status,
            :building_plan_no, :building_permission_from, :building_permission_upto,
            :date_of_commencement, :proposed_completion_date,

            :total_area_of_land, :building_height, :total_plinth_area, :total_built_up_area,
            :garages_available_for_sale, :total_garage_area,
            :open_parking_spaces, :total_open_parking_area,
            :covered_parking_spaces, :total_covered_parking_area,

            :estimated_construction_cost, :cost_of_land,
            :total_open_area, :total_project_cost,

            :project_address1, :project_address2,
            :project_district, :project_mandal, :project_village,
            :project_pincode, :project_latitude, :project_longitude,
            :plan_approving_authority, :survey_no, :address_proof_path,

            :local_address1, :local_address2, :local_area, :local_landmark,
            :local_district, :local_mandal, :local_village,
            :local_pincode, :project_website_url,

            :development_completed, :development_pending,
            :amount_collected, :amount_spent, :balance_amount, :plan_modified,

            :architect_certificate_path, :engineer_certificate_path, :ca_certificate_path,

            :project_delayed, :number_of_units, :units_advance_taken,
            :units_agreement_sale, :units_sold, :legal_declaration_accepted
        )
    """)

    db.session.execute(query, data)
    db.session.commit()


# ---------------------------------------------------------
# FETCH PROJECT REGISTRATION (NEW - FOR PREVIEW & PDF)
# ---------------------------------------------------------
def get_project_registration(application_number, pan_number):
    query = text("""
        SELECT
            -- ======================
            -- PROJECT (project_registration)
            -- ======================
            pr.application_number,
            pr.pan_number,
            pr.project_name,
            pr.project_description,
            pr.project_type,
            pr.project_status,
            pr.building_plan_no,
            pr.building_permission_from,
            pr.building_permission_upto,
            pr.date_of_commencement,
            pr.proposed_completion_date,
            pr.total_area_of_land,
            pr.building_height,
            pr.total_plinth_area,
            pr.total_built_up_area,
            pr.total_open_area,
            pr.estimated_construction_cost,
            pr.cost_of_land,
            pr.total_project_cost,
            pr.project_address1,
            pr.project_address2,
            pr.project_district,
            pr.project_mandal,
            pr.project_village,
            pr.project_pincode,
            pr.project_latitude,
            pr.project_longitude,
            pr.plan_approving_authority,
            pr.survey_no,
            pr.number_of_units,
            pr.units_advance_taken,
            pr.units_agreement_sale,
            pr.units_sold,
            pr.legal_declaration_accepted,

            -- ======================
            -- PROMOTER (project_registrations)
            -- ======================
            preg.name                AS promoter_name,
            preg.father_name         AS promoter_father_name,
            preg.aadhaar             AS promoter_aadhaar,
            preg.mobile              AS promoter_mobile,
            preg.email               AS promoter_email,
            preg.landline            AS promoter_landline,
            preg.state_ut            AS promoter_state,
            preg.district            AS promoter_district,
            preg.promoter_website    AS promoter_website,
            preg.litigation          AS promoter_litigation,

            -- ======================
            -- BANK DETAILS
            -- ======================
            preg.bank_state,
            preg.bank_name,
            preg.branch_name,
            preg.account_no,
            preg.account_holder,
            preg.ifsc

        FROM project_registration pr
        LEFT JOIN project_registrations preg
               ON pr.application_number = preg.application_no
              AND pr.pan_number = preg.pan_number

        WHERE pr.application_number = :application_number
          AND pr.pan_number = :pan_number
    """)

    result = db.session.execute(
        query,
        {
            "application_number": application_number,
            "pan_number": pan_number
        }
    ).mappings().first()

    return dict(result) if result else None

# =====================================
# FETCH BY PAN + APP NO
# =====================================
# ---------------------------------------------------------
# FETCH PROJECT REGISTRATION (BY PAN + APPLICATION NO)
# ---------------------------------------------------------
def get_project_registration(application_number, pan_number):

    query = text("""
        SELECT *
        FROM project_registration
        WHERE application_number = :application_number
        AND pan_number = :pan_number
        LIMIT 1
    """)

    result = db.session.execute(
        query,
        {
            "application_number": application_number,
            "pan_number": pan_number
        }
    ).mappings().first()

    return dict(result) if result else None