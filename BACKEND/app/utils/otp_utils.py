import random
import time
import hmac
import hashlib
from datetime import datetime, timedelta

SECRET_KEY = "aprera_secret_key"

OTP_STORE = {}

LOCK_STORE = {}

def hash_otp(otp):
    return hmac.new(
        SECRET_KEY.encode(),
        otp.encode(),
        hashlib.sha256
    ).hexdigest()

OTP_STORE = {}  # {pan: {"otp": "123456", "expires": timestamp}}

def generate_otp(pan):
    otp = str(random.randint(100000, 999999))
    OTP_STORE[pan] = {
        "otp_hash": hash_otp(otp),
        "expiry": datetime.now() + timedelta(minutes=5),
        "attempts": 0
    }
    return otp


def verify_otp(pan, otp):
    data = OTP_STORE.get(pan)

    if not data:
        return {
            "status": False,
            "message": "OTP not found"
        }

    if pan in LOCK_STORE:

        if datetime.now() < LOCK_STORE[pan]:

            return {
                "status": False,
                "message": "Account locked for 15 minutes"
            }

        del LOCK_STORE[pan]

    if datetime.now() > data["expiry"]:

        OTP_STORE.pop(pan, None)
        return {
            "status": False,
            "message": "OTP expired"
        }

    entered_hash = hash_otp(otp)

    if entered_hash == data["otp_hash"]:
        OTP_STORE.pop(pan, None)
        return {
            "status": True,
            "message": "OTP verified"
        }

    data["attempts"] += 1

    if data["attempts"] >= 5:

        LOCK_STORE[pan] = (
            datetime.now() + timedelta(hours=9)
        )

        return {
            "status": False,
            "message": "Account locked for 15 minutes due to 5 invalid OTP attempts"
        }

    return {
        "status": False,
        "message": f"Invalid OTP. Attempt {data['attempts']} of 5"
    }