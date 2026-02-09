import "../styles/projectapplicationdetails.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const ProjectApplicationDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ DATA FROM PREVIOUS PAGE
  const projectData = location.state?.projectData;
  console.log("Received Project Data:", projectData);

  const formatDateOnly = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-GB") : "";

  const [fileErrors, setFileErrors] = useState({});
  const [files, setFiles] = useState({});
  const [formData, setFormData] = useState({
    newValidityFrom: "",
    newValidityTo: "",
  });

  // ✅ FILE VALIDATION
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setFileErrors((prev) => ({
        ...prev,
        [fieldName]: "Please upload only PDF format",
      }));
      e.target.value = "";
      return;
    }

    setFileErrors((prev) => ({ ...prev, [fieldName]: "" }));
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ SUBMIT (MATCHES BACKEND)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFiles = [
      "representation_letter",
      "form_b",
      "consent_letter",
      "form_e",
      "form_p4",
      "extension_proceeding",
    ];

    for (let key of requiredFiles) {
      if (!files[key]) {
        alert("Please upload all the required supporting documents.");
        return;
      }
    }

    const payload = new FormData();

    payload.append("application_number", projectData.application_number);
    payload.append("project_name", projectData.promoter_name);
    payload.append("project_id", "");
    payload.append("validity_from", projectData.validity_from);
    payload.append("validity_to", projectData.validity_to);
    payload.append("new_validity_from", formData.newValidityFrom);
    payload.append("new_validity_to", formData.newValidityTo);

    payload.append("representation_letter", files.representation_letter);
    payload.append("form_b", files.form_b);
    payload.append("consent_letter", files.consent_letter);
    payload.append("form_e", files.form_e);
    payload.append("form_p4", files.form_p4);
    payload.append("extension_proceeding", files.extension_proceeding);

    console.log("Submitting payload:", [...payload.entries()]);

    try {
      const res = await fetch(
        "https://7pcdv8zx-8080.inc1.devtunnels.ms/api/extension-application",
        {
          method: "POST",
          body: payload,
        }
      );

      if (!res.ok) throw new Error();

      alert("Application submitted successfully");
      navigate("/extensionpaymentpage");
    } catch (err) {
      console.error(err);
      alert("Error submitting application");
    }
  };

  if (!projectData) return <p>No project data found</p>;

  return (
    <div className="projectapplicationdetails-form-container">
      <h2 className="projectapplicationdetails-form-title">
        Extension process
      </h2>

      <form
        className="projectapplicationdetails-application-form"
        onSubmit={handleSubmit}
      >
        <div className="projectapplicationdetails-note-text">
          Note: Double the registration fee for extension process
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>Application No</label>
          <input value={projectData.application_number} disabled />
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>Project Name</label>
          <input value={projectData.promoter_name} disabled />
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>Project ID</label>
          <input value="null" disabled />
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>Validity From</label>
          <input value={formatDateOnly(projectData.validity_from)} disabled />
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>Validity To According to Plans & Proceedings</label>
          <input value={formatDateOnly(projectData.validity_to)} disabled />
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>Mention New Validity From Date According to Plan and Proceedings</label>
          <input
            type="date"
            name="newValidityFrom"
            onChange={handleChange}
            required
          />
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>Mention New Validity To Date According to Plan and Proceedings</label>
          <input
            type="date"
            name="newValidityTo"
            onChange={handleChange}
            required
          />
        </div>

        <div className="projectapplicationdetails-section-title">
          Supporting Documents
        </div>

        {[
  ["representation_letter", "1. Representation Letter explaining the reason for delay"],
  ["form_b", "2. Form B with revised completion dates"],
  ["consent_letter", "3. Consent letter from the allottees"],
  ["form_e", "4. Form E for Renewal"],
  ["form_p4", "5. Change Request in Form P4"],
  ["extension_proceeding", "6. Extension proceeding granted by local authority"],
].map(([key, label]) => (
  <div className="projectapplicationdetails-form-row" key={key}>
    <label>{label}</label>
    <input type="file" onChange={(e) => handleFileChange(e, key)} />

    {/* 🔴 ERROR MESSAGE */}
    {fileErrors[key] && (
      <div className="projectapplicationdetails-file-error">
        {fileErrors[key]}
      </div>
    )}

    {/* 🔴 DOWNLOAD NOTES (ONLY FOR FORM E & FORM P4) */}
    {key === "form_e" && (
      <div style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
        Download Form E from Forms Download
      </div>
    )}

    {key === "form_p4" && (
      <div style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
        Download P4 from Forms Download
      </div>
    )}
  </div>
))}

        

        <div className="projectapplicationdetails-button-row">
          <button type="reset" className="projectapplicationdetails-btn reset">
            Reset
          </button>
          <button type="submit" className="projectapplicationdetails-btn submit">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectApplicationDetails;