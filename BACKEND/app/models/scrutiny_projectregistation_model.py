from datetime import datetime

from sqlalchemy import text

from app.models.database import db


def _normalize_project_type(value):
    if value in (1, "1"):
        return "Residential"
    if value in (2, "2"):
        return "Commercial"
    if value in (3, "3"):
        return "Mixed Development"
    return value or "N/A"


def _normalize_project_status(value):
    return value or "Under Scrutiny"


def _normalize_promoter_type(value):
    return "Organization" if (value or "").lower() == "other" else "Individual"


def _build_scrutiny_label(promoter_type):
    return "S1" if (promoter_type or "").lower() == "other" else "S2"


def _build_review_desk():
    return "Technical Committee"


def _serialize_row(row):
    promoter_type = row["promoter_type"]
    return {
        "application_no": row["application_no"],
        "promoter_type": promoter_type,
        "promoter_display": _normalize_promoter_type(promoter_type),
        "applicant_name": row["applicant_name"],
        "mobile": row["mobile"],
        "email": row["email"],
        "project_name": row["project_name"] or "Pending project details",
        "project_type": _normalize_project_type(row["project_type"]),
        "project_status": _normalize_project_status(row["project_status"]),
        "project_cost": row["project_cost"],
        "district": row["district"] or "N/A",
        "status": "PENDING",
        "created_at": str(row["created_at"]) if row["created_at"] else None,
        "scrutiny_label": _build_scrutiny_label(promoter_type),
        "review_desk": _build_review_desk(),
        "wizard": {},
        "preview": {},
    }

def get_scrutiny_project_registrations(dept=None):

    condition1 = ""
    condition2 = ""
    
    # Assistant Director (AD) gets these districts. Deputy Director (DD) gets the rest.
    # Note: "Vijayawada" is part of "NTR" district.
    ad_districts = [
        "Alluri Sitharama Raju",
        "Anakapalli",
        "Anantapuramu",
        "Annamayya",
        "Bapatla",
        "Chittoor",
        "Dr. B.R. Ambedkar Konaseema",
        "East Godavari",
        "Eluru",
        "Guntur",
        "Kakinada",
        "Krishna",
        "NTR" # This handles Vijayawada
    ]
    ad_districts_str = ", ".join([f"UPPER('{d}')" for d in ad_districts])

    dept_key = str(dept or "").strip().lower()

    if dept_key and dept_key != "verification":
        required_verification_condition = "LOWER(v.verified_by) = 'verification'"
        is_ad = dept_key in ["ad", "assistant director"]
        is_dd = dept_key in ["dd", "deputy director"]
        is_director = dept_key in ["director", "dir"]
        is_chairman = dept_key in ["chairman", "chairperson"]

        if is_ad or is_dd:
            required_verification_condition = "LOWER(v.verified_by) = 'planning'"
        elif is_director:
            required_verification_condition = "LOWER(v.verified_by) IN ('ad', 'dd', 'assistant director', 'deputy director')"
        elif is_chairman:
            required_verification_condition = (
                "LOWER(v.verified_by) = 'director' "
                "AND LOWER(CAST(v.is_shortfall AS TEXT)) IN ('false', 'no', '0')"
            )

        condition1 = f"""
        AND EXISTS (
            SELECT 1 
            FROM verification_final_status v
            WHERE TRIM(v.application_no) = TRIM(preg.application_no)
            AND v.status = 'verified'
            AND {required_verification_condition}
        )
        """
        
        condition2 = f"""
        AND EXISTS (
            SELECT 1 
            FROM verification_final_status v
            WHERE TRIM(v.application_no) = TRIM(ppo.application_no)
            AND v.status = 'verified'
            AND {required_verification_condition}
        )
        """

        if is_ad:
            condition1 += f"\n        AND UPPER(preg.district) IN ({ad_districts_str})"
            condition2 += f"\n        AND UPPER(ppo.district) IN ({ad_districts_str})"
        elif is_dd:
            condition1 += f"\n        AND (UPPER(preg.district) NOT IN ({ad_districts_str}) OR preg.district IS NULL)"
            condition2 += f"\n        AND (UPPER(ppo.district) NOT IN ({ad_districts_str}) OR ppo.district IS NULL)"
        elif is_chairman:
            condition1 += """
        AND NOT EXISTS (
            SELECT 1
            FROM verification_final_status chairman_status
            WHERE TRIM(chairman_status.application_no) = TRIM(preg.application_no)
              AND LOWER(chairman_status.verified_by) = 'chairman'
        )
        """
            condition2 += """
        AND NOT EXISTS (
            SELECT 1
            FROM verification_final_status chairman_status
            WHERE TRIM(chairman_status.application_no) = TRIM(ppo.application_no)
              AND LOWER(chairman_status.verified_by) = 'chairman'
        )
        """

    query = text(f"""
        SELECT
            preg.application_no AS application_no,
            'individual' AS promoter_type,
            preg.name AS applicant_name,
            preg.mobile AS mobile,
            preg.email AS email,
            pr.project_name AS project_name,
            pr.project_type AS project_type,
            pr.project_status AS project_status,
            pr.total_project_cost AS project_cost,
            preg.district AS district,
            preg.created_at AS created_at
        FROM project_registrations preg
        LEFT JOIN project_registration pr
          ON pr.application_number = preg.application_no
         AND pr.pan_number = preg.pan_number

        WHERE COALESCE(LOWER(preg.promoter_type), 'individual') <> 'other'
        {condition1}

        UNION ALL

        SELECT
            ppo.application_no AS application_no,
            'other' AS promoter_type,
            COALESCE(ppo.organization_name, ppo.type_of_promoter, 'Organization') AS applicant_name,
            ppo.authorized_signatory_mobile AS mobile,
            ppo.authorized_signatory_email AS email,
            opr.project_name AS project_name,
            opr.project_type AS project_type,
            opr.project_status AS project_status,
            opr.total_project_cost AS project_cost,
            ppo.district AS district,
            NULL AS created_at
        FROM promoter_profile_other_t_indv ppo
        LEFT JOIN othertheninduvidual_project_registration opr
          ON opr.application_number = ppo.application_no
         AND opr.pan_number = ppo.pan_number

        WHERE 1=1
        {condition2}
        ORDER BY application_no DESC
    """)

    rows = db.session.execute(query).mappings().all()
    return [_serialize_row(row) for row in rows]

def get_scrutiny_project_registration_by_application(application_no, promoter_type):
    promoter_type = (promoter_type or "").lower()

    if promoter_type == "other":
        query = text(
            """
            SELECT
                ppo.application_no AS application_no,
                'other' AS promoter_type,
                COALESCE(ppo.organization_name, ppo.type_of_promoter, 'Organization') AS applicant_name,
                ppo.authorized_signatory_mobile AS mobile,
                ppo.authorized_signatory_email AS email,
                opr.project_name AS project_name,
                opr.project_type AS project_type,
                opr.project_status AS project_status,
                opr.total_project_cost AS project_cost,
                ppo.district AS district,
                NULL AS created_at
            FROM promoter_profile_other_t_indv ppo
            LEFT JOIN othertheninduvidual_project_registration opr
              ON opr.application_number = ppo.application_no
             AND opr.pan_number = ppo.pan_number
            WHERE ppo.application_no = :application_no
            LIMIT 1
            """
        )
    else:
        query = text(
            """
            SELECT
                preg.application_no AS application_no,
                'individual' AS promoter_type,
                preg.name AS applicant_name,
                preg.mobile AS mobile,
                preg.email AS email,
                pr.project_name AS project_name,
                pr.project_type AS project_type,
                pr.project_status AS project_status,
                pr.total_project_cost AS project_cost,
                preg.district AS district,
                preg.created_at AS created_at
            FROM project_registrations preg
            LEFT JOIN project_registration pr
              ON pr.application_number = preg.application_no
             AND pr.pan_number = preg.pan_number
            WHERE preg.application_no = :application_no
            LIMIT 1
            """
        )

    row = db.session.execute(query, {"application_no": application_no}).mappings().first()
    if not row:
        return None

    return _serialize_row(row)


# -----------------create file posting api ------------------
# ----------------------------------------------------------------


def _clean_optional(value):
    if value is None:
        return None
    if isinstance(value, str):
        value = value.strip()
        return value or None
    return value


def create_scrutiny_file(data):
    query = text(
        """
        INSERT INTO scrutiny_all (
            file_number,
            inward_no,
            memo_number,
            file_date,
            "type",
            from_where,
            to_whom,
            assign_to,
            description,
            remarks,
            document_desc,
            file_path
        )
        VALUES (
            :file_number,
            :inward_no,
            :memo_number,
            :file_date,
            :type,
            :from_where,
            :to_whom,
            :assign_to,
            :description,
            :remarks,
            :document_desc,
            :file_path
        )
        RETURNING
            id,
            file_number,
            inward_no,
            memo_number,
            file_date,
            "type" AS type,
            from_where,
            to_whom,
            assign_to,
            description,
            remarks,
            document_desc,
            file_path,
            created_at
        """
    )

    params = {
        "file_number": data.get("file_number"),
        "inward_no": data.get("inward_no"),
        "memo_number": _clean_optional(data.get("memo_number")),
        "file_date": data.get("file_date"),
        "type": data.get("type"),
        "from_where": data.get("from_where"),
        "to_whom": data.get("to_whom"),
        "assign_to": data.get("assign_to"),
        "description": data.get("description"),
        "remarks": _clean_optional(data.get("remarks")),
        "document_desc": _clean_optional(data.get("document_desc")),
        "file_path": _clean_optional(data.get("file_path")),
    }

    row = db.session.execute(query, params).mappings().first()
    db.session.commit()

    return dict(row) if row else None


# ---------------- fpms dashboard  get api ------------------
# ------------------------------------------------------------


def get_scrutiny_fpms_dashboard_data():
    summary_query = text(
        """
        SELECT COUNT(*) AS total_files
        FROM scrutiny_all
        """
    )

    files_query = text(
        """
        SELECT
            id,
            file_number,
            inward_no,
            memo_number,
            file_date,
            "type" AS received_through,
            from_where,
            to_whom,
            assign_to,
            description,
            remarks,
            document_desc,
            file_path,
            created_at
        FROM scrutiny_all
        ORDER BY created_at DESC, id DESC
        """
    )

    summary_row = db.session.execute(summary_query).mappings().first()
    file_rows = db.session.execute(files_query).mappings().all()

    total_files = int(summary_row["total_files"] or 0) if summary_row else 0

    rows = []
    for index, row in enumerate(file_rows, start=1):
        rows.append(
            {
                "id": row["id"],
                "s_no": index,
                "file_number": row["file_number"],
                "inward_no": row["inward_no"],
                "memo_number": row["memo_number"],
                "file_date": str(row["file_date"]) if row["file_date"] else None,
                "file_description": row["description"],
                "received_through": row["received_through"],
                "from_where": row["from_where"],
                "to_whom": row["to_whom"],
                "assign_to": row["assign_to"],
                "file_assigned_date": (
                    str(row["created_at"]) if row["created_at"] else str(row["file_date"]) if row["file_date"] else None
                ),
                "status": "Created",
                "remarks": row["remarks"],
                "document_desc": row["document_desc"],
                "file_path": row["file_path"],
                "created_at": str(row["created_at"]) if row["created_at"] else None,
            }
        )

    return {
        "summary": {
            "total_files": total_files,
            "open_files": total_files,
            "closed_files": 0,
        },
        "rows": rows,
    }


# ------------------remarks api ----------------------
# ---------------------------------------------------


def create_verification_remark(data):
    query = text(
        """
        INSERT INTO verification_remarks (
            application_no,
            document_name,
            verification_team,
            is_shortfall,
            status,
            remarks,
            document_path,
            verified_by,
            updated_at
        )
        VALUES (
            :application_no,
            :document_name,
            :verification_team,
            :is_shortfall,
            :status,
            :remarks,
            :document_path,
            :verified_by,
            CURRENT_TIMESTAMP
        )
        RETURNING
            id,
            application_no,
            document_name,
            verification_team,
            is_shortfall,
            status,
            remarks,
            document_path,
            created_at,
            updated_at,
            verified_by
        """
    )

    params = {
        "application_no": data.get("application_no"),
        "document_name": data.get("document_name"),
        "verification_team": data.get("verification_team"),
        "is_shortfall": bool(data.get("is_shortfall", False)),
        "status": data.get("status") or "pending",
        "remarks": _clean_optional(data.get("remarks")),
        "document_path": _clean_optional(data.get("document_path")),
        "verified_by": _clean_optional(data.get("verified_by")),
    }

    row = db.session.execute(query, params).mappings().first()
    db.session.commit()

    return dict(row) if row else None

# ------------------remarks get api ----------------------
# ---------------------------------------------------


def get_verification_remarks(application_no, document_name=None, verification_team=None):
    query = text(
        """
        SELECT
            id,
            application_no,
            document_name,
            verification_team,
            is_shortfall,
            status,
            remarks,
            document_path,
            created_at,
            updated_at,
            verified_by
        FROM verification_remarks
        WHERE application_no = :application_no
          AND (:document_name IS NULL OR document_name = :document_name)
          AND (:verification_team IS NULL OR verification_team = :verification_team)
        ORDER BY created_at DESC, id DESC
        """
    )

    params = {
        "application_no": application_no,
        "document_name": _clean_optional(document_name),
        "verification_team": _clean_optional(verification_team),
    }

    rows = db.session.execute(query, params).mappings().all()
    return [dict(row) for row in rows]


def get_final_shortfall_remarks(application_no):
    query = text(
        """
        SELECT
            verified_by,
            remarks,
            verified_at
        FROM verification_final_status
        WHERE TRIM(application_no) = TRIM(:application_no)
          AND LOWER(CAST(is_shortfall AS TEXT)) IN ('true', 'yes', '1')
        ORDER BY verified_at ASC
        """
    )

    rows = db.session.execute(query, {"application_no": application_no}).mappings().all()
    return [dict(row) for row in rows]


def get_document_shortfall_remarks(application_no):
    query = text(
        """
        SELECT
            document_name,
            verification_team,
            remarks,
            verified_by,
            created_at
        FROM verification_remarks
        WHERE TRIM(application_no) = TRIM(:application_no)
          AND LOWER(CAST(is_shortfall AS TEXT)) IN ('true', 'yes', '1')
        ORDER BY created_at ASC, id ASC
        """
    )

    rows = db.session.execute(query, {"application_no": application_no}).mappings().all()
    return [dict(row) for row in rows]


def get_project_contact_by_application(application_no):
    query = text(
        """
        SELECT
            preg.application_no AS application_no,
            preg.name AS applicant_name,
            preg.email AS email
        FROM project_registrations preg
        WHERE TRIM(preg.application_no) = TRIM(:application_no)

        UNION ALL

        SELECT
            ppo.application_no AS application_no,
            COALESCE(ppo.organization_name, ppo.type_of_promoter, 'Promoter') AS applicant_name,
            ppo.authorized_signatory_email AS email
        FROM promoter_profile_other_t_indv ppo
        WHERE TRIM(ppo.application_no) = TRIM(:application_no)
        LIMIT 1
        """
    )

    row = db.session.execute(query, {"application_no": application_no}).mappings().first()
    return dict(row) if row else None


def generate_project_registration_number():
    year = datetime.now().year
    prefix = f"APRERA-PROJ-{year}-"

    query = text(
        """
        SELECT COUNT(*) AS total
        FROM verification_final_status
        WHERE registration_number LIKE :prefix
        """
    )

    row = db.session.execute(query, {"prefix": f"{prefix}%"}).mappings().first()
    next_number = int(row["total"] or 0) + 1 if row else 1
    return f"{prefix}{str(next_number).zfill(5)}"


def update_project_scrutiny_status(application_no, scrutiny_status):
    individual_query = text(
        """
        UPDATE project_registrations
        SET scrutiny_status = :scrutiny_status
        WHERE TRIM(application_no) = TRIM(:application_no)
        RETURNING application_no
        """
    )

    row = db.session.execute(
        individual_query,
        {
            "application_no": application_no,
            "scrutiny_status": scrutiny_status,
        },
    ).mappings().first()

    if row:
        db.session.commit()
        return {
            "application_no": row["application_no"],
            "promoter_type": "individual",
            "scrutiny_status": scrutiny_status,
        }

    other_query = text(
        """
        UPDATE promoter_profile_other_t_indv
        SET scrutiny_status = :scrutiny_status
        WHERE TRIM(application_no) = TRIM(:application_no)
        RETURNING application_no
        """
    )

    row = db.session.execute(
        other_query,
        {
            "application_no": application_no,
            "scrutiny_status": scrutiny_status,
        },
    ).mappings().first()

    if row:
        db.session.commit()
        return {
            "application_no": row["application_no"],
            "promoter_type": "other",
            "scrutiny_status": scrutiny_status,
        }

    db.session.rollback()
    return None


def create_final_verification(data):
    query = text("""
        INSERT INTO verification_final_status (
            application_no,
            status,
            is_shortfall,
            verified_by,
            remarks,
            registration_number
        )
        VALUES (
            :application_no,
            :status,
            :is_shortfall,
            :verified_by,
            :remarks,
            :registration_number
        )
        ON CONFLICT (application_no, verified_by)
        DO UPDATE SET
            status = EXCLUDED.status,
            is_shortfall = EXCLUDED.is_shortfall,
            verified_by = EXCLUDED.verified_by,
            remarks = EXCLUDED.remarks,
            registration_number = COALESCE(EXCLUDED.registration_number, verification_final_status.registration_number),
            verified_at = CURRENT_TIMESTAMP
        RETURNING *;
    """)

    row = db.session.execute(query, data).mappings().first()
    db.session.commit()

    return dict(row)