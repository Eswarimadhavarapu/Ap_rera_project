import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/ProjectDetails.css";
import ProjectWizard from "../components/ProjectWizard";

import ProjectRegistrationSection from "../components/ProjectRegistrationSection";
import ProjectSiteAddress from "../components/ProjectSiteAddress";
import ProjectLocalAddress from "../components/ProjectLocalAddress";
import ProjectMaterialFacts from "../components/ProjectMaterialFacts";
import LegalDeclaration from "../components/LegalDeclaration";
import ProjectConstructionStatus from "../components/ProjectConstructionStatus";
import { apiPost } from "../api/api";

const ProjectDetails = () => {
  const navigate = useNavigate();

  
  // ✅ ADD HERE (just below useNavigate)
  const HARD_PAN = "EPBPPO375F";
  const HARD_APPLICATION_NO = "APP-2026-0089";

  const [errors, setErrors] = useState({
  plinthArea: "",
});


  // 🔹 SINGLE SOURCE OF TRUTH
  const [formData, setFormData] = useState({
    // Project Registration
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

    // Project Site Address
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
    surveyNo: "",

    // Project Local Address
    localAddress1: "",
    localAddress2: "",
    localArea: "",
    localLandmark: "",
    localDistrict: "0",
    localMandal: "0",
    localVillage: "0",
    localPincode: "",
    projectWebsiteURL: "",

    // Construction Status
    developmentCompleted: "",
    developmentPending: "",
    amountCollected: "",
    amountSpent: "",
    balanceAmount: "",
    planModified: "",

    // Certificates
    architectCertificate: null,
    engineerCertificate: null,
    caCertificate: null,

    // Project Delay
    projectDelayed: "",

    // Project Material Facts
    numberOfUnits: "",
    unitsAdvanceTaken: "",
    unitsAgreementSale: "",
    unitsSold: "",

    // Legal
    legalDeclarationAccepted: false,
  });

const totalOpenArea =
  Number(formData.totalAreaOfLand) > 0
    ? Number(formData.totalPlinthArea) > 0
      ? Number(formData.totalPlinthArea) <= Number(formData.totalAreaOfLand)
        ? (
            Number(formData.totalAreaOfLand) -
            Number(formData.totalPlinthArea)
          ).toFixed(2)
        : ""
      : Number(formData.totalAreaOfLand).toFixed(2)
    : "";



const totalProjectCost =
  Number(formData.estimatedConstructionCost) ||
  Number(formData.costOfLand)
    ? (
        (Number(formData.estimatedConstructionCost) || 0) +
        (Number(formData.costOfLand) || 0)
      ).toFixed(2)
    : "";
const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;

  // allow only numbers & decimals
  if (
    ["totalAreaOfLand", "totalPlinthArea", "estimatedConstructionCost", "costOfLand"].includes(name) &&
    value !== "" &&
    !/^\d*\.?\d*$/.test(value)
  ) {
    return;
  }

  setFormData((prev) => {
    // 🔹 CASCADING RESET (IMPORTANT)
    if (name === "projectDistrict") {
      return {
        ...prev,
        projectDistrict: value,
        projectMandal: "0",
        projectVillage: "0",
      };
    }

    if (name === "projectMandal") {
      return {
        ...prev,
        projectMandal: value,
        projectVillage: "0",
      };
    }

    const updated = {
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    };

    const totalLand = Number(updated.totalAreaOfLand) || 0;
    const plinthArea = Number(updated.totalPlinthArea) || 0;

    if (name === "totalPlinthArea" && plinthArea > totalLand) {
      setErrors({
        plinthArea: "Plinth area cannot be greater than total land area",
      });
      return prev;
    }

    setErrors({ plinthArea: "" });
    return updated;
  });
};

  // 🔹 FILE HANDLER
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  // 🔹 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.legalDeclarationAccepted) {
      alert("Please accept the legal declaration");
      return;
    }

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        payload.append(key, value);
      }
    });
    
  // 🔹 HARD-CODED VALUES
  payload.append("panNumber", HARD_PAN);
  payload.append("applicationNumber", HARD_APPLICATION_NO);

    // ✅ append derived values
    payload.append("totalOpenArea", totalOpenArea);
    payload.append("totalProjectCost", totalProjectCost);

    try {
       await apiPost("/api/project-registration", payload);
      navigate("/Development-Details");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="project-details-container">
      <ProjectWizard currentStep={2} />

      {/* 🔹 ONE FORM ONLY */}
      <form onSubmit={handleSubmit} className="project-form">
        <ProjectRegistrationSection
          formData={{
            ...formData,
            totalOpenArea,
            totalProjectCost,
          }}
          handleInputChange={handleInputChange}
           errors={errors}   // ✅ USE IT
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

        {formData.projectStatus === "3" && (
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
            Save And Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectDetails;