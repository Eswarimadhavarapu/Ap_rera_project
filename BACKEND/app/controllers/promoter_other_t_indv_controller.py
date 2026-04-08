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

@promoter_other_t_indv_bp.route("/api/other-t-indv/promoter/get/<application_no>", methods=["GET"])
def get_full_application(application_no):
    try:
        promoter = PromoterOtherTINDV.query.filter_by(application_no=application_no).first()
        if not promoter:
            return jsonify({"error": "Application not found"}), 404

        formData = {
            "applicationNo": promoter.application_no,
            "promoterType": promoter.promoter_type,
            "typeOfPromoter": promoter.type_of_promoter,
            "organizationName": promoter.organization_name,
            "cinNumber": promoter.registration_number,
            "registrationDate": promoter.registration_date,
            "gstNum": promoter.gst_number,
            "panNumber": promoter.pan_number,
            "authorizedSignatoryMobile": promoter.authorized_signatory_mobile,
            "authorizedSignatoryEmail": promoter.authorized_signatory_email,
            "authorizedSignatoryLandline": promoter.authorized_signatory_landline or "",
            "promoterWebsite": promoter.website or "",
            "stateUT": promoter.state,
            "district": promoter.district,
            "bankState": promoter.bank_state,
            "bankName": promoter.bank_name,
            "branchName": promoter.branch_name,
            "accountNo": promoter.account_no,
            "accountHolder": promoter.account_holder,
            "ifsc": promoter.ifsc_code,
            "otherStateReg": promoter.other_state_reg,
            "lastFiveYears": promoter.last_five_years,
            "litigation": promoter.litigation,
            "promoter2": promoter.promoter2
        }

        # Arrays
        promoter2Entries = []
        for p2 in Promoter2OtherTINDV.query.filter_by(application_no=application_no).all():
            promoter2Entries.append({
                "id": p2.id,
                "promoter2IsOrganization": p2.is_organization,
                "promoter2IsIndian": p2.is_indian,
                "promoter2Name": p2.name,
                "promoter2State": p2.state or "",
                "promoter2District": p2.district or "",
                "promoter2AddressLine1": p2.address_line1,
                "promoter2AddressLine2": p2.address_line2 or "",
                "promoter2PinCode": p2.pin_code or "",
                "promoter2Mobile": p2.mobile,
                "promoter2Email": p2.email,
                "promoter2PanCard": p2.pan_card,
                "promoter2Aadhaar": p2.aadhaar or ""
            })

        orgMemberEntries = []
        for m in OrgMemberOtherTINDV.query.filter_by(application_no=application_no).all():
            orgMemberEntries.append({
                "id": m.id,
                "isIndian": m.is_indian,
                "name": m.name,
                "designation": m.designation,
                "mobile": m.mobile,
                "email": m.email,
                "address1": m.address_line1,
                "address2": m.address_line2 or "",
                "state": m.state or "",
                "district": m.district or "",
                "pinCode": m.pin_code or "",
                "aadhaar": m.aadhaar or "",
                "pan": m.pan or "",
                "din": m.din or ""
            })

        reraEntries = []
        for r in ReraOtherTINDV.query.filter_by(application_no=application_no).all():
            reraEntries.append({
                "id": r.id,
                "reraRegNumber": r.rera_reg_number,
                "reraState": r.rera_state,
                "registrationRevoked": r.registration_revoked,
                "revocationReason": r.revocation_reason or ""
            })

        projectEntries = []
        for p in PastProjectOtherTINDV.query.filter_by(application_no=application_no).all():
            projectEntries.append({
                "id": p.id,
                "projectName": p.project_name,
                "projectType": p.project_type,
                "currentStatus": p.current_status,
                "projectAddress": p.project_address,
                "projectStateUT": p.state or "",
                "projectDistrict": p.district or "",
                "pinCode": p.pin_code or "",
                "surveyNo": p.survey_no or ""
            })

        litigationEntries = []
        for l in LitigationOtherTINDV.query.filter_by(application_no=application_no).all():
            litigationEntries.append({
                "id": l.id,
                "caseNo": l.case_no,
                "tribunalPlace": l.tribunal_place,
                "petitionerName": l.petitioner_name,
                "respondentName": l.respondent_name,
                "caseFacts": l.case_facts,
                "caseStatus": l.case_status,
                "interimOrder": l.interim_order,
                "finalOrderDetails": l.final_order_details
            })

        return jsonify({
            "formData": formData,
            "promoter2Entries": promoter2Entries,
            "orgMemberEntries": orgMemberEntries,
            "reraEntries": reraEntries,
            "projectEntries": projectEntries,
            "litigationEntries": litigationEntries
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@promoter_other_t_indv_bp.route("/api/other-t-indv/promoter/update", methods=["PUT"])
def update_full_application():
    data = request.json
    try:
        application_no = data["applicationNo"]
        promoter = PromoterOtherTINDV.query.filter_by(application_no=application_no).first()
        if not promoter:
            return jsonify({"error": "Application not found"}), 404

        promoter.promoter_type = data.get("promoterType")
        promoter.type_of_promoter = data.get("typeOfPromoter")
        promoter.organization_name = data.get("organizationName")
        promoter.registration_number = data.get("cinNumber")
        promoter.registration_date = data.get("registrationDate")
        promoter.gst_number = data.get("gstNum")
        promoter.pan_number = data.get("panNumber")
        promoter.authorized_signatory_mobile = data.get("authorizedSignatoryMobile")
        promoter.authorized_signatory_email = data.get("authorizedSignatoryEmail")
        promoter.authorized_signatory_landline = data.get("authorizedSignatoryLandline")
        promoter.website = data.get("promoterWebsite")
        promoter.state = data.get("stateUT")
        promoter.district = data.get("district")
        promoter.bank_state = data.get("bankState")
        promoter.bank_name = data.get("bankName")
        promoter.branch_name = data.get("branchName")
        promoter.account_no = data.get("accountNo")
        promoter.account_holder = data.get("accountHolder")
        promoter.ifsc_code = data.get("ifsc")
        promoter.other_state_reg = data.get("otherStateReg")
        promoter.last_five_years = data.get("lastFiveYears")
        promoter.litigation = data.get("litigation")
        promoter.promoter2 = data.get("promoter2")

        # Delete existing collections
        Promoter2OtherTINDV.query.filter_by(application_no=application_no).delete()
        OrgMemberOtherTINDV.query.filter_by(application_no=application_no).delete()
        ReraOtherTINDV.query.filter_by(application_no=application_no).delete()
        PastProjectOtherTINDV.query.filter_by(application_no=application_no).delete()
        LitigationOtherTINDV.query.filter_by(application_no=application_no).delete()

        db.session.flush()

        # Insert new entries
        for p2 in data.get("promoter2Entries", []):
            db.session.add(Promoter2OtherTINDV(
                application_no=application_no,
                is_organization=p2.get("promoter2IsOrganization"),
                is_indian=p2.get("promoter2IsIndian"),
                name=p2.get("promoter2Name"),
                state=p2.get("promoter2State"),
                district=p2.get("promoter2District"),
                address_line1=p2.get("promoter2AddressLine1"),
                address_line2=p2.get("promoter2AddressLine2"),
                pin_code=p2.get("promoter2PinCode"),
                mobile=p2.get("promoter2Mobile"),
                email=p2.get("promoter2Email"),
                pan_card=p2.get("promoter2PanCard"),
                aadhaar=p2.get("promoter2Aadhaar")
            ))

        for member in data.get("orgMemberEntries", []):
            db.session.add(OrgMemberOtherTINDV(
                application_no=application_no,
                is_indian=member.get("isIndian"),
                name=member.get("name"),
                designation=member.get("designation"),
                mobile=member.get("mobile"),
                email=member.get("email"),
                address_line1=member.get("address1"),
                address_line2=member.get("address2"),
                state=member.get("state"),
                district=member.get("district"),
                pin_code=member.get("pinCode"),
                aadhaar=member.get("aadhaar"),
                pan=member.get("pan"),
                din=member.get("din")
            ))

        for r in data.get("reraEntries", []):
            db.session.add(ReraOtherTINDV(
                application_no=application_no,
                rera_reg_number=r.get("reraRegNumber"),
                rera_state=r.get("reraState"),
                registration_revoked=r.get("registrationRevoked"),
                revocation_reason=r.get("revocationReason")
            ))

        for proj in data.get("projectEntries", []):
            db.session.add(PastProjectOtherTINDV(
                application_no=application_no,
                project_name=proj.get("projectName"),
                project_type=proj.get("projectType"),
                current_status=proj.get("currentStatus"),
                project_address=proj.get("projectAddress"),
                state=proj.get("projectStateUT"),
                district=proj.get("projectDistrict"),
                pin_code=proj.get("pinCode"),
                survey_no=proj.get("surveyNo")
            ))

        for l in data.get("litigationEntries", []):
            db.session.add(LitigationOtherTINDV(
                application_no=application_no,
                case_no=l.get("caseNo"),
                tribunal_place=l.get("tribunalPlace"),
                petitioner_name=l.get("petitionerName"),
                respondent_name=l.get("respondentName"),
                case_facts=l.get("caseFacts"),
                case_status=l.get("caseStatus"),
                interim_order=l.get("interimOrder"),
                final_order_details=l.get("finalOrderDetails")
            ))

        db.session.commit()
        return jsonify({"message": "Application updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
