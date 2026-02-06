from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.models.database import db

import logging
from logging.handlers import RotatingFileHandler
import os
 
 # ---------------------------------------------------------
# Logging Setup
# ---------------------------------------------------------
LOG_DIR = os.path.join(os.path.dirname(__file__), "..", "logs")
os.makedirs(LOG_DIR, exist_ok=True)

log_file = os.path.join(LOG_DIR, "app.log")

handler = RotatingFileHandler(
    log_file,
    maxBytes=5_000_000,
    backupCount=5
)

formatter = logging.Formatter(
    "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
handler.setFormatter(formatter)

root_logger = logging.getLogger()
root_logger.setLevel(logging.INFO)
root_logger.addHandler(handler)
root_logger.addHandler(logging.StreamHandler())

# Reduce flask request noise
logging.getLogger("werkzeug").setLevel(logging.WARNING)
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    # BACKEND/app/uploads
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

    # =========================
    # CORS Configuration
    # =========================
    CORS(
        app,
        resources={r"/api/*": {
            "origins": app.config["ALLOWED_ORIGINS"].split(","),
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": "*"

        }},
        supports_credentials=True
    )


    # =========================
    # Database Initialization
    # =========================
    db.init_app(app)

    # =========================
    # Register Blueprints
    # =========================
    from app.controllers.test_connection_controller import test_connection_bp
    from app.controllers.location_controller import location_bp
    from app.controllers.development_details_controller import development_details_bp
    from app.controllers.project_registration_controller import project_registration_bp
    from app.controllers.project_wizard_controller import project_wizard_bp
    from app.controllers.complint_controller import complint_bp
    from app.controllers.promoter_registration_controller import promoter_registration_bp
    from app.controllers.project_uploddocuments_controller import project_upload_documents_bp
    from app.controllers.occupation_controller import occupation_controller
    from app.controllers.agent_registration_controller import agent_bp
    from app.controllers.otp_controller import otp_bp
    from app.controllers.associate_controller import associate_bp
    from app.controllers.application_associate_controller import application_associate_bp
    from app.controllers.project_preview_controller import preview_bp
    from app.controllers.project_preview_extensionprocess_controller import (
    preview_extensionprocess_bp
    )
    from app.controllers.projectapplicationdetailsextension import (
    projectapplicationdetailsextension_bp
    )

    
    app.register_blueprint(preview_bp, url_prefix="/api")
    app.register_blueprint(application_associate_bp, url_prefix="/api")
    app.register_blueprint(associate_bp, url_prefix="/api")
    app.register_blueprint(project_upload_documents_bp, url_prefix="/api")
    app.register_blueprint(project_wizard_bp, url_prefix="/api")
    app.register_blueprint(promoter_registration_bp, url_prefix="/api")
    app.register_blueprint(complint_bp, url_prefix="/api")
    app.register_blueprint(development_details_bp, url_prefix="/api")
    app.register_blueprint(test_connection_bp, url_prefix="/api")
    app.register_blueprint(location_bp, url_prefix="/api")
    app.register_blueprint(project_registration_bp, url_prefix="/api")
    app.register_blueprint(occupation_controller, url_prefix="/api")
    app.register_blueprint(agent_bp, url_prefix="/api/agent")
    app.register_blueprint(otp_bp, url_prefix="/api/otp")
    app.register_blueprint(preview_extensionprocess_bp, url_prefix="/api")
    app.register_blueprint(
    projectapplicationdetailsextension_bp,
    url_prefix="/api")
  

    return app