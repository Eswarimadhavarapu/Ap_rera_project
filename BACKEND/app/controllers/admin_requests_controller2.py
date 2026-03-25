from flask import Blueprint, jsonify
from app.models.admin_renewal_model import (
    get_renewal_dashboard_counts,
    get_renewals_by_status
)

# Blueprint
admin_renewal_bp = Blueprint("admin_renewal_bp", __name__)


# ===============================
# Renewal Dashboard Counts
# ===============================
@admin_renewal_bp.route("/admin/renewal-dashboard", methods=["GET","OPTIONS"])
def renewal_dashboard():

    data = get_renewal_dashboard_counts()

    return jsonify(data)


# ===============================
# Renewals By Status
# ===============================
@admin_renewal_bp.route("/admin/renewals/<status>", methods=["GET","OPTIONS"])
def renewals_by_status(status):

    rows = get_renewals_by_status(status.upper())

    result = []

    for r in rows:
        result.append({
            "id": r["id"],
            "agent_id": r["agent_id"],
            "application_no": r["application_no"],
            "expiry_date": r["expiry_date"],
            "status": r["renewal_status"],
            "payment_status": r["payment_status"]
        })

    return jsonify(result)