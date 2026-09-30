import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../../styles/scrutiny/scrutiny_projectregistation_2.css";
import "../../styles/scrutiny/scrutiny_remarks_field.css";

import ProjectWizard from "../../components/scrutiny/scrutiny_steper";
import ScrutinyPageHeader from "../../components/scrutiny/ScrutinyPageHeader";
import ScrutinyLayout from "../../components/scrutiny/ScrutinyLayout";
import ScrutinyProjectRegistrationSection 
  from "../../components/scrutiny/scrutiny_ExistingProjectRegistrationSection";
import ScrutinyProjectSiteAddress 
  from "../../components/scrutiny/scrutiny_ExistingProjectSiteAddress";
import ScrutinyProjectLocalAddress 
  from "../../components/scrutiny/scrutiny_ExistingProjectLocalAddress";

import ScrutinyProjectMaterialFacts 
  from "../../components/scrutiny/scrutiny_ExistingProjectMaterialFacts";

import ScrutinyLegalDeclaration 
  from "../../components/scrutiny/scrutiny_ExistingLegalDeclaration";

import ScrutinyProjectConstructionStatus 
  from "../../components/scrutiny/scrutiny_ExistingProjectConstructionStatus";

import ScrutinyOtherThanIndividualAuthorizedSignatory
  from "../../components/scrutiny/scrutiny_OtherThanIndividualAuthorizedSignatory";

import { apiDelete, apiGet, apiPost, apiPut } from "../../api/api";
import { useAdmin } from "../../context/AdminContext";

const normalizePromoterType = (value) => {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "individual") return "individual";
  if (
    normalized === "other" ||
    normalized === "other than individual" ||
    normalized === "otherthanindividual" ||
    normalized === "other_then_individual"
  ) {
    return "other";
  }

  return normalized || "other";
};

const normalizeDepartment = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "scrutiny" ? "verification" : normalized;
};

const getDepartmentLabel = (value) => {
  const labels = {
    verification: "Verification Team",
    planning: "Planning Team",
    legal: "Legal Team",
    audit: "Audit Team",
    engineer: "Scrutiny Engineer",
    director: "Director",
    chairman: "Chairman",
  };
  return labels[normalizeDepartment(value)] || "Verification Team";
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatShortfall = (value) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  const normalized = String(value || "").trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(normalized)) return "Yes";
  if (["no", "n", "false", "0"].includes(normalized)) return "No";
  return "N/A";
};

const PROJECT_PAGE_2_REMARK_DOCUMENT = "Project Registration Page 2";

const scrutiny_projectregistation_2 = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAdmin();
  const activeVerificationTeam = normalizeDepartment(admin?.department || "verification");

  let panNumber =
    location.state?.panNumber ||
    sessionStorage.getItem("panNumber")||"SUNIL0000K";

  let applicationNumber =
    location.state?.applicationNumber ||
    sessionStorage.getItem("applicationNumber")||"100126273336";

  let promoterType = normalizePromoterType(
   location.state?.promoterType ||
   sessionStorage.getItem("promoterType")||"other"
  );


  /* ===============================
     STATES
  =============================== */

  const [isExistingProject, setIsExistingProject] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [shortfall, setShortfall] = useState("");
  const [savedRemarks, setSavedRemarks] = useState([]);
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const [remarksSaving, setRemarksSaving] = useState(false);
  const [remarksMessage, setRemarksMessage] = useState("");

  const [fetchSuccessMsg, setFetchSuccessMsg] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const [formData, setFormData] = useState({

    projectName: "",
    projectDescription: "",
    projectType: "0",
    projectStatus: "0",

    buildingPlanNo: "",
    buildingPermissionFrom: "",
    buildingPermissionUpto: "",
    dateOfCommencement: "",
    proposedCompletionDate: "",

    totalAreaOfLand: "",
    buildingHeight: "",
    totalPlinthArea: "",
    totalBuiltUpArea: "",

    garagesAvailableForSale: "",
    totalGarageArea: "",

    openParkingSpaces: "",
    totalOpenParkingArea: "",

    coveredParkingSpaces: "",
    totalCoveredParkingArea: "",

    estimatedConstructionCost: "",
    costOfLand: "",

    projectAddress1: "",
    projectAddress2: "",
    projectDistrict: "0",
    projectMandal: "0",
    projectVillage: "0",
    projectPincode: "",

    projectLatitude: "",
    projectLongitude: "",
    planApprovingAuthority: "0",

    addressProof: null,
    address_proof_path: "",
    surveyNo: "",

    localAddress1: "",
    localAddress2: "",
    localArea: "",
    localLandmark: "",
    localDistrict: "0",
    localMandal: "0",
    localVillage: "0",
    localPincode: "",


    // ✅ Add these new fields

  authorizedSignatoryName: "",
  authorizedSignatoryMobile: "",
  authorizedSignatoryEmail: "",
  isExistingDirector: "",

  authorizedSignatoryPhoto: null,
  authorizedSignatoryPhotoPath: "",

  boardResolutionCopy: null,
  boardResolutionCopyPath: "",


    developmentCompleted: "",
    developmentPending: "",

    amountCollected: "",
    amountSpent: "",
    balanceAmount: "",

    planModified: false,
    projectDelayed: false,

    architect_certificate_path: "",
    engineer_certificate_path: "",
    ca_certificate_path: "",

    architectCertificate: null,
    engineerCertificate: null,
    caCertificate: null,

    numberOfUnits: "",
    unitsAdvanceTaken: "",
    unitsAgreementSale: "",
    unitsSold: "",

    legalDeclarationAccepted: false,
  });


  /* ===============================
     FORMAT DATE
  =============================== */

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };


  /* ===============================
     SAVE SESSION
  =============================== */

  useEffect(() => {
  sessionStorage.setItem("panNumber", panNumber);
  sessionStorage.setItem("applicationNumber", applicationNumber);

  if (promoterType) {
    sessionStorage.setItem("promoterType", promoterType);
  }

}, [panNumber, applicationNumber, promoterType]);
  /* ===============================
     LOAD EXISTING PROJECT
  =============================== */

  useEffect(() => {

    const loadProject = async () => {

      try {

       const endpoint =
  promoterType === "other"
    ? `/api/othertheninduvidual-project-registration/details?applicationNumber=${applicationNumber}&panNumber=${panNumber}`
    : `/api/project-registration/details?applicationNumber=${applicationNumber}&panNumber=${panNumber}`;

const res = await apiGet(endpoint);

        console.log("FETCH RESPONSE:", res);

        if (res?.data && Object.keys(res.data).length > 0) {

          setFetchSuccessMsg("");

          setIsExistingProject(true);

          const d = res.data;

          setFormData((prev) => ({

            ...prev,

            projectName: d.project_name || "",
            projectDescription: d.project_description || "",

            projectType: String(d.project_type || "0"),
            projectStatus: String(d.project_status || "0"),

            buildingPlanNo: d.building_plan_no || "",

            buildingPermissionFrom: formatDate(d.building_permission_from),
            buildingPermissionUpto: formatDate(d.building_permission_upto),
            dateOfCommencement: formatDate(d.date_of_commencement),
            proposedCompletionDate: formatDate(d.proposed_completion_date),

            totalAreaOfLand: d.total_area_of_land || "",
            buildingHeight: d.building_height || "",

            totalPlinthArea: d.total_plinth_area || "",
            totalBuiltUpArea: d.total_built_up_area || "",

            garagesAvailableForSale: d.garages_available_for_sale || "",
            totalGarageArea: d.total_garage_area || "",

            openParkingSpaces: d.open_parking_spaces || "",
            totalOpenParkingArea: d.total_open_parking_area || "",

            coveredParkingSpaces: d.covered_parking_spaces || "",
            totalCoveredParkingArea: d.total_covered_parking_area || "",

            estimatedConstructionCost: d.estimated_construction_cost || "",
            costOfLand: d.cost_of_land || "",

            projectAddress1: d.project_address1 || "",
            projectAddress2: d.project_address2 || "",

            projectDistrict: String(d.project_district || "0"),
            projectMandal: String(d.project_mandal || "0"),
            projectVillage: String(d.project_village || "0"),
            projectPincode: d.project_pincode || "",

            projectLatitude: d.project_latitude || "",
            projectLongitude: d.project_longitude || "",

            planApprovingAuthority: String(d.plan_approving_authority || "0"),

            surveyNo: d.survey_no || "",

            address_proof_path: d.address_proof_path || "",

            localAddress1: d.local_address1 || "",
            localAddress2: d.local_address2 || "",
            localArea: d.local_area || "",
            localLandmark: d.local_landmark || "",

            localDistrict: String(d.local_district || "0"),
            localMandal: String(d.local_mandal || "0"),
            localVillage: String(d.local_village || "0"),
            localPincode: d.local_pincode || "",


           authorizedSignatoryName: d.authorized_signatory_name || "",
           authorizedSignatoryMobile: d.authorized_signatory_mobile || "",
           authorizedSignatoryEmail: d.authorized_signatory_email || "",
           isExistingDirector: d.is_existing_director || "",

          authorizedSignatoryPhotoPath: d.authorized_signatory_photo_path || "",
          boardResolutionCopyPath: d.board_resolution_copy_path || "",


            developmentCompleted: d.development_completed || "",
            developmentPending: d.development_pending || "",

            amountCollected: d.amount_collected || "",
            amountSpent: d.amount_spent || "",
            balanceAmount: d.balance_amount || "",

            planModified: d.plan_modified === true,
            projectDelayed: d.project_delayed === true,

            architect_certificate_path: d.architect_certificate_path || "",
            engineer_certificate_path: d.engineer_certificate_path || "",
            ca_certificate_path: d.ca_certificate_path || "",

            numberOfUnits: d.number_of_units || "",
            unitsAdvanceTaken: d.units_advance_taken || "",
            unitsAgreementSale: d.units_agreement_sale || "",
            unitsSold: d.units_sold || "",

            legalDeclarationAccepted:
              d.legal_declaration_accepted === true,

          }));

        } else {

          setIsExistingProject(false);
          setFetchSuccessMsg("");
        }

      } catch (err) {

        console.error("FETCH ERROR:", err);
        setIsExistingProject(false);

      }
      
    };

    loadProject();

  }, [panNumber, applicationNumber, promoterType]);


  const loadPageRemarks = async () => {
    if (!String(applicationNumber || "").trim()) return;

    try {
      const encodedApplicationNo = encodeURIComponent(String(applicationNumber).trim());
      const [remarksResponse, finalStatusResponse] = await Promise.all([
        apiGet(`/api/scrutiny/verification-remarks?application_no=${encodedApplicationNo}&document_name=${encodeURIComponent(PROJECT_PAGE_2_REMARK_DOCUMENT)}&verification_team=${activeVerificationTeam}`),
        apiGet(`/api/scrutiny/final-status?application_no=${encodedApplicationNo}`),
      ]);

      setSavedRemarks(Array.isArray(remarksResponse?.rows) ? remarksResponse.rows : []);
      setFinalSubmitted(
        Array.isArray(finalStatusResponse?.rows) &&
          finalStatusResponse.rows.some(
            (row) => normalizeDepartment(row.verified_by) === activeVerificationTeam
          )
      );
    } catch (loadRemarksError) {
      console.error("Project page 2 remarks fetch failed", loadRemarksError);
    }
  };

  useEffect(() => {
    loadPageRemarks();
  }, [applicationNumber, activeVerificationTeam]);

  const savedPageRemark = savedRemarks[0] || null;
  const remarksLocked = finalSubmitted || Boolean(savedPageRemark);

  const handleAddRemark = async () => {
    if (remarksLocked) return;

    const trimmedRemarks = remarks.trim();
    if (!String(applicationNumber || "").trim()) {
      alert("Application number is missing.");
      return;
    }

    if (!shortfall) {
      alert("Please select whether there is any shortfall.");
      return;
    }

    if (!trimmedRemarks) {
      alert("Please enter remarks before adding.");
      return;
    }

    try {
      setRemarksSaving(true);
      setRemarksMessage("");
      await apiPost("/api/scrutiny/verification-remarks", {
        application_no: String(applicationNumber).trim(),
        document_name: PROJECT_PAGE_2_REMARK_DOCUMENT,
        verification_team: activeVerificationTeam,
        is_shortfall: shortfall === "yes",
        status: "pending",
        remarks: trimmedRemarks,
        verified_by: getDepartmentLabel(activeVerificationTeam),
      });
      setRemarks("");
      setShortfall("");
      setRemarksMessage("Remark added successfully.");
      await loadPageRemarks();
    } catch (saveRemarkError) {
      alert(saveRemarkError.message || "Unable to save remarks.");
    } finally {
      setRemarksSaving(false);
    }
  };

  const handleRemoveRemark = async (remarkId) => {
    if (finalSubmitted || !remarkId) return;

    if (!window.confirm("Remove this remark?")) return;

    try {
      setRemarksSaving(true);
      await apiDelete(
        `/api/scrutiny/verification-remarks/${remarkId}?application_no=${encodeURIComponent(String(applicationNumber).trim())}`
      );
      setRemarksMessage("Remark removed successfully.");
      await loadPageRemarks();
    } catch (removeRemarkError) {
      alert(removeRemarkError.message || "Unable to remove remark.");
    } finally {
      setRemarksSaving(false);
    }
  };
  /* ===============================
     CALCULATIONS
  =============================== */

  const totalOpenArea =
    Number(formData.totalAreaOfLand) > 0 &&
    Number(formData.totalPlinthArea) > 0
      ? (
          Number(formData.totalAreaOfLand) -
          Number(formData.totalPlinthArea)
        ).toFixed(2)
      : "";

  const totalProjectCost = (
    (Number(formData.estimatedConstructionCost) || 0) +
    (Number(formData.costOfLand) || 0)
  ).toFixed(2);


  /* ===============================
     HANDLERS
  =============================== */
  /* ===============================
     SUBMIT
  =============================== */
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!formData.legalDeclarationAccepted) {
//     alert("Accept legal declaration");
//     return;
//   }

//   const payload = {
//   ...formData,
//   panNumber,
//   applicationNumber,
//   totalOpenArea,
//   totalProjectCost,
// };

//   try {
//     // ✅ ALWAYS CALL SAME API
//     // ✅ If project exists → UPDATE
// if (promoterType === "other") {

//   if (isExistingProject) {
//     await apiPut(
//       "/api/othertheninduvidual-project-registration/update",
//       payload
//     );
//   } else {
//     await apiPost(
//       "/api/othertheninduvidual-project-registration",
//       payload
//     );
//   }

// } else {

//   if (isExistingProject) {
//     const formDataToSend = new FormData();

// // append normal fields
// Object.keys(formData).forEach((key) => {
//   if (formData[key] !== null && formData[key] !== undefined) {
//     formDataToSend.append(key, formData[key]);
//   }
// });

// formDataToSend.append("panNumber", panNumber);
// formDataToSend.append("applicationNumber", applicationNumber);
// formDataToSend.append("totalOpenArea", totalOpenArea);
// formDataToSend.append("totalProjectCost", totalProjectCost);

// const response = await fetch(
//   "https://bs20m5dw-8080.inc1.devtunnels.ms/api/project-registration/update",
//   {
//     method: "PUT",
//     body: formDataToSend,
//   }
// );

// if (!response.ok) {
//   throw new Error("Update failed");
// }
//   } else {
//     await apiPost("/api/project-registration", payload);
//   }

// }

// setSaveSuccessMsg("Project details saved successfully");
//     navigate("/existing-development-details", {
//       state: { panNumber, applicationNumber },
//     });

//   } catch (err) {
//     console.error("Submit Error:", err);
//     alert(err.message || "Save failed");
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.legalDeclarationAccepted) {
    alert("Accept legal declaration");
    return;
  }

  try {

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    });

    formDataToSend.append("panNumber", panNumber);
    formDataToSend.append("applicationNumber", applicationNumber);
    formDataToSend.append("totalOpenArea", totalOpenArea);
    formDataToSend.append("totalProjectCost", totalProjectCost);

    if (promoterType === "other") {

      if (isExistingProject) {

         await apiPut(
          "/api/othertheninduvidual-project-registration/update",
          formDataToSend
        );
      } else {

        await apiPost(
          "/api/othertheninduvidual-project-registration",
          Object.fromEntries(formDataToSend)
        );

      }

    } else {

      if (isExistingProject) {

      await apiPut(
        "/api/project-registration/update",
        formDataToSend
      );
      
      } else {
        await apiPost("/api/project-registration", Object.fromEntries(formDataToSend));
      }

    }

    setSaveSuccessMsg("Project details saved successfully");

    navigate("/scrutiny/project-registration_3", {
  state: { 
    panNumber, 
    applicationNumber,
    promoterType
  },
});

  } catch (err) {

    console.error("Submit Error:", err);
    alert(err.message || "Save failed");

  }
};
  /* ===============================
     RENDER
  =============================== */

  return (
    <ScrutinyLayout>
      <div className="project-details-container-scrutiny">

        <ScrutinyPageHeader />

        <ProjectWizard currentStep={2} />
        
         {fetchSuccessMsg && (
    <div className="alert-scrutiny alert-success-scrutiny">
      {fetchSuccessMsg}
    </div>
  )}

  {saveSuccessMsg && (
    <div className="alert-scrutiny alert-success-scrutiny">
      {saveSuccessMsg}
    </div>
  )}

        

        <form onSubmit={handleSubmit} className="project-form-scrutiny">

         <ScrutinyProjectRegistrationSection
    formData={{ ...formData, totalOpenArea, totalProjectCost }}
  />
          

          <ScrutinyProjectLocalAddress
    formData={formData}
  />
          <ScrutinyProjectSiteAddress
    formData={formData}
  />
          {promoterType === "other" && (
          <ScrutinyOtherThanIndividualAuthorizedSignatory
          formData={formData}
          />
          )}



         {["0", "3", ""].includes(formData.projectStatus) && (


            <ScrutinyProjectConstructionStatus
    formData={formData}
  />

          )}

          <ScrutinyProjectMaterialFacts
    formData={formData}
  />

          <ScrutinyLegalDeclaration
    formData={formData}
  />

          <section className="scrutiny-remarks-card">
            <div className="scrutiny-remarks-head">
              <h3>Enter Remarks (Data Shortfall Remarks if any)*</h3>
              <span>{Math.max(0, 5000 - remarks.length)}</span>
            </div>

            <div className="spr-shortfall-row" style={{ display: "flex", gap: "20px", margin: "10px 0 14px" }}>
              <label className="spr-radio">
                <input
                  type="radio"
                  name="projectPage2Shortfall"
                  value="yes"
                  checked={shortfall === "yes"}
                  disabled={remarksLocked}
                  onChange={(event) => setShortfall(event.target.value)}
                />
                <span style={{ marginLeft: "5px" }}>Yes</span>
              </label>
              <label className="spr-radio">
                <input
                  type="radio"
                  name="projectPage2Shortfall"
                  value="no"
                  checked={shortfall === "no"}
                  disabled={remarksLocked}
                  onChange={(event) => setShortfall(event.target.value)}
                />
                <span style={{ marginLeft: "5px" }}>No</span>
              </label>
            </div>

            <textarea
              id="scrutiny-project-registration-remarks"
              className="scrutiny-remarks-box"
              maxLength={5000}
              value={remarks}
              disabled={remarksLocked}
              onChange={(event) => setRemarks(event.target.value.slice(0, 5000))}
              placeholder="Maximum of 5000 Characters"
            />

            <div className="spr-submit-row" style={{ marginTop: "15px", textAlign: "right" }}>
              {remarksMessage ? (
                <span style={{ marginRight: "12px", color: "#166534", fontWeight: 600 }}>{remarksMessage}</span>
              ) : null}
              <button
                type="button"
                className="btn-scrutiny btn-primary-scrutiny"
                onClick={handleAddRemark}
                disabled={remarksSaving || remarksLocked}
              >
                {savedPageRemark ? "Remark Added" : "Add Remark"}
              </button>
            </div>

            {savedRemarks.length > 0 && (
              <div className="table-responsive" style={{ marginTop: "15px" }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>SNo</th>
                      <th>Description</th>
                      <th>Is Shortfall</th>
                      <th>Remarks</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedRemarks.map((item, index) => (
                      <tr key={item.id || index}>
                        <td>{index + 1}</td>
                        <td>{getDepartmentLabel(item.verified_by || item.verification_team)}</td>
                        <td>{formatShortfall(item.is_shortfall)}</td>
                        <td>{item.remarks || "N/A"}</td>
                        <td>{formatDateTime(item.created_at || item.updated_at)}</td>
                        <td>
                          {!finalSubmitted ? (
                            <button
                              type="button"
                              className="btn-scrutiny btn-secondary-scrutiny"
                              onClick={() => handleRemoveRemark(item.id)}
                              disabled={remarksSaving}
                            >
                              Remove
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="form-section-scrutiny">

            <button type="submit" className="btn-scrutiny btn-primary-scrutiny pull-right-scrutiny">

              {isExistingProject ? "Next Page" : "Save And Continue"}

            </button>

          </div>

        </form>

      </div>
    </ScrutinyLayout>
  );
};

export default scrutiny_projectregistation_2;
