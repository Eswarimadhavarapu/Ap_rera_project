import "../styles/AgentDetails.css";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiGet } from "../api/api";
import AgentStepper from "../components/AgentStepper";

const AgentDetailsOther = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedPan = location.state?.pan || "";

const getStep = () => {
  if (location.pathname.includes("AgentUploadDocumentotherthan")) return 2;
  if (location.pathname.includes("Preview")) return 3;
  if (location.pathname.includes("Payment")) return 4;
  if (location.pathname.includes("Acknowledgement")) return 5;
  return 1;
};

const currentStep = getStep();

// ================= VALIDATION HELPERS =================

function isValidMobile(num) {
  return /^[6-9]\d{9}$/.test(num);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPAN(pan) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
}

function isValidPincode(pin) {
  return /^5\d{5}$/.test(pin);
}

function isValidAadhaar(num) {
  return /^\d{12}$/.test(num);
}

function isValidDIN(num) {
  return /^\d{8}$/.test(num);
}

// ===== JPG IMAGE VALIDATION =====
function isJPGImage(file) {
  return (
    file &&
    (file.type === "image/jpeg" ||
     file.type === "image/jpg")
  );
}
// ===== PDF VALIDATION =====
function isPDFFile(file) {
  return file && file.type === "application/pdf";
}

// ===== ADDRESS VALIDATION =====

// Allow letters, numbers, space, , . / - # ()
const isValidAddress = (value) => {
  const regex = /^[A-Z0-9\s,./\-#()]+$/i;
  return (
    value.trim().length >= 5 &&   // min 5 chars
    value.trim().length <= 200 && // max 200 chars
    regex.test(value)
  );
};

// Format address (remove extra spaces)
const formatAddress = (value) => {
  return value
    .replace(/\s+/g, " ") // remove multiple spaces
    .trimStart();         // no leading space
};



// ===== INPUT FORMATTERS =====
// Mobile: only numbers, max 10, start 6-9
const formatMobile = (value) => {
  let val = value.replace(/\D/g, "").slice(0, 10);

  // Must start with 6,7,8,9
  if (val.length > 0 && !/^[6-9]/.test(val)) {
    return "";
  }

  return val;
};

// Numbers only with max length
const onlyNumbers = (value, max) =>
  value.replace(/\D/g, "").slice(0, max);

// CIN → 23 chars uppercase alphanumeric
const formatCIN = (value) =>
  value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 23);


// PAN → Uppercase
// ===== PAN FORMAT (allow A–Z, a–z, 0–9, max 10 chars) =====
const formatPAN = (value) =>
  value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);


// ===== REGISTRATION / CIN / TRUST FORMAT =====
// allow A–Z, a–z, 0–9 and special characters, max 23 chars
const formatRegistrationNo = (value) =>
  value.slice(0, 23);


const isValidRegistrationNo = (value) => {
  return value.length > 0 && value.length <= 23;
};



// ===== PINCODE HELPERS =====

// Allow only 6 digits and must start with 5
const formatPincode = (value) => {
  // Remove non-digits
  let val = value.replace(/\D/g, "");

  // Limit to 6 digits
  val = val.slice(0, 6);

  // First digit must be 5
  if (val.length > 0 && val[0] !== "5") {
    return "";
  }


  return val;
};


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


// ===== INDIAN TRUSTEE FORM =====
const [indianTrusteeForm, setIndianTrusteeForm] = useState({
  designation: "",
  name: "",
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

// ===== FOREIGNER TRUSTEE FORM =====
const [foreignerTrusteeForm, setForeignerTrusteeForm] = useState({
  designation: "",
  name: "",
  email: "",
  mobile: "",
  address1: "",
  address2: "",
  photo: null,
  addressProof: null,
});
// ===== ACTIVE TRUSTEE FORM (AUTO SWITCH) =====
const trusteeForm =
  trusteeType === "Indian"
    ? indianTrusteeForm
    : foreignerTrusteeForm;

const setTrusteeForm =
  trusteeType === "Indian"
    ? setIndianTrusteeForm
    : setForeignerTrusteeForm;





const handleAddTrustee = () => {
  const {
  designation,
  name,
  email,
  mobile,
  address1,
} = trusteeForm;


const d = trusteeForm;

// ===== TYPE BASED VALIDATION =====

if (trusteeType === "Indian") {

  if (
    !d.designation?.trim() ||
    !d.name?.trim() ||
    !d.email?.trim() ||
    !d.mobile?.trim() ||
    !trusteeStateId ||
    !trusteeDistrictId ||
    !d.address1?.trim() ||
    !d.pincode?.trim() ||
    !d.pan?.trim() ||
    !d.aadhaar?.trim() ||
    !d.panDoc ||
    !d.aadhaarDoc ||
    !d.photo
  ) {
    alert("Please fill all mandatory Trustee fields including documents");
    return;
  }

}

else if (trusteeType === "Foreigner") {

  if (
    !d.designation?.trim() ||
    !d.name?.trim() ||
    !d.email?.trim() ||
    !d.mobile?.trim() ||
    !d.address1?.trim() ||
    !d.photo ||
    !d.addressProof
  ) {
    alert("Please fill all mandatory Foreigner Trustee fields");
    return;
  }

}
  // Email validation
if (!isValidEmail(email)) {
  alert("Enter valid Trustee Email");
  return;
}

// Mobile validation
if (!isValidMobile(mobile)) {
  alert("Trustee mobile must start with 6-9 and be 10 digits");
  return;
}

// PAN (Indian only)
if (trusteeType === "Indian" && trusteeForm.pan && !isValidPAN(trusteeForm.pan)) {
  alert("Invalid Trustee PAN");
  return;
}

// Aadhaar (Indian only)
if (trusteeType === "Indian" && !isValidAadhaar(trusteeForm.aadhaar)) {
  alert("Invalid Trustee Aadhaar");
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

  const d = partnerForm;

if (
  !d.designation?.trim() ||
  !d.name?.trim() ||
  !d.email?.trim() ||
  !d.mobile?.trim() ||
  !partnerStateId ||
  !partnerDistrictId ||
  !d.address1?.trim() ||
  !d.pincode?.trim() ||
  !d.pan?.trim() ||
  !d.aadhaar?.trim() ||
  !d.panDoc ||
  !d.aadhaarDoc ||
  !d.photo
) {
  alert("Please fill all mandatory Partner fields including documents");
  return; // ❌ STOP — DO NOT ADD
}

  const newPartner = {
    ...partnerForm,
    id: Date.now(),
  };

  setPartners(prev => [...prev, newPartner]);

  setPartnerForm(initialPartnerForm);
};

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
  din: "", 
  photo: null,
  addressProof: null,
});
const [directorStateId, setDirectorStateId] = useState("");
const [directorDistrictId, setDirectorDistrictId] = useState("");
const [directorDistricts, setDirectorDistricts] = useState([]);
// ===== TRUSTEE / PARTNER LOCATION =====
const [trusteeStateId, setTrusteeStateId] = useState("");
const [trusteeDistrictId, setTrusteeDistrictId] = useState("");
const [trusteeDistricts, setTrusteeDistricts] = useState([]);


// ================= AUTO SAVE FORM =================



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
  // 🔥 RESTORE TRUSTEE FORMS
setIndianTrusteeForm(data.indianTrusteeForm || {});
setForeignerTrusteeForm(data.foreignerTrusteeForm || {});
setTrusteeType(data.trusteeType || "");

// 🔥 RESTORE PARTNER FORM
setPartnerForm(data.partnerForm || initialPartnerForm);

// 🔥 RESTORE DIRECTOR
setDirectorForm(data.directorForm || {});
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
  ...data.foreignerDirector, // ✅ override if exists
});


// 🔥 RESTORE IDS
setTrusteeStateId(data.trusteeStateId || "");
setTrusteeDistrictId(data.trusteeDistrictId || "");

setDirectorStateId(data.directorStateId || "");
setDirectorDistrictId(data.directorDistrictId || "");

setOtherReraStateId(data.otherReraStateId || "");
setOtherReraDistrictId(data.otherReraDistrictId || "");

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


// ================= AUTO SAVE FORM =================
useEffect(() => {
  const data = {
    form,
    files,
    directors,
    trustees,
    partners,

    indianTrusteeForm,
    foreignerTrusteeForm,
    trusteeType,

    partnerForm,

    directorForm,
    foreignerDirector,

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

    trusteeStateId,
    trusteeDistrictId,

    directorStateId,
    directorDistrictId,

    otherReraStateId,
    otherReraDistrictId,
  };

  localStorage.setItem(
    "agentDetailsDraft",
    JSON.stringify(data)
  );
}, [
  form,
  files,
  directors,
  trustees,
  partners,

  indianTrusteeForm,
  foreignerTrusteeForm,
  trusteeType,

  partnerForm,

  directorForm,
  foreignerDirector,

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

  trusteeStateId,
  trusteeDistrictId,

  directorStateId,
  directorDistrictId,

  otherReraStateId,
  otherReraDistrictId,
]);

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
const [showDirectorForm, setShowDirectorForm] = useState(true);

// ===== DIRECTOR LOCATION =====

const [showAddDirector, setShowAddDirector] = useState("");
const [addDirectorRadio, setAddDirectorRadio] = useState("");






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

// Send multiple authorized persons (even if 1)
formData.append(
  "authorized_persons",
  JSON.stringify([
    {
      name: form.signName,
      mobile: form.signMobile,
      email: form.signEmail
    }
  ])
);

// Files for authorized person (index based)
if (files.authPhoto) {
  formData.append("authorized_photo_0", files.authPhoto);
}

if (files.boardResolution) {
  formData.append("board_resolution_0", files.boardResolution);
}

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
/* ================= LITIGATION ================= */

if (litigations.length > 0) {

  formData.append(
    "litigations",
    JSON.stringify(
      litigations.map((l) => ({
        case_no: l.caseNo,
        tribunal_name_place: l.namePlace,
        petitioner_name: l.petitioner,
        respondent_name: l.respondent,
        case_facts: l.facts,
        present_status: l.status,
        interim_order: l.interimOrder,
        final_order: l.finalOrder
      }))
    )
  );

  // Send files separately
  litigations.forEach((l, index) => {
    if (l.interimCert) {
      formData.append(`interim_certificate_${index}`, l.interimCert);
    }

    if (l.finalCert) {
      formData.append(`final_certificate_${index}`, l.finalCert);
    }
  });
}

  /* ===== SELF AFFIDAVIT (WHEN NO CASES) ===== */
if (hasLitigation === "No" && affidavitFile) {
  formData.append("self_affidavit", affidavitFile);


}

/* ================= ENTITY (DIRECTOR / PARTNER / TRUSTEE) ================= */


/* ================= ENTITY (MULTIPLE) ================= */

let entityList = [];

if (
  form.orgType === "Company" ||
  form.orgType === "Joint Venture" ||
  form.orgType === "Government Department/Local Bodies/Government Bodies"
) {
  entityList = directors;
}

else if (form.orgType === "Trust/Society") {
  entityList = trustees;
}

else if (form.orgType === "Partnership/LLP Firm") {
  entityList = partners;
}

if (entityList.length === 0) {
  alert("Please add at least one entity");
  return;
}

formData.append(
  "entities",
  JSON.stringify(
    entityList.map((entity) => ({
      designation: entity.designation,
      name: entity.name,
      email: entity.email,
      mobile: entity.mobile,
      state: entity.state || "NA",
      district: entity.district || "NA",
      address1: entity.address1,
      address2: entity.address2 || "NA",
      pincode: entity.pincode || "NA",
      pan: entity.pan || "NA",
      aadhaar: entity.aadhaar || "NA",
      din: entity.din || "NA",
      nationality: entity.nationality || "Indian"
    }))
  )
);

/* ===== ENTITY FILES ===== */
entityList.forEach((entity, index) => {
  if (entity.panDoc)
    formData.append(`entity_pan_doc_${index}`, entity.panDoc);

  if (entity.aadhaarDoc)
    formData.append(`entity_aadhaar_doc_${index}`, entity.aadhaarDoc);

  if (entity.photo)
    formData.append(`entity_photo_${index}`, entity.photo);

  if (entity.addressProof)
    formData.append(`entity_address_proof_${index}`, entity.addressProof);
});

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
    application_id: data.application_no,   // 🔥 FIX
    organisation_id: data.agent_id,        // 🔥 FIX
    pan_card_number: data.pan,             // 🔥 FIX
    status: data.status,
    hasProjects,
    hasOtherRera,
  },
});



  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};




const validateMandatoryFields = () => {
  /* ========= 1️⃣ ORGANISATION TYPE ========= */
  if (!form.orgType) return "Please select Organisation Type";

  /* ========= 2️⃣ ORGANISATION NAME ========= */
  if (!form.orgName) return "Please enter Organisation Name";

  /* =====================================================
     3️⃣ TYPE-WISE FIELDS (IN SCREEN ORDER)
     ===================================================== */

  /* ===== COMPANY / JOINT VENTURE ===== */
  if (form.orgType === "Company" || form.orgType === "Joint Venture") {
    if (!form.cin) return "Please enter CIN Number";
    if (!form.regDate) return "Please select Date of Registration";
    if (!files.regCert) return "Upload Registration Certificate";
  }

  /* ===== TRUST / SOCIETY ===== */
  if (form.orgType === "Trust/Society") {
    if (!form.trustNumber) return "Please enter Trust Number";
    if (!form.trustRegDate) return "Please select Date of Trust Registration";
    if (!files.trustDeed) return "Upload Trust Deed";
    if (!files.regCert) return "Upload Registration Certificate";
  }

  /* ===== PARTNERSHIP / LLP ===== */
  if (form.orgType === "Partnership/LLP Firm") {
    if (!form.regNumber) return "Please enter Registration Number";
    if (!form.regDate) return "Please select Date of Registration";
    if (!files.partnershipDeed) return "Upload Partnership Deed";
    if (!files.regCert) return "Upload Registration Certificate";
  }

  /* ===== GOVERNMENT ===== */
  if (form.orgType === "Government Department/Local Bodies/Government Bodies") {
    if (!form.regNumber) return "Please enter Registration Number";
    if (!form.regDate) return "Please select Date of Registration";
    if (!files.regCert) return "Upload Registration Certificate";
  }

  /* ========= 4️⃣ PAN SECTION ========= */
  if (!form.pan) return "Please enter PAN Card Number";
  if (!files.panDoc) return "Upload PAN Card";

  /* ========= 5️⃣ CONTACT ========= */
if (!form.email?.trim()) {
  return "Please enter Email Id";
}

if (!/^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email.trim())) {
  return "Email must start with a letter and be in valid format (example: test@gmail.com)";
}
if (!form.mobile?.trim()) {
  return "Please enter Mobile Number";
}

if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
  return "Mobile number must be 10 digits and start with 6-9";
}
  /* ========= 6️⃣ GST ========= */
  if (form.gst && !files.gstDoc)
    return "Upload GST Number Document";

  /* ========= 7️⃣ MEMORANDUM (ONLY COMPANY/JV) ========= */
  if (
    (form.orgType === "Company" || form.orgType === "Joint Venture") &&
    !files.memorandumDoc
  ) {
    return "Upload Memorandum of Articles / Bye-laws";
  }
  /* =====================================================
     6️⃣ LOCAL ADDRESS FOR COMMUNICATION  ⭐ NEW SECTION
     ===================================================== */

  if (!form.address1) return "Please enter Address Line 1";
  if (!stateData?.id) return "Please select State";
  if (!districtData?.id) return "Please select District";
  if (!mandalData?.id) return "Please select Mandal";
  if (!villageData?.id) return "Please select Village";
  // ===== PIN CODE =====
if (!form.pincode?.trim()) {
  return "Please enter PIN Code";
}

if (!/^5[0-9]{5}$/.test(form.pincode.trim())) {
  return "PIN Code must start with 5 and contain exactly 6 digits";
}
  if (!files.addressProof) return "Upload Address Proof";

/* =====================================================
   7️⃣ DIRECTOR DETAILS VALIDATION
   Only for Company / JV / Government
   ===================================================== */

if (
  form.orgType === "Company" ||
  form.orgType === "Joint Venture" ||
  form.orgType === "Government Department/Local Bodies/Government Bodies"
) {

  /* ===== 1. DIRECTOR NOT ADDED YET ===== */
  if (directors.length === 0) {

    if (!directorType) {
      return "Please select Director Type (Indian / Foreigner)";
    }

    /* ---------- INDIAN ---------- */
    if (directorType === "Indian") {
      const d = directorForm;

      if (!d.designation) return "Please select Director Designation";
      // ===== NAME =====
if (!d.name?.trim())
  return "Please enter Director Name";

if (!/^[A-Za-z\s]+$/.test(d.name))
  return "Director Name should contain only alphabets";

// ===== EMAIL =====
if (!d.email?.trim())
  return "Please enter Director Email Id";

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
  return "Please enter valid Director Email Id (example: test@gmail.com)";

// ===== MOBILE =====
if (!d.mobile?.trim())
  return "Please enter Director Mobile Number";

if (!/^[6-9]\d{9}$/.test(d.mobile))
  return "Director Mobile must be 10 digits and start with 6-9";

      if (!directorStateId) return "Please select Director State";
      if (!directorDistrictId) return "Please select Director District";

      if (!d.address1) return "Please enter Director Address Line 1";
      if (!d.pincode?.trim())
  return "Please enter Director PIN Code";

if (!/^5[0-9]{5}$/.test(d.pincode.trim()))
  return "Director PIN Code must start with 5 and contain exactly 6 digits";

      if (!d.pan) return "Please enter Director PAN Number";

if (d.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(d.pan))
  return "Invalid PAN format (Example: ABCDE1234F)";
      if (!d.panDoc) return "Upload Director PAN Card";

     if (!d.aadhaar?.trim())
  return "Please enter Director Aadhaar Number";

if (!/^[0-9]{12}$/.test(d.aadhaar.trim()))
  return "Director Aadhaar must be exactly 12 digits";
      if (!d.aadhaarDoc) return "Upload Director Aadhaar";
      if (!d.photo) return "Upload Director Photograph";
      if (
        form.orgType !==
          "Government Department/Local Bodies/Government Bodies" &&
        !d.din
      ) {
        return "Please enter Director DIN Number";
      }
    }

    /* ---------- FOREIGNER ---------- */
    if (directorType === "Foreigner") {
      const d = foreignerDirector;

      if (!d.designation) return "Please select Director Designation";
      // ===== NAME =====
if (!d.name) return "Please enter Director Name";

if (d.name && !/^[A-Za-z\s]+$/.test(d.name))
  return "Director Name should contain only alphabets";

// ===== EMAIL =====
if (!d.email) return "Please enter Director Email Id";

if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
  return "Please enter valid Director Email Id (example: test@gmail.com)";

// ===== MOBILE =====
if (!d.mobile) return "Please enter Director Mobile Number";

if (d.mobile && !/^[6-9]\d{9}$/.test(d.mobile))
  return "Director Mobile must be 10 digits and start with 6-9";

// ===== ADDRESS LINE 1 =====
if (!d.address1) return "Please enter Director Address Line 1";

if (d.address1 && d.address1.trim().length < 5)
  return "Director Address must be at least 5 characters long";
      if (!d.photo) return "Upload Director Photograph";
      if (!d.addressProof) return "Upload Director Address Proof";
        if (
        form.orgType !==
          "Government Department/Local Bodies/Government Bodies" &&
        !d.din
      ) {
        return "Please enter Director DIN Number";
      }
    }
  }

  /* ===== 2. DIRECTOR ALREADY ADDED ===== */
  else {
    const d = directors[0];

    if (!d.designation) return "Director designation missing";
    if (!d.name) return "Director name missing";
    if (!d.email) return "Director email missing";
    if (!d.mobile) return "Director mobile missing";

    if (
      form.orgType !==
        "Government Department/Local Bodies/Government Bodies" &&
      !d.din
    ) {
      return "Director DIN missing";
    }

    if (!d.photo) return "Director photo missing";
   
  }
}

/* =====================================================
   8️⃣ AUTHORIZED SIGNATORY VALIDATION
   ===================================================== */

// ===== SIGNATORY NAME =====
if (!form.signName) {
  return "Please enter Authorized Signatory Name";
}

if (!/^[A-Za-z\s]{2,50}$/.test(form.signName.trim())) {
  return "Authorized Signatory Name should contain only alphabets (2-50 characters)";
}


// ===== SIGNATORY MOBILE =====
if (!form.signMobile) {
  return "Please enter Authorized Signatory Mobile Number";
}

if (!/^[6-9]\d{9}$/.test(form.signMobile)) {
  return "Authorized Signatory Mobile must be 10 digits and start with 6-9";
}


// ===== SIGNATORY EMAIL =====             
if (!form.signEmail) {                      
  return "Please enter Authorized Signatory Email Id";
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.signEmail.trim())) {
  return "Please enter valid Authorized Signatory Email Id (example: test@gmail.com)";
}
if (!files.authPhoto) {
  return "Upload Authorized Signatory Photograph";
}

if (!files.boardResolution) {
  return "Upload Board Resolution for Authorized Signatory";
}

/* =====================================================
   PROJECTS IN LAST 5 YEARS VALIDATION
   ===================================================== */

// ❗ Must select Yes or No first
/* ===== MUST SELECT YES/NO ===== */
if (!hasProjects) {
  return "Please select Last five years project details";
}

/* ===== IF YES SELECTED ===== */
if (hasProjects === "Yes") {

  // typed but not added
  if (projectName.trim() && projects.length === 0) {
    return "Please click Add to save the project";
  }

  // nothing typed & nothing added
  if (!projectName.trim() && projects.length === 0) {
    return "Please enter and add at least one Project Name";
  }
}


/* ---------- If NO selected ---------- */
// No extra validation needed
/* ================= LITIGATION VALIDATION ================= */
/* =====================================================
   LITIGATION VALIDATION – PURE FIELD WISE
   ===================================================== */

/* ---------- Nothing selected ---------- */
if (!hasLitigation) {
  return "Please select Any Civil/Criminal Cases (Yes or No)";
}


/* =====================================================
   WHEN YES SELECTED → VALIDATE FORM DIRECTLY
   ===================================================== */
if (hasLitigation === "Yes") {

  /* ✅ If already added to table, skip everything */
  if (litigations.length > 0) {
    // DO NOTHING - continue to next validation section
  } else {

    const l = litigationForm;

    if (!l.caseNo)
      return "Please enter Case Number";

    if (!l.namePlace)
      return "Please enter Name & Place of Tribunal/Authority";

    if (!l.petitioner)
      return "Please enter Petitioner Name";

    if (!l.respondent)
      return "Please enter Respondent Name";

    if (!l.facts)
      return "Please enter Facts of the Case";

    if (!l.status)
      return "Please select Present Status of the Case";

    if (!hasInterimOrder)
      return "Please select Interim Order (Yes or No)";

    if (!hasFinalOrder)
      return "Please select Details of Final Order (Yes or No)";

    if (hasInterimOrder === "Yes" && !l.interimCert)
      return "Please add Interim Order Certificate";

    if (hasFinalOrder === "Yes" && !l.finalCert)
      return "Please upload Disposed Certificate";

    return "Please click Add to save Any Civil/Criminal Cases Details";
  }
}


/* =====================================================
   WHEN NO SELECTED
   ===================================================== */
if (hasLitigation === "No") {
  if (!affidavitFile) {
    return "Please upload Self Declared Affidavit";
  }
}

/* =====================================================
   OTHER STATE / UT RERA VALIDATION
   ===================================================== */

/* 1️⃣ Must select Yes or No */

if (!hasOtherRera) {
  return "Please select Do you have registration in other states (Yes or No)";
}

if (hasOtherRera === "Yes") {

  // ✅ If at least one record is added, no need to validate input fields
  if (otherReraList.length > 0) {
    return null;
  }

  // ❗ If nothing added, then validate fields
  if (!otherReraForm.regNumber)
    return "Please enter Registration Number";

  if (!otherReraStateId)
    return "Please select State/UT";

  if (!otherReraDistrictId)
    return "Please select District";

  return "Please click Add to save Other State RERA details";
}


  return null; // ✅ ALL VALID
};



  const handleSaveAndContinue = () => {

  // ===== REGISTRATION NUMBER VALIDATION =====
const error = validateMandatoryFields();

  if (error) {
    alert(error); // same popup style as your screenshot
    return;
  }


let regValue = "";

if (form.orgType === "Company" || form.orgType === "Joint Venture") {
  regValue = form.cin;
}

else if (form.orgType === "Trust/Society") {
  regValue = form.trustNumber;
}

else if (
  form.orgType === "Partnership/LLP Firm" ||
  form.orgType === "Government Department/Local Bodies/Government Bodies"
) {
  regValue = form.regNumber;
}

if (!isValidRegistrationNo(regValue)) {
  return alert(
    "Registration/CIN/Trust Number must contain only A-Z and 0-9 (max 23 characters)"
  );
}


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
  // ===== FORMAT VALIDATIONS =====

// Organisation Mobile
if (!isValidMobile(form.mobile)) {
  return alert("Mobile must start with 6-9 and be 10 digits");
}

// Organisation Email
if (!isValidEmail(form.email)) {
  return alert("Enter valid Email (example: abc2@gmail.com)");
}

// PAN
if (!isValidPAN(form.pan)) {
  return alert("PAN must be in format ABCDE2345G");
}

// Authorized Mobile
if (!isValidMobile(form.signMobile)) {
  return alert("Authorized mobile must be 10 digits (6-9 start)");
}

// Authorized Email
if (!isValidEmail(form.signEmail)) {
  return alert("Enter valid Authorized Email");
}


  // ===== ADDRESS VALIDATION =====
if (!isValidAddress(form.address1)) {
  return alert(
    "Address Line 1 must be 5–200 characters and contain valid characters"
  );
}

if (
  !stateData.id ||
  !districtData.id ||
  !mandalData.id ||
  !villageData.id
)
  return alert("Please select complete Address");


// PINCODE VALIDATION (ALL ORG TYPES)
if (!isValidPincode(form.pincode)) {
  return alert("PIN Code must be 6 digits and start with 5 (Example: 534350)");
}


  if (!form.signName)
    return alert("Please enter Authorized Signatory Name");

  if (!form.signMobile)
    return alert("Please enter Authorized Mobile Number");

  if (!form.signEmail)
    return alert("Please enter Authorized Email");
  /* ================= FILE VALIDATIONS ================= */

  if (!files.regCert)
    return alert("Please upload Registration Certificate");

  if (!files.panDoc)
    return alert("Please upload PAN Document");

  if ((form.orgType === "Company" || form.orgType === "Joint Venture") && !files.memorandumDoc)
    return alert("Please upload Memorandum Document");
/* ===== AFFIDAVIT (WHEN NO CASES) ===== */

// ===== FINAL PHOTO CHECK =====
const allPhotos = [
  files.authPhoto,
  ...directors.map(d => d.photo),
  ...trustees.map(t => t.photo),
];

for (let photo of allPhotos) {
  if (photo && !isJPGImage(photo)) {
    alert("All photos must be JPG format");
    return;
  }
}

// ===== FINAL PDF VALIDATION =====
const allPDFs = [
  files.regCert,
  files.panDoc,
  files.gstDoc,
  files.addressProof,
  files.boardResolution,
  files.memorandumDoc,
  files.partnershipDeed,
  files.trustDeed,
];

for (let file of allPDFs) {
  if (file && !isPDFFile(file)) {
    alert("All documents must be in PDF format");
    return;
  }
}


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
  if (
  !designation ||
  !name ||
  !mobile ||
  !email ||
  !address1 ||
  (
    form.orgType !==
      "Government Department/Local Bodies/Government Bodies" &&
    !din
  )
) {
  alert("Please fill all mandatory Foreigner Director fields");
  return;
}


  // ===== Format Validation =====
  if (!isValidMobile(mobile)) {
    alert("Mobile must start with 6-9 and be 10 digits");
    return;
  }


 // DIN only if not Government
if (
  form.orgType !==
    "Government Department/Local Bodies/Government Bodies" &&
  !isValidDIN(din)
) {
  alert("DIN must be 8 digits");
  return;
}


  // ❌ NO Aadhaar Validation Here (Foreigner)

  // ===== Save Foreigner =====
  setDirectors(prev => [
  ...prev,   // ⭐ keeps old directors
  {
      nationality: "Foreigner",
      designation,
      name,
      din:
      form.orgType ===
      "Government Department/Local Bodies/Government Bodies"
        ? "NA"
        : din,
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
  setShowDirectorForm(false);


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

// ===== COMMON JPG PHOTO HANDLER =====
const handleJPGPhoto = (e, setter, field) => {
  const file = e.target.files[0];

  if (!file) return;

  if (!isJPGImage(file)) {
    alert("Only JPG / JPEG images are allowed");

    e.target.value = ""; // reset input
    return;
  }

  setter(prev => ({
    ...prev,
    [field]: file,
  }));
};
// ===== COMMON PDF HANDLER =====
const handlePDFFile = (e, setter, field) => {
  const file = e.target.files[0];

  if (!file) return;

  // ❌ Not PDF
  if (!isPDFFile(file)) {
    alert("Only PDF files are allowed");

    e.target.value = ""; // reset input
    return;
  }

  // ✅ Valid PDF
  setter(prev => ({
    ...prev,
    [field]: file,
  }));
};


 return (
    <div className="yagentdetails-agent-wrapper">
      {/* Breadcrumb */}
      <div className="yagentdetails-breadcrumb">
        You are here : <span><a href="/">  Home </a> </span> / <span> Registration</span> /{" "}
        <span>Real Estate Agent Registration</span>
      </div>
<div className="yagentdetails-page-content">
      <h2 className="yagentdetails-page-title">Real Estate Agent Registration</h2>
      <AgentStepper currentStep={0} />
      {errorMsg && (
  <div className="yagentdetails-error-banner">
    <span>{errorMsg}</span>
    <button onClick={() => setErrorMsg("")}>×</button>
  </div>
   )} 

     {/* Agent Type */}
<section className="yagentdetails-agent-type-section">
  <h3 className="yagentdetails-agent-type-title">Agent Type</h3>

  <div className="yagentdetails-agent-type-options">

    {/* ❌ Individual (Disabled) */}
    <label className="yagentdetails-agent-type-item">
      <input
        type="radio"
        name="agentType"
        value="Individual"
        disabled        // 🔥 Not clickable
      />
      <span style={{ color: "#999" }}>Individual</span>
    </label>

    {/* ✅ Other (Selected by Default) */}
    <label className="yagentdetails-agent-type-item">
      <input
        type="radio"
        name="agentType"
        value="Other"
        defaultChecked  // 🔥 Selected by default
      />
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
            <label>Organisation Name <span className="yagentdetails-required">*</span></label>
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
  maxLength="23"
  value={form.cin}
  onChange={(e) =>
  setForm({
    ...form,
    cin: formatRegistrationNo(e.target.value),
  })
}

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
        onChange={(e) =>
  setForm({
    ...form,
    trustNumber: formatRegistrationNo(e.target.value),
  })
}

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
          onChange={(e) =>
  setForm({
    ...form,
    regNumber: formatRegistrationNo(e.target.value),
  })
}

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
            <input
  type="file"
  accept="application/pdf"
  onChange={(e) =>
    handlePDFFile(e, setFiles, "regCert")
  }
/>


          </div>

          <div>
            <label>PAN Card Number <span className="yagentdetails-required">*</span></label>
           <input
  type="text"
  name="pan"
  maxLength="10"
  value={form.pan}
  disabled={!!passedPan}
  onChange={(e) =>
    setForm({
      ...form,
      pan: formatPAN(e.target.value),
    })
  }
/>


          </div>

          <div>
            <label>Upload PAN Card <span className="yagentdetails-required">*</span></label>
            <input
  type="file"
  accept="application/pdf"
  onChange={(e) =>
    handlePDFFile(e, setFiles, "panDoc")
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
      mobile: formatMobile(e.target.value),
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
            <input
  type="file"
  accept="application/pdf"
  onChange={(e) =>
    handlePDFFile(e, setFiles, "gstDoc")
  }
/>


          </div>
         {/* ===== MEMORANDUM (ONLY FOR COMPANY) ===== */}
{(form.orgType === "Company" || form.orgType === "Joint Venture") && (
  <div>
    <label>
      Upload Memorandum of Articles/Bye-laws <span className="yagentdetails-required">*</span>
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
             <label className="label-inline">
  Address Line 1 <span className="required">*</span>
</label>
              <input
  name="address1"
  value={form.address1}
  onChange={(e) =>
    setForm({
      ...form,
      address1: formatAddress(e.target.value),
    })
  }
/>

            </div>

            <div>
              <label>Address Line 2</label>
              <input
  name="address2"
  value={form.address2}
  onChange={(e) =>
    setForm({
      ...form,
      address2: formatAddress(e.target.value),
    })
  }
/>

            </div>

            <div>
             <label className="label-inline">
  State <span className="required">*</span>
</label>
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
              <label className="label-inline">
  District <span className="required">*</span>
</label>
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
              <label className="label-inline">
  Mandal <span className="required">*</span>
</label>
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
              <label className="label-inline">
  Local Area / Village <span className="required">*</span>
</label>
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
              <label className="label-inline">
  PIN Code <span className="required">*</span>
</label>
 <input
  name="pincode"
  maxLength="6"
  value={form.pincode}
  onChange={(e) =>
    setForm({
      ...form,
      pincode: formatPincode(e.target.value),
    })
  }
/>


            </div>
            

          <div>
            <label>Upload Address Proof <span className="yagentdetails-required">*</span></label>
           <input
  type="file"
  accept="application/pdf"
  onChange={(e) =>
    handlePDFFile(e, setFiles, "addressProof")
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
onChange={() => {
  setDirectorType("Indian");
  setShowDirectorForm(true);
}}
          />
          Indian
        </label>

        <label>
          <input
            type="radio"
            name="directorType"
            value="Foreigner"
            checked={directorType === "Foreigner"}
onChange={() => {
  setDirectorType("Foreigner");
  setShowDirectorForm(true);
}}
          />
          Foreigner
        </label>
      </div>
    </div>

    {/* ===== INDIAN DIRECTOR FORM ===== */}
    {showDirectorForm && directorType === "Indian" && (
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
  value={directorForm.email}
  onChange={(e) =>
    setDirectorForm({
      ...directorForm,
      email: e.target.value,
    })
  }
/>

    </div>

    <div>
      <label>Mobile Number <span className="yagentdetails-required">*</span></label>
      <input
  maxLength="10"
  value={directorForm.mobile}
  onChange={(e) =>
    setDirectorForm({
      ...directorForm,
      mobile: formatMobile(e.target.value),
    })
  }
/>


    </div>

    {/* Row 2 — 🔥 MISSING FIELDS ADDED */}
    <div>
      <label>State/UT <span className="yagentdetails-required">*</span></label>
     <select
  value={directorStateId}
  onChange={(e) => {
    const selected = states.find(
      (s) => s.id == e.target.value
    );

    setDirectorStateId(e.target.value);

    setDirectorForm({
      ...directorForm,
      state: selected?.state_name || "",
      district: "",   // reset district
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
      <label>District <span className="yagentdetails-required">*</span></label>
     <select
  value={directorDistrictId}
  disabled={!directorStateId}
  onChange={(e) => {
    const selected = directorDistricts.find(
      (d) => d.id == e.target.value
    );

    setDirectorDistrictId(e.target.value);

    setDirectorForm({
      ...directorForm,
      district: selected?.name || "",
    });
  }}
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
  maxLength="6"
  value={directorForm.pincode}
  onChange={(e) =>
    setDirectorForm({
      ...directorForm,
      pincode: formatPincode(e.target.value),
    })
  }
/>

    </div>

    <div>
      <label>PAN Card Number <span className="yagentdetails-required">*</span></label>
      <input
  maxLength="10"
  value={directorForm.pan}
  onChange={(e) =>
    setDirectorForm({
      ...directorForm,
      pan: formatPAN(e.target.value),
    })
  }
/>

    </div>

    <div>
      <label>Upload PAN Card <span className="yagentdetails-required">*</span></label>
<input
  type="file"
  accept="application/pdf"
  onChange={(e) =>
    handlePDFFile(e, setDirectorForm, "panDoc")
  }
/>

   </div>

    <div>
      <label>Aadhaar Number <span className="yagentdetails-required">*</span></label>
      <input
  maxLength="12"
  value={directorForm.aadhaar}
  onChange={(e) =>
    setDirectorForm({
      ...directorForm,
      aadhaar: onlyNumbers(e.target.value, 12),
    })
  }
/>

    </div>

    {/* Row 4 */}
    <div>
      <label>Upload Aadhaar <span className="yagentdetails-required">*</span></label>
      <input
  type="file"
  accept="application/pdf"
  onChange={(e) =>
    handlePDFFile(e, setDirectorForm, "aadhaarDoc")
  }
/>


    </div>

    <div>
      <label>Photograph <span className="yagentdetails-required">*</span></label>
     <input
  type="file"
  accept="image/jpeg"
  onChange={(e) =>
    handleJPGPhoto(e, setDirectorForm, "photo")
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

    {/* ===== DIN (HIDE FOR GOVERNMENT) ===== */}
{form.orgType !==
  "Government Department/Local Bodies/Government Bodies" && (
  <div>
    <label>DIN Number <span className="yagentdetails-required">*</span></label>
    <input
      maxLength="8"
      value={directorForm.din}
      onChange={(e) =>
        setDirectorForm({
          ...directorForm,
          din: onlyNumbers(e.target.value, 8),
        })
      }
    />
  </div>
)}

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

const d = directorForm;

if (
  !d.designation?.trim() ||
  !d.name?.trim() ||
  !d.email?.trim() ||
  !d.mobile?.trim() ||
  !directorStateId ||
  !directorDistrictId ||
  !d.address1?.trim() ||
  !d.pincode?.trim() ||
  !d.pan?.trim() ||
  !d.aadhaar?.trim() ||
  !d.panDoc ||          // ✅ PAN file check
  !d.aadhaarDoc ||      // ✅ Aadhaar file check
  !d.photo ||           // ✅ Photo check
  (
    form.orgType !==
    "Government Department/Local Bodies/Government Bodies" &&
    !d.din?.trim()
  )
) {
  alert("Please fill all mandatory Director fields including documents");
  return; // ❌ STOP HERE
}

 

  if (!isValidEmail(email)) {
    alert("Enter valid Email ID");
    return;
  }

  if (!isValidAadhaar(aadhaar)) {
    alert("Aadhaar must be 12 digits");
    return;
  }

  // DIN only if not Government
if (
  form.orgType !==
    "Government Department/Local Bodies/Government Bodies" &&
  !isValidDIN(din)
) {
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
  setShowDirectorForm(false);

}}

      >
        Add
      </button>
    </div>

  </div>
  
)}


    {/* ===== FOREIGNER PLACEHOLDER ===== */}
    {showDirectorForm && directorType === "Foreigner" && (
      <p style={{ marginTop: "10px" }}>
      </p>
    )}
  </section>
)}

{/* ===== FOREIGNER DIRECTOR ===== */}
{showDirectorForm && directorType === "Foreigner" && (
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
  maxLength="10"
  value={foreignerDirector.mobile}
  onChange={(e) =>
    setForeignerDirector({
      ...foreignerDirector,
      mobile: formatMobile(e.target.value),
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
  accept="image/jpeg"
  onChange={(e) =>
    handleJPGPhoto(e, setForeignerDirector, "photo")
  }
/>


{foreignerDirector.photo && (
  <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
    Selected: {foreignerDirector.photo.name}
  </p>
)}

      </div>

      <div>
        <label>Upload Address Proof <span className="yagentdetails-required">*</span></label>
        <input
  type="file"
  onChange={(e) => {
    const file = e.target.files[0];

    if (!file) return;

    setForeignerDirector({
      ...foreignerDirector,
      addressProof: file,
    });
  }}
/>

{/* Show file name */}
{foreignerDirector.addressProof && (
  <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
    Selected: {foreignerDirector.addressProof.name}
  </p>
)}

      </div>

      {/* ===== DIN (HIDE FOR GOVERNMENT) ===== */}
{form.orgType !==
  "Government Department/Local Bodies/Government Bodies" && (
  <div>
    <label>DIN Number <span className="yagentdetails-required">*</span></label>
    <input
      maxLength="8"
      value={foreignerDirector.din}
onChange={(e) =>
  setForeignerDirector({
    ...foreignerDirector,
    din: onlyNumbers(e.target.value, 8),
  })
}

    />
  </div>
)}


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
    onClick={() => {
      if (d.panDoc) {
        window.open(URL.createObjectURL(d.panDoc), "_blank");
      }
    }}
  >
    View PAN Card
  </span>
</td>



<td>
  <span
    className={`yagentdetails-view-link ${
      !d.aadhaarDoc ? "disabled-link" : ""
    }`}
    onClick={() => {
      if (d.aadhaarDoc) {
        window.open(URL.createObjectURL(d.aadhaarDoc), "_blank");
      }
    }}
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
onChange={() => {
  setTrusteeType("Indian");
}}          />
          Indian
        </label>

        <label>
          <input
            type="radio"
            name="trusteeType"
            checked={trusteeType === "Foreigner"}
            onChange={() => {
  setTrusteeType("Foreigner");
}}          />
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
    <label>
  Name <span className="required">*</span>
</label>
    <input
      value={trusteeForm.name}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, name: e.target.value })
      }
    />
  </div>

  <div>
    <label>
  Email Id <span className="required">*</span>
</label>
    <input
      type="email"
      value={trusteeForm.email}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, email: e.target.value })
      }
    />
  </div>

  <div>
   <label>
  Mobile Number <span className="required">*</span>
</label>
    <input
  maxLength="10"
  value={trusteeForm.mobile}
  onChange={(e) =>
    setTrusteeForm({
      ...trusteeForm,
      mobile: formatMobile(e.target.value),
    })
  }
/>


  </div>

  <div>
  <label>
  State/UT <span className="required">*</span>
</label>

  <select
    value={trusteeStateId}
    onChange={(e) => {
      setTrusteeStateId(e.target.value);

      const selected = states.find(s => s.id == e.target.value);

setTrusteeForm({
  ...trusteeForm,
  state: selected?.state_name || "",   // ✅ save name
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
  <label>
  District <span className="required">*</span>
</label>

  <select
    value={trusteeDistrictId}
    disabled={!trusteeStateId}
    onChange={(e) => {
      setTrusteeDistrictId(e.target.value);

      const selected = trusteeDistricts.find(d => d.id == e.target.value);

setTrusteeForm({
  ...trusteeForm,
  district: selected?.name || "",   // ✅ save name
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
    <label>
  Address Line 1 <span className="required">*</span>
</label>
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
   <label>
  PINCode <span className="required">*</span>
</label>
   <input
  maxLength="6"
  value={trusteeForm.pincode}
  onChange={(e) =>
    setTrusteeForm({
      ...trusteeForm,
      pincode: formatPincode(e.target.value),
    })
  }
/>

  </div>

  <div>
    <label>
  PAN Card Number <span className="required">*</span>
</label>
    <input
  maxLength="10"
  value={trusteeForm.pan}
  onChange={(e) =>
    setTrusteeForm({
      ...trusteeForm,
      pan: formatPAN(e.target.value),
    })
  }
/>

  </div>

  <div>
    <label>
  Upload PAN Card <span className="required">*</span>
</label>
    <input
      type="file"
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, panDoc: e.target.files[0] })
      }
    />
  </div>

  <div>
    <label>
  Aadhaar Number <span className="required">*</span>
</label>
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
    <label>
  Upload Aadhaar Card <span className="required">*</span>
</label>
    <input
      type="file"
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, aadhaarDoc: e.target.files[0] })
      }
    />
  </div>

  <div>
    <label>
  Photograph <span className="required">*</span>
</label>
    <input
  type="file"
  accept="image/jpeg"
  onChange={(e) =>
    handleJPGPhoto(e, setTrusteeForm, "photo")
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
    <label>
  Name <span className="required">*</span>
</label>
    <input
      value={trusteeForm.name}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, name: e.target.value })
      }
    />
  </div>

  <div>
    <label>
  Email Id <span className="required">*</span>
</label>
    <input
      type="email"
      value={trusteeForm.email}
      onChange={(e) =>
        setTrusteeForm({ ...trusteeForm, email: e.target.value })
      }
    />
  </div>

  <div>
    <label>
  Mobile Number <span className="required">*</span>
</label>
    <input
  maxLength="10"
  value={trusteeForm.mobile}
  onChange={(e) =>
    setTrusteeForm({
      ...trusteeForm,
      mobile: formatMobile(e.target.value),
    })
  }
/>

  </div>

  <div>
<label>
  Address Line 1 <span className="required">*</span>
</label>    
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
<label>
  Upload Photograph <span className="required">*</span>
</label>      <input
  type="file"
  accept="image/jpeg"
  onChange={(e) =>
    handleJPGPhoto(e, setTrusteeForm, "photo")
  }
/>

  </div>

  <div>
<label>
  Upload Address Proof <span className="required">*</span>
</label>      <input
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
              <label>Name <span className="required">*</span></label>
              <input
                name="signName"
                value={form.signName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>
  Mobile Number <span className="required">*</span>
</label>
              <input
  name="signMobile"
  maxLength="10"
  value={form.signMobile}
  onChange={(e) =>
    setForm({
      ...form,
      signMobile: formatMobile(e.target.value),
    })
  }
/>

            </div>

            <div>
             <label>
  Email Id <span className="required">*</span>
</label>
              <input
                name="signEmail"
                value={form.signEmail}
                onChange={handleChange}
              />
            </div>
            <div>
            <label>Photo <span className="yagentdetails-required">*</span></label>
           <input
  type="file"
  accept="image/jpeg"
  onChange={(e) =>
    handleJPGPhoto(e, setFiles, "authPhoto")
  }
/>



          </div>

          <div>
            <label>Board Resolution for Authorized Signatory <span className="yagentdetails-required">*</span></label>
           <input
  type="file"
  accept="application/pdf"
  onChange={(e) =>
    handlePDFFile(e, setFiles, "boardResolution")
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
  className="yagentdetails-project-delete-btn"
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
 // setAffidavitFile(null);
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
  accept="application/pdf"
  onChange={(e) =>
    handlePDFFile(e, setLitigationForm, "interimCert")
  }
/>

  </div>
)}


       {hasFinalOrder === "Yes" && (
  <div>
    <label>Disposed Certificate <span className="yagentdetails-required">*</span></label>
    <input
  type="file"
  accept="application/pdf"
  onChange={(e) =>
    handlePDFFile(e, setLitigationForm, "finalCert")
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
  <div className="yagentdetails-table-scroll">
    <table
      className="yagentdetails-table"
      style={{ marginTop: "15px", minWidth: "1200px" }}
    >

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
  </div>
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
    const selected = states.find(s => s.id == e.target.value);

    setOtherReraStateId(e.target.value);

    setOtherReraForm(prev => ({
      ...prev,
      state: selected?.state_name || "", // ✅ STORE NAME
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
    const selected = otherReraDistricts.find(d => d.id == e.target.value);

    setOtherReraDistrictId(e.target.value);

    setOtherReraForm(prev => ({
      ...prev,
      district: selected?.name || "", // ✅ STORE NAME
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