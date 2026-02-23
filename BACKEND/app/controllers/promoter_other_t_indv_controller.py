from flask import Blueprint, request, jsonify
from app import db
from app.models.promoter_other_t_indv import PromoterOtherTINDV
from app.models.promoter2_other_t_indv import Promoter2OtherTINDV
from app.models.org_member_other_t_indv import OrgMemberOtherTINDV
from app.models.rera_other_t_indv import ReraOtherTINDV
from app.models.past_project_other_t_indv import PastProjectOtherTINDV
from app.models.litigation_other_t_indv import LitigationOtherTINDV

promoter_other_t_indv_bp = Blueprint("promoter_other_t_indv_bp", __name__)

@promoter_other_t_indv_bp.route("/api/other-t-indv/promoter/save", methods=["POST"])
def save_full_application():

    data = request.json

    try:
        application_no = data["applicationNo"]

        # 🔥 CHECK IF EXISTS
        existing = PromoterOtherTINDV.query.filter_by(
            application_no=application_no
        ).first()

        if existing:
            return jsonify({"error": "Application already exists"}), 400

        # ===============================
        # 1️⃣ SAVE MAIN PROMOTER
        # ===============================
        promoter = PromoterOtherTINDV(
            application_no=application_no,
            promoter_type=data["promoterType"],
            type_of_promoter=data["typeOfPromoter"],
            organization_name=data["organizationName"],
            registration_number=data["cinNumber"],
            registration_date=data["registrationDate"],
            gst_number=data["gstNum"],
            pan_number=data["panNumber"],
            authorized_signatory_mobile=data["authorizedSignatoryMobile"],
            authorized_signatory_email=data["authorizedSignatoryEmail"],
            authorized_signatory_landline=data.get("authorizedSignatoryLandline"),
            website=data["promoterWebsite"],
            state=data["stateUT"],
            district=data["district"],
            bank_state=data["bankState"],
            bank_name=data["bankName"],
            branch_name=data["branchName"],
            account_no=data["accountNo"],
            account_holder=data["accountHolder"],
            ifsc_code=data["ifsc"],
            other_state_reg=data["otherStateReg"],
            last_five_years=data["lastFiveYears"],
            litigation=data["litigation"],
            promoter2=data["promoter2"]
        )

        db.session.add(promoter)
        db.session.flush()   # 🔥 Important

        # ===============================
        # 2️⃣ SAVE PROMOTER 2 ENTRIES
        # ===============================
        for p2 in data.get("promoter2Entries", []):
            entry = Promoter2OtherTINDV(
                application_no=application_no,
                is_organization=p2["promoter2IsOrganization"],
                is_indian=p2["promoter2IsIndian"],
                name=p2["promoter2Name"],
                state=p2.get("promoter2State"),
                district=p2.get("promoter2District"),
                address_line1=p2["promoter2AddressLine1"],
                address_line2=p2.get("promoter2AddressLine2"),
                pin_code=p2.get("promoter2PinCode"),
                mobile=p2["promoter2Mobile"],
                email=p2["promoter2Email"],
                pan_card=p2["promoter2PanCard"],
                aadhaar=p2.get("promoter2Aadhaar")
            )
            db.session.add(entry)

        # ===============================
        # 3️⃣ SAVE ORG MEMBERS
        # ===============================
        for member in data.get("orgMemberEntries", []):
            entry = OrgMemberOtherTINDV(
                application_no=application_no,
                is_indian=member["isIndian"],
                name=member["name"],
                designation=member["designation"],
                mobile=member["mobile"],
                email=member["email"],
                address_line1=member["address1"],
                address_line2=member.get("address2"),
                state=member.get("state"),
                district=member.get("district"),
                pin_code=member.get("pinCode"),
                aadhaar=member.get("aadhaar"),
                pan=member.get("pan"),
                din=member.get("din")
            )
            db.session.add(entry)

        # ===============================
        # 4️⃣ SAVE RERA
        # ===============================
        for r in data.get("reraEntries", []):
            entry = ReraOtherTINDV(
                application_no=application_no,
                rera_reg_number=r["reraRegNumber"],
                rera_state=r["reraState"],
                registration_revoked=r["registrationRevoked"],
                revocation_reason=r.get("revocationReason")
            )
            db.session.add(entry)

        # ===============================
        # 5️⃣ SAVE PROJECTS
        # ===============================
        for proj in data.get("projectEntries", []):
            entry = PastProjectOtherTINDV(
                application_no=application_no,
                project_name=proj["projectName"],
                project_type=proj["projectType"],
                current_status=proj["currentStatus"],
                project_address=proj["projectAddress"],
                state=proj.get("projectStateUT"),
                district=proj.get("projectDistrict"),
                pin_code=proj.get("pinCode"),
                survey_no=proj.get("surveyNo")
            )
            db.session.add(entry)

        # ===============================
        # 6️⃣ SAVE LITIGATIONS
        # ===============================
        for l in data.get("litigationEntries", []):
            entry = LitigationOtherTINDV(
                application_no=application_no,
                case_no=l["caseNo"],
                tribunal_place=l["tribunalPlace"],
                petitioner_name=l["petitionerName"],
                respondent_name=l["respondentName"],
                case_facts=l["caseFacts"],
                case_status=l["caseStatus"],
                interim_order=l["interimOrder"],
                final_order_details=l["finalOrderDetails"]
            )
            db.session.add(entry)

        # 🔥 FINAL COMMIT
        db.session.commit()

        return jsonify({"message": "Full application saved successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
