from app.models.database import db
from sqlalchemy import text

def get_project_basic_details_by_pan(pan_number):
    query = text("""
        SELECT
            pr.application_number,
            preg.name AS name,
            pr.building_plan_no,
            pr.building_permission_from,
            pr.building_permission_upto
        FROM project_registration pr
        LEFT JOIN project_registrations preg
               ON pr.application_number = preg.application_no
        WHERE pr.pan_number = :pan_number
    """)

    result = db.session.execute(
        query,
        {"pan_number": pan_number}
    ).mappings().all()

    return [dict(r) for r in result]
