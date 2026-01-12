from app.models.database import db
from sqlalchemy import text

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