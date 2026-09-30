from sqlalchemy import text
from app.models.database import db

def get_project_ratings(application_number):
    query = text("""
        SELECT 
            id, director_user_id, rating, review, created_at, updated_at
        FROM project_ratings
        WHERE project_application_number = :app_no
        ORDER BY created_at DESC
    """)
    rows = db.session.execute(query, {"app_no": application_number}).mappings().all()
    
    ratings_list = [dict(r) for r in rows]
    total_ratings = len(ratings_list)
    average_rating = sum(r['rating'] for r in ratings_list) / total_ratings if total_ratings > 0 else 0

    return {
        "average_rating": float(average_rating),
        "total_ratings": total_ratings,
        "reviews": ratings_list
    }

def submit_project_rating(application_number, user_id, rating, review):
    existing = text("""
        SELECT id, rating, review FROM project_ratings
        WHERE project_application_number = :app_no AND director_user_id = :user_id
    """)
    row = db.session.execute(existing, {"app_no": application_number, "user_id": user_id}).mappings().first()
    
    if row:
        update_q = text("""
            UPDATE project_ratings
            SET rating = :rating, review = :review, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        """)
        db.session.execute(update_q, {"rating": rating, "review": review, "id": row["id"]})
    else:
        insert_q = text("""
            INSERT INTO project_ratings (project_application_number, director_user_id, rating, review)
            VALUES (:app_no, :user_id, :rating, :review)
        """)
        db.session.execute(insert_q, {"app_no": application_number, "user_id": user_id, "rating": rating, "review": review})
        
    db.session.commit()
    return {"success": True, "message": "Rating saved successfully"}

def get_completed_projects(user_id):
    """Return ALL registered projects so director can rate any of them."""
    query = text("""
        WITH all_projects AS (
            SELECT
                preg.application_no AS application_no,
                'individual' AS promoter_type,
                preg.name AS applicant_name,
                pr.project_name AS project_name,
                COALESCE(CAST(pr.project_status AS TEXT), 'Under Scrutiny') AS project_status,
                preg.district AS district
            FROM project_registrations preg
            LEFT JOIN project_registration pr
              ON pr.application_number = preg.application_no
             AND pr.pan_number = preg.pan_number
            WHERE COALESCE(LOWER(preg.promoter_type), 'individual') <> 'other'
              AND preg.scrutiny_status = 'approved'

            UNION ALL

            SELECT
                ppo.application_no AS application_no,
                'other' AS promoter_type,
                COALESCE(ppo.organization_name, ppo.type_of_promoter, 'Organization') AS applicant_name,
                opr.project_name AS project_name,
                COALESCE(CAST(opr.project_status AS TEXT), 'Under Scrutiny') AS project_status,
                ppo.district AS district
            FROM promoter_profile_other_t_indv ppo
            LEFT JOIN othertheninduvidual_project_registration opr
              ON opr.application_number = ppo.application_no
             AND opr.pan_number = ppo.pan_number
            WHERE ppo.scrutiny_status = 'approved'
        )
        SELECT 
            ap.*,
            (
                SELECT json_agg(json_build_object('id', pg.id, 'image_url', pg.image_url))
                FROM project_gallery pg
                WHERE pg.project_application_number = ap.application_no
            ) as gallery,
            (
                SELECT json_build_object('rating', prat.rating, 'review', prat.review)
                FROM project_ratings prat
                WHERE prat.project_application_number = ap.application_no AND prat.director_user_id = :user_id
                LIMIT 1
            ) as my_rating,
            (
                SELECT json_build_object('average', COALESCE(AVG(p2.rating), 0), 'total_reviews', COUNT(p2.id))
                FROM project_ratings p2
                WHERE p2.project_application_number = ap.application_no
            ) as all_ratings
        FROM all_projects ap
        ORDER BY ap.application_no DESC
    """)

    rows = db.session.execute(query, {"user_id": user_id}).mappings().all()
    
    data = []
    for row in rows:
        r = dict(row)
        if r.get('gallery') is None:
            r['gallery'] = []
        if r.get('my_rating') is None:
            r['my_rating'] = None
        if r.get('all_ratings') is None:
            r['all_ratings'] = {'average': 0, 'total_reviews': 0}
        else:
            r['all_ratings']['average'] = float(r['all_ratings']['average'])
        data.append(r)
        
    return data