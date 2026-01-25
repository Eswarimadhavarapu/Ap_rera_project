import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Upload.css";
import { apiPost } from "../api/api";

const AgentUploadDocuments = () => {
  const navigate = useNavigate();

  const [files, setFiles] = useState({
    year1: null,
    year2: null,
    year3: null,
  });

  const [agree, setAgree] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const closePopup = () => setPopup({ show: false, message: "" });

  const handleSaveAndContinue = async () => {
    // Validation
    if (!files.year1)
      return setPopup({
        show: true,
        message: "Please Upload ITR Year 1",
      });

    if (!files.year2)
      return setPopup({
        show: true,
        message: "Please Upload ITR Year 2",
      });

    if (!files.year3)
      return setPopup({
        show: true,
        message: "Please Upload ITR Year 3",
      });

    if (!agree)
      return setPopup({
        show: true,
        message: "Please accept the declaration",
      });

    try {
      setIsLoading(true);

      // Get applicant details from localStorage
      const applicantDetailsStr = localStorage.getItem("agentApplicantDetails");
      if (!applicantDetailsStr) {
        return setPopup({
          show: true,
          message: "Applicant details not found. Please complete Agent Details first.",
        });
      }

      const applicantDetails = JSON.parse(applicantDetailsStr);

      // Create FormData for file upload
      const formData = new FormData();

      // Add all applicant details
      formData.append("agentName", applicantDetails.agentName || "");
      formData.append("fatherName", applicantDetails.fatherName || "");
      formData.append("occupation", applicantDetails.occupation || "");
      formData.append("occupationName", applicantDetails.occupationName || "");
      formData.append("email", applicantDetails.email || "");
      formData.append("aadhaar", applicantDetails.aadhaar || "");
      formData.append("pan", applicantDetails.pan || "");
      formData.append("mobile", applicantDetails.mobile || "");
      formData.append("landline", applicantDetails.landline || "");
      formData.append("licenseNumber", applicantDetails.licenseNumber || "");
      formData.append("licenseDate", applicantDetails.licenseDate || "");
      formData.append("address1", applicantDetails.address1 || "");
      formData.append("address2", applicantDetails.address2 || "");
      formData.append("state", applicantDetails.state || "");
      formData.append("district", applicantDetails.district || "");
      formData.append("mandal", applicantDetails.mandal || "");
      formData.append("village", applicantDetails.village || "");
      formData.append("pincode", applicantDetails.pincode || "");

      // Add files from applicant details (if stored as File objects)
      if (applicantDetails.photograph) {
        formData.append("photograph", applicantDetails.photograph);
      }
      if (applicantDetails.panProof) {
        formData.append("panProof", applicantDetails.panProof);
      }
      if (applicantDetails.addressProof) {
        formData.append("addressProof", applicantDetails.addressProof);
      }

      // Add ITR files from upload documents page
      formData.append("itrYear1", files.year1);
      formData.append("itrYear2", files.year2);
      formData.append("itrYear3", files.year3);

      // Add declaration
      formData.append("declaration", agree ? "true" : "false");

      // Send to backend API
      const response = await apiPost("/api/agent/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.success) {
        // Save upload document data temporarily for preview
        localStorage.setItem(
          "agentUploadDocuments",
          JSON.stringify({
            year1: files.year1.name,
            year2: files.year2.name,
            year3: files.year3.name,
          })
        );

        // Save agent ID for future reference
        if (response.data && response.data.agentId) {
          localStorage.setItem("agentId", response.data.agentId);
        }

        setPopup({
          show: true,
          message: "Registration saved successfully!",
        });

        // Navigate to preview after closing popup
        setTimeout(() => {
          navigate("/agent-preview");
        }, 1500);
      } else {
        setPopup({
          show: true,
          message: response.message || "Failed to save registration. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setPopup({
        show: true,
        message: error.message || "An error occurred while saving. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ud-wrapper">
      <div className="ud-main">
        {/* ===== BREADCRUMB ===== */}
        <div className="ud-breadcrumb">
          You are here :
          <span className="ud-link"> Home </span>
          {" / "}
          <span>Registration</span>
          {" / "}
          <span className="ud-current">Real Estate Agent Registration</span>
        </div>

        <div className="ud-content">
          {/* ===== TITLE ===== */}
          <h2 className="ud-title">Real Estate Agent Registration</h2>

          {/* ===== STEPPER ===== */}
          <div className="ud-stepper">
            <div className="ud-step-line"></div>

            <div className="ud-step done">
              <div className="ud-circle">1</div>
              <p>Agent Detail</p>
            </div>

            <div className="ud-step active">
              <div className="ud-circle">2</div>
              <p>Upload Documents</p>
            </div>

            <div className="ud-step">
              <div className="ud-circle">3</div>
              <p>Preview</p>
            </div>

            <div className="ud-step">
              <div className="ud-circle">4</div>
              <p>Payment</p>
            </div>

            <div className="ud-step">
              <div className="ud-circle">5</div>
              <p>Acknowledgement</p>
            </div>
          </div>

          {/* ===== SECTION ===== */}
          <h3 className="ud-section-title">Upload Documents</h3>

          <p className="ud-note">
            <b>Note :</b> If the entity is registered below 3 years period and IT
            returns are not available, upload available returns with reason.
          </p>

          {/* ===== TABLE ===== */}
          <table className="ud-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Upload Document</th>
                <th>Uploaded Document</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Income Tax Return Acknowledgement of Preceding Year 1 *</td>
                <td>
                  <input 
                    type="file" 
                    name="year1" 
                    accept=".pdf"
                    onChange={handleFileChange} 
                  />
                </td>
                <td>{files.year1?.name}</td>
              </tr>

              <tr>
                <td>Income Tax Return Acknowledgement of Preceding Year 2 *</td>
                <td>
                  <input 
                    type="file" 
                    name="year2" 
                    accept=".pdf"
                    onChange={handleFileChange} 
                  />
                </td>
                <td>{files.year2?.name}</td>
              </tr>

              <tr>
                <td>Income Tax Return Acknowledgement of Preceding Year 3 *</td>
                <td>
                  <input 
                    type="file" 
                    name="year3" 
                    accept=".pdf"
                    onChange={handleFileChange} 
                  />
                </td>
                <td>{files.year3?.name}</td>
              </tr>
            </tbody>
          </table>

          {/* ===== DECLARATION ===== */}
          <h3 className="ud-section-title">Declaration</h3>

          <label className="ud-declaration">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            &nbsp; I / We solemnly affirm and declare that the particulars given
            above are correct.
          </label>

          {/* ===== BUTTON ===== */}
          <div className="ud-btn-row">
            <button 
              className="ud-btn" 
              onClick={handleSaveAndContinue}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save And Continue"}
            </button>
          </div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {popup.show && (
        <div className="ud-modal-overlay">
          <div className="ud-modal">
            <button className="ud-modal-close" onClick={closePopup}>×</button>
            <p>{popup.message}</p>
            <button className="ud-modal-ok" onClick={closePopup}>OK</button>
          </div>
        </div>
      )}

      {/* ===== LOADING OVERLAY ===== */}
      {isLoading && (
        <div className="ud-loading-overlay">
          <div className="ud-loading-spinner"></div>
          <p>Saving your registration...</p>
        </div>
      )}
    </div>          
  );
};

export default AgentUploadDocuments;