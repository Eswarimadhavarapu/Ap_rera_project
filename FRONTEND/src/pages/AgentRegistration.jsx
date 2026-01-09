import "../styles/AgentRegistration.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const steps = [
  "Agent Detail",
  "Upload Documents",
  "Preview",
  "Payment",
  "Acknowledgement",
];

const AgentRegistration = () => {
  const navigate = useNavigate();

  const [applicationType, setApplicationType] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = () => {
    if (!applicationType) {
      setShowPopup(true); // 🚨 show popup
      return;
    }

    if (applicationType === "New") {
      navigate("/agent-detail-new");
    } else {
      navigate("/agent-detail-existing");
    }
  };

  return (
    <div className="container-wrapper">
      {/* BREADCRUMB */}
      <div className="breadcrumb-box">
        You are here :
        <span className="link"> Home </span> /
        <span> Registration </span> /
        <span> Real Estate Agent Registration</span>
      </div>

      {/* MAIN BOX */}
      <div className="main-container">
        <h2 className="page-title">Real Estate Agent Registration</h2>

        {/* STEPPER */}
        <div className="step-box">
          <div className="step-line"></div>
          {steps.map((step, index) => (
            <div className="step-item" key={index}>
              <div className={`step-circle ${index === 0 ? "active" : ""}`}>
                {index + 1}
              </div>
              <p>{step}</p>
            </div>
          ))}
        </div>

        {/* INSTRUCTIONS */}
        <div className="instructions">
          <h3>General Instructions :</h3>
          <ol>
            <li>This is not a mobile App.</li>
            <li>Clear cookies before filling the form.</li>
            <li>Remove pop-up blockers.</li>
            <li>Passport size photo (35mm × 45mm).</li>
            <li>Documents must be PDF.</li>
            <li>Best viewed in Chrome.</li>
            <li>* fields are mandatory.</li>
          </ol>

          <h3>Guide to fill online registration form :</h3>
          <ol>
            <li>
              For step by step understanding of filling online application,
              kindly refer{" "}
              <Link to="/guidelines" className="guideline-link">
                Guidelines for Registration
              </Link>
              .
            </li>
            <li>Select "New" if first time.</li>
            <li>Select "Existing" if incomplete.</li>
            <li>Use Save & Continue.</li>
            <li>
              <span className="red-text">List of Address Proof:</span> Aadhaar /
              Passport / Voter ID / Bank Passbook
            </li>
          </ol>
        </div>

        {/* APPLICATION TYPE */}
        <div className="application-row">
          <div className="application-type">
            <b>Application Type *</b>

            <label>
              <input
                type="radio"
                name="applicationType"
                checked={applicationType === "New"}
                onChange={() => setApplicationType("New")}
              />
              New
            </label>

            <label>
              <input
                type="radio"
                name="applicationType"
                checked={applicationType === "Existing"}
                onChange={() => setApplicationType("Existing")}
              />
              Existing
            </label>
          </div>

          <button type="button" className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      {/* 🚨 POPUP MODAL */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <span
              className="modal-close"
              onClick={() => setShowPopup(false)}
            >
              ×
            </span>
            Select Application Type
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentRegistration;
