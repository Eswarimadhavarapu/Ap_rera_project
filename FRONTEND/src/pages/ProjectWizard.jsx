import React, { useState } from "react";
import "../styles/projectWizard.css";
import { apiPost } from "../api/api";
import { useNavigate } from "react-router-dom";


export default function ProjectWizard() {
   const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState("instructions");
  const [step, setStep] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [applicationType, setApplicationType] = useState("new");

  const steps = [
    "Promoter Profile",
    "Project Details",
    "Development Details",
    "Associate Details",
    "Upload Documents",
    "Preview",
    "Payment",
    "Acknowledgment",
  ];

  const [formData, setFormData] = useState({
    applicationNo: "",
    promoterType: "individual",
    panNumber: "",

    // Bank Details
    bankState: "",
    bankName: "",
    branchName: "",
    accountNo: "",
    accountHolder: "",
    ifsc: "",

    // Promoter Details
    name: "",
    fatherName: "",
    aadhaar: "",
    mobile: "",
    landline: "",
    email: "",
    promoterWebsite: "",
    stateUT: "",
    district: "",
    licenseNo: "",
    licenseDate: "",
    gstNum: "",

    // Other State Registration
    otherStateReg: "",
    reraRegNumber: "",
    reraState: "",
    registrationRevoked: "",
    revocationReason: "",

    // Projects Last 5 Years
    lastFiveYears: "",
    projectName: "",
    projectType: "",
    currentStatus: "",
    projectAddress: "",
    projectStateUT: "",
    projectDistrict: "",
    pinCode: "",
    surveyNo: "",

    // Litigations
    litigation: "",
    caseNo: "",
    tribunalPlace: "",
    petitionerName: "",
    respondentName: "",
    caseFacts: "",
    caseStatus: "",
    interimOrder: "",
    finalOrderDetails: "",

    // Promoter 2
    promoter2: "",
    promoter2IsOrganization: "",
    promoter2IsIndian: "",
    promoter2Name: "",
    promoter2AddressLine1: "",
    promoter2AddressLine2: "",
    promoter2Mobile: "",
    promoter2Email: "",
    promoter2PanCard: "",
  });

  // Arrays to store added entries
  const [reraEntries, setReraEntries] = useState([]);
  const [projectEntries, setProjectEntries] = useState([]);
  const [litigationEntries, setLitigationEntries] = useState([]);
  const [promoter2Entries, setPromoter2Entries] = useState([]);

  const handleChange = (e) => {
  const { name, value } = e.target;

  // 🔒 Account Number: only digits, max 18
  if (name === "accountNo") {
    if (!/^\d*$/.test(value)) return; // block alphabets & symbols
    if (value.length > 18) return;    // block more than 18 digits
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

   


  const handleSubmitInstructions = () => {
  setCurrentScreen("form");
  const appNo = `100126${Math.floor(Math.random() * 900000 + 100000)}`;

  setFormData((prev) => ({ ...prev, applicationNo: appNo }));

  // ✅ STORE APPLICATION NUMBER EARLY
  sessionStorage.setItem("applicationNumber", appNo);
};


  const handleGetDetails = () => {
    if (!formData.panNumber) {
      alert("Please enter PAN Card Number");
      return;
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.panNumber)) {
      alert("Invalid PAN format");
      return;
    }

    // setShowDetails(true);
    // ✅ STORE PAN
sessionStorage.setItem("panNumber", formData.panNumber);

setShowDetails(true);

  };

  // Add RERA Entry
  const handleAddReraEntry = () => {
    if (!formData.reraRegNumber || !formData.reraState || !formData.registrationRevoked) {
      alert("Please fill all required RERA fields");
      return;
    }

    const newEntry = {
      id: Date.now(),
      reraRegNumber: formData.reraRegNumber,
      reraState: formData.reraState,
      registrationRevoked: formData.registrationRevoked,
      revocationReason: formData.revocationReason,
    };

    setReraEntries([...reraEntries, newEntry]);
    
    // Clear form
    setFormData(prev => ({
      ...prev,
      reraRegNumber: "",
      reraState: "",
      registrationRevoked: "",
      revocationReason: "",
    }));
  };

  // Delete RERA Entry
  const handleDeleteReraEntry = (id) => {
    setReraEntries(reraEntries.filter(entry => entry.id !== id));
  };

  // Add Project Entry
  const handleAddProjectEntry = () => {
    if (!formData.projectName || !formData.projectType || !formData.currentStatus || !formData.projectAddress) {
      alert("Please fill all required project fields");
      return;
    }

    const newEntry = {
      id: Date.now(),
      projectName: formData.projectName,
      projectType: formData.projectType,
      currentStatus: formData.currentStatus,
      projectAddress: formData.projectAddress,
      projectStateUT: formData.projectStateUT,
      projectDistrict: formData.projectDistrict,
      pinCode: formData.pinCode,
      surveyNo: formData.surveyNo,
    };

    setProjectEntries([...projectEntries, newEntry]);
    
    // Clear form
    setFormData(prev => ({
      ...prev,
      projectName: "",
      projectType: "",
      currentStatus: "",
      projectAddress: "",
      projectStateUT: "",
      projectDistrict: "",
      pinCode: "",
      surveyNo: "",
    }));
  };

  // Delete Project Entry
  const handleDeleteProjectEntry = (id) => {
    setProjectEntries(projectEntries.filter(entry => entry.id !== id));
  };

  // Add Litigation Entry
  const handleAddLitigationEntry = () => {
    if (!formData.caseNo || !formData.tribunalPlace || !formData.petitionerName || !formData.respondentName) {
      alert("Please fill all required litigation fields");
      return;
    }

    const newEntry = {
      id: Date.now(),
      caseNo: formData.caseNo,
      tribunalPlace: formData.tribunalPlace,
      petitionerName: formData.petitionerName,
      respondentName: formData.respondentName,
      caseFacts: formData.caseFacts,
      caseStatus: formData.caseStatus,
      interimOrder: formData.interimOrder,
      finalOrderDetails: formData.finalOrderDetails,
    };

    setLitigationEntries([...litigationEntries, newEntry]);
    
    // Clear form
    setFormData(prev => ({
      ...prev,
      caseNo: "",
      tribunalPlace: "",
      petitionerName: "",
      respondentName: "",
      caseFacts: "",
      caseStatus: "",
      interimOrder: "",
      finalOrderDetails: "",
    }));
  };

  // Delete Litigation Entry
  const handleDeleteLitigationEntry = (id) => {
    setLitigationEntries(litigationEntries.filter(entry => entry.id !== id));
  };

  // Add Promoter 2 Entry
  const handleAddPromoter2Entry = () => {
    if (!formData.promoter2Name || !formData.promoter2AddressLine1 || !formData.promoter2Mobile || !formData.promoter2Email || !formData.promoter2PanCard) {
      alert("Please fill all required Promoter 2 fields");
      return;
    }

    const newEntry = {
      id: Date.now(),
      promoter2IsOrganization: formData.promoter2IsOrganization,
      promoter2IsIndian: formData.promoter2IsIndian,
      promoter2Name: formData.promoter2Name,
      promoter2AddressLine1: formData.promoter2AddressLine1,
      promoter2AddressLine2: formData.promoter2AddressLine2,
      promoter2Mobile: formData.promoter2Mobile,
      promoter2Email: formData.promoter2Email,
      promoter2PanCard: formData.promoter2PanCard,
    };

    setPromoter2Entries([...promoter2Entries, newEntry]);
    
    // Clear form
    setFormData(prev => ({
      ...prev,
      promoter2IsOrganization: "",
      promoter2IsIndian: "",
      promoter2Name: "",
      promoter2AddressLine1: "",
      promoter2AddressLine2: "",
      promoter2Mobile: "",
      promoter2Email: "",
      promoter2PanCard: "",
    }));
  };

  // Delete Promoter 2 Entry
  const handleDeletePromoter2Entry = (id) => {
    setPromoter2Entries(promoter2Entries.filter(entry => entry.id !== id));
  };

  const handleSaveAndContinue = async () => {
  try {
    if (!formData.bankState || !formData.bankName || !formData.accountNo) {
      alert("Please fill all required bank details");
      return;
    }
    // 🔒 Account number final validation
if (!/^\d{18}$/.test(formData.accountNo)) {
  alert("Account Number must be exactly 18 digits");
  return;
}

    if (!formData.name || !formData.fatherName || !formData.aadhaar || !formData.mobile || !formData.email) {
      alert("Please fill all required promoter details");
      return;
    }
    if (!formData.otherStateReg || !formData.lastFiveYears || !formData.litigation || !formData.promoter2) {
      alert("Please answer all Yes/No questions");
      return;
    }

    // 🔥 SEND DATA TO BACKEND
const response = await apiPost(
  "/api/project-registration-wizard",
  formData
);


alert("Form saved successfully in DB! Moving to project-details");
// ✅ STORE IN SESSION (SOURCE OF TRUTH)
sessionStorage.setItem("panNumber", formData.panNumber);
sessionStorage.setItem("applicationNumber", formData.applicationNo);

// ✅ NAVIGATE
navigate("/project-details", {
  state: {
    panNumber: formData.panNumber,
    applicationNumber: formData.applicationNo,
  },
});




  } catch (error) {
    console.error(error);
    alert(
      "Failed to save form: " +
        (error.response?.data?.error || error.message)
    );
  }
};


  // Instructions Screen
  if (currentScreen === "instructions") {
    return (
      <div className="projwizard-page">
        <div className="projwizard-card">
          <h2 className="projwizard-main-title">Project Registration</h2>

          <h3 className="projwizard-instruction-heading">General Instructions :</h3>
          
          <ol className="projwizard-instruction-list">
            <li>This is not a mobile App (however can be viewed on mobile screen) so kindly use laptop/desktop for use of this site.</li>
            <li>Clear the cookies before filling the online form</li>
            <li>Remove pop-up block from your browser</li>
            <li>Photograph - Passport size (35mm x 45mm, 300 DPI, Straight view/Light background) and in JPEG format.</li>
            <li>All the documents that are to be uploaded in the application should be in PDF format and should not be password protected, Drawings in DWG format and self-attested (every page of every document).</li>
            <li>Site best viewed in "Google Chrome (Version 62.0.3202.94)"</li>
            <li>Fields marked with *are mandatory.</li>
          </ol>

          <h3 className="projwizard-instruction-heading">Guide to fill online registration form :</h3>
          
          <ol className="projwizard-instruction-list">
            <li>Many details are required for the registration of project which involves information regarding promoter, Promoter 2, plan approvals, Time schedule, Location details of project, Bank account of the project, Associate details etc</li>
            <li>For step by step understanding of filing online application, kindly refer <a href="#" className="projwizard-link">Guidelines for Registration</a> page.</li>
            <li>Select "New" as application type, if you are a new applicant.</li>
            <li>Select "Existing" as application type, if application was incomplete / Shortfall / Withdraw / Change Request</li>
            <li>The entire form is divided to various parts with "Save and Continue" facilities for each part</li>
            <li><strong style={{color: 'red'}}>List of Address Proof:</strong> Aadhaar/Ration Card/Bank Book/Driving License/Voter Id/Gas/Phone Bill/Passport (Any one)</li>
            <li><a href="#" className="projwizard-link">Click Here</a> for the list of supporting documents, their respective file formats that are needed to be attached with the Project Registration Application Form</li>
            <li><a href="#" className="projwizard-link">Fee Calculator</a></li>
          </ol>

          <div className="projwizard-application-type-section">
            <label className="projwizard-app-type-label">Application Type*</label>
            <div className="projwizard-radio-group">
              <label>
                <input
                  type="radio"
                  name="applicationType"
                  value="new"
                  checked={applicationType === "new"}
                  onChange={(e) => setApplicationType(e.target.value)}
                />
                {" "}New
              </label>
              <label>
                <input
                  type="radio"
                  name="applicationType"
                  value="existing"
                  checked={applicationType === "existing"}
                  onChange={(e) => setApplicationType(e.target.value)}
                />
                {" "}Existing
              </label>
            </div>
          </div>

          <div className="projwizard-submit-button-container">
            <button className="projwizard-submit-btn" onClick={handleSubmitInstructions}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Form Screen
  return (
    <div className="projwizard-page">
      <div className="projwizard-card">
        {/* BREADCRUMB */}
        <div className="projwizard-breadcrumb">
          You are here : <span>Home</span> / <span>Registration</span> / Project Registration
        </div>

        <h2 className="projwizard-title">Project Registration</h2>
        <div className="projwizard-header-line"></div>

        {/* STEPPER */}
        <div className="projwizard-stepper">
          {steps.map((label, index) => {
            const num = index + 1;
            return (
              <div key={index} className="projwizard-step-item">
                <div
                  className={`projwizard-step-circle ${
                    step === num ? "projwizard-active" : ""
                  }`}
                >
                  {num}
                </div>
                <div className="projwizard-step-label">
                  {label.split(" ").map((w, i) => (
                    <div key={i}>{w}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FORM BODY */}
        <div className="projwizard-form-body">

          {/* APPLICATION NUMBER */}
          <div className="projwizard-section-block">
            <h3 className="projwizard-h3">Application Number</h3>
            <div className="projwizard-section-line"></div>

            <label className="projwizard-field-label">Application Number*</label>
            <input
              type="text"
              name="applicationNo"
              value={formData.applicationNo}
              readOnly
              className="projwizard-text-input"
              style={{ width: "300px" }}
            />
          </div>

          {/* PROMOTER TYPE */}
          <div className="projwizard-section-block">
            <h3 className="projwizard-h3">Promoter Type</h3>
            <div className="projwizard-section-line"></div>

            <div className="projwizard-radio-row">
              <label>
                <input
                  type="radio"
                  name="promoterType"
                  value="individual"
                  checked={formData.promoterType === "individual"}
                  onChange={handleChange}
                />{" "}
                Individual
              </label>

              <label>
                <input
                  type="radio"
                  name="promoterType"
                  value="other"
                  checked={formData.promoterType === "other"}
                  onChange={handleChange}
                />{" "}
                Other than Individual
              </label>
            </div>
          </div>

          {/* SHOW AFTER GET DETAILS */}
          {showDetails && (
            <>
              {/* BANK DETAILS */}
              <div className="projwizard-section-block">
                <h3 className="projwizard-h3">
                  Designated Bank Account Details Of The Project
                </h3>
                <div className="projwizard-section-line"></div>

                <div className="projwizard-grid">
                  <div className="field">
                    <label>Bank State<span className="projwizard-required">*</span></label>
                    <select name="bankState" value={formData.bankState} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="AP">Andhra Pradesh</option>
                      <option value="TS">Telangana</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Bank Name<span className="projwizard-required">*</span></label>
                    <select name="bankName" value={formData.bankName} onChange={handleChange}>
                      <option value="">Select</option>
                      <option>SBI</option>
                      <option>HDFC</option>
                      <option>ICICI</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Branch Name<span className="projwizard-required">*</span></label>
                    <select name="branchName" value={formData.branchName} onChange={handleChange}>
                      <option value="">Select</option>
                      <option>Ameerpet</option>
                      <option>Madhapur</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Account No<span className="projwizard-required">*</span></label>
                    <input
  type="text"
  name="accountNo"
  value={formData.accountNo}
  onChange={handleChange}
  placeholder="Enter 18-digit Account Number"
  maxLength={18}
  inputMode="numeric"
/>
                  </div>

                  <div className="field">
                    <label>Account Holder's Name as in Bank Pass Book<span className="projwizard-required">*</span></label>
                    <input type="text" name="accountHolder" value={formData.accountHolder} onChange={handleChange} placeholder="Account Holder's Name as in Bank Pass" />
                  </div>

                  <div className="field">
                    <label>IFSC Code<span className="projwizard-required">*</span></label>
                    <input type="text" name="ifsc" value={formData.ifsc} onChange={handleChange} placeholder="IFSC Code" />
                  </div>

                  <div className="field">
                    <label>Upload Bank Statement<span className="projwizard-required">*</span></label>
                    <input type="file" />
                  </div>
                </div>
              </div>

              {/* PROMOTER DETAILS */}
              <div className="projwizard-section-block">
                <h3 className="projwizard-h3">Promoter Details</h3>
                <div className="projwizard-section-line"></div>

                <div className="projwizard-grid">
                  <div className="field">
                    <label>Name<span className="projwizard-required">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                  </div>

                  <div className="field">
                    <label>Father Name<span className="projwizard-required">*</span></label>
                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father Name" />
                  </div>

                  <div className="field">
                    <label>PAN Card Number<span className="projwizard-required">*</span></label>
                    <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="ODZPS3189E" readOnly />
                  </div>

                  <div className="field">
                    <label>Upload PAN Card<span className="projwizard-required">*</span></label>
                    <input type="file" />
                  </div>

                  <div className="field">
                    <label>Aadhaar Number<span className="projwizard-required">*</span></label>
                    <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} placeholder="Aadhaar Number" />
                  </div>

                  <div className="field">
                    <label>Upload Aadhaar<span className="projwizard-required">*</span></label>
                    <input type="file" />
                  </div>

                  <div className="field">
                    <label>Mobile Number <span className="projwizard-required">*</span></label>
                    <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" />
                  </div>

                  <div className="field">
                    <label>Landline Number</label>
                    <input type="text" name="landline" value={formData.landline} onChange={handleChange} placeholder="Landline Number" />
                  </div>

                  <div className="field">
                    <label>Email Id<span className="projwizard-required">*</span></label>
                    <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email Id" />
                  </div>

                  <div className="field">
                    <label>Promoter Website URL</label>
                    <input type="text" name="promoterWebsite" value={formData.promoterWebsite} onChange={handleChange} placeholder="Website" />
                  </div>

                  <div className="field">
                    <label>State/UT<span className="projwizard-required">*</span></label>
                    <select name="stateUT" value={formData.stateUT} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="AP">Andhra Pradesh</option>
                      <option value="TS">Telangana</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>District<span className="projwizard-required">*</span></label>
                    <select name="district" value={formData.district} onChange={handleChange}>
                      <option value="">Select</option>
                      <option>Vijayawada</option>
                      <option>Guntur</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Upload Photograph<span className="projwizard-required">*</span></label>
                    <input type="file" />
                  </div>

                  <div className="field">
                    <label>License Number by the local bodies</label>
                    <input type="text" name="licenseNo" value={formData.licenseNo} onChange={handleChange} placeholder="License Number by the local bodies" />
                  </div>

                  <div className="field">
                    <label>License issued date</label>
                    <input type="date" name="licenseDate" value={formData.licenseDate} onChange={handleChange} placeholder="License issued date" />
                  </div>

                  <div className="field">
                    <label>Upload License certificate</label>
                    <input type="file" />
                  </div>

                  <div className="field">
                    <label>GST Num</label>
                    <input type="text" name="gstNum" value={formData.gstNum} onChange={handleChange} placeholder="GST Num" />
                  </div>

                  <div className="field">
                    <label>Upload GST Num Document</label>
                    <input type="file" />
                  </div>
                </div>
              </div>

              {/* OTHER STATE / UT */}
              <div className="projwizard-section-block aprera-section">
                <h3 className="projwizard-h3">Other State/UT RERA Registration Details</h3>
                <div className="projwizard-section-line"></div>

                <div className="aprera-row">
                  <div className="aprera-label">
                    Do you have any registration in other State/UT<span>*</span>
                  </div>
                  <div className="aprera-radio">
                    <label>
                      <input type="radio" name="otherStateReg" value="yes" checked={formData.otherStateReg === "yes"} onChange={handleChange} /> Yes
                    </label>
                    <label>
                      <input type="radio" name="otherStateReg" value="no" checked={formData.otherStateReg === "no"} onChange={handleChange} /> No
                    </label>
                  </div>
                </div>

                {/* CONDITIONAL: Show if otherStateReg is "yes" */}
                {formData.otherStateReg === "yes" && (
                  <div className="projwizard-conditional-section">
                    <div className="projwizard-grid">
                      <div className="field">
                        <label>RERA Registration Number<span className="projwizard-required">*</span></label>
                        <input type="text" name="reraRegNumber" value={formData.reraRegNumber} onChange={handleChange} placeholder="RERA Registration Number" />
                      </div>

                      <div className="field">
                        <label>State/UT<span className="projwizard-required">*</span></label>
                        <select name="reraState" value={formData.reraState} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="AP">Andhra Pradesh</option>
                          <option value="TS">Telangana</option>
                          <option value="KA">Karnataka</option>
                        </select>
                      </div>

                      <div className="field">
                        <label>Have your said registration been revoked?<span className="projwizard-required">*</span></label>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                          <label>
                            <input type="radio" name="registrationRevoked" value="yes" checked={formData.registrationRevoked === "yes"} onChange={handleChange} /> Yes
                          </label>
                          <label>
                            <input type="radio" name="registrationRevoked" value="no" checked={formData.registrationRevoked === "no"} onChange={handleChange} /> No
                          </label>
                        </div>
                      </div>

                      <div className="field">
                        <label>Reason for Revocation<span className="projwizard-required">*</span></label>
                        <input type="text" name="revocationReason" value={formData.revocationReason} onChange={handleChange} placeholder="Reason for Revocation" />
                      </div>
                    </div>
                    <button type="button" className="projwizard-add-btn" onClick={handleAddReraEntry}>Add</button>
                    <div style={{ clear: 'both' }}></div>

                    {/* RERA ENTRIES TABLE */}
                    {reraEntries.length > 0 && (
                      <table className="projwizard-doc-table" style={{ marginTop: '20px' }}>
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>RERA Registration Number</th>
                            <th>State/UT</th>
                            <th>Have your said registration been revoked?</th>
                            <th>Reason for Revocation</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reraEntries.map((entry, index) => (
                            <tr key={entry.id}>
                              <td>{index + 1}</td>
                              <td>{entry.reraRegNumber}</td>
                              <td>{entry.reraState}</td>
                              <td>{entry.registrationRevoked === "yes" ? "Yes" : "No"}</td>
                              <td>{entry.revocationReason}</td>
                              <td>
                                <button 
                                  type="button" 
                                  className="projwizard-delete-btn" 
                                  onClick={() => handleDeleteReraEntry(entry.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>

              {/* PROJECTS LAST 5 YEARS */}
              <div className="projwizard-section-block aprera-section">
                <h3 className="projwizard-h3">Projects Launched In The Past 5 Years</h3>
                <div className="projwizard-section-line"></div>

                <div className="aprera-row">
                  <div className="aprera-label">
                    Last five years project details<span>*</span>
                  </div>
                  <div className="aprera-radio">
                    <label>
                      <input type="radio" name="lastFiveYears" value="yes" checked={formData.lastFiveYears === "yes"} onChange={handleChange} /> Yes
                    </label>
                    <label>
                      <input type="radio" name="lastFiveYears" value="no" checked={formData.lastFiveYears === "no"} onChange={handleChange} /> No
                    </label>
                  </div>
                </div>

                {/* CONDITIONAL: Show if lastFiveYears is "yes" */}
                {formData.lastFiveYears === "yes" && (
                  <div className="projwizard-conditional-section">
                    <p className="aprera-note-red">Note : Only if it is by the same Promoter/Firm then the following information has to be given</p>
                    
                    <div className="projwizard-grid">
                      <div className="field">
                        <label>Project Name<span className="projwizard-required">*</span></label>
                        <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="Project Name" />
                      </div>

                      <div className="field">
                        <label>Project Type<span className="projwizard-required">*</span></label>
                        <select name="projectType" value={formData.projectType} onChange={handleChange}>
                          <option value="">Select</option>
                          <option>Residential</option>
                          <option>Commercial</option>
                          <option>Mixed Use</option>
                        </select>
                      </div>

                      <div className="field">
                        <label>Current Status<span className="projwizard-required">*</span></label>
                        <select name="currentStatus" value={formData.currentStatus} onChange={handleChange}>
<option value="">Select</option>
<option>Ongoing</option>
<option>Completed</option>
</select>
</div>
<div className="field">
                    <label>Address<span className="projwizard-required">*</span></label>
                    <input type="text" name="projectAddress" value={formData.projectAddress} onChange={handleChange} placeholder="Address" />
                  </div>

                  <div className="field">
                    <label>State/UT<span className="projwizard-required">*</span></label>
                    <select name="projectStateUT" value={formData.projectStateUT} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="AP">Andhra Pradesh</option>
                      <option value="TS">Telangana</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>District<span className="projwizard-required">*</span></label>
                    <select name="projectDistrict" value={formData.projectDistrict} onChange={handleChange}>
                      <option value="">Select</option>
                      <option>Vijayawada</option>
                      <option>Guntur</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>PIN Code<span className="projwizard-required">*</span></label>
                    <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="PIN Code" />
                  </div>

                  <div className="field">
                    <label>Survey No & Revenue Village</label>
                    <input type="text" name="surveyNo" value={formData.surveyNo} onChange={handleChange} placeholder="Survey No" />
                  </div>
                </div>
                <button type="button" className="projwizard-add-btn" onClick={handleAddProjectEntry}>Add</button>
                <div style={{ clear: 'both' }}></div>

                {/* PROJECT ENTRIES TABLE */}
                {projectEntries.length > 0 && (
                  <table className="projwizard-doc-table" style={{ marginTop: '20px' }}>
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Project Name</th>
                        <th>Project Type</th>
                        <th>Current Status</th>
                        <th>Address</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectEntries.map((entry, index) => (
                        <tr key={entry.id}>
                          <td>{index + 1}</td>
                          <td>{entry.projectName}</td>
                          <td>{entry.projectType}</td>
                          <td>{entry.currentStatus}</td>
                          <td>{entry.projectAddress}</td>
                          <td>
                            <button 
                              type="button" 
                              className="projwizard-delete-btn" 
                              onClick={() => handleDeleteProjectEntry(entry.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* LITIGATIONS */}
          <div className="projwizard-section-block aprera-section">
            <h3 className="projwizard-h3">Litigations</h3>
            <div className="projwizard-section-line"></div>

            <div className="aprera-row">
              <div className="aprera-label">
                Any Civil/Criminal Cases<span>*</span>
              </div>
              <div className="aprera-radio">
                <label>
                  <input type="radio" name="litigation" value="yes" checked={formData.litigation === "yes"} onChange={handleChange} /> Yes
                </label>
                <label>
                  <input type="radio" name="litigation" value="no" checked={formData.litigation === "no"} onChange={handleChange} /> No
                </label>
              </div>
            </div>

            {/* CONDITIONAL: Show if litigation is "yes" */}
            {formData.litigation === "yes" && (
              <div className="projwizard-conditional-section">
                <p className="aprera-note-red">Note : In case Petitioner/Respondent are more than one, Please provide their names by comma separated.</p>
                
                <div className="projwizard-grid">
                  <div className="field">
                    <label>Case No.<span className="projwizard-required">*</span></label>
                    <input type="text" name="caseNo" value={formData.caseNo} onChange={handleChange} placeholder="Case No." />
                  </div>

                  <div className="field">
                    <label>Name & Place of Tribunal/Authority<span className="projwizard-required">*</span></label>
                    <input type="text" name="tribunalPlace" value={formData.tribunalPlace} onChange={handleChange} placeholder="Name & Place of Tribunal/Authority" />
                  </div>

                  <div className="field">
                    <label>Name of the Petitioner<span className="projwizard-required">*</span></label>
                    <input type="text" name="petitionerName" value={formData.petitionerName} onChange={handleChange} placeholder="Name of the Petitioner" />
                  </div>

                  <div className="field">
                    <label>Name of the Respondent<span className="projwizard-required">*</span></label>
                    <input type="text" name="respondentName" value={formData.respondentName} onChange={handleChange} placeholder="Name of the Respondent" />
                  </div>

                  <div className="field">
                    <label>Facts of the case/contents of the Petition<span className="projwizard-required">*</span></label>
                    <textarea name="caseFacts" value={formData.caseFacts} onChange={handleChange} placeholder="Facts of the case/contents of the Petition"></textarea>
                  </div>

                  <div className="field">
                    <label>Present status of the case<span className="projwizard-required">*</span></label>
                    <select name="caseStatus" value={formData.caseStatus} onChange={handleChange}>
                      <option value="">Select</option>
                      <option>Pending</option>
                      <option>Resolved</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Interim Order if any<span className="projwizard-required">*</span></label>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                      <label>
                        <input type="radio" name="interimOrder" value="yes" checked={formData.interimOrder === "yes"} onChange={handleChange} /> Yes
                      </label>
                      <label>
                        <input type="radio" name="interimOrder" value="no" checked={formData.interimOrder === "no"} onChange={handleChange} /> No
                      </label>
                    </div>
                  </div>

                  <div className="field">
                    <label>Details of final order if disposed<span className="projwizard-required">*</span></label>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                      <label>
                        <input type="radio" name="finalOrderDetails" value="yes" checked={formData.finalOrderDetails === "yes"} onChange={handleChange} /> Yes
                      </label>
                      <label>
                        <input type="radio" name="finalOrderDetails" value="no" checked={formData.finalOrderDetails === "no"} onChange={handleChange} /> No
                      </label>
                    </div>
                  </div>
                </div>
                <button type="button" className="projwizard-add-btn" onClick={handleAddLitigationEntry}>Add</button>
                <div style={{ clear: 'both' }}></div>

                {/* LITIGATION ENTRIES TABLE */}
                {litigationEntries.length > 0 && (
                  <table className="projwizard-doc-table" style={{ marginTop: '20px' }}>
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Case No.</th>
                        <th>Tribunal/Authority</th>
                        <th>Petitioner</th>
                        <th>Respondent</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {litigationEntries.map((entry, index) => (
                        <tr key={entry.id}>
                          <td>{index + 1}</td>
                          <td>{entry.caseNo}</td>
                          <td>{entry.tribunalPlace}</td>
                          <td>{entry.petitionerName}</td>
                          <td>{entry.respondentName}</td>
                          <td>
                            <button 
                              type="button" 
                              className="projwizard-delete-btn" 
                              onClick={() => handleDeleteLitigationEntry(entry.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* IF NO → SHOW SELF DECLARED AFFIDAVIT */}
            {formData.litigation === "no" && (
              <div className="projwizard-conditional-section">
                <p className="aprera-note-red">
                  Note : "A self declared affidavit (on Rs.20 non judicial stamp paper) has to be uploaded if there are no cases pending, refer form P10 in forms download for proforma of this Self Affidavit."
                </p>

                <div className="projwizard-grid">
                  <div className="field">
                    <label>
                      Self Declared Affidavit<span className="projwizard-required">*</span>
                    </label>
                    <input type="file" name="selfAffidavit" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PROMOTER 2 DETAILS */}
          <div className="projwizard-section-block aprera-section">
            <h3 className="projwizard-h3">
              Promoter 2 Details (Land Owners - Only If Sale Transaction Is Involved)
            </h3>
            <div className="projwizard-section-line"></div>

            <div className="aprera-row">
              <div className="aprera-label">
                Promoter 2 Details<span>*</span>
              </div>
              <div className="aprera-radio">
                <label>
                  <input type="radio" name="promoter2" value="yes" checked={formData.promoter2 === "yes"} onChange={handleChange} /> Yes
                </label>
                <label>
                  <input type="radio" name="promoter2" value="no" checked={formData.promoter2 === "no"} onChange={handleChange} /> No
                </label>
              </div>
            </div>

            {/* CONDITIONAL: Show if promoter2 is "yes" */}
            {formData.promoter2 === "yes" && (
              <div className="projwizard-conditional-section">
                <div className="aprera-row" style={{ marginTop: '20px' }}>
                  <div className="aprera-label">
                    Is Promoter 2 is Organization
                  </div>
                  <div className="aprera-radio">
                    <label>
                      <input type="radio" name="promoter2IsOrganization" value="yes" checked={formData.promoter2IsOrganization === "yes"} onChange={handleChange} /> Yes
                    </label>
                    <label>
                      <input type="radio" name="promoter2IsOrganization" value="no" checked={formData.promoter2IsOrganization === "no"} onChange={handleChange} /> No
                    </label>
                  </div>
                </div>

                <div className="aprera-row" style={{ marginTop: '15px' }}>
                  <div className="aprera-label">
                    Is Promoter 2 is
                  </div>
                  <div className="aprera-radio">
                    <label>
                      <input type="radio" name="promoter2IsIndian" value="indian" checked={formData.promoter2IsIndian === "indian"} onChange={handleChange} /> Indian
                    </label>
                    <label>
                      <input type="radio" name="promoter2IsIndian" value="foreigner" checked={formData.promoter2IsIndian === "foreigner"} onChange={handleChange} /> Foreigner
                    </label>
                  </div>
                </div>

                <div className="projwizard-grid" style={{ marginTop: '20px' }}>
                  <div className="field">
                    <label>Name<span className="projwizard-required">*</span></label>
                    <input type="text" name="promoter2Name" value={formData.promoter2Name} onChange={handleChange} placeholder="Name" />
                  </div>

                  <div className="field">
                    <label>Address Line 1<span className="projwizard-required">*</span></label>
                    <input type="text" name="promoter2AddressLine1" value={formData.promoter2AddressLine1} onChange={handleChange} placeholder="Address Line 1" />
                  </div>

                  <div className="field">
                    <label>Address Line 2</label>
                    <input type="text" name="promoter2AddressLine2" value={formData.promoter2AddressLine2} onChange={handleChange} placeholder="Address Line 2" />
                  </div>

                  <div className="field">
                    <label>Mobile No<span className="projwizard-required">*</span></label>
                    <input type="text" name="promoter2Mobile" value={formData.promoter2Mobile} onChange={handleChange} placeholder="Mobile No" />
                  </div>

                  <div className="field">
                    <label>Email ID<span className="projwizard-required">*</span></label>
                    <input type="text" name="promoter2Email" value={formData.promoter2Email} onChange={handleChange} placeholder="Email ID" />
                  </div>

                  <div className="field">
                    <label>Pan Card No<span className="projwizard-required">*</span></label>
                    <input type="text" name="promoter2PanCard" value={formData.promoter2PanCard} onChange={handleChange} placeholder="Pan Card No" />
                  </div>

                  <div className="field">
                    <label>Upload PAN Card, Aadhaar Card and Photograph<span className="projwizard-required">*</span> (.pdf format only)</label>
                    <input type="file" accept=".pdf" />
                  </div>
                </div>
                <button type="button" className="projwizard-add-btn" onClick={handleAddPromoter2Entry}>Add</button>
                <div style={{ clear: 'both' }}></div>

                {/* PROMOTER 2 ENTRIES TABLE */}
                {promoter2Entries.length > 0 && (
                  <table className="projwizard-doc-table" style={{ marginTop: '20px' }}>
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promoter2Entries.map((entry, index) => (
                        <tr key={entry.id}>
                          <td>{index + 1}</td>
                          <td>{entry.promoter2Name}</td>
                          <td>{entry.promoter2AddressLine1}</td>
                          <td>{entry.promoter2Mobile}</td>
                          <td>{entry.promoter2Email}</td>
                          <td>
                            <button 
                              type="button" 
                              className="projwizard-delete-btn" 
                              onClick={() => handleDeletePromoter2Entry(entry.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* UPLOAD DOCUMENTS */}
          <div className="projwizard-section-block aprera-section">
            <h3 className="projwizard-h3">Upload Documents</h3>
            <div className="projwizard-section-line"></div>

            <p className="aprera-note">
              <strong>Note :</strong> If the entity is registered below 3 years period, and if the IT returns are not available for 3 years period promoter has to upload the available IT returns and audit balance sheets of the entity with a specific reason, refer form P12 in forms download for proforma of this Sample Affidavit
            </p>

            <table className="projwizard-doc-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Upload Document</th>
                  <th>Uploaded Document</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Consolidated Income Tax Returns for the Past 3 Years<span className="projwizard-required">*</span></td>
                  <td>
                    <input type="file" />
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>Balance Sheet<span className="projwizard-required">*</span></td>
                  <td>
                    <input type="file" />
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="projwizard-save-container">
            <button className="projwizard-save-btn" onClick={handleSaveAndContinue}>
              Save And Continue
            </button>
          </div>
        </>
      )}

      {/* PAN SECTION - ONLY SHOW BEFORE GET DETAILS */}
      

          {/* PAN SECTION - ONLY SHOW BEFORE GET DETAILS */}
          {!showDetails && (
            <div className="projwizard-section-block">
              <h3 className="projwizard-h3">PAN Card Number</h3>
              <div className="projwizard-section-line"></div>

              <div className="projwizard-row">
                <input
                  className="projwizard-text-input"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="PAN Card Number"
                  style={{ width: "300px" }}
                />
                <button
                  type="button"
                  className="projwizard-btn"
                  onClick={handleGetDetails}
                >
                  Get Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}