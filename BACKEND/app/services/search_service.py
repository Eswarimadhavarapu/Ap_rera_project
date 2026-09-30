from sqlalchemy import text
from app.models.database import db
from app.controllers.project_preview_data_controller import build_project_preview_data
import json

def get_projects_with_ratings(search_params):
    project_name = search_params.get("project_name", "")
    area = search_params.get("area", "")
    application_number = search_params.get("application_number", "")
    page = int(search_params.get("page", 1))
    limit = int(search_params.get("limit", 10))
    offset = (page - 1) * limit

    # Build WHERE conditions
    where_clauses_ind = ["1=1", "preg.scrutiny_status = 'approved'"]
    where_clauses_org = ["1=1", "ppo.scrutiny_status = 'approved'"]
    params = {}

    if project_name:
        where_clauses_ind.append("pr.project_name ILIKE :project_name")
        where_clauses_org.append("opr.project_name ILIKE :project_name")
        params["project_name"] = f"%{project_name}%"
    
    if area:
        where_clauses_ind.append("CAST(preg.district AS TEXT) ILIKE :area")
        where_clauses_org.append("CAST(ppo.district AS TEXT) ILIKE :area")
        params["area"] = f"%{area}%"
    
    if application_number:
        where_clauses_ind.append("preg.application_no ILIKE :app_no")
        where_clauses_org.append("ppo.application_no ILIKE :app_no")
        params["app_no"] = f"%{application_number}%"

    where_ind = " AND ".join(where_clauses_ind)
    where_org = " AND ".join(where_clauses_org)

    query = text(f"""
        WITH all_projects AS (
            SELECT
                preg.application_no AS application_no,
                'individual' AS promoter_type,
                preg.name AS applicant_name,
                pr.project_name AS project_name,
                pr.project_type AS project_type,
                pr.project_status AS project_status,
                pr.total_project_cost AS project_cost,
                preg.district AS district
            FROM project_registrations preg
            LEFT JOIN project_registration pr
              ON pr.application_number = preg.application_no
             AND pr.pan_number = preg.pan_number
            WHERE COALESCE(LOWER(preg.promoter_type), 'individual') <> 'other'
            AND {{where_ind}}

            UNION ALL

            SELECT
                ppo.application_no AS application_no,
                'other' AS promoter_type,
                COALESCE(ppo.organization_name, ppo.type_of_promoter, 'Organization') AS applicant_name,
                opr.project_name AS project_name,
                opr.project_type AS project_type,
                opr.project_status AS project_status,
                opr.total_project_cost AS project_cost,
                ppo.district AS district
            FROM promoter_profile_other_t_indv ppo
            LEFT JOIN othertheninduvidual_project_registration opr
              ON opr.application_number = ppo.application_no
             AND opr.pan_number = ppo.pan_number
            WHERE 1=1
            AND {{where_org}}
        )
        SELECT 
            ap.*,
            (
                SELECT json_agg(json_build_object(
                    'id', pg.id,
                    'image_url', pg.image_url,
                    'title', pg.title,
                    'description', pg.description
                ))
                FROM project_gallery pg
                WHERE pg.project_application_number = ap.application_no
            ) as gallery,
            (
                SELECT json_build_object(
                    'average', COALESCE(AVG(prat.rating), 0),
                    'total_reviews', COUNT(prat.id)
                )
                FROM project_ratings prat
                WHERE prat.project_application_number = ap.application_no
            ) as rating
        FROM all_projects ap
        ORDER BY ap.application_no DESC
        LIMIT :limit OFFSET :offset
    """.replace("{where_ind}", where_ind).replace("{where_org}", where_org))
    
    count_query = text(f"""
        WITH all_projects AS (
            SELECT preg.application_no
            FROM project_registrations preg
            LEFT JOIN project_registration pr
              ON pr.application_number = preg.application_no
             AND pr.pan_number = preg.pan_number
            WHERE COALESCE(LOWER(preg.promoter_type), 'individual') <> 'other'
            AND {{where_ind}}

            UNION ALL

            SELECT ppo.application_no
            FROM promoter_profile_other_t_indv ppo
            LEFT JOIN othertheninduvidual_project_registration opr
              ON opr.application_number = ppo.application_no
             AND opr.pan_number = ppo.pan_number
            WHERE 1=1
            AND {{where_org}}
        )
        SELECT COUNT(*) as total_count FROM all_projects
    """.replace("{where_ind}", where_ind).replace("{where_org}", where_org))

    params["limit"] = limit
    params["offset"] = offset

    rows = db.session.execute(query, params).mappings().all()
    count_row = db.session.execute(count_query, params).mappings().first()
    total = count_row["total_count"] if count_row else 0

    data = []
    for row in rows:
        r = dict(row)
        if r.get('gallery') is None:
            r['gallery'] = []
        if r.get('rating') is None:
            r['rating'] = {'average': 0, 'total_reviews': 0}
        else:
             r['rating']['average'] = float(r['rating']['average'])
        data.append(r)

    return {
        "success": True,
        "data": data,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
    }


def get_public_project_details(application_number):
    """Return full project preview data for a given application number."""
    query = text("""
        SELECT application_no, pan_number, 'individual' AS promoter_type
        FROM project_registrations
        WHERE application_no = :app AND scrutiny_status = 'approved'
        UNION ALL
        SELECT application_no, pan_number, 'other' AS promoter_type
        FROM promoter_profile_other_t_indv
        WHERE application_no = :app AND scrutiny_status = 'approved'
    """)
    row = db.session.execute(query, {"app": application_number}).mappings().first()

    if not row:
        return None

    # Reuse the existing robust preview builder (same one used by ProjectPreview.jsx)
    full_data = build_project_preview_data({
        "applicationNumber": row["application_no"],
        "panNumber": row["pan_number"]
    })

    # Fetch gallery images from the new project_gallery table
    gallery_query = text("""
        SELECT json_agg(json_build_object(
            'id', id,
            'image_url', image_url,
            'title', title,
            'description', description
        )) as gallery
        FROM project_gallery
        WHERE project_application_number = :app
    """)
    gallery_row = db.session.execute(gallery_query, {"app": application_number}).mappings().first()
    full_data["gallery"] = gallery_row["gallery"] if gallery_row and gallery_row["gallery"] else []
    full_data["promoter_type"] = row["promoter_type"]
    full_data["application_no"] = row["application_no"]

    return full_data