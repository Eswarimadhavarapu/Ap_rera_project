import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.models.database import db
from app.models.project_gallery import ProjectGallery
from datetime import datetime
import traceback

project_gallery_bp = Blueprint('project_gallery_bp', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_gallery_dir():
    """Returns the absolute path for the project_gallery uploads folder."""
    base = current_app.config.get('UPLOAD_FOLDER', '')
    # Go up to BACKEND/app/uploads/ and add project_gallery
    uploads_root = os.path.abspath(os.path.join(base, '..', '..', 'uploads'))
    gallery_dir = os.path.join(uploads_root, 'project_gallery')
    os.makedirs(gallery_dir, exist_ok=True)
    return gallery_dir


@project_gallery_bp.route('/project-gallery/upload', methods=['POST'])
def upload_project_image():
    try:
        app_no = request.form.get('application_number')
        if not app_no:
            return jsonify({"success": False, "error": "Application number is required"}), 400

        if 'image' not in request.files:
            return jsonify({"success": False, "error": "No image file provided"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"success": False, "error": "No selected file"}), 400

        if not allowed_file(file.filename):
            return jsonify({"success": False, "error": "File type not allowed. Use PNG, JPG, GIF, or WEBP"}), 400

        # Save file
        gallery_dir = get_gallery_dir()
        original_name = secure_filename(file.filename)
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
        filename = f"{timestamp}_{original_name}"
        file_path = os.path.join(gallery_dir, filename)
        file.save(file_path)

        # URL path served by the /uploads/<path:filename> route
        image_url = f"uploads/project_gallery/{filename}"

        gallery_entry = ProjectGallery(
            project_application_number=app_no,
            image_url=image_url,
            title=request.form.get('title', ''),
            description=request.form.get('description', '')
        )
        db.session.add(gallery_entry)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Image uploaded successfully",
            "data": gallery_entry.to_dict()
        }), 201

    except Exception as e:
        traceback.print_exc()
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@project_gallery_bp.route('/project-gallery/<string:app_no>', methods=['GET'])
def get_project_gallery(app_no):
    """Fetch all images for a project application number."""
    try:
        images = ProjectGallery.query.filter_by(
            project_application_number=app_no
        ).order_by(ProjectGallery.display_order, ProjectGallery.created_at).all()

        return jsonify({
            "success": True,
            "data": [img.to_dict() for img in images]
        }), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


@project_gallery_bp.route('/project-gallery/delete/<int:image_id>', methods=['DELETE'])
def delete_project_image(image_id):
    """Delete a gallery image by its DB id."""
    try:
        img = ProjectGallery.query.get(image_id)
        if not img:
            return jsonify({"success": False, "error": "Image not found"}), 404

        # Delete the physical file
        gallery_dir = get_gallery_dir()
        filename = img.image_url.replace("uploads/project_gallery/", "")
        file_path = os.path.join(gallery_dir, filename)
        if os.path.exists(file_path):
            os.remove(file_path)

        db.session.delete(img)
        db.session.commit()

        return jsonify({"success": True, "message": "Image deleted"}), 200
    except Exception as e:
        traceback.print_exc()
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500