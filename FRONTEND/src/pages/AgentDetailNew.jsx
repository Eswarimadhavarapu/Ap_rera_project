import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/agentDetail.css";
import { apiPost } from "../api/api"; // ✅ ADD THIS

const steps = [
  "Agent Detail",
  "Upload Documents",
  "Preview",
  "Payment",
  "Acknowledgement",
];

const AgentDetail = () => {
  const navigate = useNavigate();

  const [agentType, setAgentType] = useState("");
  const [pan, setPan] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState(""); // ✅ ADD THIS
  const [panError, setPanError] = useState("");
  /* ================= GET DETAILS ================= */
  const handleGetDetails = async () => {
    // Agent type validation
    if (!agentType) {
      setPopupMessage("Please select Agent Type");
      setShowPopup(true);
      return;
    }

    // PAN validation
    if (pan.length !== 10) {
      setPopupMessage("Please enter a valid 10-digit PAN Number");
      setShowPopup(true);
      return;
    }

    try {
      // ✅ CALL PAN CHECK API
      const response = await apiPost("/api/agent/check-pan", { pan });

      // ❌ PAN EXISTS → BLOCK NAVIGATION
      if (response.success && response.exists) {
        setPopupMessage(
          "An application already exists for this PAN number. You cannot create a new application."
        );
        setShowPopup(true);
        return; // ⛔ STOP HERE
      }

      // ✅ PAN DOES NOT EXIST → ALLOW NAVIGATION
      navigate("/applicant-details", { state: { agentType, pan } });

    } catch (error) {
      setPopupMessage("Error while checking PAN. Please try again.");
      setShowPopup(true);
    }
  };

  return (
    <div className="agent-registration-page">
       <div className="agent-container">
      <div className="outer-box">
        <div className="breadcrumb-box">
          You are here :
          <span className="crumb-link"> Home </span> /
          <span> Registration </span> /
          <span> Real Estate Agent Registration</span>
        </div>

        <h2 className="page-title">Real Estate Agent Registration</h2>

        <div className="stepper-box">
          <div className="stepper-line"></div>
          {steps.map((step, index) => (
            <div className="stepper-item" key={index}>
              <div className={`stepper-circle ${index === 0 ? "active" : ""}`}>
                {index + 1}
              </div>
              <div className="stepper-text">{step}</div>
            </div>
          ))}
        </div>

        <div className="form-box">
          <h3 className="section-title">Agent Type</h3>

          <div className="agent-type-row">
            <label>
              <input
                type="radio"
                name="agentType"
                value="Individual"
                checked={agentType === "Individual"}
                onChange={() => setAgentType("Individual")}
              />
              Individual
            </label>

            <label>
              <input
                type="radio"
                name="agentType"
                value="Other"
                checked={agentType === "Other"}
                onChange={() => setAgentType("Other")}
              />
              Other than individual
            </label>
          </div>

          <div className="pan-wrapper">
            <div className="pan-input-group">
  <label>
    PAN Card Number <span className="required">*</span>
  </label>

  <input
    type="text"
    value={pan}
    maxLength={10}
    onChange={(e) => {
      const value = e.target.value.toUpperCase();
      setPan(value);

      if (value.length === 10) {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        if (!panRegex.test(value)) {
          setPanError("PAN format should be ABCDE1234F");
        } else {
          setPanError("");
        }
      } else {
        setPanError("");
      }
    }}
    placeholder="ABCDE1234F"
  />

  {panError && (
    <small className="text-danger">{panError}</small>
  )}
</div>

            <button className="btn-primary" onClick={handleGetDetails}>
              Get Details
            </button>
          </div>
        </div>
      </div>

      {/* ===== POPUP ===== */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <span
              className="modal-close"
              onClick={() => setShowPopup(false)}
            >
              ×
            </span>

            <p>{popupMessage}</p>

            <button
              className="btn-primary"
              onClick={() => setShowPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AgentDetail;