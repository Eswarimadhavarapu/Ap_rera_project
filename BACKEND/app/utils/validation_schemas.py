from flask import jsonify
from marshmallow import Schema, fields, validate, ValidationError


class RegistrationSchema(Schema):

    pan = fields.Str(
        required=False,
        validate=validate.Regexp(
            r"^[A-Z]{5}[0-9]{4}[A-Z]$",
            error="Invalid PAN format"
        )
    )
    
    aadhaar = fields.Str(
        required=False,
        validate=validate.Regexp(
            r"^[0-9]{12}$",
            error="Invalid Aadhaar format"
        )
    )

    mobile = fields.Str(
        required=False,
        validate=validate.Regexp(
            r"^[6-9][0-9]{9}$",
            error="Invalid Mobile format"
        )
    )
    # EMAIL VALIDATION
    email = fields.Email(
        required=False,
        error_messages={
            "invalid": "Invalid Email format"
        }
    )

    # GST VALIDATION
    gst = fields.Str(
        required=False,
        validate=validate.Regexp(
            r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$",
            error="Invalid GST format"
        )
    )


def validate_registration(data):
    try:
        RegistrationSchema().load(data)
        return None

    except ValidationError as err:
        return jsonify({
            "errors": err.messages
        }), 422