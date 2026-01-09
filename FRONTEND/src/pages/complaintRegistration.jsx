import React, { useState } from "react";
import "../styles/complaintRegistration.css";
import ComplaintDetails from "./ComplaintDetails";



/* ================= STEP WIZARD COMPONENT ================= */
function StepWizard({ currentStep }) {
  const steps = [
    "Complaint Registration",
    "Complaint Registration Details",
    "Preview",
    "Payment",
    "Acknowledgement",
  ];

  return (
    <div className="stepwizard">
      <div className="stepwizard-row">
        {steps.map((label, index) => {
          const step = index + 1;
          return (
            <div className="stepwizard-step" key={step}>
              <div
                className={`step-circle ${
                  currentStep === step ? "active" : ""
                }`}
              >
                {step}
              </div>
              <p>{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ComplaintRegistration() {
  const [currentStep, setCurrentStep] = useState(1);

  const [documents, setDocuments] = useState({
    saleAgreement: null,
    feeReceipt: null,
    interimOrder: null,
  });

  const [declaration, setDeclaration] = useState({
    agree1: false,
    agree2: false,
    name: "",
  });

  /* ================= DOWNLOAD FORM (EDITABLE DOC) ================= */
  const downloadForm = (type) => {
    const fileMap = {
      M: FormM,
      N: FormN,
    };

    const link = document.createElement("a");
    link.href = fileMap[type];
    link.download = type === "M" ? "Form_M.doc" : "Form_N.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ================= FILE UPLOAD ================= */
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files[0]) return;

    if (files[0].type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    if (files[0].size > 70 * 1024 * 1024) {
      alert("File size must be less than 70MB");
      return;
    }

    setDocuments((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleDeclarationChange = (e) => {
    const { name, checked, value } = e.target;
    setDeclaration((prev) => ({
      ...prev,
      [name]: checked ?? value,
    }));
  };

  /* ================= UI ================= */
  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="breadcrumb">
          <span>You are here : </span>
          <a href="/">Home</a> / Registration /{" "}
          <span>Complaint Registration</span>
        </div>

        <h2 className="main-heading">Complaint Registration</h2>

        <StepWizard currentStep={currentStep} />

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="step-box">
            <h3 className="subheading">General Instructions :</h3>

            <ol className="instruction-list">
              <li>Clear cookies before filling the form</li>
              <li>Remove pop-up blocker</li>
              <li>Uploaded documents must be PDF</li>
              <li>Best viewed in Chrome</li>

              <li>
                Submit application either in{" "}
                <b
                  className="blue-text download-link"
                  onClick={() => downloadForm("M")}
                >
                  Form M
                </b>{" "}
                or{" "}
                <b
                  className="blue-text download-link"
                  onClick={() => downloadForm("N")}
                >
                  Form N
                </b>
              </li>
            </ol>

            <div className="cr-footer">
              <button
                className="proceed-btn"
                onClick={() => setCurrentStep(2)}
              >
                Proceed
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <ComplaintDetails setCurrentStep={setCurrentStep} />
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <>
            <h3 className="subheading">Upload Documents</h3>

            <div className="row">
              <div className="col">
                <label>
                  Agreement for Sale <span className="required">*</span>
                </label>
                <input
                  type="file"
                  name="saleAgreement"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>

              <div className="col">
                <label>
                  Fee Receipt <span className="required">*</span>
                </label>
                <input
                  type="file"
                  name="feeReceipt"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </>
        )}

        {/* STEP 5 */}
        {currentStep === 5 && (
          <>
            <h3 className="subheading">Declaration</h3>

            <div className="declaration-box">
              <label>
                <input
                  type="checkbox"
                  name="agree1"
                  checked={declaration.agree1}
                  onChange={handleDeclarationChange}
                />
                Complaint is not pending in any court.
              </label>
            </div>

            <div className="declaration-box">
              <label>
                <input
                  type="checkbox"
                  name="agree2"
                  checked={declaration.agree2}
                  onChange={handleDeclarationChange}
                />
                I{" "}
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Your Name"
                  value={declaration.name}
                  onChange={handleDeclarationChange}
                  className="inline-input"
                />{" "}
                confirm details are correct.
              </label>

              <div className="cr-footer">
                <button className="proceed-btn">
                  Submit Complaint
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}