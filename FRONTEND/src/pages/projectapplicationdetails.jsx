import "../styles/projectapplicationdetails.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ProjectApplicationDetails = () => {
  const navigate = useNavigate();

  // 🔴 Store errors for each file input
  const [fileErrors, setFileErrors] = useState({});

  // ✅ Only PDF validation (NO popup)
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setFileErrors((prev) => ({
        ...prev,
        [fieldName]: "Please upload only PDF format",
      }));
      e.target.value = "";
    } else {
      setFileErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fileInputs = document.querySelectorAll('input[type="file"]');
    let allFilesUploaded = true;

    fileInputs.forEach((input) => {
      if (!input.files || input.files.length === 0) {
        allFilesUploaded = false;
      }
    });

    if (!allFilesUploaded) {
      alert(
        "Please upload all the required supporting documents before submitting."
      );
      return;
    }

    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the application?"
    );

    if (confirmSubmit) {
      alert("Application submitted successfully.");
      navigate("/extensionpaymentpage");
    }
  };

  return (
    <div className="projectapplicationdetails-form-container">
      <h2 className="projectapplicationdetails-form-title">Extension process</h2>
        <form className="projectapplicationdetails-application-form" onSubmit={handleSubmit}>
            <div className="projectapplicationdetails-note-text">
    Note: Double the registration fee for extension process
  </div>
        <div className="projectapplicationdetails-form-row">
          <label>Application No</label>
          <input type="text" placeholder="Enter Application No" />
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>Project Name</label>
          <input type="text" placeholder="Enter Project Name" />
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>Project ID</label>
          <input type="text" placeholder="Enter Project ID" />
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>Validity From</label>
          <input type="text" placeholder="mm/dd/yyyy" />
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>Validity To According to Plans & Proceedings</label>
          <input type="text" placeholder="mm/dd/yyyy" />
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>
            Mention New Validity From Date According to Plan and Proceedings
          </label>
          <input type="date" />
        </div>

        <div className="projectapplicationdetails-form-row">
          <label>
            Mention New Validity To Date According to Plan and Proceedings
          </label>
          <input type="date" />
        </div>

        <div className="projectapplicationdetails-section-title">Supporting Documents</div>

        {/* 1 */}
        <div className="projectapplicationdetails-form-row">
          <label>1. Representation Letter explaining the reason for delay</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "doc1")}
          />
          {fileErrors.doc1 && (
            <div className="projectapplicationdetails-file-error">{fileErrors.doc1}</div>
          )}
        </div>

        {/* 2 */}
        <div className="projectapplicationdetails-form-row">
          <label>2. Form B with revised completion dates</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "doc2")}
          />
          {fileErrors.doc2 && (
            <div className="projectapplicationdetails-file-error">{fileErrors.doc2}</div>
          )}
        </div>

        {/* 3 */}
        <div className="projectapplicationdetails-form-row">
          <label>3. Consent letter from the allottees</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "doc3")}
          />
          {fileErrors.doc3 && (
            <div className="projectapplicationdetails-file-error">{fileErrors.doc3}</div>
          )}
        </div>

        {/* Form E */}
        <div className="projectapplicationdetails-form-row form-e-row">
          <div className="projectapplicationdetails-form-e-top">
            <label>4. Form E for Renewal</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "formE")}
            />
          </div>

          {fileErrors.formE && (
            <div className="projectapplicationdetails-file-error">{fileErrors.formE}</div>
          )}

          <div className="projectapplicationdetails-download-note">
            Download Form E from Forms Download
          </div>
        </div>

        {/* Form P4 */}
        <div className="projectapplicationdetails-form-row form-p4-row">
          <label>5. Change Request in Form P4</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "formP4")}
          />

          {fileErrors.formP4 && (
            <div className="projectapplicationdetails-file-error">{fileErrors.formP4}</div>
          )}

          <div className="projectapplicationdetails-download-note">
            Download P4 from Forms Download
          </div>
        </div>

        {/* 6 */}
        <div className="projectapplicationdetails-form-row">
          <label>6. Extension proceeding granted by local authority</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "doc6")}
          />
          {fileErrors.doc6 && (
            <div className="projectapplicationdetails-file-error">{fileErrors.doc6}</div>
          )}
        </div>

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