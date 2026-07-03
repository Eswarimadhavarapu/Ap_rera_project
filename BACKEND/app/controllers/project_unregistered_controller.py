import os
from werkzeug.utils import secure_filename
from sqlalchemy import func
from datetime import date

UPLOAD_FOLDER = "uploads/ReraUnRegister_Documents"
from flask import Blueprint, request, jsonify, current_app
from app.models.database import db
from app.models.project_unregistered_model import ProjectUnregisteredDetails
import pandas as pd
import traceback
from app.utils.mail_service import send_email, send_email_with_attachment
from flask import send_from_directory
from app.utils.validation_schemas import validate_registration
project_unregistered_bp = Blueprint("project_unregistered", __name__)
from flask_jwt_extended import jwt_required,get_jwt_identity

COLUMN_MAP = {
    "s_no": ["s.no", "s no", "sno"],
    "district": ["district"],
    "organisation": ["organisation", "organization"],
    "ulb_uda_name": ["ulb/uda name", "ulb uda name"],
    "ba_no": ["ba no.", "ba no"],
    "proceeding_order_date": ["proceeding order date"],
    "approved_date": ["approved date", "flp approved on"],
    "fileno": ["fileno", "file no"],
    "lp_no": ["lp no.", "lp no"],
    "owner_name": ["owner name", "ownername"],
    "owner_mobile_no": ["owner mobile no.", "owner no."],
    "owner_email": ["owner email", "owner mail"],
    "owner_builder_address": ["owner/builder address", "owner address"],
    "building_address": ["building address"],
    "plot_area": ["plot area", "plotted area"],
    "site_area_acres": ["site area (in acres)"],
    "approved_bua": ["approved bua"],
    "housing_units": ["housing units"],
    "no_of_plots": ["no of plots"],
    "landuse_sub_category": ["landuse sub-category"],
    "sub_use": ["sub use"],
    "mandal_city": ["mandal/city"],
    "village_location": ["village/location"],
    "filestatus_vw": ["filestatus_vw", "flp status"],
    "is_ldcc_applied": ["is ldcc applied"],
    "ldcc_approved_on": ["ldcc approved on"],
}

SHEET_NAME_MAP = {
    "BUILDING": "Notice",  # 🔥 Read the "Notice" sheet for BUILDING uploads
    "LAYOUT": "Notice",  # adjust if LAYOUT uses a different sheet name
}

def normalize(x):
    return str(x).strip().lower() if x else ""


def build_header_index(headers):
    index = {}
    normalized = {normalize(h): h for h in headers}
    for db_col, aliases in COLUMN_MAP.items():
        for alias in aliases:
            if alias in normalized:
                index[db_col] = normalized[alias]
                break
    return index


def clean_value(v):
    if v is None:
        return None
    v = str(v).strip()
    if v.lower() in ["", "-", "na", "n/a", "approved", "nat"]:
        return None
    return v


def parse_int(v):
    try:
        return int(float(v)) if v else None
    except:
        return None


def parse_float(v):
    try:
        return float(v) if v else None
    except:
        return None


def parse_date(v):
    if not v:
        return None
    try:
        dt = pd.to_datetime(v, errors="coerce")
        if pd.isna(dt):
            return None
        return dt.date()
    except:
        return None


def parse_bool(v):
    if not v:
        return None
    return str(v).lower() in ["true", "1", "yes", "y"]


def row_to_record(row, header_index, project_type):

    def get(col):
        excel_col = header_index.get(col)
        return clean_value(row.get(excel_col)) if excel_col else None

    return {
        "s_no": parse_int(get("s_no")),
        "district": get("district"),
        "organisation": get("organisation"),
        "ulb_uda_name": get("ulb_uda_name"),
        "ba_no": get("ba_no"),
        "proceeding_order_date": parse_date(get("proceeding_order_date")),
        "approved_date": parse_date(get("approved_date")),
        "fileno": get("fileno"),
        "lp_no": get("lp_no"),
        "owner_name": get("owner_name"),
        "owner_mobile_no": get("owner_mobile_no"),
        "owner_email": get("owner_email"),
        "owner_builder_address": get("owner_builder_address"),
        "building_address": get("building_address"),
        "plot_area": parse_float(get("plot_area")),
        "site_area_acres": parse_float(get("site_area_acres")),
        "approved_bua": parse_float(get("approved_bua")),
        "housing_units": parse_int(get("housing_units")),
        "no_of_plots": parse_int(get("no_of_plots")),
        "landuse_sub_category": get("landuse_sub_category"),
        "sub_use": get("sub_use"),
        "mandal_city": get("mandal_city"),
        "village_location": get("village_location"),
        "filestatus_vw": get("filestatus_vw"),
        "is_ldcc_applied": parse_bool(get("is_ldcc_applied")),
        "ldcc_approved_on": parse_date(get("ldcc_approved_on")),
        "project_type": project_type,
    }


@project_unregistered_bp.route("/project-unregistered/upload-excel", methods=["POST"])
@jwt_required()
def upload_excel():
    try:
        file = request.files.get("file")
        project_type = request.form.get("project_type", "").upper()

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        if project_type not in ["BUILDING", "LAYOUT"]:
            return jsonify({"error": "project_type must be BUILDING or LAYOUT"}), 400
        xl = pd.ExcelFile(file)
        available_sheets = xl.sheet_names
        target_sheet = SHEET_NAME_MAP.get(project_type)

        if target_sheet not in available_sheets:
            # Fallback: if the named sheet doesn't exist, try sheet index 1 (second sheet)
            if len(available_sheets) > 1:
                target_sheet = available_sheets[1]
            else:
                target_sheet = available_sheets[0]

        print(f"Available sheets: {available_sheets}")
        print(f"Reading sheet: '{target_sheet}' for project_type={project_type}")

        df = pd.read_excel(xl, sheet_name=target_sheet, dtype=str)

        print("Before cleaning:", len(df))

        # Remove empty rows
        df = df.dropna(how="all")

        # Remove invalid S.NO rows
        sno_col = next(
            (c for c in df.columns if str(c).strip().upper() == "S.NO"), None
        )
        if sno_col:
            df = df[df[sno_col].notna()]
            df = df[df[sno_col].astype(str).str.strip() != ""]
            df = df[
                df[sno_col]
                .astype(str)
                .str.replace(".", "", regex=False)
                .str.strip()
                .str.isnumeric()
            ]

        print("After cleaning:", len(df))

        df = df.fillna("")
        df.columns = [str(c).strip() for c in df.columns]

        header_index = build_header_index(df.columns.tolist())

        inserted = 0
        skipped = 0

        for idx, row in df.iterrows():
            try:
                data = row_to_record(row.to_dict(), header_index, project_type)

                if not data.get("s_no"):
                    skipped += 1
                    continue

                record = ProjectUnregisteredDetails(**data)
                db.session.add(record)
                inserted += 1

            except Exception as e:
                print("Row error:", idx, e)
                skipped += 1

        db.session.commit()

        return jsonify(
            {
                "success": True,
                "inserted": inserted,
                "skipped": skipped,
                "sheet_used": target_sheet,
            }
        )

    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500


UPLOAD_FOLDER = "uploads/ReraUnRegister_Documents"


@project_unregistered_bp.route(
    "/project-unregistered/<int:record_id>", methods=["PATCH"]
)
@jwt_required()
def update_status(record_id):
    try:
        record = ProjectUnregisteredDetails.query.get(record_id)

        if not record:
            return jsonify({"success": False, "message": "Record not found"}), 404

        body = request.form
       
        first_notice_file = request.files.get("first_notice")
        second_notice_file = request.files.get("second_notice")
        rera_notice_file = request.files.get("rera_notice")
        sh_file = request.files.get("sh_document")

  
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        if first_notice_file:
            filename = secure_filename(first_notice_file.filename)

            save_path = os.path.join(UPLOAD_FOLDER, filename)

            first_notice_file.save(save_path)
            record.first_notice_doc_path = (
                f"uploads/ReraUnRegister_Documents/{filename}"
            )
        if second_notice_file:
            filename = secure_filename(second_notice_file.filename)

            save_path = os.path.join(UPLOAD_FOLDER, filename)

            second_notice_file.save(save_path)
            record.second_notice_doc_path = (
                f"uploads/ReraUnRegister_Documents/{filename}"
            )
            filename = secure_filename(rera_notice_file.filename)

            save_path = os.path.join(UPLOAD_FOLDER, filename)

            rera_notice_file.save(save_path)
            record.rera_personal_notice_doc_path = (
                f"uploads/ReraUnRegister_Documents/{filename}"
            )
        if sh_file:
            filename = secure_filename(sh_file.filename)

            save_path = os.path.join(UPLOAD_FOLDER, filename)

            sh_file.save(save_path)
            record.sh_document_path = f"uploads/ReraUnRegister_Documents/{filename}"
        patch_fields = [
            "approval_status",
            "s1_remarks",
            "s2_remarks",
            "s4_remarks",
            "s5_remarks",
            "aprera_register_status",
            "rera_registered",
            "rera_registration_no",
            "rera_register_no",
            "exemption_id",
            "secound_notice_sent_date",
            "first_notice_sent_date",
            "pan_number",
            "s1_authority_id",
            "s2_authority_id",
            "s4_authority_id",
            "s5_authority_id",
        ]

        for field in patch_fields:
            if field in body:
                setattr(record, field, body.get(field))

        db.session.commit()

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Updated with files",
                    "data": record.to_dict(),
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()

        current_app.logger.exception("Unexpected error")

        return jsonify({"success": False, "message": "Internal server error"}), 500


@project_unregistered_bp.route("/project-unregistered/<int:record_id>", methods=["GET"])
@jwt_required()
def get_single_record(record_id):
    try:
        record = ProjectUnregisteredDetails.query.get(record_id)
        if not record:
            return jsonify({"success": False, "message": "Record not found"}), 404
        return jsonify({"success": True, "data": record.to_dict()}), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Internal server error"}), 500


@project_unregistered_bp.route("/project-unregistered", methods=["GET"])
@jwt_required()
def get_all_records():
    identity = get_jwt_identity()
    try:
        # 🔹 Query Params
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))

        district = request.args.get("district")
        project_type = request.args.get("project_type")
        search = request.args.get("search")

        sort_by = request.args.get("sort_by", "id")  # default sort column
        order = request.args.get("order", "desc")  # asc / desc

        query = ProjectUnregisteredDetails.query
        if district:
            query = query.filter(
                func.lower(ProjectUnregisteredDetails.district).like(
                    f"%{district.lower()}%"
                )
            )

        if project_type:
            query = query.filter_by(project_type=project_type.upper())
        if search:
            search = f"%{search.lower()}%"
            query = query.filter(
                func.lower(ProjectUnregisteredDetails.owner_name).like(search)
                | func.lower(ProjectUnregisteredDetails.organisation).like(search)
                | func.lower(ProjectUnregisteredDetails.district).like(search)
            )
        if hasattr(ProjectUnregisteredDetails, sort_by):
            sort_column = getattr(ProjectUnregisteredDetails, sort_by)
        else:
            sort_column = ProjectUnregisteredDetails.id

        if order == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        data = [record.to_dict() for record in pagination.items]

        return (
            jsonify(
                {
                    "success": True,
                    "page": page,
                    "per_page": per_page,
                    "total_records": pagination.total,
                    "total_pages": pagination.pages,
                    "data": data,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"success": False, "message": "Internal server error"}), 500


@project_unregistered_bp.route(
    "/project-unregistered/send-notice-mail/<int:record_id>", methods=["POST"]
)
@jwt_required()
def send_notice_mail(record_id):
    try:
        record = ProjectUnregisteredDetails.query.get(record_id)

        if not record:
            return jsonify({"success": False, "message": "Record not found"}), 404

        # ================= FORM DATA =================
        email = request.form.get("email")
        remarks = request.form.get("remarks")
        subject = request.form.get("subject", "AP RERA Notice")

        # ================= FILES =================
        notice1 = request.files.get("notice1")
        notice2 = request.files.get("notice2")

        print("NOTICE1:", notice1)
        print("NOTICE2:", notice2)

        if not email:
            return jsonify({"success": False, "message": "Email required"}), 400

        if not notice1 and not notice2:
            return (
                jsonify({"success": False, "message": "Notice document required"}),
                400,
            )

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        file_path = None 

        if notice1:
            print("notice1 received")

            filename = secure_filename(notice1.filename)

            file_path = os.path.join(UPLOAD_FOLDER, filename)

            notice1.save(file_path)

            record.first_notice_sent_date = date.today()
            record.first_notice_doc_path = (
                f"uploads/ReraUnRegister_Documents/{filename}"
            )
            record.s2_remarks = remarks

  
            record.approval_status = "s4"

        # ================= SECOND NOTICE =================
        elif notice2:
            print("notice2 received")
            filename = secure_filename(notice2.filename)

            file_path = os.path.join(UPLOAD_FOLDER, filename)

            notice2.save(file_path)

            record.secound_notice_sent_date = date.today()

            record.rera_personal_notice_doc_path = (
                f"uploads/ReraUnRegister_Documents/{filename}"
            )
            record.s5_remarks = remarks
            record.approval_status = "s7"

        else:
            print("No file received")

      
        body = f"""
To  
The Project Owner / Promoter  

Subject: Notice for Non-Registration under AP RERA  

Dear Sir/Madam,  

It has come to the notice of Andhra Pradesh Real Estate Regulatory Authority (AP RERA) that your project has not been registered under the provisions of the Real Estate (Regulation and Development) Act, 2016.  

⚠️ Reason for Notice:
{remarks}

You are hereby directed to comply with RERA rules immediately.

Failure to comply will result in legal action.

Regards,  
AP RERA Authority  
"""

      
        send_email_with_attachment(
            email,
            subject,
            body,
            [file_path],
        )

        db.session.commit()

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Mail sent & status updated successfully",
                    "status": record.approval_status,
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        current_app.logger.exception("Unexpected error")
        return jsonify({"success": False, "message": "Internal server error"}), 500