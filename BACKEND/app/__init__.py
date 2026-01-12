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
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
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

    app.register_blueprint(development_details_bp, url_prefix="/api")
    app.register_blueprint(test_connection_bp, url_prefix="/api")
    app.register_blueprint(location_bp, url_prefix="/api")
    app.register_blueprint(project_registration_bp, url_prefix="/api")
  

    return app
