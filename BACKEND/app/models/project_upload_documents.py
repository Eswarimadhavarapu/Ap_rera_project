# from app.models.database import db
# from datetime import datetime

# class ProjectRegistrationDocument(db.Model):
#     __tablename__ = "project_registration_documents"

#     application_number = db.Column(db.String(50), primary_key=True)
#     pan_number = db.Column(db.String(20), primary_key=True)

#     documents = db.Column(db.JSON)
#     uploaded_on = db.Column(db.DateTime, default=datetime.utcnow)


from app.models.database import db
from datetime import datetime

class ProjectRegistrationDocument(db.Model):
    __tablename__ = "project_registration_documents"

    application_number = db.Column(db.String(50), primary_key=True)
    pan_number = db.Column(db.String(20), primary_key=True)

    documents = db.Column(db.JSON)
    uploaded_on = db.Column(db.DateTime, default=datetime.utcnow)