from flask_jwt_extended import get_jwt
from functools import wraps
from flask import jsonify

def roles_required(*roles):

    def wrapper(fn):

        @wraps(fn)
        def decorator(*args, **kwargs):

            claims = get_jwt()
            user_role = str(claims.get("role", "")).upper()

            required_roles = [r.upper() for r in roles]

            print("Required Roles =", required_roles)
            print("User Role =", user_role)

            if user_role == "SUPER_ADMIN":
                return fn(*args, **kwargs)

            if user_role not in roles:
                return jsonify({
                    "error": "Unauthorized"
                }), 403

            return fn(*args, **kwargs)

        return decorator

    return wrapper
