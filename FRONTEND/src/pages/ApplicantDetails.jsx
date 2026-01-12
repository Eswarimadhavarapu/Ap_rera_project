import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/ApplicantDetails.css";

const ApplicantDetails = () => {
  const navigate = useNavigate();
  const [litigationStatus, setLitigationStatus] = useState("No");

  /* -------------------- STATE -------------------- */
  const [form, setForm] = useState({
    agentName: "",
    fatherName: "",
    occupation: "",
    email: "",
    aadhaar: "",
    pan: "",
    mobile: "",
    address1: "",
    district: "",
    mandal: "",
    village: "",
  });

  const [showProjects, setShowProjects] = useState(false);
  const [showLitigation, setShowLitigation] = useState(false);
  const [showOtherState, setShowOtherState] = useState(false);
  const [showInterimCert, setShowInterimCert] = useState(false);
  const [showFinalCert, setShowFinalCert] = useState(false);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
  const handleSaveContinue = () => {
    if (!form.agentName) return alert("Please Enter Agent Name");
    if (!form.fatherName) return alert("Please Enter Father Name");
    if (!form.occupation) return alert("Please Select Occupation");
    if (!form.email) return alert("Please Enter Email");
    if (form.aadhaar.length !== 12) return alert("Aadhaar Number must be 12 digits");

    if (!form.pan) return alert("Please Enter PAN Card Number");
    if (!form.mobile) return alert("Please Enter Mobile Number");
    if (!form.address1) return alert("Please Enter Address Line 1");
    if (!form.district) return alert("Please Select District");
    if (!form.mandal) return alert("Please Select Mandal");
    if (!form.village) return alert("Please Select Local Area / Village");

    alert("Agent details saved successfully");
    navigate("/agent-upload-documents");
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="applicationDeta-page-wrapper">
      <div className="applicationDeta-rera-container ">

        {/* Breadcrumb */}
        <div className="applicationDeta-breadcrumb">
          You are here : <span>Home</span> / <span>Registration</span> /{" "}
          <span>Real Estate Agent Registration</span>
        </div>

        <div className="applicationDeta-content-box">
          <h2 className="applicationDeta-page-title">Real Estate Agent Registration</h2>

          {/* Stepper */}
          <div className="applicationDeta-stepper">
            {["Agent Detail", "Upload Documents", "Preview", "Payment", "Acknowledgement"].map(
              (s, i) => (
                <div className="applicationDeta-step" key={i}>
                  <div className={`applicationDeta-circle ${i === 0 ? "applicationDeta-active" : ""}`}>{i + 1}</div>
                  <span>{s}</span>
                </div>
              )
            )}
          </div>

          {/* Applicant Details */}
          <section className="applicationDeta-section">
            <h3 className="applicationDeta-section-title">Applicant Details</h3>

            <div className="applicationDeta-grid-4">
              <div>
                <label>Agent Name *</label>
                <input name="agentName" onChange={handleChange} />
              </div>

              <div>
                <label>Upload Photograph (JPG) *</label>
                <input type="file" onChange={(e) => validateFile(e.target.files[0], "jpg")} />
              </div>

              <div>
                <label>Father's Name *</label>
                <input name="fatherName" onChange={handleChange} />
              </div>

              <div>
                <label>Occupation *</label>
                <select name="occupation" onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Self</option>
                  <option>Business</option>
                </select>
              </div>

              <div>
                <label>Email Id *</label>
                <input type="email" name="email" onChange={handleChange} />
              </div>

              <div>
  <label>Aadhaar Number *</label>
  <input
    name="aadhaar"
    value={form.aadhaar}
    maxLength="12"
    onChange={(e) => {
      // allow only numbers
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
    onChange={(e) => {
      const value = e.target.value.toUpperCase();
      setForm({ ...form, pan: value });
    }}
  />
</div>

              <div>
                <label>Upload PAN Card (PDF) *</label>
                <input type="file" onChange={(e) => validateFile(e.target.files[0], "pdf")} />
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
                <input />
              </div>

              <div>
                <label>License Number by local bodies</label>
                <input />
              </div>

              <div>
                <label>License Issued Date</label>
                <input type="date" />
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="applicationDeta-section">
            <h3 className="applicationDeta-section-title">Local Address For Communication</h3>

            <div className="applicationDeta-grid-4">
              <div>
                <label>Address Line 1 *</label>
                <input name="address1" onChange={handleChange} />
              </div>

              <div>
                <label>Address Line 2</label>
                <input />
              </div>

              <div>
                <label>State *</label>
                <select>
                  <option>Andhra Pradesh</option>
                </select>
              </div>

              <div>
                <label>District *</label>
                <input name="district" onChange={handleChange} />
              </div>

              <div>
                <label>Mandal *</label>
                <input name="mandal" onChange={handleChange} />
              </div>

              <div>
                <label>Local Area / Village *</label>
                <input name="village" onChange={handleChange} />
              </div>

              <div>
                <label>PIN Code *</label>
                <input />
              </div>

              <div>
                <label>Upload Address Proof (PDF) *</label>
                <input type="file" onChange={(e) => validateFile(e.target.files[0], "pdf")} />
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="applicationDeta-section">
            <h3 className="applicationDeta-section-title">Projects Launched In The Past 5 Years</h3>

            <div className="applicationDeta-radio-inline">
              <span>Last five years project details *</span>
              <label><input type="radio" onChange={() => setShowProjects(true)} /> Yes</label>
              <label><input type="radio" defaultChecked onChange={() => setShowProjects(false)} /> No</label>
            </div>

            {showProjects && (
              <div className="applicationDeta-grid-4 applicationDeta-conditional-box">
                <div>
                  <label>Project Name *</label>
                  <input />
                </div>
                <div></div><div></div>
                <div><button className="applicationDeta-add-btn">Add</button></div>
              </div>
            )}
          </section>

          {/* Litigations */}
          <section className="applicationDeta-section">
  <h3 className="applicationDeta-section-title">Litigations</h3>

  <div className="applicationDeta-radio-inline applicationDeta-litigation-row">
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

    {/* ✅ FILE APPEARS NEXT TO NO */}
    {litigationStatus === "No" && (
      <div className="applicationDeta-inline-file">
        <label>Self Declared Affidavit *</label>
        <input type="file" />
      </div>
    )}
  </div>

  {/* ================= WHEN YES ================= */}
  {litigationStatus === "Yes" && (
    <>
      <p style={{ color: "red", marginTop: "10px" }}>
        Note : In case Petitioner/Respondent are more than one, please provide
        their names by comma separated.
      </p>

      <div className="applicationDeta-conditional-box applicationDeta-grid-4">
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
          </select>
        </div>

        <div>
          <label>Interim Order if any *</label>
          <label><input type="radio" /> Yes</label>
          <label><input type="radio" /> No</label>
        </div>

        <div>
          <label>Details of final order if disposed *</label>
          <label><input type="radio" /> Yes</label>
          <label><input type="radio" /> No</label>
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
          <button className="applicationDeta-add-btn">Add</button>
        </div>
      </div>
    </>
  )}
</section>


          {/* Other State */}
          <section className="applicationDeta-section">
            <h3 className="applicationDeta-section-title">Other State/UT RERA Registration Details</h3>

            <div className="applicationDeta-radio-inline">
              <span>Do you have registration in other states *</span>
              <label><input type="radio" onChange={() => setShowOtherState(true)} /> Yes</label>
              <label><input type="radio" defaultChecked onChange={() => setShowOtherState(false)} /> No</label>
            </div>

            {showOtherState && (
              <div className="applicationDeta-grid-4 applicationDeta-conditional-box">
                <div><label>Registration Number *</label><input /></div>
                <div><label>State / UT *</label><select><option>Select</option></select></div>
                <div><label>District *</label><select><option>Select</option></select></div>
                <div><button className="applicationDeta-add-btn">Add</button></div>
              </div>
            )}
          </section>

          {/* Save */}
          <div className="applicationDeta-btn-row">
            <button onClick={handleSaveContinue}>Save And Continue</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;