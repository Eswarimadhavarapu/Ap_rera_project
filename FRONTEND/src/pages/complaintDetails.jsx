import React, { useState, useEffect, useRef } from "react";

import { apiPost } from "../api/api";
import "../styles/complaintdetails.css";

export default function ComplaintDetails({
  setCurrentStep,
  setComplaintData,
  complaintData
}) {
  const STATES = [
    "Andaman and Nicobar Island (UT)",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh (UT)",
    "Chhattisgarh",
    "Dadra and Nagar Haveli (UT)",
    "Daman and Diu (UT)",
    "Delhi (NCT)",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Lakshadweep (UT)",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry (UT)",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const DISTRICTS = {
    "Andhra Pradesh": [
      "Anantapur",
      "Chittoor",
      "East Godavari",
      "Guntur",
      "Kadapa",
      "Krishna",
      "Kurnool",
      "Nellore",
      "Prakasam",
      "Srikakulam",
      "Visakhapatnam",
      "Vizianagaram",
      "West Godavari",
    ],
    Telangana: [
      "Adilabad",
      "Hyderabad",
      "Karimnagar",
      "Khammam",
      "Mahabubnagar",
      "Medak",
      "Nalgonda",
      "Nizamabad",
      "Ranga Reddy",
      "Warangal",
    ],
    "Tamil Nadu": [
      "Chennai",
      "Coimbatore",
      "Madurai",
      "Tiruchirappalli",
    ],
    Karnataka: [
      "Bengaluru Urban",
      "Mysuru",
      "Mangaluru",
      "Hubballi",
    ],
    Maharashtra: [
      "Mumbai",
      "Pune",
      "Nagpur",
      "Nashik",
    ],
    Kerala: [
      "Thiruvananthapuram",
      "Kochi",
      "Kozhikode",
      "Thrissur",
    ],
  };

  const complaintByOptionsMap = {
    Agent: ["Allottee", "Others", "Promoter"],
    Allottee: ["Agent", "Promoter"],
    Promoter: ["Agent", "Allottee", "Others"],
  };

  const inputFilters = {
  onlyChars: /^[A-Za-z\s]*$/,
  onlyNumbers: /^\d*$/,
  alphaNumeric: /^[A-Za-z0-9\-\/]*$/,
};


  const [form, setForm] = useState({
    complaintAgainst: "",
    complaintBy: "",
    complainantRERA: "",
    complainantName: "",
    complainantMobile: "",
    complainantEmail: "",
    cAddress1: "",
    cAddress2: "",
    cState: "",
    cDistrict: "",
    cPincode: "",
    agentId: "",
    respondentRERA: "",
    projectName: "",
    respondentName: "",
    respondentMobile: "",
    respondentEmail: "",
    rAddress1: "",
    rAddress2: "",
    rState: "",
    rDistrict: "",
    rPincode: "",
    promoterRegId: "",
    subject: "",
    subjectOther: "",
    description: "",
    relief: "",
    reliefOther: "",
    complaintRegarding: "",
    interimOrder: "",
    interimFile: null,
    agreementFile: null,
    feeReceiptFile: null,
    declaration1: false,
    declaration2: false,
    declarantName: "",
    docDesc: "",
    docFile: null,
  });

  const [districtList, setDistrictList] = useState([]);
  const [supportingDocs, setSupportingDocs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});
  const [activeError, setActiveError] = useState("");
  const docFileRef = useRef(null);
   



  useEffect(() => {
    if (complaintData) {
      setForm((p) => ({ ...p, ...complaintData }));
      setSupportingDocs(complaintData.supportingDocs || []);
    }
  }, [complaintData]);

  // const handleChange = (e) => {
  //   const { name, value, type, checked, files } = e.target;
  //   setForm((p) => ({
  //     ...p,
  //     [name]:
  //       type === "checkbox"
  //         ? checked
  //         : type === "file"
  //           ? files[0]
  //           : value,
  //   }));
  // };


const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;

  /* ================= FILE VALIDATION (STEP 2) ================= */
  if (type === "file") {
    const file = files?.[0];
    if (!file) return;

    // 🔴 Allow ONLY PDF
    if (file.type !== "application/pdf") {
      setActiveError("Only PDF files are allowed");
      e.target.value = "";
      return;
    }

    // 🔴 Optional: size limit (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setActiveError("PDF file size must be less than 5 MB");
      e.target.value = "";
      return;
    }

    setForm((p) => ({ ...p, [name]: file }));
    return;
  }

  /* ================= INPUT FILTERS ================= */
  if (["complainantName", "respondentName", "declarantName"].includes(name)) {
    if (!/^[A-Za-z\s]*$/.test(value)) return;
  }

  if (["complainantMobile", "respondentMobile"].includes(name)) {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 10) return;
  }

  if (["cPincode", "rPincode"].includes(name)) {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 6) return;
  }

  if (["agentId", "promoterRegId"].includes(name)) {
    if (!/^[A-Za-z0-9\-\/]*$/.test(value)) return;
    if (value.length > 20) return;
  }

  /* ================= NORMAL STATE UPDATE ================= */
  setForm((p) => ({
    ...p,
    [name]: type === "checkbox" ? checked : value,
  }));

  /* ================= CLEAR FIELD ERROR ================= */
  setErrors((prev) => {
    if (!prev[name]) return prev;
    const copy = { ...prev };
    delete copy[name];
    return copy;
  });
};


  const handleAddDoc = () => {
  if (!form.docDesc || !form.docFile) return;

  if (form.docFile.type !== "application/pdf") {
    setActiveError("Only PDF files are allowed");
    return;
  }

  setSupportingDocs((p) => [
    ...p,
    { id: Date.now(), desc: form.docDesc, file: form.docFile },
  ]);

  setForm((p) => ({ ...p, docDesc: "", docFile: null }));

  if (docFileRef.current) {
    docFileRef.current.value = ""; // ✅ FILE INPUT RESET
  }
};


const validateForm = () => {
  const newErrors = {};

  // 🔹 Application Type
  if (!form.applicationType) {
    newErrors.applicationType = "Please select Application Type";
  }

  // 🔹 Complaint Against / By
  if (!form.complaintAgainst) {
    newErrors.complaintAgainst = "Please Select Complaint Against";
  }

  if (!form.complaintBy) {
    newErrors.complaintBy = "Please Select Complaint By";
  }

  // 🔹 Name
  if (!form.complainantName) {
    newErrors.complainantName = "Please Enter Name";
  }

  // 🔹 Mobile
  if (!form.complainantMobile) {
    newErrors.complainantMobile = "Please Enter Mobile Number";
  } else if (!/^[6-9]\d{9}$/.test(form.complainantMobile)) {
    newErrors.complainantMobile = "Please Enter Valid Mobile Number";
  }

  // 🔹 Email
  if (!form.complainantEmail) {
    newErrors.complainantEmail = "Please Enter Email Id";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.complainantEmail)) {
    newErrors.complainantEmail = "Please Enter Valid Email Id";
  }

  // 🔹 Address
  if (!form.cAddress1) {
    newErrors.cAddress1 = "Please Enter Address Line 1";
  }

  if (!form.cState) {
    newErrors.cState = "Please Select State";
  }

  if (!form.cDistrict) {
    newErrors.cDistrict = "Please Select District";
  }

  if (!form.cPincode) {
    newErrors.cPincode = "Please Enter Pincode";
  } else if (!/^\d{6}$/.test(form.cPincode)) {
    newErrors.cPincode = "Please Enter Valid Pincode";
  }

  // 🔹 RESPONDENT VALIDATION (CONDITIONAL)

if (showRespondentBlock) {

  // 👉 CASE 1: Registered with RERA = YES
  if (respondentRERA_Yes && (isAgent || isPromoter)) {
    if (!form.promoterRegId) {
      newErrors.promoterRegId = "Please Enter Registration ID";
    }
  }

  // 👉 CASE 2: Registered with RERA = NO
  if (
    (isAllottee) ||
    (isAgent && respondentRERA_No) ||
    (isPromoter && respondentRERA_No)
  ) {
    if (!form.respondentName) {
      newErrors.respondentName = "Please Enter Respondent Name";
    }

    if (!form.respondentMobile) {
      newErrors.respondentMobile = "Please Enter Mobile Number";
    } else if (!/^[6-9]\d{9}$/.test(form.respondentMobile)) {
      newErrors.respondentMobile = "Please Enter Valid Mobile Number";
    }

    if (!form.respondentEmail) {
      newErrors.respondentEmail = "Please Enter Email ID";
    }
  }

  // 👉 Project name required except Agent
  if (!form.projectName && form.complaintAgainst !== "Agent") {
    newErrors.projectName = "Please Enter Project Name";
  }
}

  // 🔹 Complaint Details
  if (!form.subject) {
    newErrors.subject = "Please Enter Subject of Complaint";
  }

  if (!form.relief) {
    newErrors.relief = "Please Enter Relief Sought";
  }

  if (
  (form.complaintBy === "Others" ||
   form.complaintBy === "Promoter" ||
   (form.complaintAgainst === "Promoter" && form.complaintBy === "Agent"))
  && !form.description
) {
  newErrors.description = "Please Enter Description of Complaint";
}

  // 🔹 Declaration
  if (!form.declaration1) {
    newErrors.declaration1 = "Please Accept Declaration";
  }

  if (!form.declaration2 || !form.declarantName) {
    newErrors.declarantName = "Please Enter Declarant Name and Accept Declaration";
  }

  // store all errors
  setErrors(newErrors);

  // show ONLY first error in popup
  setActiveError(Object.values(newErrors)[0] || "");

  return Object.keys(newErrors).length === 0;
};


  // API submission handler following the backend contract
 const handleSaveAndContinue = async () => {

  // ❌ STOP here if required fields are missing
  if (!validateForm()) {
    return;
  }

  try {
    setIsSubmitting(true);

      setSubmitError("");

      // STEP 1: Create complaint (POST /complint/create)
      const complaintPayload = {
        complainant: {
          type: form.complaintBy || "",
          name: form.complainantName || "",
          mobile: form.complainantMobile || "",
          email: form.complainantEmail || "",
          state: form.cState || "",
          district: form.cDistrict || "",
          pincode: form.cPincode || "",
          address_line1: form.cAddress1 || "",
          address_line2: form.cAddress2 || "",
   
        },
        respondent: {
          type: form.complaintAgainst || "",
          name: form.respondentName || "",
          project_name: form.projectName || "",
          phone: form.respondentMobile || "",
          email: form.respondentEmail || "",
        address_line1: form.rAddress1 || "",
    address_line2: form.rAddress2 || "",
    state: form.rState || "",
    district: form.rDistrict || "",
    pincode: form.rPincode || "",
        },
        complaint: {
          subject: form.subject || "",
          relief_sought: form.relief || "",
          description: form.description || "",
          application_type: form.applicationType,
          complaint_facts: {
            complaint_regarding: form.complaintRegarding || null,
          },
        },
      };

      const createData = await apiPost("/api/complint/create", complaintPayload);
      
      if (!createData || !createData.complaint_id) {
        throw new Error("Failed to create complaint - no complaint_id returned");
      }

      const complaintId = createData.complaint_id;

      // STEP 2A: Upload system complaint documents (one at a time)
      const systemDocs = [
        { type: "AGREEMENT_FOR_SALE", file: form.agreementFile },
        { type: "FEE_RECEIPT", file: form.feeReceiptFile },
        { type: "INTERIM_ORDER", file: form.interimFile },
      ];

      for (const doc of systemDocs) {
        if (doc.file) {
          const formData = new FormData();
          formData.append("complaint_id", complaintId.toString());
          formData.append("type", doc.type);
          formData.append("document", doc.file);

          await apiPost("/api/complint/upload-complaint-documents", formData);
        }
      }

      // STEP 2B: Upload supporting documents (all at once)
      if (supportingDocs.length > 0) {
        const supportingFormData = new FormData();
        supportingFormData.append("complaint_id", complaintId.toString());

        supportingDocs.forEach((doc) => {
          supportingFormData.append("document_description", doc.desc);
          supportingFormData.append("documents", doc.file);
        });

        await apiPost("/api/complint/upload-supporting-documents", supportingFormData);
      }

      // Save all data including complaint_id
      setComplaintData({ 
        ...form, 
        supportingDocs,
        complaint_id: complaintId 
      });

      // Move to next step
      setCurrentStep(2);

    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Flags
  const isPromoterByAllottee =
    form.complaintAgainst === "Promoter" &&
    form.complaintBy === "Allottee";

  const showAllotteeComplainantOnly =
    (form.complaintAgainst === "Agent" &&
      (form.complaintBy === "Allottee" || form.complaintBy === "Others")) ||
    isPromoterByAllottee;

  const isAgainstAllottee = form.complaintAgainst === "Allottee";
  const isComplaintByAllottee = form.complaintBy === "Allottee";
  const isInitialComplaintStage = !form.complaintAgainst && !form.complaintBy;
  const isComplaintAgainstAllottee = form.complaintAgainst === "Allottee";
  const isComplaintByOthers = form.complaintBy === "Others";
  const isAgentAgainstPromoter =
    form.complaintAgainst === "Promoter" &&
    form.complaintBy === "Agent";

  const isInitialStage = !form.complaintAgainst || !form.complaintBy;
  const isAgent = form.complaintAgainst === "Agent";
  const isAllottee = form.complaintAgainst === "Allottee";
  const isPromoter = form.complaintAgainst === "Promoter";

  const byAgent = form.complaintBy === "Agent";
  const byAllottee = form.complaintBy === "Allottee";
  const byOthers = form.complaintBy === "Others";
  const byPromoter = form.complaintBy === "Promoter";

  const complainantRERA_Yes = form.complainantRERA === "Yes";
  const complainantRERA_No = form.complainantRERA === "No";
  const respondentRERA_Yes = form.respondentRERA === "Yes";
  const respondentRERA_No = form.respondentRERA === "No";

  const showSubjectOther = form.subject === "Any Other";
  const showReliefOther = form.relief === "Any Other";

  const isSubjectResolved =
    form.subject &&
    (form.subject !== "Any Other" || form.subjectOther);

  const isReliefResolved =
    form.relief &&
    (form.relief !== "Any Other" || form.reliefOther);

  const showComplainantBlock =
    form.complaintBy &&
    !showAllotteeComplainantOnly &&
    (byAllottee || byOthers || byPromoter || byAgent);

  const showRespondentBlock = isAgent || isPromoter || isAllottee;

  const showComplainantRERA = (isAgent && byPromoter) || isPromoter;
  const showRespondentRERA = (isAgent && !form.complaintBy) || isPromoter;

  const showAgreementUpload =
    !isInitialStage &&
    ((isAllottee && byPromoter) || (isPromoter && byAllottee));

    

  const showInterim = form.complaintAgainst === "Promoter";
  const showInterimUpload = showInterim && form.interimOrder === "Yes";

  
  return (
    <div className="cr-container">
      <h3>Complaint Details</h3>

      {/* 🔴 SINGLE ERROR POPUP (ONE BY ONE) */}
{activeError && (
  <div className="error-toast" style={{ top: "90px" }}>
    <span className="error-toast-text">{activeError}</span>
    <button
      className="error-toast-close"
      onClick={() => setActiveError("")}
    >
      ×
    </button>
  </div>
)}


     


      {submitError && (
        <div style={{ color: "red", marginBottom: "1rem", padding: "10px", backgroundColor: "#fee", border: "1px solid red" }}>
          {submitError}
        </div>
      )}

      <div className="cr-row">
        <div>
          <label>Complaint Against *</label>
          <select
            name="complaintAgainst"
            value={form.complaintAgainst}
            onChange={(e) => {
              handleChange(e);
              setForm((p) => ({ ...p, complaintBy: "" }));
            }}
          >
            <option value="">Select</option>
            <option>Agent</option>
            <option>Allottee</option>
            <option>Promoter</option>
          </select>
        </div>
        <div>
          <label>Complaint By *</label>
          <select
            name="complaintBy"
            value={form.complaintBy}
            onChange={handleChange}
            disabled={!form.complaintAgainst}
          >
            <option value="">Select</option>
            {(complaintByOptionsMap[form.complaintAgainst] || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showAllotteeComplainantOnly && (
        <>
          <h4>Details Of The Complainant</h4>
          <div className="cr-row-3">
            <div>
            <label>Name of the Complainant *</label>
            <input
  name="complainantName"
  placeholder="Name of the Complainant"
  value={form.complainantName}
  onChange={handleChange}
  maxLength={50}
/>
</div>
<div>
<label>Mobile No *</label>
           <input
  name="complainantMobile"
  placeholder="Mobile No"
  value={form.complainantMobile}
  onChange={handleChange}
  maxLength={10}
  inputMode="numeric"
/>
</div>
<div>
  <label>Email ID *</label>
            <input
              name="complainantEmail"
              placeholder="Email ID"
              value={form.complainantEmail}
              onChange={handleChange}
            />
            </div>
          </div>

          <h4>Complainant Communication Address</h4>
          <div className="cr-row-3">
            <input
              name="cAddress1"
              placeholder="Address Line 1 *"
              value={form.cAddress1}
              onChange={handleChange}
            />
            <input
              name="cAddress2"
              placeholder="Address Line 2"
              value={form.cAddress2}
              onChange={handleChange}
            />
            <select
              name="cState"
              value={form.cState}
              onChange={(e) => {
                handleChange(e);
                setDistrictList(DISTRICTS[e.target.value] || []);
              }}
            >
              <option value="">State/UT *</option>
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select name="cDistrict" value={form.cDistrict} onChange={handleChange}>
              <option value="">District *</option>
              {districtList.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <input
  name="cPincode"
  placeholder="PIN Code *"
  value={form.cPincode}
  onChange={handleChange}
  maxLength={6}
  inputMode="numeric"
/>

          </div>
        </>
      )}

      {showComplainantBlock && (
        <>
          <h4>Details of the Complaint</h4>
          <div className="rera-block">
            <label className="rera-label">
              Is He/She Registered with AP RERA:
            </label>
            <div className="radio-line">
              <label>
                <input
                  type="radio"
                  name="complainantRERA"
                  value="Yes"
                  checked={form.complainantRERA === "Yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="complainantRERA"
                  value="No"
                  checked={form.complainantRERA === "No"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          <div className="cr-row-3">
            {complainantRERA_Yes && (
              <input
  name="agentId"
  placeholder="Promoter / Project Reg. ID / Agent ID *"
  value={form.agentId}
  onChange={handleChange}
  maxLength={20}
/>


            )}
          </div>

        {complainantRERA_No && (
  <>
    {/* ---------- BASIC DETAILS (3 FIELDS) ---------- */}
    <div className="cr-row-3">
      <div className="field">
        <label>Name of the Complainant *</label>
        <input
          name="complainantName"
          placeholder="Name of the Complainant"
          value={form.complainantName}
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label>Mobile No *</label>
        <input
          name="complainantMobile"
          placeholder="Mobile No"
          value={form.complainantMobile}
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label>Email ID *</label>
        <input
          name="complainantEmail"
          placeholder="Email ID"
          value={form.complainantEmail}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* ---------- ADDRESS HEADING (OUTSIDE GRID) ---------- */}
    <h4>Complainant Communication Address</h4>

    {/* ---------- ADDRESS LINE 1 & 2 ---------- */}
    <div className="cr-row-3">
      <div className="field">
        <label>Address Line 1 *</label>
        <input
          name="cAddress1"
          placeholder="Address Line 1"
          value={form.cAddress1}
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label>Address Line 2</label>
        <input
          name="cAddress2"
          placeholder="Address Line 2"
          value={form.cAddress2}
          onChange={handleChange}
        />
      </div>
    

    {/* ---------- STATE / DISTRICT / PIN ---------- */}

      <div className="field">
        <label>State / UT *</label>
        <select
          name="cState"
          value={form.cState}
          onChange={(e) => {
            handleChange(e);
            setDistrictList(DISTRICTS[e.target.value] || []);
          }}
        >
          <option value="">Select</option>
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>District *</label>
        <select
          name="cDistrict"
          value={form.cDistrict}
          onChange={handleChange}
        >
          <option value="">Select</option>
          {districtList.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>PIN Code *</label>
        <input
          name="cPincode"
          placeholder="PIN Code"
          value={form.cPincode}
          onChange={handleChange}
        />
      </div>
    </div>
  </>
)}

        </>
      )}

      {showRespondentBlock && (
        <>
          <h4>Details of the Respondent</h4>
          {(isAgent || isPromoter) && (
            <>
              <label>Is He/She Registered with AP RERA:</label>
              <div className="radio-line">
                <label>
                  <input
                    type="radio"
                    name="respondentRERA"
                    value="Yes"
                    checked={form.respondentRERA === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="respondentRERA"
                    value="No"
                    checked={form.respondentRERA === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </>
          )}

          <div className="cr-row-3">
            {respondentRERA_Yes && (isPromoter || isAgent) && (
              <input
                name="promoterRegId"
                placeholder={isAgent ? "Agent ID *" : "Promoter / Project Reg. ID *"}
                value={form.promoterRegId}
                onChange={handleChange}
              />
            )}
          </div>

          {(isAllottee || (isAgent && respondentRERA_No) || (isPromoter && respondentRERA_No)) && (
  <div className="cr-row-3">
    <div className="field">
      <label>Project Name <span>*</span></label>
      <input
        name="projectName"
        placeholder="Project Name *"
        value={form.projectName}
        onChange={handleChange}
      />
    </div>

    <div className="field">
      <label>
        {isPromoter
          ? "Promoter Name (Preferably Company Name)"
          : "Name"}{" "}
        <span>*</span>
      </label>
      <input
        name="respondentName"
        placeholder={
          isPromoter
            ? "Promoter Name (Preferably Company Name)"
            : "Name"
        }
        value={form.respondentName}
        onChange={handleChange}
      />
    </div>

    <div className="field">
      <label>Mobile Number <span>*</span></label>
      <input
        name="respondentMobile"
        placeholder="Mobile *"
        value={form.respondentMobile}
        onChange={handleChange}
      />
    </div>

    <div className="field">
      <label>Email ID <span>*</span></label>
      <input
        name="respondentEmail"
        placeholder="Email *"
        value={form.respondentEmail}
        onChange={handleChange}
      />
    </div>
  </div>
)}

        </>
      )}

       {(
  isAgainstAllottee ||
  (isAgent && respondentRERA_No) ||
  (isPromoter && respondentRERA_No)
) && (

        <>
          <h4>Respondent Communication Address</h4>
          <div className="cr-row-3">
  <div className="field">
    <label>Address Line 1 <span>*</span></label>
    <input
      name="rAddress1"
      placeholder="Address Line 1"
      value={form.rAddress1}
      onChange={handleChange}
    />
  </div>

  <div className="field">
    <label>Address Line 2</label>
    <input
      name="rAddress2"
      placeholder="Address Line 2"
      value={form.rAddress2}
      onChange={handleChange}
    />
  </div>

  <div className="field">
    <label>State / UT <span>*</span></label>
    <select
      name="rState"
      value={form.rState}
      onChange={(e) => {
        handleChange(e);
        setDistrictList(DISTRICTS[e.target.value] || []);
      }}
    >
      <option value="">Select</option>
      {STATES.map((s) => (
        <option key={s}>{s}</option>
      ))}
    </select>
  </div>

  <div className="field">
    <label>District <span>*</span></label>
    <select
      name="rDistrict"
      value={form.rDistrict}
      onChange={handleChange}
    >
      <option value="">Select</option>
      {districtList.map((d) => (
        <option key={d}>{d}</option>
      ))}
    </select>
  </div>

  <div className="field">
    <label>PIN Code <span>*</span></label>
    <input
      name="rPincode"
      placeholder="PIN Code"
      value={form.rPincode}
      onChange={handleChange}
    />
  </div>
</div>

        </>
      )}

      <h4>Details Of The Complaint</h4>
      <div className="cr-row-3">
        <div className="field">
          <label>Subject of Complaint *</label>
          <input
            name="subject"
            placeholder="Subject of Complaint"
            value={form.subject}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Relief Sought from APRERA *</label>
          <input
            name="relief"
            placeholder="Relief Sought from APRERA"
            value={form.relief}
            onChange={handleChange}
          />
        </div>

        {form.complaintAgainst === "Promoter" && (
          <div className="field">
            <label>Interim Order *</label>
            <div className="radio-inline">
              <label>
                <input
                  type="radio"
                  name="interimOrder"
                  value="Yes"
                  checked={form.interimOrder === "Yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="interimOrder"
                  value="No"
                  checked={form.interimOrder === "No"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>
        )}

        {(isComplaintByOthers || byPromoter) && (
          <div className="field">
            <div>
              <label>Description of Complaint *</label>
              <input
                name="description"
                placeholder="Description of Complaint"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {isAgentAgainstPromoter && (
          <div>
            <div className="field">
              <label>Description of Complaint *</label>
              <input
                name="description"
                placeholder="Description of Complaint"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      

      {isAgainstAllottee  && (
        <div className="cr-row-3">
          <div>
            <label>Upload Agreement for Sale *</label>
            <input
  type="file"
  name="agreementFile"
  accept="application/pdf"
  onChange={handleChange}
/>
          </div>
        </div>
      )}
       {isAgainstAllottee  && (
        <div className="cr-row-3">
          <div>
            <label>Upload Fee Receipt *</label>
            <input
              type="file"
              name="feeReceiptFile"
              accept="application/pdf"
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      
      

      {isComplaintByAllottee && (
        <div className="cr-row-3">
          <div>
            <label>Description of Complaint *</label>
            <input
              name="description"
              placeholder="Description of Complaint"
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

  {isComplaintByAllottee && (
        <div className="cr-row-3">
          <div>
            <label>
              Complaint Regarding *
              <span style={{ color: "red" }}>
                {" "}(Ex: House/Flat/Block/Floor No.)
              </span>
            </label>
            <input
              name="complaintRegarding"
              placeholder="Complaint Regarding"
              value={form.complaintRegarding}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Upload Fee *</label>
            <input
              type="file"
              name="feeReceiptFile"
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      {/* <div className="cr-row-3">
        {showAgreementUpload && (
          <input
            type="file"
            name="agreementFile"
            onChange={handleChange}
          />
        )}
      </div> */}

      <div className="cr-row-3">
        {showInterimUpload && (
          <div>
            <label>Upload Relavant Document</label>
          <input
            type="file"
            name="interimFile"
            accept="application/pdf"
            onChange={handleChange}
          />
          </div>
        )}
      </div>
</div>
      <h4>Supporting Documents</h4>
      <div className="cr-row-3">
        <div>
          <label>Document Description</label>
          <input
            name="docDesc"
            placeholder="Document Description"
            value={form.docDesc}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Upload Document</label>
         <input
  type="file"
  name="docFile"
  accept="application/pdf"
  ref={docFileRef}
  onChange={handleChange}
/>

        </div>
        <button
    type="button"
    onClick={handleAddDoc}
    className="add-btn"
  >
          Add
        </button>
      </div>

      {supportingDocs.length > 0 && (
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
                  <a
                    href={URL.createObjectURL(d.file)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                </td>
                <td>
                  <button
                    type="button"
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
      )}

      <h4>Declaration</h4>
      <div className="cr-declaration">
        <input
          type="checkbox"
          name="declaration1"
          checked={form.declaration1 || false}
          onChange={handleChange}
        />
        <span>
          I hereby declare that the complaint mentioned above is not pending before any
          court of law or any other authority or any other tribunal.
        </span>
      </div>
      <div className="cr-declaration">
        <input
          type="checkbox"
          name="declaration2"
          checked={form.declaration2 || false}
          onChange={handleChange}
        />
        <span>
          I,&nbsp;
          <input
            type="text"
            name="declarantName"
            value={form.declarantName || ""}
            onChange={handleChange}
            className="inline-input"
          />
          , the complainant do hereby verify that the contents of above are true to my
          personal knowledge and belief and that I have not suppressed any material
          fact(s).
        </span>
      </div>

      <div className="cr-footer">
        <button
          className="proceed-btn"
          onClick={handleSaveAndContinue}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Save And Continue"}
        </button>
      </div>
    </div>
  );
}