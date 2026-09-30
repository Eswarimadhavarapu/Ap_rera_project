from app.models.database import db
from datetime import datetime
import pytz

IST = pytz.timezone("Asia/Kolkata")

class ProjectRatingHistory(db.Model):
    __tablename__ = 'project_rating_history'

    id = db.Column(db.Integer, primary_key=True)
    rating_id = db.Column(db.Integer, index=True, nullable=False)
    old_rating = db.Column(db.Integer)
    new_rating = db.Column(db.Integer)
    old_review = db.Column(db.Text)
    new_review = db.Column(db.Text)
    changed_by = db.Column(db.Integer, nullable=False)
    changed_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(IST).replace(tzinfo=None)
    )

    def to_dict(self):
        return {
            'id': self.id,
            'rating_id': self.rating_id,
            'old_rating': self.old_rating,
            'new_rating': self.new_rating,
            'old_review': self.old_review,
            'new_review': self.new_review,
            'changed_by': self.changed_by,
            'changed_at': self.changed_at.isoformat() if self.changed_at else None
        }