import React, { useState } from "react";
import "../styles/complaintdetails.css";

export default function ComplaintDetails({ setCurrentStep, setComplaintData }) {
const [supportingDocs, setSupportingDocs] = useState([]);

  
  const [form, setForm] = useState({
    /* Main selection */
    complaintAgainst: "",
    complaintBy: "",

    /* Complainant */
    complainantName: "",
    complainantMobile: "",
    complainantEmail: "",

    /* Complainant Address */
    cAddress1: "",
    cAddress2: "",
    cState: "",
    cDistrict: "",
    cPincode: "",

    /* Respondent */
    respondentRERA: "",
    projectName: "",
    respondentName: "",
    respondentMobile: "",
    respondentEmail: "",

    /* Respondent Address */
    rAddress1: "",
    rAddress2: "",
    rState: "",
    rDistrict: "",
    rPincode: "",

    /* Complaint */
    subject: "",
    subjectOther: "",
    description: "",
    relief: "",
    reliefOther: "",
    complaintRegarding: "",

    /* Description breakup */
    agreed: "",
    delivered: "",
    deviation: "",

    /* Files */
    agreementFile: null,
    feeReceiptFile: null,
    interimOrder: "",
    interimFile: null,

    /* Supporting docs */
    docDesc: "",
    docFile: null,

    /* Declaration */
    declaration1: false,
    declaration2: false,
    declarantName: "",
  });


  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [error, setError] = useState("");



  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((p) => ({
      ...p,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
            ? files[0]
            : value,
    }));
  };

  const handleAddDoc = () => {
  if (!form.docDesc || !form.docFile) {
    setError("Please add document description and file");
    return;
  }

  setSupportingDocs((prev) => [
    ...prev,
    {
      id: Date.now(),
      desc: form.docDesc,
      file: form.docFile,
    },
  ]);

  setForm((p) => ({ ...p, docDesc: "", docFile: null }));
};


  /* ---------------- FLAGS ---------------- */

  const isAgent = form.complaintAgainst === "Agent";
  const isAllottee = form.complaintAgainst === "Allottee";
  const isPromoter = form.complaintAgainst === "Promoter";

  const byAgent = form.complaintBy === "Agent";
  const byAllottee = form.complaintBy === "Allottee";
  const byOthers = form.complaintBy === "Others";

  const showComplainantDetails =
    byAllottee || byOthers || (isPromoter && byAllottee);

  const showComplainantAddress = showComplainantDetails;

  const showRespondentRERA = isPromoter;

  const showRespondentDetails =
    isAgent || isAllottee || (isPromoter && form.respondentRERA === "No");

  const showComplaintRegarding =
    byAllottee || (isAllottee && byAgent);

  const showAgreementUpload =
    isPromoter && byAllottee;

  const showFeeReceipt =
    (isAllottee && byAgent) || (isPromoter && byAllottee);

  const showInterim = isPromoter;
  const showInterimUpload =
    isPromoter && form.interimOrder === "Yes";

  const showDescriptionSplit =
    isPromoter && byAllottee;

  const showAnyOther =
    form.subject === "Any Other" || form.relief === "Any Other";

  const isInitialSelect =
    form.complaintAgainst === "" &&
    form.complaintBy === "" &&
    !hasUserInteracted;

  const isUserSelectReset =
    form.complaintAgainst === "" &&
    form.complaintBy === "" &&
    hasUserInteracted;

  const validateForm = () => {
    // Required always
    if (!form.complaintAgainst || !form.complaintBy) {
      return "Please select Complaint Against and Complaint By";
    }

    // Complainant details
    if (showComplainantDetails) {
      if (
        !form.complainantName ||
        !form.complainantMobile ||
        !form.complainantEmail
      ) {
        return "Please fill all complainant details";
      }
    }

    // Complainant address
    if (showComplainantAddress) {
      if (
        !form.cAddress1 ||
        !form.cState ||
        !form.cDistrict ||
        !form.cPincode
      ) {
        return "Please fill complainant address details";
      }
    }

    // Respondent details
    if (showRespondentDetails) {
      if (
        !form.respondentName ||
        !form.respondentMobile ||
        !form.respondentEmail
      ) {
        return "Please fill respondent details";
      }
    }

    // Complaint details
    if (!form.subject || !form.relief) {
      return "Please select subject and relief";
    }

    if (form.subject === "Any Other" && !form.subjectOther) {
      return "Please enter subject details";
    }

    if (form.relief === "Any Other" && !form.reliefOther) {
      return "Please enter relief details";
    }

    // Declaration
    if (!form.declaration1 || !form.declaration2 || !form.declarantName) {
      return "Please complete declaration";
    }

    return ""; // ✅ VALID
  };

  const handleSaveAndContinue = () => {
  const validationError = validateForm();

  if (validationError) {
    setError(validationError);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  setComplaintData({
    ...form,
    supportingDocs,
  });

  setCurrentStep(3);
};


  

  /* ---------------- UI ---------------- */

  return (
    <div className="cr-container">
      <h3>Complaint Details</h3>
      {error && (
        <div className="cr-error">
          {error}
        </div>
      )}


      {/* ================= Complaint Against / By ================= */}
      <div className="cr-row">
        <div className="cr-field">
          <label>Complaint Against *</label>
          <select
            name="complaintAgainst"
            value={form.complaintAgainst}
            onChange={(e) => {
              handleChange(e);
              setHasUserInteracted(true);   // 👈 IMPORTANT
              setForm((p) => ({ ...p, complaintBy: "" }));
            }}
          >

            <option value="">Select</option>
            <option value="Agent">Agent</option>
            <option value="Allottee">Allottee</option>
            <option value="Promoter">Promoter</option>
          </select>
        </div>

        <div className="cr-field">
          <label>Complaint By *</label>
          <select
            name="complaintBy"
            value={form.complaintBy}
            onChange={(e) => {
              handleChange(e);
              setHasUserInteracted(true);   // 👈 IMPORTANT
            }}
          >

            <option value="">Select</option>

            {/* INITIAL STATE */}
            {form.complaintAgainst === "" && (
              <>
                <option value="Agent">Agent</option>
                <option value="Allottee">Allottee</option>
                <option value="Others">Others</option>
                <option value="Promoter">Promoter</option>
              </>
            )}

            {isAgent && (
              <>
                <option value="Allottee">Allottee</option>
                <option value="Promoter">Promoter</option>
                <option value="Others">Others</option>
              </>
            )}

            {isAllottee && (
              <>
                <option value="Agent">Agent</option>
                <option value="Promoter">Promoter</option>
              </>
            )}

            {isPromoter && (
              <>
                <option value="Agent">Agent</option>
                <option value="Allottee">Allottee</option>
                <option value="Others">Others</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* ================= COMPLAINANT ================= */}
      {showComplainantDetails && (
        <>
          <h4>Details of the Complainant</h4>
          <div className="cr-row">
            <input
              name="complainantName"
              placeholder="Name of the Complainant *"
              value={form.complainantName}
              onChange={handleChange}
            />
            <input
              name="complainantMobile"
              placeholder="Mobile No *"
              value={form.complainantMobile}
              onChange={handleChange}
            />
            <input
              name="complainantEmail"
              placeholder="Email ID *"
              value={form.complainantEmail}
              onChange={handleChange}
            />
          </div>
          <input
            name="projectName"
            placeholder="Project Name *"
            required={isUserSelectReset}
            onChange={handleChange}
          />
          <select
            name="subject"
            required={isUserSelectReset}
            onChange={handleChange}
          />
          <input
            type="file"
            name="agreementFile"
            required={isUserSelectReset}
            onChange={handleChange}
          />

        </>
      )}

      {showComplainantAddress && (
        <>
          <h4>Complainant Communication Address</h4>
          <div className="cr-row">
            <input name="cAddress1" placeholder="Address Line 1 *" onChange={handleChange} />
            <input name="cAddress2" placeholder="Address Line 2" onChange={handleChange} />
            <select name="cState" onChange={handleChange}>
              <option value="">Select State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
            </select>
            <select name="cDistrict" onChange={handleChange}>
              <option value="">Select District</option>
              <option value="Visakhapatnam">Visakhapatnam</option>
              <option value="Vijayawada">Vijayawada</option>
            </select>
            <input name="cPincode" placeholder="PINCode *" onChange={handleChange} />
          </div>
        </>
      )}

      {/* ================= RESPONDENT ================= */}
      {showRespondentRERA && (
        <>
          <h4>Details of the Respondent</h4>
          <label>Is He/She Registered with AP RERA:</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="respondentRERA" value="Yes" onChange={handleChange} /> Yes
            </label>
            <label>
              <input type="radio" name="respondentRERA" value="No" onChange={handleChange} /> No
            </label>
          </div>
        </>
      )}

      {showRespondentDetails && (
        <>
          <h4>Respondent Details</h4>
          <div className="cr-row">
            <input name="projectName" placeholder="Project Name *" onChange={handleChange} />
            <input name="respondentName" placeholder="Name" onChange={handleChange} />
            <input name="respondentMobile" placeholder="Mobile No *" onChange={handleChange} />
            <input name="respondentEmail" placeholder="Email ID *" onChange={handleChange} />
          </div>
        </>
      )}

      {/* ================= COMPLAINT ================= */}
      {/* ================= DETAILS OF THE COMPLAINT ================= */}
      <h4>Details of the Complaint</h4>

      <div className="cr-row">
        {/* Subject of Complaint */}
        <div className="cr-field">
          <label>Subject of Complaint *</label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Any Other">Any Other</option>
            <option value="Financial Issues">Financial Issues</option>
            <option value="Legal Issues">Legal Issues</option>
            <option value="Specifications and Quality Constructions">
              Specifications and Quality Constructions
            </option>
            <option value="Time Frame">Time Frame</option>
          </select>
        </div>

        {/* Subject - Any Other */}
        {form.subject === "Any Other" && (
          <div className="cr-field">
            <label>Any Other *</label>
            <input
              type="text"
              name="subjectOther"
              placeholder="Subject of Complaint"
              value={form.subjectOther}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Relief Sought from APRERA */}
        <div className="cr-field">
          <label>Relief Sought from APRERA *</label>
          <select
            name="relief"
            value={form.relief}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Any Other">Any Other</option>
            <option value="Cancellation of Agreement">
              Cancellation of Agreement
            </option>
            <option value="Compensation">Compensation</option>
            <option value="Rectification of Work">
              Rectification of Work
            </option>
          </select>
        </div>

        {/* Relief - Any Other */}
        {form.relief === "Any Other" && (
          <div className="cr-field">
            <label>Any Other *</label>
            <input
              type="text"
              name="reliefOther"
              placeholder="Relief Sought from APRERA"
              value={form.reliefOther}
              onChange={handleChange}
              required
            />
          </div>
        )}
      </div>


      {showComplaintRegarding && (
        <input
          name="complaintRegarding"
          placeholder="Complaint Regarding (House/Flat/Block/Floor No.) *"
          onChange={handleChange}
        />
      )}

      {showAgreementUpload && (
        <input type="file" name="agreementFile" onChange={handleChange} />
      )}

      {showFeeReceipt && (
        <input type="file" name="feeReceiptFile" onChange={handleChange} />
      )}

      {showInterim && (
        <>
          <label>Interim Order *</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="interimOrder" value="Yes" onChange={handleChange} /> Yes
            </label>
            <label>
              <input type="radio" name="interimOrder" value="No" onChange={handleChange} /> No
            </label>
          </div>
        </>
      )}

      {showInterimUpload && (
        <input type="file" name="interimFile" onChange={handleChange} />
      )}

      {showDescriptionSplit && (
        <>
          <h4>Description of Complaint *</h4>
          <div className="cr-row">
            <input name="agreed" placeholder="Agreed / Committed *" onChange={handleChange} />
            <input name="delivered" placeholder="Delivered *" onChange={handleChange} />
            <input name="deviation" placeholder="Deviation *" onChange={handleChange} />
          </div>
        </>
      )}

      {/* ================= SUPPORTING DOCS ================= */}
      <h4>Supporting Documents</h4>

<div className="cr-row">
  <input
    name="docDesc"
    placeholder="Document Description"
    value={form.docDesc}
    onChange={handleChange}
  />
  <input
    type="file"
    name="docFile"
    onChange={handleChange}
  />
  <button type="button" onClick={handleAddDoc}>
    Add
  </button>
</div>

<table className="doc-table">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Document Description</th>
      <th>Uploaded Document</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {supportingDocs.map((d, i) => (
      <tr key={d.id}>
        <td>{i + 1}</td>
        <td>{d.desc}</td>
        <td>
          <a href={URL.createObjectURL(d.file)} target="_blank">
            View
          </a>
        </td>
        <td>
          <button
            onClick={() =>
              setSupportingDocs((p) => p.filter((x) => x.id !== d.id))
            }
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* ================= DECLARATION ================= */}
      <h4>Declaration</h4>

      <label className="cr-declaration">
        <input
          type="checkbox"
          name="declaration1"
          onChange={handleChange}
        />
        &nbsp;I hereby declare that the complaint mentioned above is not pending
        before any court of law or any other authority or any other tribunal.
      </label>

      <label className="cr-declaration">
        <input
          type="checkbox"
          name="declaration2"
          onChange={handleChange}
        />
        &nbsp;I,&nbsp;
        <input
          type="text"
          name="declarantName"
          placeholder="Name of the Complainant"
          onChange={handleChange}
          className="inline-input"
        />
        , the complainant, do hereby verify that the contents of the above are true
        to my personal knowledge and belief and that I have not suppressed any
        material fact(s).
      </label>

      <div className="cr-footer">
        <button
          className="proceed-btn"
          onClick={handleSaveAndContinue}
        >
          Save And Continue
        </button>
      </div>



    </div>
  );
}