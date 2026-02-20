from app import db

class PromoterOtherTINDV(db.Model):
    __tablename__ = "promoter_profile_other_t_indv"


    id = db.Column(db.Integer, primary_key=True)
    application_no = db.Column(db.String(50), unique=True, nullable=False)

    promoter_type = db.Column(db.String(50))
    type_of_promoter = db.Column(db.String(100))

    organization_name = db.Column(db.String(255))
    registration_number = db.Column(db.String(150))
    registration_date = db.Column(db.Date)
    gst_number = db.Column(db.String(20))
    pan_number = db.Column(db.String(20))

    authorized_signatory_mobile = db.Column(db.String(15))
    authorized_signatory_email = db.Column(db.String(100))
    authorized_signatory_landline = db.Column(db.String(15))
    website = db.Column(db.String(255))

    state = db.Column(db.String(100))
    district = db.Column(db.String(100))

    bank_state = db.Column(db.String(100))
    bank_name = db.Column(db.String(200))
    branch_name = db.Column(db.String(200))
    account_no = db.Column(db.String(20))
    account_holder = db.Column(db.String(200))
    ifsc_code = db.Column(db.String(20))

    other_state_reg = db.Column(db.String(10))
    last_five_years = db.Column(db.String(10))
    litigation = db.Column(db.String(10))
    promoter2 = db.Column(db.String(10))
