import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/ProjectDetails.css";
import ProjectWizard from "../components/ProjectWizard";

import ProjectRegistrationSection from "../components/ProjectRegistrationSection";
import ProjectSiteAddress from "../components/ProjectSiteAddress";
import ProjectLocalAddress from "../components/ProjectLocalAddress";
import ProjectMaterialFacts from "../components/ProjectMaterialFacts";
import LegalDeclaration from "../components/LegalDeclaration";

const ProjectDetails = () => {
  const navigate = useNavigate();

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
    totalOpenArea: "",
    totalBuiltUpArea: "",
    garagesAvailableForSale: "",
    totalGarageArea: "",
    openParkingSpaces: "",
    totalOpenParkingArea: "",
    coveredParkingSpaces: "",
    totalCoveredParkingArea: "",
    estimatedConstructionCost: "",
    costOfLand: "",
    totalProjectCost: "",

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

    // Project Material Facts
    numberOfUnits: "",
    unitsAdvanceTaken: "",
    unitsAgreementSale: "",
    unitsSold: "",

    // Legal
    legalDeclarationAccepted: false,
  });

  // 🔹 COMMON INPUT HANDLER
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.legalDeclarationAccepted) {
      alert("Please accept the legal declaration");
      return;
    }

    console.log("✅ FULL PROJECT DETAILS DATA:", formData);

    navigate("/Development-Details");
  };

  return (
    <div className="project-details-container">
      <ProjectWizard currentStep={2} />

      <h2 className="page-title">Project Registration</h2>

      {/* 🔹 ONE FORM ONLY */}
      <form onSubmit={handleSubmit} className="project-form">

        <ProjectRegistrationSection
          formData={formData}
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
