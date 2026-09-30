from app.models.database import db
from datetime import datetime
import pytz

IST = pytz.timezone("Asia/Kolkata")

class ProjectGallery(db.Model):
    __tablename__ = 'project_gallery'

    id = db.Column(db.Integer, primary_key=True)
    project_application_number = db.Column(db.String(255), index=True, nullable=False)
    image_url = db.Column(db.Text, nullable=False)
    title = db.Column(db.String(255))
    description = db.Column(db.Text)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(IST).replace(tzinfo=None)
    )
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(IST).replace(tzinfo=None),
        onupdate=lambda: datetime.now(IST).replace(tzinfo=None)
    )

    def to_dict(self):
        return {
            'id': self.id,
            'project_application_number': self.project_application_number,
            'image_url': self.image_url,
            'title': self.title,
            'description': self.description,
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }