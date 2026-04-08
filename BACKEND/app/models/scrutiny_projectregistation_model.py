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


def get_scrutiny_project_registrations():
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
            COALESCE(dm.district_name, CAST(pr.project_district AS TEXT), preg.district) AS district,
            preg.created_at AS created_at
        FROM project_registrations preg
        LEFT JOIN project_registration pr
          ON pr.application_number = preg.application_no
         AND pr.pan_number = preg.pan_number
        LEFT JOIN district_master_t dm
          ON CAST(pr.project_district AS TEXT) = CAST(dm.district_id AS TEXT)
        WHERE COALESCE(LOWER(preg.promoter_type), 'individual') <> 'other'

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
            COALESCE(dm2.district_name, CAST(opr.project_district AS TEXT), ppo.district) AS district,
            NULL AS created_at
        FROM promoter_profile_other_t_indv ppo
        LEFT JOIN othertheninduvidual_project_registration opr
          ON opr.application_number = ppo.application_no
         AND opr.pan_number = ppo.pan_number
        LEFT JOIN district_master_t dm2
          ON CAST(opr.project_district AS TEXT) = CAST(dm2.district_id AS TEXT)

        ORDER BY application_no DESC
        """
    )

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
                COALESCE(dm.district_name, CAST(opr.project_district AS TEXT), ppo.district) AS district,
                NULL AS created_at
            FROM promoter_profile_other_t_indv ppo
            LEFT JOIN othertheninduvidual_project_registration opr
              ON opr.application_number = ppo.application_no
             AND opr.pan_number = ppo.pan_number
            LEFT JOIN district_master_t dm
              ON CAST(opr.project_district AS TEXT) = CAST(dm.district_id AS TEXT)
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
                COALESCE(dm.district_name, CAST(pr.project_district AS TEXT), preg.district) AS district,
                preg.created_at AS created_at
            FROM project_registrations preg
            LEFT JOIN project_registration pr
              ON pr.application_number = preg.application_no
             AND pr.pan_number = preg.pan_number
            LEFT JOIN district_master_t dm
              ON CAST(pr.project_district AS TEXT) = CAST(dm.district_id AS TEXT)
            WHERE preg.application_no = :application_no
            LIMIT 1
            """
        )

    row = db.session.execute(query, {"application_no": application_no}).mappings().first()
    if not row:
        return None

    return _serialize_row(row)