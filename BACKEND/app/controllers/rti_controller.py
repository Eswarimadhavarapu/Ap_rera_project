# app/controllers/rti_controller.py

from flask import Blueprint, request, jsonify, send_from_directory

from app.models.database import db

from app.models.rti_application import RTIApplication

from app.models.rti_application_assignments import RTIAssignment

from datetime import datetime
from app import mail
from flask_mail import Message
import os
import uuid
import random
otp_storage = {}
rti_bp = Blueprint("rti_bp", __name__)

BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads", "RTI")

os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================================================
# CREATE RTI APPLICATION
# =========================================================
@rti_bp.route("/rti/create", methods=["POST"])
def create_rti():

    try:

        data = request.form

        # =====================================================
        # SUPPORTING DOCUMENTS
        # =====================================================

        files = request.files.getlist("documents")

        uploaded_docs = []

        for file in files:

            if file:

                filename = f"{uuid.uuid4()}_{file.filename}"

                file_path = os.path.join(
                    UPLOAD_DIR,
                    filename
                )

                file.save(file_path)

                uploaded_docs.append({

                    "document_name": file.filename,

                    "document_path": f"uploads/RTI/{filename}"
                })

        # =====================================================
        # RECEIPT DOCUMENTS
        # =====================================================

        receipt_files = request.files.getlist(
            "receipt_document"
        )

        uploaded_receipts = []

        receipt_names = data.getlist(
            "receipt_document_name"
        )

        for index, file in enumerate(receipt_files):

            if file:

                filename = (
                    f"{uuid.uuid4()}_{file.filename}"
                )

                file_path = os.path.join(
                    UPLOAD_DIR,
                    filename
                )

                file.save(file_path)

                document_name = ""

                if index < len(receipt_names):

                    document_name = receipt_names[index]

                uploaded_receipts.append({

                    "document_name": document_name,

                    "original_file_name": file.filename,

                    "document_path": (
                        f"uploads/RTI/{filename}"
                    )
                })

        # =====================================================
        # CREATE APPLICATION
        # =====================================================

        application = RTIApplication(

            rti_number=f"RTI-{uuid.uuid4().hex[:8]}",

            application_type=data.get(
                "application_type"
            ),

            applicant_name=data.get(
                "applicant_name"
            ),

            gender=data.get(
                "gender"
            ),

            address_line1=data.get(
                "address_line1"
            ),

            address_line2=data.get(
                "address_line2"
            ),

            pincode=data.get(
                "pincode"
            ),

            locality_type=data.get(
                "locality_type"
            ),

            education_status=data.get(
                "education_status"
            ),

            phone_number=data.get(
                "phone_number"
            ),

            alter_mobile_number=data.get(
                "alter_mobile_number"
            ),

            email_id=data.get(
                "email_id"
            ),

            citizenship=data.get(
                "citizenship"
            ),

            mode_of_information=data.get(
                "mode_of_information"
            ),

            below_poverty_line=data.get(
                "below_poverty_line"
            ),

            subject=data.get(
                "subject"
            ),

            rti_request_text=data.get(
                "rti_request_text"
            ),

            supporting_document_name=uploaded_docs,

            status="SUBMITTED",

            application_submitted_date=datetime.now(),

            # =================================================
            # PAYMENT DETAILS
            # =================================================

            payment_transaction_id=data.get(
                "payment_transaction_id"
            ),

            payment_order_id=data.get(
                "payment_order_id"
            ),

            payment_amount=data.get(
                "payment_amount"
            ),

            payment_status=data.get(
                "payment_status"
            ),

            payment_mode=data.get(
                "payment_mode"
            ),

            bank_name=data.get(
                "bank_name"
            ),

            payment_date=datetime.now(),

            payment_response={

                "gateway_response": data.get(
                    "gateway_response"
                ),

                "transaction_message": data.get(
                    "transaction_message"
                )
            },

            receipt_number=data.get(
                "receipt_number"
            ),

            receipt_document=uploaded_receipts
        )

        db.session.add(application)

        db.session.commit()

        return jsonify({

            "status": "success",

            "message": "RTI Application submitted successfully",

            "application_id": application.id,

            "rti_number": application.rti_number
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({

            "status": "error",

            "message": str(e)
        }), 500

# =========================================================
# ASSIGN MULTIPLE DEPARTMENTS
# =========================================================

@rti_bp.route("/rti/assign", methods=["POST"])
def assign_rti():

    try:

        data = request.get_json()

        rti_application_id = data.get("rti_application_id")

        assigned_by_id = data.get("assigned_by_id")

        assignments = data.get("assignments", [])

        saved_assignments = []

        for item in assignments:

            assignment = RTIAssignment(

                rti_application_id=rti_application_id,

                assigned_department=item.get("assigned_department"),

                assigned_to_id=item.get("assigned_to_id"),

                assigned_by_id=assigned_by_id,

                assignment_status="ASSIGNED"
            )

            db.session.add(assignment)

            saved_assignments.append({

                "department": item.get("assigned_department"),

                "assigned_to_id": item.get("assigned_to_id")
            })

        application = RTIApplication.query.get(
            rti_application_id
        )

        if application:

            application.status = "ASSIGNED"

            application.assigned_date = datetime.now()

        db.session.commit()

        return jsonify({

            "status": "success",

            "message": "Departments assigned successfully",

            "assignments": saved_assignments
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({

            "status": "error",

            "message": str(e)
        }), 500

# =========================================================
# GET COMPLETE RTI DETAILS WITH ALL DEPARTMENTS
# =========================================================
@rti_bp.route("/rti/<int:id>", methods=["GET"])
def get_rti(id):

    try:

        application = RTIApplication.query.get(id)

        if not application:

            return jsonify({

                "status": "error",

                "message": "Application not found"
            }), 404

        assignments = RTIAssignment.query.filter_by(
            rti_application_id=id
        ).all()

        assignment_data = []

        for item in assignments:

            assignment_data.append({

                "assignment_id": item.id,

                "rti_application_id": item.rti_application_id,

                "assigned_department": item.assigned_department,

                "assigned_to_id": item.assigned_to_id,
                "rti_document": item.rti_document,
                "rti_comments": item.rti_comments,

                "assigned_by_id": item.assigned_by_id,

                "assigned_date": item.assigned_date,

                "assignment_status": item.assignment_status,

                "reply_comments": item.reply_comments,

                "reply_document": item.reply_document,

                "replied_by_id": item.replied_by_id,

                "replied_date": item.replied_date,

                "is_active": item.is_active,

                "created_on": item.created_on
            })

        return jsonify({

            "status": "success",

            "data": {

                "id": application.id,

                "rti_number": application.rti_number,

                "application_type": application.application_type,

                "applicant_name": application.applicant_name,

                "gender": application.gender,

                "address_line1": application.address_line1,

                "address_line2": application.address_line2,

                "pincode": application.pincode,

                "locality_type": application.locality_type,

                "education_status": application.education_status,

                "phone_number": application.phone_number,

                "alter_mobile_number": application.alter_mobile_number,

                "email_id": application.email_id,

                "citizenship": application.citizenship,

                "mode_of_information": application.mode_of_information,

                "below_poverty_line": application.below_poverty_line,

                "subject": application.subject,

                "rti_request_text": application.rti_request_text,

                "supporting_document_name": application.supporting_document_name,

                "status": application.status,

                "application_comment": application.application_comment,

                "reply_comment": application.reply_comment,

                "reply_text": application.reply_text,

                "reply_document": application.reply_document,

                "assigned_department_name": application.assigned_department_name,

                "assigned_to_authority_id": application.assigned_to_authority_id,

                "assigned_by_id": application.assigned_by_id,

                "replied_from_authority_id": application.replied_from_authority_id,

                "application_coming_from_rti": application.application_coming_from_rti,

                "application_received_date": application.application_received_date,

                "application_submitted_date": application.application_submitted_date,

                "assigned_date": application.assigned_date,

                "authority_replied_date": application.authority_replied_date,

                "replied_rti_date": application.replied_rti_date,

                "current_handler_role": application.current_handler_role,

                "priority_level": application.priority_level,

                "is_active": application.is_active,

                "is_deleted": application.is_deleted,

                "created_by": application.created_by,

                "created_on": application.created_on,

                "updated_by": application.updated_by,

                "updated_on": application.updated_on,

                "apio_id": application.apio_id,

                "apio_comments": application.apio_comments,

                "application_coming_to_apio_date": application.application_coming_to_apio_date,

                "apio_replied_date": application.apio_replied_date,

                "pio_id": application.pio_id,

                "pio_comments": application.pio_comments,

                "application_coming_to_pio_date": application.application_coming_to_pio_date,

                "pio_replied_date": application.pio_replied_date,

                "dd_id": application.dd_id,

                "dd_comments": application.dd_comments,

                "dd_replied_date": application.dd_replied_date,

                "payment_transaction_id": application.payment_transaction_id,

                "payment_order_id": application.payment_order_id,

                "payment_amount": application.payment_amount,

                "payment_status": application.payment_status,

                "payment_mode": application.payment_mode,

                "bank_name": application.bank_name,

                "payment_date": application.payment_date,

                "payment_response": application.payment_response,

                "receipt_number": application.receipt_number,

                "receipt_document": application.receipt_document,

                "department_assignments": assignment_data
            }
        })

    except Exception as e:

        return jsonify({

            "status": "error",

            "message": str(e)
        }), 500

# =========================================================
# GET ALL RTI APPLICATIONS
# =========================================================

@rti_bp.route("/rti/list", methods=["GET"])
def list_rti():

    try:

        page = int(
            request.args.get("page", 1)
        )

        status = request.args.get("status")

        query = RTIApplication.query

        if status:

            query = query.filter(
                RTIApplication.status == status
            )

        pagination = query.order_by(
            RTIApplication.id.desc()
        ).paginate(
            page=page,
            per_page=10,
            error_out=False
        )

        data = []

        for app in pagination.items:

            data.append({

                "application_id": app.id,

                "rti_number": app.rti_number,

                "applicant_name": app.applicant_name,

                "status": app.status,

                "email_id": app.email_id,

                "submitted_date": app.application_submitted_date
            })

        return jsonify({

            "status": "success",

            "page": page,

            "total": pagination.total,

            "data": data
        })

    except Exception as e:

        return jsonify({

            "status": "error",

            "message": str(e)
        }), 500


# =========================================================
# DOCUMENT VIEW
# =========================================================

@rti_bp.route("/rti/document/<path:filename>", methods=["GET"])
def view_document(filename):

    return send_from_directory(

        UPLOAD_DIR,

        filename,

        as_attachment=False
    )


@rti_bp.route("/rti/send-email-otp", methods=["POST"])
def send_email_otp():

    try:

        data = request.get_json()

        email = data.get("email")

        if not email:

            return jsonify({

                "status": "error",

                "message": "Email is required"
            }), 400

        otp = random.randint(100000, 999999)

        otp_storage[email] = str(otp)

        msg = Message(

            subject="RTI Email Verification OTP",

            recipients=[email],

            body=f"""
Dear User,

Your OTP for RTI email verification is:

{otp}

This OTP is valid for 5 minutes.

Thank You
RTI Department
"""
        )

        mail.send(msg)

        return jsonify({

            "status": "success",

            "message": "OTP sent successfully"
        })

    except Exception as e:

        return jsonify({

            "status": "error",

            "message": str(e)
        }), 500


# =========================================================
# VERIFY EMAIL OTP API
# =========================================================

@rti_bp.route("/rti/verify-email-otp", methods=["POST"])
def verify_email_otp():

    try:

        data = request.get_json()

        email = data.get("email")

        otp = data.get("otp")

        saved_otp = otp_storage.get(email)

        if not saved_otp:

            return jsonify({

                "status": "error",

                "message": "OTP not found"
            }), 404

        if saved_otp != otp:

            return jsonify({

                "status": "error",

                "message": "Invalid OTP"
            }), 400

        del otp_storage[email]

        return jsonify({

            "status": "success",

            "message": "OTP verified successfully"
        })

    except Exception as e:

        return jsonify({

            "status": "error",

            "message": str(e)
        }), 500
@rti_bp.route("/rti/updates/<int:id>", methods=["PATCH"])
def update_rti(id):

    try:

        application = RTIApplication.query.get(id)

        if not application:

            return jsonify({

                "status": "error",

                "message": "Application not found"
            }), 404

        data = request.form

        # =====================================================
        # MULTIPLE REPLY DOCUMENTS
        # =====================================================

        reply_files = request.files.getlist(
            "reply_document"
        )

        uploaded_reply_docs = []

        document_names = data.getlist(
            "reply_document_name"
        )

        for index, file in enumerate(reply_files):

            if file:

                filename = (
                    f"{uuid.uuid4()}_{file.filename}"
                )

                file_path = os.path.join(
                    UPLOAD_DIR,
                    filename
                )

                file.save(file_path)

                document_name = ""

                if index < len(document_names):

                    document_name = document_names[index]

                uploaded_reply_docs.append({

                    "document_name": document_name,

                    "original_file_name": file.filename,

                    "document_path": (
                        f"uploads/RTI/{filename}"
                    )
                })

        # =====================================================
        # STORE ONLY PATHS IN DB
        # =====================================================

        if uploaded_reply_docs:

            existing_docs = (
                application.reply_document or []
            )

            application.reply_document = (
                existing_docs + uploaded_reply_docs
            )

        # =====================================================
        # DYNAMIC FIELD UPDATE
        # =====================================================

        fields = [

            "status",

            "reply_comment",

            "reply_text",

            "assigned_to_authority_id",

            "replied_from_authority_id",

            "rti_replaid_person_id",

            "apio_id",

            "apio_comments",

            "pio_id",

            "pio_comments",

            "dd_id",

            "dd_comments",

            "assigned_department_name",

            "current_handler_role",

            "priority_level"
        ]

        for field in fields:

            value = data.get(field)

            if value is not None:

                setattr(
                    application,
                    field,
                    value
                )

        # =====================================================
        # DATE FIELDS
        # =====================================================

        application.application_received_date = (
            datetime.now()
        )

        application.assigned_date = (
            datetime.now()
        )

        application.authority_replied_date = (
            datetime.now()
        )

        application.replied_rti_date = (
            datetime.now()
        )

        application.updated_on = (
            datetime.now()
        )

        # =====================================================
        # OPTIONAL APIO DATES
        # =====================================================

        if data.get("application_coming_to_apio_date"):

            application.application_coming_to_apio_date = (
                datetime.now()
            )

        if data.get("apio_replied_date"):

            application.apio_replied_date = (
                datetime.now()
            )

        if data.get("application_coming_to_pio_date"):

            application.application_coming_to_pio_date = (
                datetime.now()
            )

        if data.get("pio_replied_date"):

            application.pio_replied_date = (
                datetime.now()
            )

        if data.get("dd_replied_date"):

            application.dd_replied_date = (
                datetime.now()
            )

        db.session.commit()

        return jsonify({

            "status": "success",

            "message": "RTI updated successfully",

            "data": {

                "id": application.id,

                "status": application.status,

                "reply_comment": application.reply_comment,

                "reply_document": application.reply_document
            }
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({

            "status": "error",

            "message": str(e)
        }), 500
@rti_bp.route("/rti/send-return_application/<int:id>", methods=["PATCH"])
def send_rti_reply(id):

    try:

        application = RTIApplication.query.get(id)

        if not application:

            return jsonify({
                "status": "error",
                "message": "Application not found"
            }), 404

        data = request.form

        email = data.get("email")

        rti_replaid_person_id = data.get(
            "rti_replaid_person_id"
        )

        status = data.get("status")

        reply_comment = data.get("reply_comment")

        # =========================================
        # UPDATE DATABASE
        # =========================================

        application.rti_replaid_person_id = (
            rti_replaid_person_id
        )

        application.status = status

        application.reply_comment = reply_comment

        application.replied_rti_date = datetime.now()

        application.updated_on = datetime.now()

        # =========================================
        # SEND EMAIL
        # =========================================

        msg = Message(

            subject="RTI Application Reply",

            recipients=[email],

            body=f"""
Dear Applicant,

Your RTI application has been updated.

Status:
{status}

Reply Comment:
{reply_comment}

Thank You
RTI Department
"""
        )

        mail.send(msg)

        db.session.commit()

        return jsonify({

            "status": "success",

            "message": "RTI updated and mail sent successfully"
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({

            "status": "error",

            "message": str(e)
        }), 500

@rti_bp.route("/rti/assignment/create", methods=["POST"])
def create_assignments():

    try:

        inserted_rows = []

        index = 0

        while True:

            rti_application_id = request.form.get(
                f"assignments[{index}][rti_application_id]"
            )

            if not rti_application_id:
                break

            assigned_department = request.form.get(
                f"assignments[{index}][assigned_department]"
            )

            assigned_by_id = request.form.get(
                f"assignments[{index}][assigned_by_id]"
            )

            rti_comments = request.form.get(
                f"assignments[{index}][rti_comments]"
            )

            rti_file = request.files.get(
                f"assignments[{index}][rti_document]"
            )

            document_path = None

            if rti_file:

                filename = (
                    f"{uuid.uuid4()}_{rti_file.filename}"
                )

                file_path = os.path.join(
                    UPLOAD_DIR,
                    filename
                )

                rti_file.save(file_path)

                # STORE ONLY PATH

                document_path = (
                    f"uploads/RTI/{filename}"
                )

            assignment = RTIAssignment(

                rti_application_id=rti_application_id,

                assigned_department=assigned_department,

                assigned_by_id=assigned_by_id,

                assigned_date=datetime.now(),

                rti_document=document_path,

                rti_comments=rti_comments
            )

            db.session.add(assignment)

            db.session.flush()

            inserted_rows.append({

                "id": assignment.id,

                "department": assigned_department
            })

            index += 1

        db.session.commit()

        return jsonify({

            "status": "success",

            "inserted_rows": inserted_rows
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({

            "status": "error",

            "message": str(e)
        }), 500
        
@rti_bp.route("/rti/assignment/update/<int:id>", methods=["PATCH"])
def update_assignment(id):

    try:

        assignment = RTIAssignment.query.get(id)

        if not assignment:

            return jsonify({

                "status": "error",

                "message": "Assignment not found"
            }), 404

        data = request.form

        # =====================================================
        # HANDLE REPLY DOCUMENT
        # =====================================================

        reply_file = request.files.get("reply_document")

        if reply_file:

            filename = f"{uuid.uuid4()}_{reply_file.filename}"

            file_path = os.path.join(
                UPLOAD_DIR,
                filename
            )

            reply_file.save(file_path)

            assignment.reply_document = {

                "document_name": reply_file.filename,

                "document_path": f"uploads/RTI/{filename}"
            }

        # =====================================================
        # HANDLE RTI DOCUMENT
        # =====================================================

        rti_file = request.files.get("rti_document")

        if rti_file:

            filename = f"{uuid.uuid4()}_{rti_file.filename}"

            file_path = os.path.join(
                UPLOAD_DIR,
                filename
            )

            rti_file.save(file_path)

            # STORE ONLY PATH

            assignment.rti_document = (
                f"uploads/RTI/{filename}"
            )

        # =====================================================
        # DYNAMIC FIELD UPDATE
        # =====================================================

        fields = [

            "rti_application_id",

            "assigned_department",

            "assigned_to_id",

            "assigned_by_id",

            "assignment_status",

            "reply_comments",

            "replied_by_id",

            "rti_comments",

            "is_active"
        ]

        for field in fields:

            value = data.get(field)

            if value is not None:

                setattr(
                    assignment,
                    field,
                    value
                )

        # =====================================================
        # DATE UPDATE
        # =====================================================

        assignment.replied_date = datetime.now()

        db.session.commit()

        return jsonify({

            "status": "success",

            "message": "Assignment updated successfully",

            "data": {

                "id": assignment.id,

                "rti_application_id": assignment.rti_application_id,

                "assigned_department": assignment.assigned_department,

                "assigned_to_id": assignment.assigned_to_id,

                "assigned_by_id": assignment.assigned_by_id,

                "assigned_date": assignment.assigned_date,

                "assignment_status": assignment.assignment_status,

                "reply_comments": assignment.reply_comments,

                "reply_document": assignment.reply_document,

                "replied_by_id": assignment.replied_by_id,

                "rti_document": assignment.rti_document,

                "rti_comments": assignment.rti_comments,

                "replied_date": assignment.replied_date,

                "is_active": assignment.is_active,

                "created_on": assignment.created_on
            }
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({

            "status": "error",

            "message": str(e)
        }), 500

# =========================================================
# GET ALL ASSIGNMENTS BY RTI_APPLICATION_ID
# =========================================================

@rti_bp.route(
    "/rti/assignments/<int:rti_application_id>",
    methods=["GET"]
)
def get_assignments_by_rti_id(rti_application_id):

    try:

        assignments = RTIAssignment.query.filter_by(
            rti_application_id=rti_application_id
        ).all()

        if not assignments:

            return jsonify({

                "status": "error",

                "message": "No assignments found"
            }), 404

        data = []

        for item in assignments:

            data.append({

                "id": item.id,

                "rti_application_id": item.rti_application_id,

                "assigned_department": item.assigned_department,

                "assigned_to_id": item.assigned_to_id,

                "assigned_by_id": item.assigned_by_id,

                "assigned_date": item.assigned_date,

                "assignment_status": item.assignment_status,

                "reply_comments": item.reply_comments,

                "reply_document": item.reply_document,

                "replied_by_id": item.replied_by_id,

                "rti_document": item.rti_document,

                "rti_comments": item.rti_comments,

                "replied_date": item.replied_date,

                "is_active": item.is_active,

                "created_on": item.created_on
            })

        return jsonify({

            "status": "success",

            "total_rows": len(data),

            "data": data
        })

    except Exception as e:

        return jsonify({

            "status": "error",

            "message": str(e)
        }), 500

# =========================================================
# GET ASSIGNMENTS BY ASSIGNED_DEPARTMENT
# =========================================================

@rti_bp.route(
    "/rti/assignments/department/<string:department>",
    methods=["GET"]
)
def get_assignments_by_department(department):

    try:

        assignments = RTIAssignment.query.filter_by(
            assigned_department=department
        ).all()

        if not assignments:

            return jsonify({

                "status": "error",

                "message": "No assignments found"
            }), 404

        data = []

        for item in assignments:

            data.append({

                "id": item.id,

                "rti_application_id": item.rti_application_id,

                "assigned_department": item.assigned_department,

                "assigned_to_id": item.assigned_to_id,

                "assigned_by_id": item.assigned_by_id,

                "assigned_date": item.assigned_date,

                "assignment_status": item.assignment_status,

                "reply_comments": item.reply_comments,

                "reply_document": item.reply_document,

                "replied_by_id": item.replied_by_id,

                "rti_document": item.rti_document,

                "rti_comments": item.rti_comments,

                "replied_date": item.replied_date,

                "is_active": item.is_active,

                "created_on": item.created_on
            })

        return jsonify({

            "status": "success",

            "total_rows": len(data),

            "department": department,

            "data": data
        })

    except Exception as e:

        return jsonify({

            "status": "error",

            "message": str(e)
        }), 500