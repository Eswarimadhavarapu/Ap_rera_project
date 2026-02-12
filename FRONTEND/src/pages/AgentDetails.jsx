import "../styles/AgentDetails.css";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiGet } from "../api/api";

const AgentDetailsOther = () => {
  const navigate = useNavigate();
  const location = useLocation();
const passedPan = location.state?.pan || "";


  // ================= VALIDATIONS =================

// CIN (21 chars AlphaNumeric)
const validateCIN = (cin) =>
  /^[A-Z0-9]{21}$/.test(cin);

// PAN (ABCDE1234F)
const validatePAN = (pan) =>
  /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);

// Email
const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Mobile: Starts with 6/7/8/9 and total 10 digits
const validateMobile = (mobile) =>
  /^[6-9][0-9]{9}$/.test(mobile);

// Pincode (Start with 5, 6 digits)
const validatePincode = (pin) =>
  /^[5][0-9]{5}$/.test(pin);

// Aadhaar (12 digits)
const validateAadhaar = (aadhaar) =>
  /^[0-9]{12}$/.test(aadhaar);

// DIN (8 digits)
const validateDIN = (din) =>
  /^[0-9]{8}$/.test(din);

// Address (Alphanumeric + , . / -)
const validateAddress = (address) =>
  /^[A-Za-z0-9\s,./-]+$/.test(address);

// JPG Only
const isJPG = (file) =>
  file && file.type === "image/jpeg";

// PDF Only
const isPDF = (file) =>
  file && file.type === "application/pdf";





  // ===============================
  // LOCATION DATA
  // ===============================
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
const [stateData, setStateData] = useState({ id: "", name: "" });
const [districtData, setDistrictData] = useState({ id: "", name: "" });
const [mandalData, setMandalData] = useState({ id: "", name: "" });
const [villageData, setVillageData] = useState({ id: "", name: "" });

  const [errorMsg, setErrorMsg] = useState("");

  
// ===== OTHER RERA LOCATION =====
const [otherReraStateId, setOtherReraStateId] = useState("");
const [otherReraDistrictId, setOtherReraDistrictId] = useState("");
const [otherReraDistricts, setOtherReraDistricts] = useState([]);

  // ===============================
  // FORM STATE
  // ===============================
  const [form, setForm] = useState({
    orgType: "",
    orgName: "",
    cin: "", 
    regNumber: "",
    regDate: "",
    pan: "",
    email: "",
    mobile: "",
    trustNumber: "",
trustRegDate: "",
    landline: "",
    gst: "",
    address1: "",
    address2: "",
    pincode: "",
    signName: "",
    signMobile: "",
    signEmail: "",
  });
  useEffect(() => {
  if (!passedPan) return;

  const savedForm = localStorage.getItem(`agentForm_${passedPan}`);

  if (savedForm) {
    setForm(JSON.parse(savedForm));
  } else {
    setForm((prev) => ({ ...prev, pan: passedPan }));
  }
}, [passedPan]);
useEffect(() => {
  if (!form.pan) return;

  localStorage.setItem(
    `agentForm_${form.pan}`,
    JSON.stringify(form)
  );
}, [form]);



  // ===== Projects (Past 5 Years) =====
const [hasProjects, setHasProjects] = useState("");
const [projectName, setProjectName] = useState("");
const [projects, setProjects] = useState([]);

// ===== Litigations =====
const [hasLitigation, setHasLitigation] = useState("");
const [hasInterimOrder, setHasInterimOrder] = useState("");
const [hasFinalOrder, setHasFinalOrder] = useState("");
// ===== Litigation Table State =====
const [litigations, setLitigations] = useState([]);
// ===== Litigation Form State =====
const [litigationForm, setLitigationForm] = useState({
  caseNo: "",
  namePlace: "",
  petitioner: "",
  respondent: "",
  facts: "",
  status: "",
  interimCert: null,
  finalCert: null,
  trustDeed: null,
});

const [affidavitFile, setAffidavitFile] = useState(null);

// ===== Other State / UT RERA =====
const [hasOtherRera, setHasOtherRera] = useState("");
const [otherReraForm, setOtherReraForm] = useState({
  regNumber: "",
  state: "",
  district: "",
});
const [otherReraList, setOtherReraList] = useState([]);




// ===== FILE STATES =====
const [files, setFiles] = useState({
  regCert: null,
  panDoc: null,
  gstDoc: null,
  addressProof: null,
  authPhoto: null,
  boardResolution: null,
  partnershipDeed: null, 
  memorandumDoc: null,
});

const [directors, setDirectors] = useState([]);


const [showTrusteeSection, setShowTrusteeSection] = useState(false);

// ===== PARTNER =====
const [showPartnerSection, setShowPartnerSection] = useState(false);

const initialPartnerForm = {
  designation: "",
  name: "",
  email: "",
  mobile: "",
  address1: "",
  address2: "",
  photo: null,
  addressProof: null,
};

const [partnerForm, setPartnerForm] = useState(initialPartnerForm);
const [partners, setPartners] = useState([]);

const [trusteeType, setTrusteeType] = useState(""); // 🔥 EMPTY initially
const [trustees, setTrustees] = useState([]);
const handleOrganisationTypeChange = (value) => {
  setShowTrusteeSection(true);
  setTrusteeType(""); // 🔥 reset Indian/Foreigner
};


const [trusteeForm, setTrusteeForm] = useState({
  nationality: "",
  designation: "",
  name: "",
  din: "NA",
  email: "",
  mobile: "",
  state: "",
  district: "",
  address1: "",
  address2: "",
  pincode: "",
  pan: "",
  aadhaar: "",
  panDoc: null,
  aadhaarDoc: null,
  photo: null,
  addressProof: null,
});



const handleAddTrustee = () => {

  const {
    designation,
    name,
    email,
    mobile,
    state,
    district,
    address1,
    pincode,
  } = trusteeForm;
  if (!otherReraForm) return null;


  if (!designation || !name || !email || !mobile || !address1) {
    alert("Please fill mandatory fields");
    return;
  }

  const newTrustee = {
    id: Date.now(),

    nationality: trusteeType,

    designation: showPartnerSection ? "Partner" : "Trustee",

    name: trusteeForm.name,
    din: trusteeForm.din || "NA",

    aadhaar: trusteeForm.aadhaar || "NA",
    pan: trusteeForm.pan || "NA",

    email: trusteeForm.email,
    mobile: trusteeForm.mobile,

    state: trusteeForm.state || "NA",
    district: trusteeForm.district || "NA",

    address1: trusteeForm.address1,
    address2: trusteeForm.address2 || "NA",

    pincode: trusteeForm.pincode || "NA",

    photo: trusteeForm.photo,
    addressProof: trusteeForm.addressProof,
    panDoc: trusteeForm.panDoc,
    aadhaarDoc: trusteeForm.aadhaarDoc,
  };

  setTrustees(prev => [...prev, newTrustee]);

  // Reset form
  setTrusteeForm({
    nationality: "",
    designation: "",
    name: "",
    din: "NA",
    email: "",
    mobile: "",
    state: "",
    district: "",
    address1: "",
    address2: "",
    pincode: "",
    pan: "",
    aadhaar: "",
    panDoc: null,
    aadhaarDoc: null,
    photo: null,
    addressProof: null,
  });

  setTrusteeType("");
};

// ===== ADD PARTNER =====
const handleAddPartner = () => {
  const {
    designation,
    name,
    email,
    mobile,
    address1,
  } = partnerForm;

  if (!designation || !name || !email || !mobile || !address1) {
    alert("Please fill all Partner details");
    return;
  }

  const newPartner = {
    ...partnerForm,
    id: Date.now(),
  };

  setPartners(prev => [...prev, newPartner]);

  setPartnerForm(initialPartnerForm);
};






// ===== TRUSTEE / PARTNER LOCATION =====
const [trusteeStateId, setTrusteeStateId] = useState("");
const [trusteeDistrictId, setTrusteeDistrictId] = useState("");
const [trusteeDistricts, setTrusteeDistricts] = useState([]);


// ================= AUTO SAVE FORM =================
useEffect(() => {
  const data = {
    form,
    files,
    directors,
    trustees,
    partners,
    projects,
   // litigations,
    otherReraList,
    stateData,
    districtData,
    mandalData,
    villageData,
    hasProjects,
    hasLitigation,
    hasOtherRera,
    hasInterimOrder,
    hasFinalOrder,
  };

  localStorage.setItem("agentDetailsDraft", JSON.stringify(data));
}, [
  form,
  files,
  directors,
  trustees,
  partners,
  projects,
  litigations,
  otherReraList,
  stateData,
  districtData,
  mandalData,
  villageData,
  hasProjects,
  hasLitigation,
  hasOtherRera,
  hasInterimOrder,
  hasFinalOrder,
]);

// ================= LOAD SAVED FORM =================
useEffect(() => {
  const saved = localStorage.getItem("agentDetailsDraft");

  if (!saved) return;

  const data = JSON.parse(saved);

  setForm((prev) => ({
    ...data.form,
    pan: passedPan || data.form?.pan || "", // ⭐ KEEP PASSED PAN SAFE
  }));

  setFiles(data.files || {});
  setDirectors(data.directors || []);
  setTrustees(data.trustees || []);
  setPartners(data.partners || []);
  setProjects(data.projects || []);
  setOtherReraList(data.otherReraList || []);

  setStateData(data.stateData || {});
  setDistrictData(data.districtData || {});
  setMandalData(data.mandalData || {});
  setVillageData(data.villageData || {});

  setHasProjects(data.hasProjects || "");
  setHasLitigation(data.hasLitigation || "");
  setHasOtherRera(data.hasOtherRera || "");
  setHasInterimOrder(data.hasInterimOrder || "");
  setHasFinalOrder(data.hasFinalOrder || "");
}, [passedPan]);

useEffect(() => {
  if (performance.navigation.type === 1) {
    localStorage.removeItem("agentDetailsDraft");
  }
}, []);

// ================= CLEAR ON REFRESH =================
useEffect(() => {
  const nav = performance.getEntriesByType("navigation")[0];
 if (nav && nav.type === "reload") {
    localStorage.removeItem("agentDetailsDraft");
  }
  
}, []);

  // ===============================
  // LOAD STATES (PAGE LOAD)
  // ===============================
  useEffect(() => {
  apiGet("/api/states")
    .then((res) => setStates(res || []))
    .catch((err) => console.error("States API error", err));
}, []);


  // ===============================
  // LOAD DISTRICTS
  // ===============================
useEffect(() => {
  if (!stateData.id) return;

  apiGet(`/api/districts/${stateData.id}`)
    .then((res) => {
      setDistricts(res || []);
      setMandals([]);
      setVillages([]);
      setDistrictData({ id: "", name: "" });
      setMandalData({ id: "", name: "" });
      setVillageData({ id: "", name: "" });
    })
    .catch(console.error);
}, [stateData.id]);


// ===== LOAD TRUSTEE DISTRICTS =====
useEffect(() => {
  if (!trusteeStateId) return;

  apiGet(`/api/districts/${trusteeStateId}`)
    .then((res) => {
      setTrusteeDistricts(res || []);
      setTrusteeDistrictId("");
    })
    .catch(console.error);

}, [trusteeStateId]);

  // ===============================
  // LOAD MANDALS
  // ===============================
 useEffect(() => {
  if (!districtData.id) return;

  apiGet(`/api/mandals/${districtData.id}`)
    .then((res) => {
      setMandals(res || []);
      setVillages([]);
      setMandalData({ id: "", name: "" });
      setVillageData({ id: "", name: "" });
    })
    .catch(console.error);
}, [districtData.id]);



  // ===============================
  // LOAD VILLAGES
  // ===============================
 useEffect(() => {
  if (!mandalData.id) return;

  apiGet(`/api/villages/${mandalData.id}`)
    .then((res) => setVillages(res || []))
    .catch(console.error);
}, [mandalData.id]);


// ===== DIRECTOR DETAILS =====
const [showDirectorSection, setShowDirectorSection] = useState(false);
const [directorType, setDirectorType] = useState(""); // Indian | Foreigner
// ===== DIRECTOR LOCATION =====
const [directorStateId, setDirectorStateId] = useState("");
const [directorDistrictId, setDirectorDistrictId] = useState("");
const [directorDistricts, setDirectorDistricts] = useState([]);
const [showAddDirector, setShowAddDirector] = useState("");
const [addDirectorRadio, setAddDirectorRadio] = useState("");





const [directorForm, setDirectorForm] = useState({
  name: "",
  email: "",
  mobile: "",
  designation: "",
  state: "",
  district: "",
  address1: "",
  address2: "",
  pincode: "",
  pan: "",
  aadhaar: "",
  din: "",
});

// ===== FOREIGNER DIRECTOR =====
const [foreignerDirector, setForeignerDirector] = useState({
  designation: "",
  name: "",
  mobile: "",
  email: "",
  address1: "",
  address2: "",
  photo: null,
  addressProof: null,
});

const [foreignerDirectors, setForeignerDirectors] = useState([]);



useEffect(() => {
  if (!directorStateId) return;

  apiGet(`/api/districts/${directorStateId}`)
    .then((res) => {
      setDirectorDistricts(res || []);
      setDirectorDistrictId("");
    })
    .catch(console.error);
}, [directorStateId]);

// ===== LOAD OTHER RERA DISTRICTS =====
useEffect(() => {
  if (!otherReraStateId) return;

  apiGet(`/api/districts/${otherReraStateId}`)
    .then((res) => {
      setOtherReraDistricts(res || []);
      setOtherReraDistrictId("");
    })
    .catch(console.error);

}, [otherReraStateId]);


  // ===============================
  // HANDLERS
  // ===============================
const handleChange = (e) => {
  const { name, value } = e.target;

  setForm(prev => ({
    ...prev,
    [name]: value,
  }));
};



  const submitAgentDetails = async () => {
  
    const formData = new FormData();
    if (form.orgType === "Company") {
  formData.append("memorandum_doc", files.memorandumDoc);
}


  /* ================= ORGANISATION ================= */
  formData.append("organisation_type", form.orgType);
  formData.append("organisation_name", form.orgName);
  
  let registrationNo = "";

if (form.orgType === "Company" || form.orgType === "Joint Venture") {
  registrationNo = form.cin;
} 
else if (form.orgType === "Trust/Society") {
  registrationNo = form.trustNumber;
} 
else {
  registrationNo = form.regNumber;
}

formData.append("registration_number", registrationNo);

  let regDate = "";

if (form.orgType === "Trust/Society") {
  regDate = form.trustRegDate;
} else {
  regDate = form.regDate;
}

formData.append("registration_date", regDate);

  formData.append("pan_card_number", form.pan);
  formData.append("email_id", form.email);
  formData.append("mobile_number", form.mobile);
  formData.append("landline_number", form.landline);
  formData.append("gst_number", form.gst);

  formData.append("registration_cert_doc", files.regCert);
  formData.append("pan_card_doc", files.panDoc);
  formData.append("gst_doc", files.gstDoc);

  /* ================= ADDRESS ================= */
  formData.append("address_line1", form.address1);
  formData.append("address_line2", form.address2);
  formData.append("state", stateData.name);
formData.append("district", districtData.name);
formData.append("mandal", mandalData.name);
formData.append("village", villageData.name);
  formData.append("pincode", form.pincode);
  formData.append("address_proof_doc", files.addressProof);

  /* ================= AUTHORIZED ================= */
  formData.append("authorized_name", form.signName);
  formData.append("authorized_mobile", form.signMobile);
  formData.append("authorized_email", form.signEmail);
  formData.append("authorized_photo", files.authPhoto);
  formData.append("board_resolution", files.boardResolution);

  /* ================= PROJECTS ================= */
  formData.append(
    "last_five_year_projects",
    JSON.stringify(
  projects.map(p => ({
    project_name: p.name,
    year: p.year || "",
    location: p.location || ""
  }))
)

  );

  /* ================= LITIGATIONS ================= */
 /* ================= LITIGATION ================= */

if (litigations.length > 0) {
  const l = litigations[0]; // backend supports one

  formData.append("case_no", l.caseNo);
  formData.append("tribunal_name_place", l.namePlace);

  formData.append("petitioner_name", l.petitioner);
  formData.append("respondent_name", l.respondent);

  formData.append("case_facts", l.facts);
  formData.append("present_status", l.status);

 if (l.interimCert) {
    formData.append("interim_certificate", l.interimCert);
  }

  // ✅ Send Final File
  if (l.finalCert) {
    formData.append("final_certificate", l.finalCert);
  }
  /* ===== SELF AFFIDAVIT (WHEN NO CASES) ===== */
if (hasLitigation === "No" && affidavitFile) {
  formData.append("self_affidavit", affidavitFile);
}

}

/* ================= ENTITY (DIRECTOR / PARTNER / TRUSTEE) ================= */


  /* ================= ENTITY (DIRECTOR / TRUSTEE / PARTNER) ================= */

let entity = null;
let entityType = "";

// COMPANY / JV / GOVT → DIRECTOR
if (
  form.orgType === "Company" ||
  form.orgType === "Joint Venture" ||
  form.orgType === "Government Department/Local Bodies/Government Bodies"
) {
  entity = directors[0];
  entityType = "DIRECTOR";
}

// TRUST → TRUSTEE
else if (form.orgType === "Trust/Society") {
  entity = trustees[0];
  entityType = "TRUSTEE";
}

// PARTNERSHIP → PARTNER
else if (form.orgType === "Partnership/LLP Firm") {
  entity = partners[0];
  entityType = "PARTNER";
}

if (!entity) {
  alert("Please add at least one Director / Trustee / Partner");
  return;
}

/* ===== COMMON FIELDS ===== */

formData.append("entity_type", entityType);

formData.append("entity_designation", entity.designation);
formData.append("entity_name", entity.name);
formData.append("entity_email", entity.email);
formData.append("entity_mobile", entity.mobile);

formData.append("entity_state", entity.state || "NA");
formData.append("entity_district", entity.district || "NA");

formData.append("entity_address_line1", entity.address1);
formData.append("entity_address_line2", entity.address2 || "NA");

formData.append("entity_pincode", entity.pincode || "NA");

formData.append("entity_pan_number", entity.pan || "NA");
formData.append("entity_aadhaar_number", entity.aadhaar || "NA");

formData.append("din_number", entity.din || "NA");

/* ===== FILES ===== */

if (entity.panDoc)
  formData.append("entity_pan_doc", entity.panDoc);

if (entity.aadhaarDoc)
  formData.append("entity_aadhaar_doc", entity.aadhaarDoc);

if (entity.photo)
  formData.append("entity_photo", entity.photo);

if (entity.addressProof)
  formData.append("entity_address_proof", entity.addressProof);

  /* ================= OTHER STATE RERA ================= */
formData.append(
  "other_state_rera_details",
  JSON.stringify(
    otherReraList.map(r => ({
      rera_no: r.regNumber,
      state: r.state,
      district: r.district,
    }))
  )
);
console.log("===== FORM DATA START =====");

for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}


console.log("===== FORM DATA END =====");

/* ================= DIRECTORS ================= */


/* ================= DIRECTOR FILES ================= */


  try {
    const res = await fetch(
      "https://0jv8810n-8080.inc1.devtunnels.ms/api/agent/other-than-individual",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log("SERVER RESPONSE:", data);


    if (!res.ok) {
      alert(data.message || "Submission failed");
      return;
    }

   alert("Agent Details submitted successfully ✅");

navigate("/AgentUploadDocumentotherthan", {
  state: {
    application_id: data.application_id,
    organisation_id: data.organisation_id,
    organization_pan_curd: data.organization_pan_curd,
    status: data.status,
  },
});


  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};


  // ===============================
  // SAVE & CONTINUE
  // ===============================
 const handleSaveAndContinue = () => {

  /* ================= REQUIRED FIELDS ================= */

  if (!form.orgType)
    return alert("Please select Organisation Type");

  if (!form.orgName)
    return alert("Please enter Organisation Name");

 // ===== REGISTRATION DATE VALIDATION =====

if (
  (form.orgType === "Company" ||
   form.orgType === "Joint Venture" ||
   form.orgType === "Partnership/LLP Firm" ||
   form.orgType === "Government Department/Local Bodies/Government Bodies") &&
  !form.regDate
) {
  return alert("Please select Registration Date");
}

if (form.orgType === "Trust/Society" && !form.trustRegDate) {
  return alert("Please select Trust Registration Date");
}

  if (!form.pan)
    return alert("Please enter PAN Number");

  if (!form.email)
    return alert("Please enter Email ID");

  if (!form.mobile)
    return alert("Please enter Mobile Number");

  if (!form.address1)
    return alert("Please enter Address Line 1");
if (
  !stateData.id ||
  !districtData.id ||
  !mandalData.id ||
  !villageData.id
)
  return alert("Please select complete Address");


  if (!form.pincode)
    return alert("Please enter PIN Code");

  if (!form.signName)
    return alert("Please enter Authorized Signatory Name");

  if (!form.signMobile)
    return alert("Please enter Authorized Mobile Number");

  if (!form.signEmail)
    return alert("Please enter Authorized Email");



  /* ================= FORMAT VALIDATIONS ================= */

  // PAN
  if (!validatePAN(form.pan))
    return alert("Invalid PAN format (Example: ABCDE1234F)");

  // Email
  if (!validateEmail(form.email))
    return alert("Invalid Email format");

  // Mobile
  if (!validateMobile(form.mobile))
    return alert("Mobile must start with 6/7/8/9 and be 10 digits");

  // Authorized Mobile
  if (!validateMobile(form.signMobile))
    return alert("Authorized mobile must be valid 10 digit number");

  // PIN Code
  if (!validatePincode(form.pincode))
    return alert("PIN Code must be 6 digits and start with 5");

 /* ===== LITIGATION VALIDATION ===== */

// When YES → check certificates
if (hasLitigation === "Yes") {

  if (litigations.length === 0) {
    return alert("Please add at least one litigation");
  }

  if (hasInterimOrder === "Yes" && !litigations[0]?.interimCert) {
    return alert("Please upload Interim Order Certificate");
  }

  if (hasFinalOrder === "Yes" && !litigations[0]?.finalCert) {
    return alert("Please upload Disposed Certificate");
  }
}

// When NO → check affidavit
if (hasLitigation === "No" && !affidavitFile) {
  return alert("Please upload Self Declared Affidavit");
}


  /* ================= DIRECTOR VALIDATION ================= */

  if (showDirectorSection && directors.length === 0)
    return alert("Please add at least one Director");

  if (directors.length > 0) {
    const d = directors[0];

    // ===== DIRECTOR VALIDATION BEFORE SUBMIT =====
if (directors.length > 0) {
  const d = directors[0];

  // ✅ Only Indian needs Aadhaar
  if (d.nationality === "Indian") {

    if (!isValidAadhaar(d.aadhaar)) {
      alert("Director Aadhaar must be 12 digits");
      return;
    }

  }

  // ✅ Both need DIN
  if (!isValidDIN(d.din)) {
    alert("Director DIN must be 8 digits");
    return;
  }

  // ✅ Both need valid mobile
  if (!isValidMobile(d.mobile)) {
    alert("Director Mobile must start with 6-9 and be 10 digits");
    return;
  }
}


    if (!validateDIN(d.din))
      return alert("Director DIN must be 8 digits");

    if (!validateMobile(d.mobile))
      return alert("Director mobile number is invalid");
  }



  /* ================= FILE VALIDATIONS ================= */

  if (!files.regCert)
    return alert("Please upload Registration Certificate");

  if (!files.panDoc)
    return alert("Please upload PAN Document");

  if ((form.orgType === "Company" || form.orgType === "Joint Venture") && !files.memorandumDoc)
    return alert("Please upload Memorandum Document");
/* ===== AFFIDAVIT (WHEN NO CASES) ===== */



  /* ================= ALL VALIDATIONS PASSED ================= */

  submitAgentDetails();
  /* ===== AFFIDAVIT (WHEN NO CASES) ===== */


};



  // ===== ADD PROJECT =====
// ===== ADD PROJECT =====
const handleAddProject = () => {
  if (!projectName.trim()) {
    alert("Enter Project Name");
    return;
  }

  setProjects([
    ...projects,
    { id: Date.now(), name: projectName },
  ]);

  setProjectName("");
};

// ===== ADD OTHER RERA =====
const handleAddOtherRera = () => {
  const { regNumber, state, district } = otherReraForm;

  if (!regNumber || !state || !district) {
    alert("Please fill all Other RERA details");
    return;
  }

  const newRera = {
    id: Date.now(),
    regNumber,
    state,
    district,
  };

  setOtherReraList([...otherReraList, newRera]);

  // Reset form after add
  setOtherReraForm({
    regNumber: "",
    state: "",
    district: "",
  });
  setOtherReraStateId("");
setOtherReraDistrictId("");
setOtherReraDistricts([]);
};


// ===== DELETE PROJECT =====
const handleDeleteProject = (id) => {
  setProjects(projects.filter((p) => p.id !== id));
};

const handleAddLitigation = () => {
  const { caseNo, namePlace, petitioner, respondent, facts, status } =
    litigationForm;
if (
  !caseNo ||
  !namePlace ||
  !petitioner ||
  !respondent ||
  !facts ||
  !status ||
  (hasInterimOrder === "Yes" && !litigationForm.interimCert) ||
  (hasFinalOrder === "Yes" && !litigationForm.finalCert)
) {
  alert("Please fill all litigation details and upload required files");
  return;
}


  setLitigations([
  ...litigations,
  {
    id: Date.now(),
    ...litigationForm,
    interimOrder: hasInterimOrder,
    finalOrder: hasFinalOrder,
  },
]);


  // reset form
  setLitigationForm({
  caseNo: "",
  namePlace: "",
  petitioner: "",
  respondent: "",
  facts: "",
  status: "",
  interimCert: null,
  finalCert: null,
});

  setHasInterimOrder("No");
  setHasFinalOrder("No");
};

const validateFiles = () => {

  // Photo → JPG
  if (files.authPhoto && !isJPG(files.authPhoto)) {
    alert("Authorized Photo must be JPG format");
    return false;
  }

  // Documents → PDF
  const pdfFiles = [
    files.regCert,
    files.panDoc,
    files.gstDoc,
    files.addressProof,
    files.boardResolution,
    files.memorandumDoc,
    files.partnershipDeed,
  ];

  for (let f of pdfFiles) {
    if (f && !isPDF(f)) {
      alert("All documents must be in PDF format");
      return false;
    }
  }

  return true;
};


const handleAddPartnerFromTrustee = () => {

  const {
    name,
    email,
    mobile,
    address1,
  } = trusteeForm;

  if (!name || !email || !mobile || !address1) {
    alert("Please fill all Partner details");
    return;
  }

  const newPartner = {
    id: Date.now(),

    nationality: trusteeType,

    designation: "Partner", // 🔥 Always Partner

    name: trusteeForm.name,
    din: "NA",

    aadhaar: trusteeForm.aadhaar || "NA",
    pan: trusteeForm.pan || "NA",

    email: trusteeForm.email,
    mobile: trusteeForm.mobile,

    state: trusteeForm.state || "NA",
    district: trusteeForm.district || "NA",

    address1: trusteeForm.address1,
    address2: trusteeForm.address2 || "NA",

    pincode: trusteeForm.pincode || "NA",

    photo: trusteeForm.photo,
    addressProof: trusteeForm.addressProof,
    panDoc: trusteeForm.panDoc,
    aadhaarDoc: trusteeForm.aadhaarDoc,
  };

  setPartners(prev => [...prev, newPartner]);

  // Reset form
  setTrusteeForm({
    nationality: "",
    designation: "",
    name: "",
    din: "NA",
    email: "",
    mobile: "",
    state: "",
    district: "",
    address1: "",
    address2: "",
    pincode: "",
    pan: "",
    aadhaar: "",
    panDoc: null,
    aadhaarDoc: null,
    photo: null,
    addressProof: null,
  });

  setTrusteeType("");
};

const handleAddForeignerDirector = () => {

  const {
    designation,
    name,
    mobile,
    email,
    address1,
    din,
    photo,
    addressProof,
  } = foreignerDirector;

  // ===== Mandatory Check =====
  if (!designation || !name || !mobile || !email || !address1 || !din) {
    alert("Please fill all mandatory Foreigner Director fields");
    return;
  }

  // ===== Format Validation =====
  if (!isValidMobile(mobile)) {
    alert("Mobile must start with 6-9 and be 10 digits");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Enter valid Email ID");
    return;
  }

  if (!isValidDIN(din)) {
    alert("DIN must be 8 digits");
    return;
  }

  // ❌ NO Aadhaar Validation Here (Foreigner)

  // ===== Save Foreigner =====
  setDirectors([
    ...directors,
    {
      nationality: "Foreigner",
      designation,
      name,
      din,
      aadhaar: "NA", // 🔥 Always NA
      email,
      mobile,

      state: "NA",
      district: "NA",

      address1,
      address2: foreignerDirector.address2 || "NA",
      pincode: "NA",
      pan: "NA",

      photo,
      addressProof,
      panDoc: null,
      aadhaarDoc: null,

      id: Date.now(),
    },
  ]);

  // Reset
  setForeignerDirector({
    designation: "",
    name: "",
    mobile: "",
    email: "",
    address1: "",
    address2: "",
    din: "",
    photo: null,
    addressProof: null,
  });
};


// ===== VALIDATION HELPERS =====
const isValidMobile = (num) => /^[6-9]\d{9}$/.test(num);

const isValidAadhaar = (num) => /^\d{12}$/.test(num);

const isValidDIN = (num) => /^\d{8}$/.test(num);

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


 return (
    <div className="yagentdetails-agent-wrapper">
      {/* Breadcrumb */}
      <div className="yagentdetails-breadcrumb">
        You are here : <span><a href="/">  Home </a> </span> / <span> Registration</span> /{" "}
        <span>Real Estate Agent Registration</span>
      </div>
<div className="yagentdetails-page-content">
      <h2 className="yagentdetails-page-title">Real Estate Agent Registration</h2>
      {errorMsg && (
  <div className="yagentdetails-error-banner">
    <span>{errorMsg}</span>
    <button onClick={() => setErrorMsg("")}>×</button>
  </div>
   )} 

      {/* Steps */}
 <div className="yagentdetails-stepper">
  <div className="yagentdetails-stepper-line"></div>

  <div className="yagentdetails-step active">
    <div className="yagentdetails-circle">1</div>
    <p>Agent Detail</p>
  </div>

  <div className="yagentdetails-step">
    <div className="yagentdetails-circle">2</div>
    <p>Upload Documents</p>
  </div>

  <div className="yagentdetails-step">
    <div className="yagentdetails-circle">3</div>
    <p>Preview</p>
  </div>

  <div className="yagentdetails-step">
    <div className="yagentdetails-circle">4</div>
    <p>Payment</p>
  </div>

  <div className="yagentdetails-step">
    <div className="yagentdetails-circle">5</div>
    <p>Acknowledgement</p>
  </div>
  </div>



      {/* Agent Type */}
     <section className="yagentdetails-agent-type-section">
  <h3 className="yagentdetails-agent-type-title">Agent Type</h3>

  <div className="yagentdetails-agent-type-options">
    <label className="yagentdetails-agent-type-item">
      <input type="radio" name="agentType" />
      <span>Individual</span>
    </label>

    <label className="yagentdetails-agent-type-item">
      <input type="radio" name="agentType" defaultChecked />
      <span>Other than individual</span>
    </label>
  </div>
  </section>

        

        {/* ================= ORGANISATION DETAILS ================= */}
<section className="yagentdetails-section yagentdetails-director-section">
        <h3>Organisation Details</h3>

<div className="yagentdetails-director-grid">
          <div>
  <label>Organisation Type <span className="yagentdetails-required">*</span></label>
  <select
  value={form.orgType}
  onChange={(e) => {
  const val = e.target.value;
  setForm({ ...form, orgType: val });

  if (val === "Trust/Society") {
    setShowTrusteeSection(true);
    setShowPartnerSection(false);
    setShowDirectorSection(false);

  } else if (val === "Partnership/LLP Firm") {
    setShowPartnerSection(true);
    setShowTrusteeSection(false);
    setShowDirectorSection(false);

  } else if (
    val === "Company" ||
    val === "Joint Venture" ||
    val === "Government Department/Local Bodies/Government Bodies"
  ) {
    // 🔥 SHOW DIRECTOR
    setShowDirectorSection(true);
    setShowTrusteeSection(false);
    setShowPartnerSection(false);

  } else {
    setShowTrusteeSection(false);
    setShowPartnerSection(false);
    setShowDirectorSection(false);
  }
}}

>
  <option value="">Select</option>
  <option value="Company">Company</option>
  <option value="Trust/Society">Trust/Society</option>
  <option value="Partnership/LLP Firm">Partnership/LLP Firm</option>
  <option value="Joint Venture">Joint Venture</option>
  <option value="Government Department/Local Bodies/Government Bodies">
    Government Department/Local Bodies/Government Bodies
  </option>
</select>

</div>



          <div>
            <label>Organisation Name<span className="yagentdetails-required">*</span></label>
            <input
  type="text"
  name="orgName"
  value={form.orgName}
  onChange={handleChange}
  placeholder="Organisation Name"
/>

          </div>

       {/* ===== REGISTRATION NUMBER (NOT COMPANY) =====
// {form.orgType !== "Company" && (
//   <div>
//     <label>
//       Registration Number <span className="yagentdetails-required">*</span>
//     </label>

//     <input
//       type="text"
//       name="regNumber"
//       value={form.regNumber}
//       onChange={handleChange}
//       placeholder="Registration Number"
//     />
//   </div>
// )} */}



{/* ===== CIN NUMBER (ONLY COMPANY) ===== */}
{/* ===== COMPANY ===== */}
{/* ===== COMPANY + JOINT VENTURE ===== */}
{(form.orgType === "Company" || form.orgType === "Joint Venture") && (
  <>
    {/* CIN */}
    <div>
      <label>
        CIN Number <span className="yagentdetails-required">*</span>
      </label>

      <input
        type="text"
        name="cin"
        value={form.cin}
        onChange={handleChange}
        placeholder="CIN Number"
      />
    </div>

    {/* DATE */}
    <div>
      <label>
        Date of Registration <span className="yagentdetails-required">*</span>
      </label>

      <input
        type="date"
        name="regDate"
        value={form.regDate}
        onChange={handleChange}
      />
    </div>
  </>
)}



{/* ===== TRUST / SOCIETY ===== */}
{form.orgType === "Trust/Society" && (
  <>
    <div>
      <label>
        Trust Number <span className="yagentdetails-required">*</span>
      </label>

      <input
        type="text"
        name="trustNumber"
        value={form.trustNumber}
        onChange={handleChange}
        placeholder="Trust Number"
      />
    </div>

    <div>
      <label>
        Date of Trust Registration{" "}
        <span className="yagentdetails-required">*</span>
      </label>

      <input
        type="date"
        name="trustRegDate"
        value={form.trustRegDate}
        onChange={handleChange}
      />
    </div>

    <div>
      <label>
        Upload Trust Deed{" "}
        <span className="yagentdetails-required">*</span>
      </label>

      <input
        type="file"
        onChange={(e) =>
          setFiles({
            ...files,
            trustDeed: e.target.files[0],
          })
        }
      />
    </div>
  </>
)}


{/* ===== OTHER TYPES ===== */}
{/* ===== OTHER TYPES ===== */}
{form.orgType !== "Company" &&
  form.orgType !== "Joint Venture" &&   // ✅ IMPORTANT
  form.orgType !== "Trust/Society" && (
    <>
      <div>
        <label>
          Registration Number{" "}
          <span className="yagentdetails-required">*</span>
        </label>

        <input
          type="text"
          name="regNumber"
          value={form.regNumber}
          onChange={handleChange}
          placeholder="Registration Number"
        />
      </div>
    </>
  )}




          {/* <div>
            <label>Date of Registration <span className="yagentdetails-required">*</span></label>
           <input
  type="date"
  name="regDate"
  value={form.regDate}
  onChange={handleChange}
/>

          </div> */}

          <div>
            <label>Upload Registration Certificate <span className="yagentdetails-required">*</span></label>
            <input type="file" onChange={(e) => setFiles({ ...files, regCert: e.target.files[0] })} />

          </div>

          <div>
            <label>PAN Card Number<span className="yagentdetails-required">*</span></label>
          <input
  type="text"
  name="pan"
  value={form.pan}
  disabled={!!passedPan}
/>



          </div>

          <div>
            <label>Upload PAN Card<span className="yagentdetails-required">*</span></label>
            <input type="file" onChange={(e) =>
  setFiles({ ...files, panDoc: e.target.files[0] })
}
 />

          </div>

          <div>
            <label>Email Id <span className="yagentdetails-required">*</span></label>
            <input
  type="email"
  name="email"
  value={form.email}
  onChange={handleChange}
  placeholder="Email Id"
/>

          </div>

          <div>
            <label>Mobile Number <span className="yagentdetails-required">*</span></label>
    <input
  type="text"
  name="mobile"
  maxLength="10"
  value={form.mobile}
  onChange={(e) =>
    setForm({
      ...form,
      mobile: e.target.value.replace(/\D/g, ""),
    })
  }
/>




          </div>

          <div>
            <label>Land Line Number</label>
           <input
  type="text"
  name="landline"
  value={form.landline}
  onChange={handleChange}
/>
          </div>

          <div>
            <label>GST Num</label>
            <input
  type="text"
  name="gst"
  value={form.gst}
  onChange={handleChange}
/>
          </div>

          <div>
            <label>Upload GST Num Document</label>
            <input type="file" onChange={(e) =>
  setFiles({ ...files, gstDoc: e.target.files[0] })
}
 />

          </div>
         {/* ===== MEMORANDUM (ONLY FOR COMPANY) ===== */}
{(form.orgType === "Company" || form.orgType === "Joint Venture") && (
  <div>
    <label>
      Upload Memorandum of Articles/Bye-laws
      <span className="yagentdetails-required">*</span>
    </label>

    <input
      type="file"
      onChange={(e) =>
        setFiles({
          ...files,
          memorandumDoc: e.target.files[0],
        })
      }
    />
  </div>
)}
{/* ===== PARTNERSHIP / LLP ===== */}
{form.orgType === "Partnership/LLP Firm" && (
  <>
  <div>
        <label>
          Date of Registration{" "}
          <span className="yagentdetails-required">*</span>
        </label>

        <input
          type="date"
          name="regDate"
          value={form.regDate}
          onChange={handleChange}
        />
      </div>
  <div>
    <label>
      Upload Partnership Deed{" "}
      <span className="yagentdetails-required">*</span>
    </label>

    <input
      type="file"
      onChange={(e) =>
        setFiles({
          ...files,
          partnershipDeed: e.target.files[0],
        })
      }
    />
  </div>
  
      
      </>
)}

{/* ===== GOVERNMENT DEPARTMENT ===== */}
{form.orgType ===
  "Government Department/Local Bodies/Government Bodies" && (
  <>
    {/* DATE */}
    <div>
      <label>
        Date of Registration{" "}
        <span className="yagentdetails-required">*</span>
      </label>

      <input
        type="date"
        name="regDate"
        value={form.regDate}
        onChange={handleChange}
      />
    </div>

    {/* UPLOAD DEED */}
    <div>
      <label>
        Upload Partnership Deed{" "}
        <span className="yagentdetails-required">*</span>
      </label>

      <input
        type="file"
        onChange={(e) =>
          setFiles({
            ...files,
            partnershipDeed: e.target.files[0],
          })
        }
      />
    </div>
  </>
)}


        </div>
      </section>

        {/* ================= LOCAL ADDRESS ================= */}
<section className="yagentdetails-section yagentdetails-director-section">
          <h3>Local Address For Communication</h3>

<div className="yagentdetails-director-grid">
            <div>
              <label>Address Line 1 *</label>
              <input
                name="address1"
                value={form.address1}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Address Line 2</label>
              <input
                name="address2"
                value={form.address2}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>State *</label>
              <select
  value={stateData.id}
  onChange={(e) => {
    const selected = states.find(s => s.id == e.target.value);

    setStateData({
      id: selected.id,
      name: selected.state_name,
    });
  }}
>

                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.state_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>District *</label>
            <select
  value={districtData.id}
  onChange={(e) => {
    const selected = districts.find(d => d.id == e.target.value);

    setDistrictData({
      id: selected.id,
      name: selected.name,
    });
  }}
>

                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Mandal *</label>
             <select
  value={mandalData.id}
  onChange={(e) => {
    const selected = mandals.find(m => m.id == e.target.value);

    setMandalData({
      id: selected.id,
      name: selected.name,
    });
  }}
>

                <option value="">Select Mandal</option>
                {mandals.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Local Area / Village *</label>
             <select
  value={villageData.id}
  onChange={(e) => {
    const selected = villages.find(v => v.id == e.target.value);

    setVillageData({
      id: selected.id,
      name: selected.name,
    });
  }}
>

                <option value="">Select Village</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>PIN Code *</label>
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
              />
            </div>
            

          <div>
            <label>Upload Address Proof <span className="yagentdetails-required">*</span></label>
           <input type="file" onChange={(e) =>
  setFiles({ ...files, addressProof: e.target.files[0] })
}
 />

          </div>
          </div>
        </section>

{/* ================= DIRECTOR DETAILS ================= */}
{showDirectorSection && (
  <section className="yagentdetails-section yagentdetails-director-section">

    <h3>Director Details</h3>

    {/* Indian / Foreigner */}
    <div className="yagentdetails-yes-no-row">
     

      <div className="yagentdetails-yes-no-options">
        <label>
          <input
            type="radio"
            name="directorType"
            value="Indian"
            checked={directorType === "Indian"}
            onChange={() => setDirectorType("Indian")}
          />
          Indian
        </label>

        <label>
          <input
            type="radio"
            name="directorType"
            value="Foreigner"
            checked={directorType === "Foreigner"}
            onChange={() => setDirectorType("Foreigner")}
          />
          Foreigner
        </label>
      </div>
    </div>

    {/* ===== INDIAN DIRECTOR FORM ===== */}
    {directorType === "Indian" && (
  <div className="yagentdetails-director-grid">

    {/* Row 1 */}
    <div>
      <label>Designation <span className="yagentdetails-required">*</span></label>
      <select
        onChange={(e) =>
          setDirectorForm({ ...directorForm, designation: e.target.value })
        }
      >
        <option value="">Select</option>
        <option value="Director">Director</option>
        <option value="Managing Director">Managing Director</option>
      </select>
    </div>

    <div>
      <label>Name <span className="yagentdetails-required">*</span></label>
      <input
        onChange={(e) =>
          setDirectorForm({ ...directorForm, name: e.target.value })
        }
      />
    </div>

    <div>
      <label>Email Id <span className="yagentdetails-required">*</span></label>
      <input
        type="email"
        onChange={(e) =>
          setDirectorForm({ ...directorForm, email: e.target.value })
        }
      />
    </div>

    <div>
      <label>Mobile Number <span className="yagentdetails-required">*</span></label>
      <input
        onChange={(e) =>
          setDirectorForm({ ...directorForm, mobile: e.target.value })
        }
      />
    </div>

    {/* Row 2 — 🔥 MISSING FIELDS ADDED */}
    <div>
      <label>State/UT <span className="yagentdetails-required">*</span></label>
      <select
        value={directorStateId}
        onChange={(e) => setDirectorStateId(e.target.value)}
      >
        <option value="">Select</option>
        {states.map((s) => (
          <option key={s.id} value={s.id}>
            {s.state_name}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label>District <span className="yagentdetails-required">*</span></label>
      <select
        value={directorDistrictId}
        disabled={!directorStateId}
        onChange={(e) => setDirectorDistrictId(e.target.value)}
      >
        <option value="">Select</option>
        {directorDistricts.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label>Address Line 1 <span className="yagentdetails-required">*</span></label>
      <input
        onChange={(e) =>
          setDirectorForm({ ...directorForm, address1: e.target.value })
        }
      />
    </div>

    <div>
      <label>Address Line 2</label>
      <input
        onChange={(e) =>
          setDirectorForm({ ...directorForm, address2: e.target.value })
        }
      />
    </div>

    {/* Row 3 */}
    <div>
      <label>Pincode <span className="yagentdetails-required">*</span></label>
      <input
        onChange={(e) =>
          setDirectorForm({ ...directorForm, pincode: e.target.value })
        }
      />
    </div>

    <div>
      <label>PAN Card Number <span className="yagentdetails-required">*</span></label>
      <input
        onChange={(e) =>
          setDirectorForm({ ...directorForm, pan: e.target.value })
        }
      />
    </div>

    <div>
      <label>Upload PAN Card <span className="yagentdetails-required">*</span></label>
<input
  type="file"
  onChange={(e) =>
    setDirectorForm({ ...directorForm, panDoc: e.target.files[0] })
  }
/>    </div>

    <div>
      <label>Aadhaar Number <span className="yagentdetails-required">*</span></label>
      <input
        onChange={(e) =>
          setDirectorForm({ ...directorForm, aadhaar: e.target.value })
        }
      />
    </div>

    {/* Row 4 */}
    <div>
      <label>Upload Aadhaar <span className="yagentdetails-required">*</span></label>
      <input
  type="file"
  onChange={(e) =>
    setDirectorForm({ ...directorForm, aadhaarDoc: e.target.files[0] })
  }
/>
    </div>

    <div>
      <label>Photograph <span className="yagentdetails-required">*</span></label>
     <input
  type="file"
  onChange={(e) =>
    setDirectorForm({ ...directorForm, photo: e.target.files[0] })
  }
/>
    </div>

    <div>
      <label>Address Proof <span className="yagentdetails-required"></span></label>
      <input
  type="file"
  onChange={(e) =>
    setDirectorForm({ ...directorForm, addressProof: e.target.files[0] })
  }
/>
    </div>

    <div>
      <label>DIN Number <span className="yagentdetails-required">*</span></label>
      <input
  maxLength="8"
  value={directorForm.din}
  onChange={(e) =>
    setDirectorForm({
      ...directorForm,
      din: e.target.value.replace(/\D/g, "")
    })
  }
/>

    </div>
     <div className="yagentdetails-add-btn-grid">
      <button
        type="button"
        className="yagentdetails-add-btn"
        onClick={() => {
  const {
    designation,
    name,
    email,
    mobile,
    address1,
    pincode,
    pan,
    aadhaar,
    din,
  } = directorForm;

  // ===== Mandatory Check =====
  if (
    !designation ||
    !name ||
    !email ||
    !mobile ||
    !address1 ||
    !pincode ||
    !pan ||
    !aadhaar ||
    !din
  ) {
    alert("Please fill all mandatory Director fields");
    return;
  }

  // ===== Format Validations =====
  if (!isValidMobile(mobile)) {
    alert("Mobile must start with 6-9 and be 10 digits");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Enter valid Email ID");
    return;
  }

  if (!isValidAadhaar(aadhaar)) {
    alert("Aadhaar must be 12 digits");
    return;
  }

  if (!isValidDIN(din)) {
    alert("DIN must be 8 digits");
    return;
  }

  // ===== Save Director =====
  setDirectors([
    ...directors,
    {
      nationality: "Indian",
      designation,
      name,
      din,
      aadhaar,
      email,
      mobile,
     state: states.find(s => s.id == directorStateId)?.state_name || "",
district: directorDistricts.find(d => d.id == directorDistrictId)?.name || "",

      address1,
      address2: directorForm.address2 || "NA",
      pincode,
      pan,

      photo: directorForm.photo,
      addressProof: directorForm.addressProof,
      panDoc: directorForm.panDoc,
      aadhaarDoc: directorForm.aadhaarDoc,

      id: Date.now(),
    },
  ]);
}}

      >
        Add
      </button>
    </div>

  </div>
  
)}


    {/* ===== FOREIGNER PLACEHOLDER ===== */}
    {directorType === "Foreigner" && (
      <p style={{ marginTop: "10px" }}>
      </p>
    )}
  </section>
)}

{/* ===== FOREIGNER DIRECTOR ===== */}
{directorType === "Foreigner" && (
  <>
    <div className="yagentdetails-director-grid">

      <div>
        <label>Designation <span className="yagentdetails-required">*</span></label>
        <select
          value={foreignerDirector.designation}
          onChange={(e) =>
            setForeignerDirector({
              ...foreignerDirector,
              designation: e.target.value,
            })
          }
        >
          <option value="">Select</option>
          <option value="Director">Director</option>
          <option value="Managing Director">Managing Director</option>
        </select>
      </div>

      <div>
        <label>Name <span className="yagentdetails-required">*</span></label>
        <input
          value={foreignerDirector.name}
          onChange={(e) =>
            setForeignerDirector({
              ...foreignerDirector,
              name: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label>Mobile Number <span className="yagentdetails-required">*</span></label>
        <input
          value={foreignerDirector.mobile}
          onChange={(e) =>
            setForeignerDirector({
              ...foreignerDirector,
              mobile: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label>Email Id <span className="yagentdetails-required">*</span></label>
        <input
          type="email"
          value={foreignerDirector.email}
          onChange={(e) =>
            setForeignerDirector({
              ...foreignerDirector,
              email: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label>Address Line 1 <span className="yagentdetails-required">*</span></label>
        <input
          value={foreignerDirector.address1}
          onChange={(e) =>
            setForeignerDirector({
              ...foreignerDirector,
              address1: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label>Address Line 2</label>
        <input
          value={foreignerDirector.address2}
          onChange={(e) =>
            setForeignerDirector({
              ...foreignerDirector,
              address2: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label>Upload Photograph <span className="yagentdetails-required">*</span></label>
        <input
          type="file"
          onChange={(e) =>
            setForeignerDirector({
              ...foreignerDirector,
              photo: e.target.files[0],
            })
          }
        />
      </div>

      <div>
        <label>Upload Address Proof <span className="yagentdetails-required">*</span></label>
        <input
          type="file"
          onChange={(e) =>
            setForeignerDirector({
              ...foreignerDirector,
              addressProof: e.target.files[0],
            })
          }
        />
      </div>

      <div>
        <label>DIN Number <span className="yagentdetails-required">*</span></label>
        <input
          value={foreignerDirector.din}
          onChange={(e) =>
            setForeignerDirector({
              ...foreignerDirector,
              din: e.target.value,
            })
          }
        />
      </div>

    </div>
    <div className="yagentdetails-add-btn-wrapper">
  <button
  type="button"
  className="yagentdetails-add-btn"
  onClick={handleAddForeignerDirector}
>

    Add
  </button>
</div>


    {/* ADD BUTTON – RIGHT SIDE */}
    {/* <div className="yagentdetails-add-btn-wrapper">
      <button
        type="button"
        className="yagentdetails-add-btn"
        onClick={() => {
  const {
    designation,
    name,
    mobile,
    email,
    address1,
    address2,
    din,
    photo,
    addressProof,
  } = foreignerDirector;

  if (!designation || !name || !mobile || !email || !address1 || !din) {
    alert("Please fill all mandatory Foreigner Director details");
    return;
  }

  setIndianDirectors([
    ...indianDirectors,
    {
      nationality: "Foreigner",   // 🔥 KEY LINE
      designation,
      name,
      din,
      aadhaar: "NA",
      email,
      mobile,
      state: "NA",
      district: "NA",
      address1,
      address2: address2 || "NA",
      pincode: "NA",
      pan: "NA",

      photo,                      // 🔥 FILE
      addressProof,               // 🔥 FILE
      panDoc: null,
      aadhaarDoc: null,

      id: Date.now(),
    },
  ]);

  // reset form
  setForeignerDirector({
    designation: "",
    name: "",
    mobile: "",
    email: "",
    address1: "",
    address2: "",
    din: "",
    photo: null,
    addressProof: null,
  });
}}

      >
        Add
      </button>
    </div> */}
  </>
)}

{/* ===== ADD DIRECTOR RADIO BUTTON ===== */}
<div className="yagentdetails-yes-no-row" style={{ marginTop: "25px" }}>
  <div className="yagentdetails-yes-no-options">
  </div>
</div>

{directors.length > 0 && (

    <div className="yagentdetails-table-wrapper">
  <table className="yagentdetails-table" style={{ marginTop: "20px" }}>
    <thead>
      <tr>
        <th>No.</th>
        <th>Nationality</th>
        <th>Designation</th>
        <th>Name</th>
        <th>DIN Number</th>
        <th>Aadhaar Number</th>
        <th>Email Id</th>
        <th>Mobile Number</th>
        <th>State/UT</th>
        <th>District</th>
        <th>Address Line 1</th>
        <th>Address Line 2</th>
        <th>Pincode</th>
        <th>PAN Card Number</th>
        <th>Photograph</th>
        <th>Address Proof</th>
        <th>PAN Card Proof</th>
        <th>Aadhaar Card Proof</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {directors.map((d, index) => (

        <tr key={d.id}>
          <td>{index + 1}</td>
          <td>{d.nationality}</td>
          <td>{d.designation}</td>
          <td>{d.name}</td>
          <td>{d.din || "NA"}</td>
          <td>{d.aadhaar}</td>
          <td>{d.email}</td>
          <td>{d.mobile}</td>
          <td>{d.state}</td>
          <td>{d.district}</td>
          <td>{d.address1}</td>
          <td>{d.address2}</td>
          <td>{d.pincode}</td>
          <td>{d.pan}</td>

         <td>
  {d.photo ? (
    <a
      href={URL.createObjectURL(d.photo)}
      target="_blank"
      rel="noopener noreferrer"
      className="yagentdetails-view-link"
    >
      View Photo
    </a>
  ) : (
    "NA"
  )}
</td>

<td>
  <span
    className={`yagentdetails-view-link ${
      !d.addressProof ? "disabled-link" : ""
    }`}
    onClick={() => {
      if (d.addressProof) {
        window.open(URL.createObjectURL(d.addressProof), "_blank");
      }
    }}
  >
    View Address
  </span>
</td>



<td>
  <span
    className={`yagentdetails-view-link ${
      !d.panDoc ? "disabled-link" : ""
    }`}
  >
    View PAN Card
  </span>
</td>



<td>
  <span
    className={`yagentdetails-view-link ${
      !d.aadhaarDoc ? "disabled-link" : ""
    }`}
  >
    View Aadhaar Card
  </span>
</td>






          <td>
            <button
              className="yagentdetails-delete-btn"
              onClick={() =>
                setDirectors(
  directors.filter((x) => x.id !== d.id)
)

              }
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
    </div>
)}

{(showTrusteeSection || showPartnerSection) && (
  <section className="yagentdetails-section">

    <h3>
      {showTrusteeSection ? "Trustee Details" : "Partner Details"}
    </h3>


    {/* Indian / Foreigner radios */}
    <div className="yagentdetails-yes-no-row">
      <div className="yagentdetails-yes-no-options">
        <label>
          <input
            type="radio"
            name="trusteeType"
            checked={trusteeType === "Indian"}
            onChange={() => setTrusteeType("Indian")}
          />
          Indian
        </label>

        <label>
          <input
            type="radio"
            name="trusteeType"
            checked={trusteeType === "Foreigner"}
            onChange={() => setTrusteeType("Foreigner")}
          />
          Foreigner
        </label>
      </div>
    </div>
    {/* ❌ NOTHING shown until user selects */}
    {trusteeType === "" && (
      <p style={{ marginTop: "10px", color: "#777" }}>
     </p>
    )}

    {/* ================= INDIAN TRUSTEE ================= */}
    {trusteeType === "Indian" && (
      <>
        <div className="yagentdetails-director-grid">

  <div>
  <label>Designation <span style={{ color: "red" }}>*</span></label>

 <select
  value={trusteeForm.designation}
  onChange={(e) =>
    setTrusteeForm({ ...trusteeForm, designation: e.target.value })
  }
>
  <option value="">Select</option>

  {showTrusteeSection && (
    <option value="Trustee">Trustee</option>
  )}

  {showPartnerSection && (
    <option value="Partner">Partner</option>
  )}
</select>

</div>


  <div>
    <label>Name *</label>
    <input
      value={trusteeForm.name}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, name: e.target.value })
      }
    />
  </div>

  <div>
    <label>Email Id *</label>
    <input
      type="email"
      value={trusteeForm.email}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, email: e.target.value })
      }
    />
  </div>

  <div>
    <label>Mobile Number *</label>
    <input
      value={trusteeForm.mobile}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, mobile: e.target.value })
      }
    />
  </div>

  <div>
  <label>State/UT *</label>

  <select
    value={trusteeStateId}
    onChange={(e) => {
      setTrusteeStateId(e.target.value);

      setTrusteeForm({
        ...trusteeForm,
        state: e.target.value,
        district: "",
      });
    }}
  >
    <option value="">Select</option>

    {states.map((s) => (
      <option key={s.id} value={s.id}>
        {s.state_name}
      </option>
    ))}
  </select>
</div>


  <div>
  <label>District *</label>

  <select
    value={trusteeDistrictId}
    disabled={!trusteeStateId}
    onChange={(e) => {
      setTrusteeDistrictId(e.target.value);

      setTrusteeForm({
        ...trusteeForm,
        district: e.target.value,
      });
    }}
  >
    <option value="">Select</option>

    {trusteeDistricts.map((d) => (
      <option key={d.id} value={d.id}>
        {d.name}
      </option>
    ))}
  </select>
</div>


  <div>
    <label>Address Line 1 *</label>
    <input
      value={trusteeForm.address1}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, address1: e.target.value })
      }
    />
  </div>

  <div>
    <label>Address Line 2</label>
    <input
      value={trusteeForm.address2}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, address2: e.target.value })
      }
    />
  </div>

  <div>
    <label>Pincode *</label>
    <input
      value={trusteeForm.pincode}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, pincode: e.target.value })
      }
    />
  </div>

  <div>
    <label>PAN Card Number *</label>
    <input
      value={trusteeForm.pan}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, pan: e.target.value })
      }
    />
  </div>

  <div>
    <label>Upload PAN Card *</label>
    <input
      type="file"
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, panDoc: e.target.files[0] })
      }
    />
  </div>

  <div>
    <label>Aadhaar Number *</label>
   <input
  maxLength="12"
  value={trusteeForm.aadhaar}
  onChange={(e) =>
    setTrusteeForm({
      ...trusteeForm,
      aadhaar: e.target.value.replace(/\D/g, "")
    })
  }
/>

  </div>

  <div>
    <label>Upload Aadhaar *</label>
    <input
      type="file"
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, aadhaarDoc: e.target.files[0] })
      }
    />
  </div>

  <div>
    <label>Photograph *</label>
    <input
      type="file"
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, photo: e.target.files[0] })
      }
    />
  </div>

  <div>
    <label>Address Proof </label>
    <input
      type="file"
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, addressProof: e.target.files[0] })
      }
    />
  </div>
</div>


        <div className="yagentdetails-add-btn-wrapper">
         <button
  type="button"
  className="yagentdetails-add-btn"
  onClick={() => {
  if (showTrusteeSection) {
    handleAddTrustee();
  } else if (showPartnerSection) {
    handleAddPartnerFromTrustee();
  }
}}

>
  Add
</button>

        </div>
      </>
    )}

    {/* ================= FOREIGNER TRUSTEE ================= */}
    {trusteeType === "Foreigner" && (
      <>
        <div className="yagentdetails-director-grid">

  <div>
    <label>Designation <span style={{ color: "red" }}>*</span></label>

 <select
  value={trusteeForm.designation}
  onChange={(e) =>
    setTrusteeForm({ ...trusteeForm, designation: e.target.value })
  }
>
  <option value="">Select</option>

  {showTrusteeSection && (
    <option value="Trustee">Trustee</option>
  )}

  {showPartnerSection && (
    <option value="Partner">Partner</option>
  )}
</select>

  </div>

  <div>
    <label>Name *</label>
    <input
      value={trusteeForm.name}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, name: e.target.value })
      }
    />
  </div>

  <div>
    <label>Email *</label>
    <input
      type="email"
      value={trusteeForm.email}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, email: e.target.value })
      }
    />
  </div>

  <div>
    <label>Mobile *</label>
    <input
      value={trusteeForm.mobile}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, mobile: e.target.value })
      }
    />
  </div>

  <div>
    <label>Address Line 1 *</label>
    <input
      value={trusteeForm.address1}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, address1: e.target.value })
      }
    />
  </div>

  <div>
    <label>Address Line 2</label>
    <input
      value={trusteeForm.address2}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, address2: e.target.value })
      }
    />
  </div>

  <div>
    <label>Photo *</label>
    <input
      type="file"
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, photo: e.target.files[0] })
      }
    />
  </div>

  <div>
    <label>Address Proof </label>
    <input
      type="file"
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, addressProof: e.target.files[0] })
      }
    />
  </div>

</div>


        <div className="yagentdetails-add-btn-wrapper">
         <button
  type="button"
  className="yagentdetails-add-btn"
  onClick={() => {
  if (showTrusteeSection) {
    handleAddTrustee();
  } else if (showPartnerSection) {
    handleAddPartnerFromTrustee();
  }
}}

>
  Add
</button>

        </div>
      </>
    )}

  </section>
)}

{trustees.length > 0 && (
  <div className="yagentdetails-table-scroll">
    <table className="yagentdetails-table">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Nationality</th>
          <th>Designation</th>
          <th>Name</th>
          <th>DIN Number</th>
          <th>Aadhaar Number</th>
          <th>Email Id</th>
          <th>Mobile Number</th>
          <th>State/UT</th>
          <th>District</th>
          <th>Address Line 1</th>
          <th>Address Line 2</th>
          <th>PIN Code</th>
          <th>PAN Card Number</th>
          <th>Photograph</th>
          <th>Address Proof</th>
          <th>PAN Card Proof</th>
          <th>Aadhaar Card Proof</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {trustees.map((t, i) => (
          <tr key={t.id}>
            <td>{i + 1}</td>
            <td>{t.nationality}</td>
            <td>{t.designation}</td>
            <td>{t.name}</td>
            <td>{t.din || "NA"}</td>
            <td>{t.aadhaar || "NA"}</td>
            <td>{t.email}</td>
            <td>{t.mobile}</td>
            <td>{t.state || "NA"}</td>
            <td>{t.district || "NA"}</td>
            <td>{t.address1}</td>
            <td>{t.address2 || "NA"}</td>
            <td>{t.pincode || "NA"}</td>
            <td>{t.pan || "NA"}</td>

            <td>
              {t.photo && (
                <a href={URL.createObjectURL(t.photo)} target="_blank">
                  View Photo
                </a>
              )}
            </td>

            <td>
              {t.addressProof && (
                <a href={URL.createObjectURL(t.addressProof)} target="_blank">
                  View Address
                </a>
              )}
            </td>

            <td>
              {t.panDoc && (
                <a href={URL.createObjectURL(t.panDoc)} target="_blank">
                  View PAN
                </a>
              )}
            </td>

            <td>
              {t.aadhaarDoc && (
                <a href={URL.createObjectURL(t.aadhaarDoc)} target="_blank">
                  View Aadhaar
                </a>
              )}
            </td>

            <td>
              <button
                className="yagentdetails-delete-btn"
                onClick={() =>
                  setTrustees(trustees.filter(x => x.id !== t.id))
                }
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{partners.length > 0 && (
  <div className="yagentdetails-table-scroll">

    <h4 style={{ marginTop: "20px" }}>Partner Details</h4>

    <table className="yagentdetails-table">

      <thead>
        <tr>
          <th>S.No</th>
          <th>Nationality</th>
          <th>Designation</th>
          <th>Name</th>
          <th>DIN</th>
          <th>Aadhaar</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>State</th>
          <th>District</th>
          <th>Address 1</th>
          <th>Address 2</th>
          <th>Pincode</th>
          <th>PAN</th>
          <th>Photo</th>
          <th>Address Proof</th>
          <th>PAN Doc</th>
          <th>Aadhaar Doc</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {partners.map((p, i) => (
          <tr key={p.id}>

            <td>{i + 1}</td>

            <td>{p.nationality}</td>

            <td>{p.designation}</td>

            <td>{p.name}</td>

            <td>{p.din}</td>

            <td>{p.aadhaar}</td>

            <td>{p.email}</td>

            <td>{p.mobile}</td>

            <td>{p.state}</td>

            <td>{p.district}</td>

            <td>{p.address1}</td>

            <td>{p.address2}</td>

            <td>{p.pincode}</td>

            <td>{p.pan}</td>

            {/* Photo */}
            <td>
              {p.photo ? (
                <a
                  href={URL.createObjectURL(p.photo)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
              ) : "NA"}
            </td>

            {/* Address Proof */}
            <td>
              {p.addressProof ? (
                <a
                  href={URL.createObjectURL(p.addressProof)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
              ) : "NA"}
            </td>

            {/* PAN */}
            <td>
              {p.panDoc ? (
                <a
                  href={URL.createObjectURL(p.panDoc)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
              ) : "NA"}
            </td>

            {/* Aadhaar */}
            <td>
              {p.aadhaarDoc ? (
                <a
                  href={URL.createObjectURL(p.aadhaarDoc)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
              ) : "NA"}
            </td>

            {/* Delete */}
            <td>
              <button
                className="yagentdetails-delete-btn"
                onClick={() =>
                  setPartners(partners.filter(x => x.id !== p.id))
                }
              >
                Delete
              </button>
            </td>

          </tr>
        ))}
      </tbody>

    </table>
  </div>
)}








        {/* ================= AUTHORIZED SIGNATORY ================= */}
       <section className="yagentdetails-section yagentdetails-director-section">

          <h3>Authorized Signatory Details</h3>

<div className="yagentdetails-director-grid">
            <div>
              <label>Name *</label>
              <input
                name="signName"
                value={form.signName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Mobile Number *</label>
              <input
                name="signMobile"
                value={form.signMobile}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Email Id *</label>
              <input
                name="signEmail"
                value={form.signEmail}
                onChange={handleChange}
              />
            </div>
            <div>
            <label>Photo <span className="yagentdetails-required">*</span></label>
            <input type="file" onChange={(e) =>
  setFiles({ ...files, authPhoto: e.target.files[0] })
}
 />

          </div>

          <div>
            <label>Board Resolution for Authorized Signatory <span className="yagentdetails-required">*</span></label>
           <input type="file" onChange={(e) =>
  setFiles({ ...files, boardResolution: e.target.files[0] })
}
 />

          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="yagentdetails-section yagentdetails-director-section">

  <h3>Projects Launched In The Past 5 Years</h3>

  {/* Yes / No */}
  <div className="yagentdetails-yes-no-row">
    <span className="yagentdetails-question">
      Last five years project details <span className="yagentdetails-required">*</span>
    </span>

    <div className="yagentdetails-yes-no-options">
      <label>
        <input
          type="radio"
          name="projects"
          value="Yes"
          checked={hasProjects === "Yes"}
          onChange={() => setHasProjects("Yes")}
        />
        Yes
      </label>

      <label>
        <input
          type="radio"
          name="projects"
          value="No"
          checked={hasProjects === "No"}
          onChange={() => {
            setHasProjects("No");
            setProjects([]);
          }}
        />
        No
      </label>
    </div>
  </div>

  {/* SHOW ONLY WHEN YES */}
  {hasProjects === "Yes" && (
    <>
     {hasProjects === "Yes" && (
  <div className="yagentdetails-project-full-row">
    {/* LEFT EMPTY SPACE (keeps Yes/No on left) */}
    <div className="yagentdetails-project-spacer"></div>

    {/* RIGHT PROJECT NAME */}
    <div className="yagentdetails-project-input">
      <label>
        Project Name <span className="yagentdetails-required">*</span>
      </label>
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Project Name"
      />
    </div>

    {/* ADD BUTTON */}
    <div className="yagentdetails-project-btn">
      <button
        type="button"
        className="yagentdetails-add-btn"
        onClick={handleAddProject}
      >
        Add
      </button>
    </div>
  </div>
)}


      {/* TABLE */}
      {projects.length > 0 && (
        <table className="yagentdetails-table" style={{ marginTop: "15px" }}>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Project Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, index) => (
              <tr key={p.id}>
                <td>{index + 1}</td>
                <td>{p.name}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )}
</section>


   {/* ================= LITIGATIONS ================= */}
<section className="yagentdetails-section yagentdetails-director-section">
  <h3>Litigations</h3>

  {/* YES / NO */}
  <div className="yagentdetails-yes-no-row">
    <span className="yagentdetails-question">
      Any Civil/Criminal Cases <span className="yagentdetails-required">*</span>
    </span>

    <div className="yagentdetails-yes-no-options">
      <label>
        <input
          type="radio"
          name="litigation"
          value="Yes"
          checked={hasLitigation === "Yes"}
          onChange={() => setHasLitigation("Yes")}
        />
        Yes
      </label>

      <label>
        <input
          type="radio"
          name="litigation"
          value="No"
          checked={hasLitigation === "No"}
       onChange={() => {
  setHasLitigation("No");
  setAffidavitFile(null);
  setHasInterimOrder("");
  setHasFinalOrder("");
  setLitigations([]);
  setLitigationForm({
    caseNo: "",
    namePlace: "",
    petitioner: "",
    respondent: "",
    facts: "",
    status: "",
    interimCert: null,
    finalCert: null,
  });
}}

        />
        No
      </label>
    </div>
  </div>

  {/* SHOW ONLY WHEN YES */}
  {hasLitigation === "Yes" && (
    
    
    <>
      <p className="yagentdetails-note">
        Note : In case Petitioner/Respondent are more than one, please provide
        their names by comma separated.
      </p>

      {/* ===== ROW 1 : 4 COLUMNS ===== */}
<div className="yagentdetails-director-grid">
        <div>
          <label>Case No. <span className="yagentdetails-required">*</span></label>
          <input
  type="text"
  placeholder="Case No."
  value={litigationForm.caseNo}
  onChange={(e) =>
    setLitigationForm({ ...litigationForm, caseNo: e.target.value })
  }
/>

        </div>

        <div>
          <label>Name & Place of Tribunal/Authority <span className="yagentdetails-required">*</span></label>
<input
  type="text"
  placeholder="Name & Place of Tribunal/Authority"
  value={litigationForm.namePlace}
  onChange={(e) =>
    setLitigationForm({ ...litigationForm, namePlace: e.target.value })
  }
/>
        </div>

        <div>
          <label>Name of the Petitioner <span className="yagentdetails-required">*</span></label>
<input
  type="text"
  placeholder="Name of the Petitioner"
  value={litigationForm.petitioner}
  onChange={(e) =>
    setLitigationForm({ ...litigationForm, petitioner: e.target.value })
  }
/>
        </div>

        <div>
          <label>Name of the Respondent <span className="yagentdetails-required">*</span></label>
<input
  type="text"
  placeholder="Name of the Respondent"
  value={litigationForm.respondent}
  onChange={(e) =>
    setLitigationForm({ ...litigationForm, respondent: e.target.value })
  }
/>
        </div>
      </div>

      {/* ===== ROW 2 ===== */}
      <div className="yagentdetails-form-grid" style={{ marginTop: "10px" }}>
        <div>
          <label>Facts of the Case/Contents of the Petitioner <span className="yagentdetails-required">*</span></label>
<input
  type="text"
  placeholder="Facts of the Case"
  value={litigationForm.facts}
  onChange={(e) =>
    setLitigationForm({ ...litigationForm, facts: e.target.value })
  }
/>
        </div>

        <div>
          <label>Present Status of the case <span className="yagentdetails-required">*</span></label>
          <select
  value={litigationForm.status}
  onChange={(e) =>
    setLitigationForm({ ...litigationForm, status: e.target.value })
  }
>
  <option value="">Select</option>
  <option value="Completed">Completed</option>
  <option value="Pending">Pending</option>
</select>


        </div>

        <div>
          <label>Interim Order if any <span className="yagentdetails-required">*</span></label>
          <div className="yagentdetails-radio-inline">
            <label>
              <input
                type="radio"
                name="interim"
                value="Yes"
                checked={hasInterimOrder === "Yes"}
                onChange={() => setHasInterimOrder("Yes")}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="interim"
                value="No"
                checked={hasInterimOrder === "No"}
                onChange={() => setHasInterimOrder("No")}
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label>Details of final order if disposed <span className="yagentdetails-required">*</span></label>
          <div className="yagentdetails-radio-inline">
            <label>
              <input
                type="radio"
                name="final"
                value="Yes"
                checked={hasFinalOrder === "Yes"}
                onChange={() => setHasFinalOrder("Yes")}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="final"
                value="No"
                checked={hasFinalOrder === "No"}
                onChange={() => setHasFinalOrder("No")}
              />
              No
            </label>
          </div>
        </div>
      </div>

      {/* ===== CERTIFICATES ===== */}
     {hasInterimOrder === "Yes" && (
  <div>
    <label>Interim Order Certificate <span className="yagentdetails-required">*</span></label>
    <input
      type="file"
      onChange={(e) =>
        setLitigationForm({
          ...litigationForm,
          interimCert: e.target.files[0],
        })
      }
    />
  </div>
)}


       {hasFinalOrder === "Yes" && (
  <div>
    <label>Disposed Certificate <span className="yagentdetails-required">*</span></label>
    <input
      type="file"
      onChange={(e) =>
        setLitigationForm({
          ...litigationForm,
          finalCert: e.target.files[0],
        })
      }
    />
  </div>
)}


       {/* ADD BUTTON ROW */}
       {/* END of agentdetails-form-grid */}

      {/* ===== ADD BUTTON (FIXED RIGHT) ===== */}
      {/* ADD BUTTON - FIXED RIGHT */}
<div className="yagentdetails-add-btn-wrapper">
  <button
    type="button"
    className="yagentdetails-add-btn"
    onClick={handleAddLitigation}
  >
    Add
  </button>
</div>
{litigations.length > 0 && (
  <table className="yagentdetails-table" style={{ marginTop: "15px" }}>
    <thead>
  <tr>
    <th>S.No.</th>
    <th>Case No.</th>
    <th>Name And Place</th>
    <th>Petitioner</th>
    <th>Respondent</th>
    <th>Facts Of Case</th>
    <th>Present Status</th>
    <th>Interim Order</th>
    <th>Final Order If Disposed</th>
    <th>Interim Certificate</th>
    <th>Dispose Certificate</th>
    <th>Action</th>
  </tr>
</thead>
<tbody>
  {litigations.map((l, i) => (
    <tr key={l.id}>
      <td>{i + 1}</td>
      <td>{l.caseNo}</td>
      <td>{l.namePlace}</td>
      <td>{l.petitioner}</td>
      <td>{l.respondent}</td>
      <td>{l.facts}</td>
      <td>{l.status}</td>
      <td>{l.interimOrder}</td>
      <td>{l.finalOrder}</td>

      {/* Interim Certificate */}
      <td>
        {l.interimCert ? (
          <a
            href={URL.createObjectURL(l.interimCert)}
            target="_blank"
            rel="noopener noreferrer"
            className="yagentdetails-view-link"
          >
            View Certificate
          </a>
        ) : (
          "-"
        )}
      </td>

      {/* Dispose Certificate */}
      <td>
        {l.finalCert ? (
          <a
            href={URL.createObjectURL(l.finalCert)}
            target="_blank"
            rel="noopener noreferrer"
            className="yagentdetails-view-link"
          >
            View Certificate
          </a>
        ) : (
          "-"
        )}
      </td>

      <td>
        <button
  className="yagentdetails-delete-btn"
  onClick={() =>
    setLitigations(litigations.filter((x) => x.id !== l.id))
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


    </>
  )}
</section>


{/* SHOW WHEN NO → AFFIDAVIT */}
{hasLitigation === "No" && (
  <div
    className="litigation-affidavit-wrapper"
    style={{
      display: "flex",
      flexDirection: "column",
      marginTop: "20px",
      width: "100%",
    }}
  >
    {/* Row: Label + File */}
    <div
      className="litigation-affidavit-row"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "0px",
        width: "100%",
      }}
    >
      {/* LEFT SIDE */}
      <div
        className="litigation-affidavit-left"
        style={{
          flex: 1,
        }}
      >
        <label
          className="litigation-affidavit-label"
          style={{
            fontWeight: "600",
            fontSize: "15px",
            color: "#000",
          }}
        >
          Self Declared Affidavit{" "}
          <span style={{ color: "red" }}>*</span>
        </label>

        <p
          className="litigation-affidavit-note"
          style={{
            marginTop: "6px",
            fontSize: "13px",
            color: "#444",
            lineHeight: "1.4",
          }}
        >
          Note: "A self declared affidavit (on Rs. 20 non judicial stamp paper)
          has to be uploaded if there<br></br>are no cases pending, refer form A4 in
          form downloads for proforma of this Self Affidavit."
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div
        className="litigation-affidavit-right"
        style={{
          minWidth: "260px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <input
          type="file"
          accept="application/pdf"
          className="litigation-affidavit-file"
          style={{
            padding: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "13px",
          }}
          onChange={(e) => setAffidavitFile(e.target.files[0])}
        />
      </div>
    </div>
  </div>
)}



      {/* Other State Registration */}
      {/* ================= Other State/UT RERA Registration Details ================= */}
<section className="yagentdetails-section yagentdetails-director-section">

  <h3>Other State/UT RERA Registration Details</h3>

  {/* YES / NO */}
  <div className="yagentdetails-director-type-row">

    <span className="yagentdetails-question">
      Do you have registration in other states <span className="yagentdetails-required">*</span>
    </span>

<div className="yagentdetails-director-options">
      <label>
        <input
          type="radio"
          name="otherRera"
          value="Yes"
          checked={hasOtherRera === "Yes"}
          onChange={() => setHasOtherRera("Yes")}
        />
        Yes
      </label>

      <label>
        <input
          type="radio"
          name="otherRera"
          value="No"
          checked={hasOtherRera === "No"}
          onChange={() => {
  setHasOtherRera("No");

  setOtherReraList([]);

  setOtherReraForm({
    regNumber: "",
    state: "",
    district: "",
  });

  setOtherReraStateId("");
  setOtherReraDistrictId("");
  setOtherReraDistricts([]);
}}

        />
        No
      </label>
    </div>
  </div>

  {/* SHOW ONLY WHEN YES */}
  {hasOtherRera === "Yes" && (
    <>
<div className="yagentdetails-director-grid">
        <div>
          <label>Registration Number <span className="yagentdetails-required">*</span></label>
          <input
            type="text"
            placeholder="Registration Number"
            value={otherReraForm.regNumber}
            onChange={(e) =>
              setOtherReraForm({ ...otherReraForm, regNumber: e.target.value })
            }
          />
        </div>

        <div>
          <label>State/UT <span className="yagentdetails-required">*</span></label>
          <select
  value={otherReraStateId}
 onChange={(e) => {
  const val = e.target.value;
  const selected = states.find(s => s.id == val);

  setOtherReraStateId(val);

  setOtherReraForm(prev => ({
    ...prev,
    state: selected?.state_name || "",
    district: "",
  }));
}}


>
  <option value="">Select</option>

  {states.map((s) => (
    <option key={s.id} value={s.id}>
      {s.state_name}
    </option>
  ))}
</select>
        </div>

        <div>
          <label>District <span className="yagentdetails-required">*</span></label>
          <select
  value={otherReraDistrictId}
  disabled={!otherReraStateId}
  onChange={(e) => {
  const val = e.target.value;
  const selected = otherReraDistricts.find(d => d.id == val);

  setOtherReraDistrictId(val);

  setOtherReraForm(prev => ({
    ...prev,
    district: selected?.name || "",
  }));
}}


>
  <option value="">Select</option>

  {otherReraDistricts.map((d) => (
    <option key={d.id} value={d.id}>
      {d.name}
    </option>
  ))}
</select>
        </div>

        <div style={{ display: "flex", alignItems: "end" }}>
          <button
            type="button"
            className="yagentdetails-add-btn"
            onClick={handleAddOtherRera}
          >
            Add
          </button>
        </div>
      </div>

      {/* TABLE */}
      {otherReraList.length > 0 && (
        <table className="yagentdetails-table" style={{ marginTop: "15px" }}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Registration Number</th>
              <th>State/UT</th>
              <th>District</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {otherReraList.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.regNumber}</td>
                <td>{r.state}</td>
                <td>{r.district}</td>
                <td>
                  <button
                    className="yagentdetails-delete-btn"
                    onClick={() =>
                      setOtherReraList(otherReraList.filter((x) => x.id !== r.id))
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
    </>
  )}
</section>



      <div className="yagentdetails-action-btn">
  <button onClick={handleSaveAndContinue}>
  Save And Continue
</button>

</div>
 </div>   
 </div>      

  );
};

export default AgentDetailsOther;