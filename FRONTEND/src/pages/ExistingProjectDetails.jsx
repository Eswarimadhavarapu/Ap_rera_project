import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../styles/ProjectDetails.css";

import ProjectWizard from "../components/ProjectWizard";
import ProjectRegistrationSection from "../components/ExistingProjectRegistrationSection";
import ProjectSiteAddress from "../components/ExistingProjectSiteAddress";
import ProjectLocalAddress from "../components/ExistingProjectLocalAddress";
import ProjectMaterialFacts from "../components/ExistingProjectMaterialFacts";
import LegalDeclaration from "../components/ExistingLegalDeclaration";
import ProjectConstructionStatus from "../components/ExistingProjectConstructionStatus";

import { apiPost } from "../api/api";

const ExistingProjectDetails = () => {

  const navigate = useNavigate();
  const location = useLocation();

  let panNumber =
    location.state?.panNumber ||
    sessionStorage.getItem("panNumber");

  let applicationNumber =
    location.state?.applicationNumber ||
    sessionStorage.getItem("applicationNumber");


  /* ===============================
     STATES
  =============================== */

  const [isExistingProject, setIsExistingProject] = useState(false);

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
  }, [panNumber, applicationNumber]);


  /* ===============================
     LOAD EXISTING PROJECT
  =============================== */

  useEffect(() => {

    const loadProject = async () => {

      try {

        const res = await apiPost("/api/get-project-by-application", {
          panNumber,
          applicationNumber,
        });

        console.log("FETCH RESPONSE:", res);

        if (res?.data && Object.keys(res.data).length > 0) {

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

        }

      } catch (err) {

        console.error("FETCH ERROR:", err);
        setIsExistingProject(false);

      }
    };

    loadProject();

  }, [panNumber, applicationNumber]);


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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };


  /* ===============================
     SUBMIT
  =============================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.legalDeclarationAccepted) {
      alert("Accept legal declaration");
      return;
    }

    // 👉 EXISTING → JUST CONTINUE
    if (isExistingProject) {

      navigate("/existing-development-details", {
        state: { panNumber, applicationNumber },
      });

      return;
    }

    // 👉 NEW → SAVE

    const payload = new FormData();

    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== "") {
        payload.append(k, v);
      }
    });

    payload.append("panNumber", panNumber);
    payload.append("applicationNumber", applicationNumber);
    payload.append("totalOpenArea", totalOpenArea);
    payload.append("totalProjectCost", totalProjectCost);

    try {

      await apiPost("/api/project-registration", payload);

      navigate("/Development-Details", {
        state: { panNumber, applicationNumber },
      });

    } catch (err) {

      alert(err.message || "Save failed");

    }
  };


  /* ===============================
     RENDER
  =============================== */

  return (

    <div className="project-details-container">

      <ProjectWizard currentStep={2} />

      <form onSubmit={handleSubmit} className="project-form">

        <ProjectRegistrationSection
          formData={{ ...formData, totalOpenArea, totalProjectCost }}
          handleInputChange={handleInputChange}
        />

        <ProjectSiteAddress
          formData={formData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
        />

        <ProjectLocalAddress
          formData={formData}
          handleInputChange={handleInputChange}
        />
       {["0", "3", ""].includes(formData.projectStatus) && (


          <ProjectConstructionStatus
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
          />

        )}

        <ProjectMaterialFacts
          formData={formData}
          handleInputChange={handleInputChange}
        />

        <LegalDeclaration
          formData={formData}
          handleInputChange={handleInputChange}
        />

        <div className="form-section">

          <button type="submit" className="btn btn-primary pull-right">

            {isExistingProject ? "Continue" : "Save And Continue"}

          </button>

        </div>

      </form>

    </div>
  );
};

export default ExistingProjectDetails;