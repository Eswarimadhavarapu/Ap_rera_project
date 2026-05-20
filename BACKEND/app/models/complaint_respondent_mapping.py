from app.models.database import db


class ComplaintRespondentMapping(db.Model):

    __tablename__ = "complaint_respondents"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    complaint_id = db.Column(
        db.BigInteger,
        db.ForeignKey("complaints.complaint_id"),
        nullable=False
    )

    respondent_id = db.Column(
        db.Integer,
        db.ForeignKey("respondents.respondent_id"),
        nullable=False
    )