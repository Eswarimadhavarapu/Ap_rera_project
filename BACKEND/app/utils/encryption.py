import os
from cryptography.fernet import Fernet, InvalidToken

KEY = os.getenv("ENCRYPTION_KEY")

if not KEY:
    raise ValueError("ENCRYPTION_KEY not found in .env")

cipher = Fernet(KEY.encode())


def encrypt_value(value):
    if value is None or value == "":
        return value

    return cipher.encrypt(
        str(value).encode()
    ).decode()


def decrypt_value(value):
    if value is None or value == "":
        return value

    return cipher.decrypt(
        value.encode()
    ).decode()


def decrypt_if_encrypted(value):
    if value is None or value == "":
        return value

    try:
        return cipher.decrypt(
            value.encode()
        ).decode()
    except InvalidToken:
        # Already plain text
        return value