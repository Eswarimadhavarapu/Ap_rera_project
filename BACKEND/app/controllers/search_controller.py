from flask import Blueprint, request, jsonify
from app.services.search_service import get_projects_with_ratings, get_public_project_details

search_bp = Blueprint('search_bp', __name__)

@search_bp.route('/search/projects', methods=['GET'])
def search_projects():
    try:
        search_params = {
            "project_name": request.args.get("project_name", ""),
            "area": request.args.get("area", ""),
            "application_number": request.args.get("application_number", ""),
            "page": request.args.get("page", 1),
            "limit": request.args.get("limit", 10)
        }
        
        result = get_projects_with_ratings(search_params)
        return jsonify(result), 200
        
    except Exception as e:
        import traceback
        return jsonify({"success": False, "error": "Internal Server Error"}), 500

@search_bp.route('/search/projects/<application_number>', methods=['GET'])
def get_project_details(application_number):
    try:
        data = get_public_project_details(application_number)
        if not data:
            return jsonify({"success": False, "error": "Project not found"}), 404
            
        return jsonify({"success": True, "data": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500