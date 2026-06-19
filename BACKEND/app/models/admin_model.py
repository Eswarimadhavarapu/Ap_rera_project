from app.models.database import db

class Admin(db.Model):
    __tablename__ = "admin_master_t"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    full_name = db.Column(db.String(100))
    email = db.Column(db.Text, unique=True, nullable=False)
    phone = db.Column(db.Text)
    department = db.Column(db.String(100))
    role = db.Column(db.String(50))
    employee_id = db.Column(db.String(50))
    photo = db.Column(db.String(500))
    state = db.Column(db.String(100))
    district = db.Column(db.String(100))
    mandal = db.Column(db.String(100))
    village = db.Column(db.String(100))
    pincode = db.Column(db.String(10))
    otp_hash = db.Column(db.String(255))
    otp_expiry = db.Column(db.DateTime)

    otp_request_count = db.Column(db.Integer, default=0)
    failed_otp_attempts = db.Column(db.Integer, default=0)

    locked_until = db.Column(db.DateTime)