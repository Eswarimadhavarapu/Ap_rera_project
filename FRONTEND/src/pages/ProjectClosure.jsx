import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/ProjectClosure.css";

export default function ProjectClosure() {
    const location = useLocation();

    const [projectDetails, setProjectDetails] = useState({
        applicationNumber: location.state?.projectData?.application_number || localStorage.getItem("application_no"),
        projectName: location.state?.projectData?.project_name || localStorage.getItem("project_name"),
        promoterName: location.state?.projectData?.name || localStorage.getItem("promoter_name")
    });

 const [success, setSuccess] = useState(false);
 const [hasOccupancy, setHasOccupancy] = useState("");
 const RequiredStar = () => <span style={{ color: "red" }}> *</span>;
 const handlePdfValidation = (e) => {
  const file = e.target.files[0];
  if (file && file.type !== "application/pdf") {
    alert("Only PDF files are allowed");
    e.target.value = "";
  }
};

const handleImageValidation = (e) => {
  const files = Array.from(e.target.files);
  const invalid = files.some(
    (file) =>
      !["image/png", "image/jpeg", "image/jpg"].includes(file.type)
  );

  if (invalid) {
    alert("Only image files are allowed");
    e.target.value = "";
  }
};

        const handleSubmit = async (e) => {

            e.preventDefault();

            const form = new FormData(e.target);

            form.append("applicationNumber", projectDetails.applicationNumber);
            form.append("projectName", projectDetails.projectName);
            form.append("promoterName", projectDetails.promoterName);

            const response = await fetch(
                "https://0jv8810n-8080.inc1.devtunnels.ms/api/project_closure/submit",
                {
                    method: "POST",
                    body: form
                }
            );

            const result = await response.json();

            if (result.status === "success") {
                setSuccess(true);
            }

        };

        if (success) {
            return (
                <div className="projectclosure-closure-container">
                    <h2 className="projectclosure-success">✔ Request Submitted Successfully</h2>
                </div>
            );
        }

        return (

            <div className="projectclosure-closure-container">

                <h2 className="projectclosure-page-title">Closure Details</h2>

                <div className="projectclosure-closure-card">

                    <div className="projectclosure-project-box">

                        <label className="projectclosure-label">Application No</label>
                        <input className="projectclosure-input" value={projectDetails.applicationNumber || ""} readOnly />

                        <label className="projectclosure-label">Project Name</label>
                        <input className="projectclosure-input" value={projectDetails.projectName || ""} readOnly />

                        <label className="projectclosure-label">Promoter Name</label>
                        <input className="projectclosure-input" value={projectDetails.promoterName || ""} readOnly />

                    </div>

                    <h3 className="projectclosure-section-title">Supporting Documents</h3>

                    <form className="projectclosure-closure-form" onSubmit={handleSubmit}>

                    <div className="projectclosure-occupancy-row">
        <label className="projectclosure-input">
    1. Do you have Occupancy Certificate:
    <RequiredStar />
    </label>

        <div className="projectclosure-radio-group">
            <label className="projectclosure-label">
                <input
                    type="radio"
                    name="occupancyCertificateStatus"
                    value="Yes"
                    onChange={(e) => setHasOccupancy(e.target.value)}
                    className="projectclosure-input"
                />
                YES
            </label>

            <label className="projectclosure-label">
                <input
                    type="radio"
                    name="occupancyCertificateStatus"
                    value="No"
                    onChange={(e) => setHasOccupancy(e.target.value)}
                    className="projectclosure-input"
                />
                NO
            </label>
        </div>
    </div>

    {/* SHOW FILE UPLOAD ONLY IF YES */}

    {hasOccupancy === "Yes" && (
        <div className="projectclosure-form-row">
            <label className="projectclosure-label">Upload Occupancy Certificate: *</label>
            <input
  type="file"
  name="occupancyCertificateDoc"
  accept=".pdf"
  required
  onChange={handlePdfValidation}
  className="projectclosure-input"
/>
        </div>
    )}

                        <div className="projectclosure-form-row">
        <label className="projectclosure-label">
            2. All the Sale Deed Copies shall be uploaded
            <RequiredStar />
        </label>
                            <input
  type="file"
  name="saleDeedCopiesDoc"
  accept=".pdf"
  required
  onChange={handlePdfValidation}
  className="projectclosure-input"
/>
                        </div>

                        <div className="projectclosure-form-row">
                            <label className="projectclosure-label">
    3. The Promoter has to form an Association of Allottee
    <RequiredStar />
    </label>
                            <input
  type="file"
  name="associationOfAllotteesDoc"
  accept=".pdf"
  required
  onChange={handlePdfValidation}
  className="projectclosure-input"
/>
                        </div>

                        <div className="projectclosure-form-row">
                        <label className="projectclosure-label">
    4. The Common Areas/Amenities as completed and the same shall be handed over
    <RequiredStar />
    </label>
                            <input
  type="file"
  name="commonAreasHandoverDoc"
  accept=".pdf"
  required
  onChange={handlePdfValidation}
  className="projectclosure-input"
/>
                        </div>

                        <div className="projectclosure-form-row">
                            <label className="projectclosure-label">5.An Affidavit regarding the Structural Liability Has to be submittedas per RERA format(F6) <RequiredStar /></label>
                            <input
  type="file"
  name="structuralLiabilityDoc"
  accept=".pdf"
  required
  onChange={handlePdfValidation}
  className="projectclosure-input"
/>
                        </div>

                        <div className="projectclosure-form-row">
                            <label className="projectclosure-label">6. An Affidavit regarding the structural liability has to be submitted as per RERA format(F7) <RequiredStar /></label>
                            <input
  type="file"
  name="unsoldUnitsDoc"
  accept=".pdf"
  required
  onChange={handlePdfValidation}
  className="projectclosure-input"
/>
                        </div>

                        <div className="projectclosure-form-row">
                            <label className="projectclosure-label">7. Consolidated Bank Statement of RERA designated bank account <RequiredStar /></label>
                            <input
  type="file"
  name="reraBankStatementDoc"
  accept=".pdf"
  required
  onChange={handlePdfValidation}
  className="projectclosure-input"
/>
                        </div>

                        <div className="projectclosure-form-row">
                            <label className="projectclosure-label">8. Latest Photographs of the project <RequiredStar /></label>
                            <input
  type="file"
  name="projectPhotosDoc"
  accept="image/png, image/jpeg, image/jpg"
  multiple
  required
  onChange={handleImageValidation}
  className="projectclosure-input"
/>
                        </div>


                        <div className="projectclosure-button-row">
                            <button type="reset" className="projectclosure-reset-btn">Reset</button>
                            <button type="submit" className="projectclosure-submit-btn">Submit Application</button>
                        </div>

                    </form>

                </div>

            </div>

        );
    }