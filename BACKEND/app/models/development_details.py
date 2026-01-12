import logging
from sqlalchemy import text
from app.models.database import db

class DevelopmentDetailsModel:

    @staticmethod
    def insert(data):
        logging.info(f"chekck the input:{data}")
        query = text("""
            INSERT INTO development_details (project_id,project_type,development_details,
                external_development_work,work_description,work_type)
            VALUES (:project_id,:project_type,:development_details,:external_development_work,
                :work_description,:work_type)
            RETURNING id
        """)
        logging.info(f"check the query:{query}")
        result = db.session.execute(query, {
            "project_id": data["project_id"],
            "project_type": data["project_type"],
            "development_details": data["development_details"],
            "external_development_work": data["external_development_work"],
            "work_description": data["work_description"],
            "work_type": data["work_type"]
        })

        db.session.commit()
        return result.fetchone()