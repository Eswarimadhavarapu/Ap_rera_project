import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/RTI/RtiRequestForm.css";

const RtiRequestForm = () => {

    const location = useLocation();
      const navigate = useNavigate();

 const userData = {
  email: location.state?.email || "",
  mobile: location.state?.mobile || "",
};

  const [formData, setFormData] = useState({
    publicAuthority: "",
    publicAuthoritySearch: "",
    name: "",
    gender: "",
    address: "",
     address2: "",
    state: "",
    district: "",
    // taluk: "",
    pincode: "",
    location: "",
    education: "",
    citizenship: "Indian",
    infoMode: "",
    bpl: "",
    requestDetails: "",
    captcha: "",
  });
const [documentDescription, setDocumentDescription] = useState("");
const [selectedFile, setSelectedFile] = useState(null);

const [documents, setDocuments] = useState([]);
  const [captchaText, setCaptchaText] = useState("");
  const [captchaError, setCaptchaError] = useState("");


  // ADD DOCUMENT
const handleAddDocument = () => {
  if (!documentDescription || !selectedFile) {
    alert("Please enter document description and choose file");
    return;
  }

  const newDocument = {
    id: documents.length + 1,
    description: documentDescription,
    file: selectedFile,
    fileURL: URL.createObjectURL(selectedFile),
  };

  setDocuments([...documents, newDocument]);

  // CLEAR INPUTS
  setDocumentDescription("");
  setSelectedFile(null);

  document.getElementById("supportFile").value = "";
};


// DELETE DOCUMENT
const handleDeleteDocument = (id) => {
  const updatedDocs = documents.filter((doc) => doc.id !== id);
  setDocuments(updatedDocs);
};

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let newCaptcha = "";
    for (let i = 0; i < 6; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(newCaptcha);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
    

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // CREATE FORM DATA
    const apiFormData = new FormData();

    apiFormData.append("application_type", "RTI");

    apiFormData.append("applicant_name", formData.name);

    apiFormData.append("gender", formData.gender);

    apiFormData.append("address_line1", formData.address);

    apiFormData.append("pincode", formData.pincode);

    apiFormData.append("locality_type", formData.location);

    apiFormData.append("education_status", formData.education);

    apiFormData.append("phone_number", userData.mobile);

    apiFormData.append("alter_mobile_number",userData.alternativeMobile );

    apiFormData.append("email_id", userData.email);

    apiFormData.append(
      "citizenship",
      formData.citizenship
    );

    apiFormData.append(
      "mode_of_information",
      formData.infoMode
    );

    apiFormData.append(
      "below_poverty_line",
      formData.bpl || "No"
    );

    apiFormData.append(
      "subject",
      "RTI Request"
    );
apiFormData.append("address_line2", formData.address2);

    apiFormData.append(
      "rti_request_text",
      formData.requestDetails
    );

    // DOCUMENTS
    documents.forEach((doc) => {
      if (doc.file) {
        apiFormData.append(
          "documents",
          doc.file
        );
      }
    });

    // API CALL
    const response = await fetch(
      "https://n7vxv3pg-8081.inc1.devtunnels.ms/api/rti/create",
      {
        method: "POST",
        body: apiFormData,
      }
    );

    const result = await response.json();

    console.log("API Response:", result);

    if (response.ok) {
      alert("RTI Request Submitted Successfully");
    } else {
      alert(result.message || "Submission Failed");
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
};

  const handleReset = () => {
    setFormData({
      publicAuthority: "",
      publicAuthoritySearch: "",
      name: "",
      gender: "",
      address: "",
      pincode: "",
      location: "",
      education: "",
      citizenship: "Indian",
      infoMode: "",
      bpl: "",
      requestDetails: "",
      captcha: "",
    });
    setCaptchaError("");
    generateCaptcha();
  };

  return (
    <div className="rtireq-container">
      <div className="rtireq-card">

        {/* FORM HEADER */}
        <div className="rtireq-header">
          {/* <span className="rtireq-gov-badge">Government of India</span> */}
          <h2 className="rtireq-title">Online RTI Request Form</h2>
          <p className="rtireq-subtitle">
            Right to Information Act, 2005 — File your request electronically
          </p>
        </div>

        <div className="rtireq-body">
          <form onSubmit={handleSubmit}>

            {/* PUBLIC AUTHORITY */}
            <div className="rtireq-section">
              <div className="rtireq-pa-header">
                <div className="rtireq-pa-header-left">
                  <h3 className="rtireq-section-title">Public Authority Details</h3>
                </div>
                <div className="rtireq-pa-divider" />
                <div className="rtireq-pa-search">
                  <span className="rtireq-pa-search-label">Search public authority</span>
                  <div className="rtireq-pa-search-bar">
                    <span className="rtireq-pa-search-icon">🔍</span>
                    <input
                      type="text"
                      name="publicAuthoritySearch"
                      className="rtireq-pa-search-input"
                      placeholder="Type name or part of name…"
                      value={formData.publicAuthoritySearch}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

             
            </div>

            {/* PERSONAL DETAILS */}
            <div className="rtireq-section">
              <h3 className="rtireq-section-title">Personal Details</h3>

              <div className="rtireq-grid">
                <div className="rtireq-group">
                  <label>
                    Full name<span className="rtireq-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="rtireq-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

 <div className="rtireq-address-row">

  {/* ADDRESS 1 */}

  <div className="rtireq-address-box">

    <label>
      Address 1
      <span className="rtireq-required">
        *
      </span>
    </label>

    <textarea
      name="address"
      placeholder="Enter Address Line 1"
      value={formData.address}
      onChange={handleChange}
      required
    />

  </div>

  {/* ADDRESS 2 */}

  <div className="rtireq-address-box">

    <label>
      Address 2
    </label>

    <textarea
      name="address2"
      placeholder="Enter Address Line 2"
      value={formData.address2 || ""}
      onChange={handleChange}
    />

  </div>

</div>

               <div className="rtireq-grid">
                {/* <div className="rtireq-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div> */}
                {/* <div className="rtireq-group">
                  <label>District</label>
                  <input
                    type="text"
                    name="district"
                    placeholder="Enter district"
                    value={formData.district}
                    onChange={handleChange}
                  />
                </div> */}
              </div> 

               <div className="rtireq-grid">
                {/* <div className="rtireq-group">
                  <label>Taluk</label>
                  <input
                    type="text"
                    name="taluk"
                    placeholder="Enter taluk"
                    value={formData.taluk}
                    onChange={handleChange}
                  />
                </div> */}
              <div className="rtireq-grid">

  <div className="rtireq-group">

    <label>
      Pincode
      <span className="rtireq-required">
        *
      </span>
    </label>

    <input
      type="text"
      name="pincode"
      placeholder="Enter Pincode"
      maxLength="6"
      value={formData.pincode}
      onChange={(e) =>
        setFormData({
          ...formData,
          pincode: e.target.value.replace(
            /\D/g,
            ""
          ),
        })
      }
      required
    />

  </div>

</div>
              </div> 

              <div className="rtireq-grid">
                <div className="rtireq-group">
                  <label>
                    Location<span className="rtireq-required">*</span>
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option>Rural</option>
                    <option>Urban</option>
                  </select>
                </div>
                <div className="rtireq-group">
                  <label>
                    Educational status<span className="rtireq-required">*</span>
                  </label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option>SSC</option>
                    <option>Intermediate</option>
                    <option>Degree</option>
                    <option>Post Graduation</option>
                  </select>
                </div>
              </div>

              <div className="rtireq-grid">
                <div className="rtireq-group">
                  <label>
                   Mobile number<span className="rtireq-required">*</span>
                  </label>
                  <div className="rtireq-readonly-group">
                    <span className="rtireq-readonly-icon">📞</span>
                    <span>{userData.mobile}</span>
                  </div>
                </div>
<div className="rtireq-group">
  <label>
    Alternative Mobile Number
  </label>

  <input
    type="text"
    name="alternativeMobile"
    placeholder="Enter Alternative Mobile Number"
    maxLength="10"
    value={formData.alternativeMobile || ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        alternativeMobile: e.target.value.replace(/\D/g, ""),
      })
    }
  />
</div>


                <div className="rtireq-group">
                  <label>
                    Email ID<span className="rtireq-required">*</span>
                  </label>
                  <div className="rtireq-readonly-group">
                    <span className="rtireq-readonly-icon">✉️</span>
                    <span>{userData.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* REQUEST DETAILS */}
            <div className="rtireq-section">
              <h3 className="rtireq-section-title">Request Details</h3>

              <div className="rtireq-grid">
                <div className="rtireq-group">
                  <label>
                    Citizenship<span className="rtireq-required">*</span>
                  </label>
                  <select name="citizenship" value={formData.citizenship} onChange={handleChange}>
                    <option>Indian</option>
                  </select>
                  <p className="rtireq-note">Only Indian citizens can file an RTI request</p>
                </div>
                <div className="rtireq-group">
                  <label>
                    Below poverty line?<span className="rtireq-required">*</span>
                  </label>
                  <select name="bpl" value={formData.bpl} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>

              <div className="rtireq-group">
                <label>
                  Mode of information required<span className="rtireq-required">*</span>
                </label>
                <div className="rtireq-radio-row">
                  {["By Post", "By Email", "Through Online Portal", "In Person"].map((mode) => (
                    <label className="rtireq-radio-pill" key={mode}>
                      <input
                        type="radio"
                        name="infoMode"
                        value={mode}
                        checked={formData.infoMode === mode}
                        onChange={handleChange}
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rtireq-warning-box">
                Only alphabets A–Z a–z, numbers 0–9 and special characters , . - ( ) / @ : &amp; are
                allowed in the RTI request text.
              </div>

              <div className="rtireq-group">
                <label>
                  RTI request text<span className="rtireq-required">*</span>
                </label>
                <textarea
                  name="requestDetails"
                  rows="6"
                  maxLength="150"
                  placeholder="Describe the information you are seeking…"
                  value={formData.requestDetails}
                  onChange={handleChange}
                  required
                />
                <p className="rtireq-char-count">
                  {150 - formData.requestDetails.length} characters remaining
                </p>
              </div>

              <div className="rtireq-support-doc-container">

  <div className="rtireq-support-input-group">
    <label>Document Description</label>

    <input
      type="text"
      placeholder="Document Description"
      value={documentDescription}
      onChange={(e) =>
        setDocumentDescription(e.target.value)
      }
    />
  </div>

  <div className="rtireq-support-input-group">
    <label>Upload Document</label>

    <input
      id="supportFile"
      type="file"
      accept=".pdf"
      onChange={(e) =>
        setSelectedFile(e.target.files[0])
      }
    />
  </div>

  <button
    type="button"
    className="rtireq-add-doc-btn"
    onClick={handleAddDocument}
  >
    Add
  </button>

</div>


{documents.length > 0 && (
  <table className="rtireq-support-doc-table">

    <thead>
      <tr>
        <th>S.No</th>
        <th>Document Description</th>
        <th>Uploaded Document</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {documents.map((doc, index) => (
        <tr key={doc.id}>

          <td>{index + 1}</td>

          <td>{doc.description}</td>

          <td>
            <a
              href={doc.fileURL}
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>
          </td>

          <td>
            <button
              type="button"
              className="rtireq-delete-btn"
              onClick={() =>
                handleDeleteDocument(doc.id)
              }
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
               
            {/* ACTIONS */}
       {/* ACTIONS */}
<div className="rtireq-button-group">
  <button
    type="button"
    className="rtireq-reset-btn"
    onClick={handleReset}
  >
    Reset
  </button>

  <button
    type="button"
    className="rtireq-submit-btn"
    onClick={() => {
      navigate("/RtiPaymentPage", {
        state: {
          formData,
          userData,
          documents,
        },
      });
    }}
  >
    Proceed to Payment
  </button>
</div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RtiRequestForm;