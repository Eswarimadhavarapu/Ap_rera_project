import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/ApplicantDetails.css";
import { apiGet,apiPost } from "../api/api";

const ApplicantDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedPan = location.state?.pan || "";
  const [litigationStatus, setLitigationStatus] = useState("No");
  const [occupations, setOccupations] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [agentType, setAgentType] = useState("Individual");

  const applicationNo = sessionStorage.getItem("application_no");
  
  
  // Location dropdowns
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);

  const [form, setForm] = useState({
    agentName: "",
    fatherName: "",
    occupation: "",
    occupationName: "",
    email: "",
    aadhaar: "",
    pan: "",
    panProof: null,
    mobile: "",
    landline: "",
    licenseNumber: "",
    licenseDate: "",
    address1: "",
    address2: "",
    state: "",
    district: "",
    mandal: "",
    village: "",
    pincode: "",
    addressProof: null,
    
  });

    const [files, setFiles] = useState({
    photograph: null,
    panProof: null,
    addressProof: null,
  });
    /* ================= LOAD SAVED FORM ================= */

useEffect(() => {
  if (!applicationNo) return;

  apiGet(`api/agent/resume-applicationss/${applicationNo}`)
    .then((res) => {
      if (res.success && res.data) {
        const d = res.data;

        setForm((prev) => ({
          ...prev,

          // -------- BASIC DETAILS --------
          agentName: d.agent_name || "",
          fatherName: d.father_name || "",
          occupation: d.occupation_id || "",
          email: d.email || "",
          aadhaar: d.aadhaar || "",
          pan: d.pan || "",
          mobile: d.mobile || "",
          landline: d.landline || "",
          licenseNumber: d.license_number || "",
          licenseDate: d.license_date || "",

          // -------- ADDRESS --------
          address1: d.address1 || "",
          address2: d.address2 || "",
          state: d.state_id || "",
          district: d.district || "",
          mandal: d.mandal || "",
          village: d.village || "",
          pincode: d.pincode || "",
        }));

        // -------- FILE INFO (display only) --------
        setUploadedFiles({
          photograph: d.photograph || null,
          panProof: d.pan_proof || null,
          addressProof: d.address_proof || null,
        });
      }
    })
    .catch((err) => {
      console.error("Resume error:", err);
    });
}, [applicationNo]);




   useEffect(() => {
    if (!passedPan) return;

    const savedForm = localStorage.getItem(`applicantForm_${passedPan}`);

    if (savedForm) {
      setForm(JSON.parse(savedForm));
    } else {
      setForm((prev) => ({ ...prev, pan: passedPan }));
    }
  }, [passedPan]);

  useEffect(() => {
  if (!form.pan) return;

  localStorage.setItem(
    `applicantForm_${form.pan}`,
    JSON.stringify(form)
  );

  localStorage.setItem("currentPan", form.pan);
  }, [form]);

  // Fetch occupations
  useEffect(() => {
    apiGet("/api/occupations")
      .then((res) => {
        if (res.success) {
          setOccupations(res.data);
        }
      })
      .catch((err) => console.error("Occupation API error:", err));
  }, []);

  // Fetch states on mount
  useEffect(() => {
    apiGet("/api/states")
      .then((res) => {
        setStates(res || []);
      })
      .catch((err) => console.error("States API error:", err));
  }, []);

 


  // Fetch districts when state changes
  useEffect(() => {
    if (form.state) {
      apiGet(`/api/districts/${form.state}`)
        .then((res) => {
          setDistricts(res || []);
          setMandals([]);
          setVillages([]);
        })
        .catch((err) => console.error("Districts API error:", err));
    }
  }, [form.state]);

  // Fetch mandals when district changes
  useEffect(() => {
    if (form.district) {
      apiGet(`/api/mandals/${form.district}`)
        .then((res) => {
          setMandals(res || []);
          setVillages([]);
        })
        .catch((err) => console.error("Mandals API error:", err));
    }
  }, [form.district]);

  // Fetch villages when mandal changes
  useEffect(() => {
    if (form.mandal) {
      apiGet(`/api/villages/${form.mandal}`)
        .then((res) => {
          setVillages(res || []);
        })
        .catch((err) => console.error("Villages API error:", err));
    }
  }, [form.mandal]);

  const [showProjects, setShowProjects] = useState(false);
  const [showOtherState, setShowOtherState] = useState(false);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, [fieldName]: file });
    }
  };

  const validateFile = (file, type) => {
    if (!file) return false;
    const name = file.name.toLowerCase();
    if (type === "jpg" && !name.endsWith(".jpg")) {
      alert("Only JPG files allowed");
      return false;
    }
    if (type === "pdf" && !name.endsWith(".pdf")) {
      alert("Only PDF files allowed");
      return false;
    }
    return true;
  };

  /* -------------------- VALIDATION -------------------- */
  const handleSaveContinue = async () => {
  if (!form.agentName) return alert("Please Enter Agent Name");
  if (!form.photograph) return alert("Please Upload Photograph");
  if (!form.fatherName) return alert("Please Enter Father Name");
  if (!form.occupation) return alert("Please Select Occupation");
  if (!form.email) return alert("Please Enter Email");
  if (form.aadhaar.length !== 12) return alert("Aadhaar Number must be 12 digits");
  if (!form.pan) return alert("Please Enter PAN Card Number");
  if (!form.panProof) return alert("Please Upload PAN Card");
  if (!form.mobile) return alert("Please Enter Mobile Number");
  if (!form.address1) return alert("Please Enter Address Line 1");
  if (!form.state) return alert("Please Select State");
  if (!form.district) return alert("Please Select District");
  if (!form.mandal) return alert("Please Select Mandal");
  if (!form.village) return alert("Please Select Local Area / Village");
  if (!form.pincode) return alert("Please Enter PIN Code");
  if (!form.addressProof) return alert("Please Upload Address Proof");

  try {
    const formData = new FormData();

    // text fields
    Object.entries(form).forEach(([key, value]) => {
      if (
        key !== "photograph" &&
        key !== "panProof" &&
        key !== "addressProof"
      ) {
        formData.append(key, value);
      }
    });

    // file fields
    formData.append("photograph", form.photograph);
    formData.append("panProof", form.panProof);
    formData.append("addressProof", form.addressProof);

    const response = await apiPost("/api/agent/register-step1", formData);

    if (response.success) {
      localStorage.setItem("agentId", response.agent_id);
       // ✅ show popup instead of navigating
      setShowSuccessPopup(true);
    } else {
      alert(response.message || "Failed to save applicant details");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong while saving");
  }
};

  /* -------------------- UI -------------------- */
  return (
    <div className="applicantdetails-page-wrapper">
      <div className="applicantdetails-rera-container">
        {/* Breadcrumb */}
        <div className="applicantdetails-breadcrumb">
          You are here : <span>Home</span> / <span>Registration</span> /{" "}
          <span>Real Estate Agent Registration</span>
        </div>

        <div className="applicantdetails-content-box">
          <h2 className="applicantdetails-page-title">Real Estate Agent Registration</h2>

          {/* Stepper */}
          <div className="applicantdetails-stepper">
            {["Agent Detail", "Upload Documents", "Preview", "Payment", "Acknowledgement"].map(
              (s, i) => (
                <div className="applicantdetails-step" key={i}>
                  <div className={`applicantdetails-circle ${i === 0 ? "active" : ""}`}>{i + 1}</div>
                  <span>{s}</span>
                </div>
              )
            )}
          </div>

          {/* Applicant Details */}
          <section className="applicantdetails-section">
  <h3 className="applicantdetails-section-title">Agent Type</h3>

  <div className="applicantdetails-radio-inline">
    <label>
      <input
        type="radio"
        name="agentType"
        value="Individual"
        checked={agentType === "Individual"}
        onChange={(e) => setAgentType(e.target.value)}
      />
      Individual
    </label>

    <label style={{ marginLeft: "30px" }}>
      <input
        type="radio"
        name="agentType"
        value="Other"
        checked={agentType === "Other"}
        onChange={(e) => setAgentType(e.target.value)}
      />
      Other than individual
    </label>
  </div>
</section>
          <section className="applicantdetails-section">
            <h3 className="applicantdetails-section-title">Applicant Details</h3>

            <div className="applicantdetails-grid-4">
              <div>
                <label>Agent Name *</label>
                <input name="agentName" value={form.agentName} onChange={handleChange} />
              </div>

              <div>
                <label>Upload Photograph (JPG) *</label>
                <input
                  type="file"
                  accept=".jpg"
                  onChange={(e) => {
                    if (validateFile(e.target.files[0], "jpg")) {
                      handleFileChange(e, "photograph");
                    }
                  }}
                />
              </div>

              <div>
                <label>Father's Name *</label>
                <input name="fatherName" value={form.fatherName} onChange={handleChange} />
              </div>

              <div>
                <label>Occupation *</label>
                <select
                  name="occupation"
                  value={form.occupation}
                  onChange={(e) => {
                    const selected = occupations.find(
                      (o) => o.occupation_id == e.target.value
                    );
                    setForm({
                      ...form,
                      occupation: e.target.value,
                      occupationName: selected?.occupation_name || "",
                    });
                  }}
                >
                  <option value="">Select</option>
                  {occupations.map((o) => (
                    <option key={o.occupation_id} value={o.occupation_id}>
                      {o.occupation_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Email Id *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} />
              </div>

              <div>
                <label>Aadhaar Number *</label>
                <input
                  name="aadhaar"
                  value={form.aadhaar}
                  maxLength="12"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, aadhaar: value });
                  }}
                />
              </div>

              <div>
                <label>PAN Card Number *</label>
                <input
  name="pan"
  value={form.pan}
  maxLength="10"
  disabled={!!passedPan}   // 🔒 lock PAN
  onChange={(e) => {
    const value = e.target.value.toUpperCase();
    setForm({ ...form, pan: value });
  }}
/>
              </div>

              <div>
                <label>Upload PAN Card (PDF) *</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    if (validateFile(e.target.files[0], "pdf")) {
                      handleFileChange(e, "panProof");
                    }
                  }}
                />
              </div>

              <div>
                <label>Mobile Number *</label>
                <input
                  name="mobile"
                  value={form.mobile}
                  maxLength="10"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, mobile: value });
                  }}
                />
              </div>

              <div>
                <label>Land Line Number</label>
                <input name="landline" value={form.landline} onChange={handleChange} />
              </div>

              <div>
                <label>License Number by local bodies</label>
                <input
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>License Issued Date</label>
                <input
                  type="date"
                  name="licenseDate"
                  value={form.licenseDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="applicantdetails-section">
            <h3 className="applicantdetails-section-title">Local Address For Communication</h3>

            <div className="applicantdetails-grid-4">
              <div>
                <label>Address Line 1 *</label>
                <input name="address1" value={form.address1} onChange={handleChange} />
              </div>

              <div>
                <label>Address Line 2</label>
                <input name="address2" value={form.address2} onChange={handleChange} />
              </div>

              <div>
                <label>State *</label>
                <select
  name="state"
  value={form.state}
  onChange={(e) => {
    setForm({
      ...form,
      state: e.target.value,
      district: "",
      mandal: "",
      village: "",
    });
  }}
>
  <option value="">Select State</option>
  {states.map((state) => (
    <option key={state.id} value={state.id}>
      {state.state_name}
    </option>
  ))}
</select>

              </div>

              <div>
                <label>District *</label>
                <select
  name="district"
  value={form.district}
  onChange={(e) => {
    setForm({
      ...form,
      district: e.target.value,
      mandal: "",
      village: "",
    });
  }}
  disabled={!form.state}
>
  <option value="">Select District</option>
  {districts.map((district) => (
    <option key={district.id} value={district.id}>
      {district.name}
    </option>
  ))}
</select>

              </div>

              <div>
                <label>Mandal *</label>
                <select
  name="mandal"
  value={form.mandal}
  onChange={(e) => {
    setForm({
      ...form,
      mandal: e.target.value,
      village: "",
    });
  }}
  disabled={!form.district}
>
  <option value="">Select Mandal</option>
  {mandals.map((mandal) => (
    <option key={mandal.id} value={mandal.id}>
      {mandal.name}
    </option>
  ))}
</select>

              </div>

              <div>
                <label>Local Area / Village *</label>
               <select
  name="village"
  value={form.village}
  onChange={handleChange}
  disabled={!form.mandal}
>
  <option value="">Select Village</option>
  {villages.map((village) => (
    <option key={village.id} value={village.id}>
      {village.name}
    </option>
  ))}
</select>

              </div>

              <div>
                <label>PIN Code *</label>
                <input
                  name="pincode"
                  value={form.pincode}
                  maxLength="6"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, pincode: value });
                  }}
                />
              </div>

              <div>
                <label>Upload Address Proof (PDF) *</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    if (validateFile(e.target.files[0], "pdf")) {
                      handleFileChange(e, "addressProof");
                    }
                  }}
                />
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="applicantdetails-section">
            <h3 className="applicantdetails-section-title">Projects Launched In The Past 5 Years</h3>

            <div className="applicantdetails-radio-inline">
              <span>Last five years project details *</span>
              <label>
                <input type="radio" onChange={() => setShowProjects(true)} /> Yes
              </label>
              <label>
                <input
                  type="radio"
                  defaultChecked
                  onChange={() => setShowProjects(false)}
                />{" "}
                No
              </label>
            </div>

            {showProjects && (
              <div className="applicantdetails-grid-4 applicantdetails-conditional-box">
                <div>
                  <label>Project Name *</label>
                  <input />
                </div>
                <div></div>
                <div></div>
                <div>
                  <button className="applicantdetails-add-btn">Add</button>
                </div>
              </div>
            )}
          </section>

          {/* Litigations */}
          <section className="applicantdetails-section">
            <h3 className="applicantdetails-section-title">Litigations</h3>

            <div className="applicantdetails-radio-inline applicantdetails-litigation-row">
              <span>Any Civil/Criminal Cases *</span>

              <label>
                <input
                  type="radio"
                  name="litigation"
                  value="Yes"
                  checked={litigationStatus === "Yes"}
                  onChange={() => setLitigationStatus("Yes")}
                />{" "}
                Yes
              </label>

              <label>
                <input
                  type="radio"
                  name="litigation"
                  value="No"
                  checked={litigationStatus === "No"}
                  onChange={() => setLitigationStatus("No")}
                />{" "}
                No
              </label>

              {litigationStatus === "No" && (
                <div className="applicantdetails-inline-file">
                  <label>Self Declared Affidavit *</label>
                  <input type="file" />
                </div>
              )}
            </div>

            {litigationStatus === "Yes" && (
              <>
                <p style={{ color: "red", marginTop: "10px" }}>
                  Note : In case Petitioner/Respondent are more than one, please provide
                  their names by comma separated.
                </p>

                <div className="applicantdetails-conditional-box applicantdetails-grid-4">
                  <div>
                    <label>Case No *</label>
                    <input />
                  </div>

                  <div>
                    <label>Name & Place of Tribunal/Authority *</label>
                    <input />
                  </div>

                  <div>
                    <label>Name of the Petitioner *</label>
                    <input />
                  </div>

                  <div>
                    <label>Name of the Respondent *</label>
                    <input />
                  </div>

                  <div>
                    <label>Facts of the Case/Contents of the Petitioner *</label>
                    <input />
                  </div>

                  <div>
                    <label>Present Status of the case *</label>
                    <select>
                      <option>Select</option>
                      <option value="Completed">Completed</option>
                      <option value="Delay">Delay</option>
                      <option value="Under Development">Under Development</option>
                    </select>
                  </div>

                  <div>
                    <label>Interim Order if any *</label>
                    <label>
                      <input type="radio" /> Yes
                    </label>
                    <label>
                      <input type="radio" /> No
                    </label>
                  </div>

                  <div>
                    <label>Details of final order if disposed *</label>
                    <label>
                      <input type="radio" /> Yes
                    </label>
                    <label>
                      <input type="radio" /> No
                    </label>
                  </div>

                  <div>
                    <label>Interim Order Certificate *</label>
                    <input type="file" />
                  </div>

                  <div>
                    <label>Disposed Certificate *</label>
                    <input type="file" />
                  </div>

                  <div></div>

                  <div>
                    <button className="applicantdetails-add-btn">Add</button>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Other State */}
          <section className="applicantdetails-section">
            <h3 className="applicantdetails-section-title">Other State/UT RERA Registration Details</h3>

            <div className="applicantdetails-radio-inline">
              <span>Do you have registration in other states *</span>
              <label>
                <input type="radio" onChange={() => setShowOtherState(true)} /> Yes
              </label>
              <label>
                <input
                  type="radio"
                  defaultChecked
                  onChange={() => setShowOtherState(false)}
                />{" "}
                No
              </label>
            </div>

            {showOtherState && (
              <div className="applicantdetails-grid-4 applicantdetails-conditional-box">
                <div>
                  <label>Registration Number *</label>
                  <input />
                </div>
                <div>
                  <label>State / UT *</label>
                  <select>
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label>District *</label>
                  <select>
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <button className="applicantdetails-add-btn">Add</button>
                </div>
              </div>
            )}
          </section>

          <div className="applicantdetails-form-footer-row">
  <button
    type="button"
    className="applicantdetails-applicant-back-btn"
    onClick={() => navigate(-1)}
  >
    ← Back
  </button>

          {/* Save */}

          <div className="applicantdetails-btn-row">
          <button onClick={handleSaveContinue}>
            Save And Continue
          </button>
        </div>
         {/* ================= SUCCESS POPUP ================= */}
        {showSuccessPopup && (
          <div className="applicantdetails-success-modal-overlay">
            <div className="applicantdetails-success-modal">
              <h3>Success</h3>
              <p>Applicant Details Saved Successfully</p>

              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  navigate("/agent-upload-documents", {
                    state: {
                      agentId: localStorage.getItem("agentId"),
                    },
                  });
                }}
              >
                OK
              </button>
            </div>
        </div>
      )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ApplicantDetails;