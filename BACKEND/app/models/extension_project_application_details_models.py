from app.models.database import db
from sqlalchemy.sql import text


def insert_extension_project_application(data):
    query = text("""
        INSERT INTO extension_project_application_details (
            application_number,
            project_name,
            project_id,
            validity_from,
            validity_to,
            new_validity_from,
            new_validity_to,
            representation_letter,
            form_b,
            consent_letter,
            form_e,
            form_p4,
            extension_proceeding,
            status
        )
        VALUES (
            :application_number,
            :project_name,
            :project_id,
            :validity_from,
            :validity_to,
            :new_validity_from,
            :new_validity_to,
            :representation_letter,
            :form_b,
            :consent_letter,
            :form_e,
            :form_p4,
            :extension_proceeding,
            'SUBMITTED'
        )
    """)

    db.session.execute(query, {
        "application_number": data["application_number"],
        "project_name": data["project_name"],
        "project_id": data["project_id"],
        "validity_from": data["validity_from"],
        "validity_to": data["validity_to"],
        "new_validity_from": data["new_validity_from"],
        "new_validity_to": data["new_validity_to"],
        "representation_letter": data["representation_letter"],
        "form_b": data["form_b"],
        "consent_letter": data["consent_letter"],
        "form_e": data["form_e"],
        "form_p4": data["form_p4"],
        "extension_proceeding": data["extension_proceeding"],
    })

    db.session.commit()