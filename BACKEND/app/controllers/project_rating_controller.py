from flask import Blueprint, request, jsonify
from app.services.project_rating_service import get_project_ratings, submit_project_rating, get_completed_projects

project_rating_bp = Blueprint('project_rating_bp', __name__)

@project_rating_bp.route('/project-ratings/<application_number>', methods=['GET'])
def get_ratings(application_number):
    try:
        data = get_project_ratings(application_number)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": "Internal Server Error"}), 500

@project_rating_bp.route('/director/project-ratings', methods=['POST'])
def post_director_rating():
    try:
        data = request.json
        user_id = data.get('director_user_id') or request.headers.get('X-User-Id')
        
        if not user_id:
            return jsonify({"success": False, "error": "Unauthorized"}), 401
            
        app_no = data.get('project_application_number')
        rating = data.get('rating')
        review = data.get('review')
        
        if not app_no or not rating:
            return jsonify({"success": False, "error": "Missing application number or rating"}), 400
            
        if not (1 <= int(rating) <= 5):
            return jsonify({"success": False, "error": "Rating must be between 1 and 5"}), 400
            
        result = submit_project_rating(app_no, user_id, rating, review)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"success": False, "error": "Internal Server Error"}), 500

@project_rating_bp.route('/director/completed-projects', methods=['GET'])
def fetch_director_completed_projects():
    try:
        user_id = request.args.get('director_user_id') or request.headers.get('X-User-Id') or '0'
        data = get_completed_projects(user_id)
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500