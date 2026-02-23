# from sqlalchemy import text
# from app.models.database import db


# def insert_othertheninduvidual_project_registration(data):

#     query = text("""
#         INSERT INTO othertheninduvidual_project_registration (
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
#             units_agreement_sale, units_sold, legal_declaration_accepted,

#             authorized_signatory_name,
#             authorized_signatory_mobile,
#             authorized_signatory_email,
#             is_existing_director,
#             authorized_signatory_photo_path,
#             board_resolution_copy_path
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
#             :units_agreement_sale, :units_sold, :legal_declaration_accepted,

#             :authorized_signatory_name,
#             :authorized_signatory_mobile,
#             :authorized_signatory_email,
#             :is_existing_director,
#             :authorized_signatory_photo_path,
#             :board_resolution_copy_path
#         )
#     """)

#     db.session.execute(query, data)
#     db.session.commit()



from sqlalchemy import text
from app.models.database import db


# =========================================================
# INSERT DATA
# =========================================================
def insert_othertheninduvidual_project_registration(data):

    query = text("""
        INSERT INTO othertheninduvidual_project_registration (
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
            units_agreement_sale, units_sold, legal_declaration_accepted,

            authorized_signatory_name,
            authorized_signatory_mobile,
            authorized_signatory_email,
            is_existing_director,
            authorized_signatory_photo_path,
            board_resolution_copy_path
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
            :units_agreement_sale, :units_sold, :legal_declaration_accepted,

            :authorized_signatory_name,
            :authorized_signatory_mobile,
            :authorized_signatory_email,
            :is_existing_director,
            :authorized_signatory_photo_path,
            :board_resolution_copy_path
        )
    """)

    db.session.execute(query, data)
    db.session.commit()


# =========================================================
# 🔥 GET DATA (FOR PREVIEW)
# =========================================================
def get_othertheninduvidual_project_registration(application_number, pan_number):

    query = text("""
        SELECT     -- ================= BASIC =================
    pr.application_number,
    pr.pan_number,
    pr.project_name,
    pr.project_description,
    pr.project_type,
    pr.project_status,

    -- ================= PERMISSION =================
    pr.building_plan_no,
    pr.building_permission_from,
    pr.building_permission_upto,
    pr.date_of_commencement,
    pr.proposed_completion_date,

    -- ================= AREA =================
    pr.total_area_of_land,
    pr.building_height,
    pr.total_plinth_area,
    pr.total_built_up_area,
    pr.total_open_area,

    -- ================= COST =================
    pr.estimated_construction_cost,
    pr.cost_of_land,
    pr.total_project_cost,

    -- ================= SITE ADDRESS =================
    pr.project_address1,
    pr.project_address2,
    pr.project_pincode,
    pr.project_latitude,
    pr.project_longitude,

    d.district_name    AS project_district_name,
    m.mandal_name      AS project_mandal_name,
    v.village_name     AS project_village_name,

    -- ================= LOCAL ADDRESS =================
    pr.local_address1,
    pr.local_address2,
    pr.local_pincode,

    ld.district_name   AS local_district_name,
    lm.mandal_name     AS local_mandal_name,
    lv.village_name    AS local_village_name,

    -- ================= OTHER =================
    pr.plan_approving_authority,
    pr.address_proof_path,
    pr.project_website_url,
    pr.survey_no,

    -- ================= PARKING =================
    pr.garages_available_for_sale,
    pr.total_garage_area,
    pr.open_parking_spaces,
    pr.total_open_parking_area,
    pr.covered_parking_spaces,
    pr.total_covered_parking_area,

    -- ================= MATERIAL =================
    pr.number_of_units,
    pr.units_advance_taken,
    pr.units_agreement_sale,
    pr.units_sold,
    pr.legal_declaration_accepted,

    -- ===================================================
    -- 🔥 NEW OTHER THAN INDIVIDUAL FIELDS (YOUR 6 VALUES)
    -- ===================================================
    pr.authorized_signatory_name,
    pr.authorized_signatory_mobile,
    pr.authorized_signatory_email,
    pr.is_existing_director,
    pr.authorized_signatory_photo_path,
    pr.board_resolution_copy_path,

    -- ================= PROMOTER JOIN =================
    preg.name              AS promoter_name,
    preg.father_name       AS promoter_father_name,
    preg.aadhaar           AS promoter_aadhaar,
    preg.mobile            AS promoter_mobile,
    preg.email             AS promoter_email,
    preg.landline          AS promoter_landline,
    preg.state_ut          AS promoter_state,
    preg.district          AS promoter_district,
    preg.promoter_website  AS promoter_website,

    -- ================= BANK =================
    preg.bank_state,
    preg.bank_name,
    preg.branch_name,
    preg.account_no,
    preg.account_holder,
    preg.ifsc

    FROM othertheninduvidual_project_registration pr

    LEFT JOIN project_registrations preg
      ON pr.application_number = preg.application_no
     AND pr.pan_number = preg.pan_number

    LEFT JOIN district_master_t d
      ON pr.project_district = d.id

    LEFT JOIN mandal_master_t m
      ON pr.project_mandal = m.id

    LEFT JOIN villages_t v
      ON pr.project_village = v.id

    LEFT JOIN district_master_t ld
      ON pr.local_district = ld.id

    LEFT JOIN mandal_master_t lm
      ON pr.local_mandal = lm.id

    LEFT JOIN villages_t lv
      ON pr.local_village = lv.id

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

    if not result:
        return {}

    return dict(result)