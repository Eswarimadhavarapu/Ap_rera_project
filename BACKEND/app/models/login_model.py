# app/models/login_model.py
from app.models.database import db
from sqlalchemy import text

def get_emails_by_pan(pan_number):
    query = text("""
        SELECT DISTINCT email
        FROM project_registrations
        WHERE pan_number = :pan
    """)
    result = db.session.execute(query, {"pan": pan_number}).fetchall()
    return [row[0] for row in result]

def get_projects_by_pan(pan_number):
    query = text("""
        SELECT
            pr.application_number,
            preg.name AS promoter_name,
            pr.building_plan_no AS ba_no,
            pr.building_permission_from AS validity_from,
            pr.building_permission_upto AS validity_to
        FROM project_registration pr
        JOIN project_registrations preg
          ON pr.application_number = preg.application_no
         AND pr.pan_number = preg.pan_number
        WHERE pr.pan_number = :pan
        ORDER BY pr.application_number
    """)
    result = db.session.execute(query, {"pan": pan_number}).mappings().all()
    return [dict(row) for row in result]