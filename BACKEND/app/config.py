import os
from dotenv import load_dotenv

load_dotenv()  # Load .env once

def str_to_bool(value, default=False):
    if value is None:
        return default
    return value.lower() in ("true", "1", "yes")

class Config:
    # ========================
    # Flask App
    # ========================
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    DEBUG = str_to_bool(os.getenv("FLASK_DEBUG"), False)
    PORT = int(os.getenv("PORT", 8080))

    # ========================
    # CORS
    # ========================
    ALLOWED_ORIGINS = (
          "http://localhost:5173,"
          "http://127.0.0.1:5173,"
          "https://0jv8810n-5173.inc1.devtunnels.ms/"
    )
    

    # ========================
    # Database
    # ========================
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    if not SQLALCHEMY_DATABASE_URI:
        raise RuntimeError("DATABASE_URL is not set in .env")

    # ========================
    # Email
    # ========================
    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

    SMTP_USE_TLS = str_to_bool(os.getenv("SMTP_USE_TLS"), True)
    SMTP_USE_SSL = str_to_bool(os.getenv("SMTP_USE_SSL"), False)

    FROM_EMAIL = os.getenv("FROM_EMAIL")

    # ========================
    # Public URL
    # ========================
    PUBLIC_BASE_URL = os.getenv("PUBLIC_BASE_URL")