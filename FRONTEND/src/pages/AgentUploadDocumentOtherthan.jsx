import { useState } from "react";
import "../styles/AgentUploadDocumentOtherthan.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";



export default function AgentUploadDocumentOtherthan() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({});
  const [agreed, setAgreed] = useState(false);
const [showError, setShowError] = useState("");
const location = useLocation();

const {
  application_id,
  organisation_id,
  organization_pan_curd,
  status,
} = location.state || {};


  /* ✅ FIXED FUNCTION NAME */
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

const handleSubmit = async () => {
  setShowError("");

  if (!files.year1) {
    setShowError("Please Upload Income Tax Return Acknowledgement of Year 1");
    return;
  }

  if (!files.year2) {
    setShowError("Please Upload Income Tax Return Acknowledgement of Year 2");
    return;
  }

  if (!files.year3) {
    setShowError("Please Upload Income Tax Return Acknowledgement of Year 3");
    return;
  }

  if (!agreed) {
    setShowError("Please Check Self Declaration");
    return;
  }

  // ✅ CHECK NAVIGATION DATA
  if (!application_id || !organisation_id || !organization_pan_curd) {
    setShowError("Session expired. Please submit Agent Details again.");
    return;
  }

  try {
    const formData = new FormData();

    // ✅ SEND BACKEND REQUIRED IDS
    formData.append("application_id", application_id);
    formData.append("organisation_id", organisation_id);
    formData.append("pan_card_number", organization_pan_curd);

    // ✅ SEND FILES
    formData.append("itr_year1_doc", files.year1);
    formData.append("itr_year2_doc", files.year2);
    formData.append("itr_year3_doc", files.year3);

    const res = await fetch(
      "https://0jv8810n-8080.inc1.devtunnels.ms/api/agent/other-than-individual/itr",
      {
        method: "PATCH",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setShowError(data.message || "Upload failed");
      return;
    }

    alert("ITR Documents Uploaded Successfully ✅");

    navigate("/preview-other", {
  state: {
    application_id,
    organisation_id,
    pan_card_number: organization_pan_curd,
  },
});


  } catch (err) {
    console.error(err);
    setShowError("Server error. Try again later.");
  }
};




  const downloadFile = (file) => {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(url);
};


  return (
    <div className="zagentud-page-wrapper">
      {/* Breadcrumb */}
      <div className="zagentud-breadcrumb">
        You are here :{" "}
        <a href="/">Home</a> / Registration /{" "}
        <strong>Real Estate Agent Registration</strong>
      </div>

      <div className="zagentud-container">
        {/* Page Title */}
        <h2 className="zagentud-heading">Real Estate Agent Registration</h2>

        {/* Stepper */}
        <div className="zagentud-steps-box">
          <div className="zagentud-steps">
            {[
              "Agent Detail",
              "Upload Documents",
              "Preview",
              "Payment",
              "Acknowledgement",
            ].map((step, index) => (
              <div
                key={step}
                className={`zagentud-step ${
                  index === 1
                    ? "agentud-step-active"
                    : index < 1
                    ? "agentud-step-completed"
                    : ""
                }`}
              >
                <div className="zagentud-step-circle">{index + 1}</div>
                <div className="zagentud-step-label">{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Documents */}
        <h3 className="zagentud-section-heading">Upload Documents</h3>

        <p className="zagentud-note">
          <strong>Note :</strong> If the entity is registered below 3 years period
          and if the IT returns are not available for 3 years period agent has to
          upload the available IT returns of the entity with a specific reason,
          refer form A3 in form downloads for proforma of this Sample Affidavit.
        </p>

        {/* ❌ ERROR POPUP */}
       {/* 🔴 CENTER POPUP OVERLAY */}
{showError && (
  <div className="zagentud-inline-error">
    <span>{showError}</span>
    <button
      type="button"
      className="zagentud-inline-error-close"
      onClick={() => setShowError("")}
    >
      ✕
    </button>
  </div>
)}







        <table className="zagentud-table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Upload Document</th>
              <th>Uploaded Document</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Income Tax Return Acknowledgement of Preceding Year 1{" "}
                <span className="zagentud-required">*</span>
              </td>
              <td>
                <input
                  type="file"
                  name="year1"
                  onChange={handleFileChange}
                />
              </td>
           <td
  onClick={() => downloadFile(files.year2)}
  style={{ cursor: "pointer", color: "#1e90ff", textDecoration: "underline" }}
>
  {files.year1?.name}
</td>

            </tr>

            <tr>
              <td>
                Income Tax Return Acknowledgement of Preceding Year 2{" "}
                <span className="zagentud-required">*</span>
              </td>
              <td>
                <input
                  type="file"
                  name="year2"
                  onChange={handleFileChange}
                />
              </td>
              <td
onClick={() => downloadFile(files.year2)}
  style={{ cursor: "pointer", color: "#1e90ff", textDecoration: "underline" }}
>
  {files.year2?.name}
</td>

            </tr>

            <tr>
              <td>
                Income Tax Return Acknowledgement of Preceding Year 3{" "}
                <span className="zagentud-required">*</span>
              </td>
              <td>
                <input
                  type="file"
                  name="year3"
                  onChange={handleFileChange}
                />
              </td>
              <td
  onClick={() => downloadFile(files.year3)}
  style={{ cursor: "pointer", color: "#1e90ff", textDecoration: "underline" }}
>
  {files.year3?.name}
</td>

            </tr>
          </tbody>
        </table>

        {/* Declaration */}
        <div className="zagentud-declaration">
          <h3 className="zagentud-section-heading">Declaration</h3>

          <div className="zagentud-declaration-row">
            <label className="zagentud-declaration-text">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span> I/We </span>
              <input type="text" className="zagentud-declaration-input" />
              <span>
                solemnly affirm and declare that the particulars given above are
                correct to my/our knowledge and belief.
              </span>
            </label>
          </div>

          <div className="zagentud-declaration-actions">
            <button
              className="zagentud-btn-primary"
             
              onClick={handleSubmit}
            >
              Save And Continue
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}