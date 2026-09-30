from app.models.database import db
from datetime import datetime
import pytz

IST = pytz.timezone("Asia/Kolkata")

class ProjectRating(db.Model):
    __tablename__ = 'project_ratings'

    id = db.Column(db.Integer, primary_key=True)
    project_application_number = db.Column(db.String(255), index=True, nullable=False)
    director_user_id = db.Column(db.Integer, index=True, nullable=False)
    rating = db.Column(db.Integer)
    review = db.Column(db.Text)
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
            'director_user_id': self.director_user_id,
            'rating': self.rating,
            'review': self.review,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }