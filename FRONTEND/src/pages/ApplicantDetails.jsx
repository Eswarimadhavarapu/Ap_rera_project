import { useNavigate } from "react-router-dom";
import "../styles/ApplicantDetails.css";

const ApplicantDetails = () => {
  const navigate = useNavigate();

  const handleSaveContinue = () => {
    // later you can add validation here
    navigate("/upload-documents");
  };

  return (
    <div className="page-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        You are here : <span>Home</span> / <span>Registration</span> /{" "}
        <span>Real Estate Agent Registration</span>
      </div>

      {/* Main Container */}
      <div className="content-box">
        <h2 className="page-title">Real Estate Agent Registration</h2>

        {/* Stepper */}
        <div className="stepper">
          {[
            "Agent Detail",
            "Upload Documents",
            "Preview",
            "Payment",
            "Acknowledgement",
          ].map((s, i) => (
            <div className="step" key={i}>
              <div className={`circle ${i === 0 ? "active" : ""}`}>
                {i + 1}
              </div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        {/* Agent Type */}
        <section className="section">
          <h3 className="section-title">Agent Type</h3>
          <div className="radio-row">
            <label>
              <input type="radio" name="agentType" defaultChecked /> Individual
            </label>
            <label>
              <input type="radio" name="agentType" /> Other than Individual
            </label>
          </div>
        </section>

        {/* Applicant Details */}
        <section className="section">
          <h3 className="section-title">Applicant Details</h3>

          <div className="grid-4">
            <div>
              <label>Agent Name *</label>
              <input type="text" />
            </div>

            <div>
              <label>Upload Photograph *</label>
              <input type="file" />
            </div>

            <div>
              <label>Father's Name *</label>
              <input type="text" />
            </div>

            <div>
              <label>Occupation *</label>
              <select>
                <option>Self</option>
                <option>Business</option>
              </select>
            </div>

            <div>
              <label>Email Id *</label>
              <input type="email" />
            </div>

            <div>
              <label>Aadhaar Number *</label>
              <input type="text" />
            </div>

            <div>
              <label>PAN Card Number *</label>
              <input type="text" />
            </div>

            <div>
              <label>Upload PAN Card *</label>
              <input type="file" />
            </div>

            <div>
              <label>Mobile Number *</label>
              <input type="text" />
            </div>

            <div>
              <label>Land Line Number</label>
              <input type="text" />
            </div>

            <div>
              <label>License Number by local bodies</label>
              <input type="text" />
            </div>

            <div>
              <label>License Issued Date</label>
              <input type="date" />
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="section">
          <h3 className="section-title">Local Address For Communication</h3>

          <div className="grid-4">
            <div>
              <label>Address Line 1 *</label>
              <input type="text" />
            </div>

            <div>
              <label>Address Line 2</label>
              <input type="text" />
            </div>

            <div>
              <label>State *</label>
              <select>
                <option>Andhra Pradesh</option>
              </select>
            </div>

            <div>
              <label>District *</label>
              <select>
                <option>Select</option>
              </select>
            </div>

            <div>
              <label>Mandal *</label>
              <select>
                <option>Select</option>
              </select>
            </div>

            <div>
              <label>Local Area / Village *</label>
              <select>
                <option>Select</option>
              </select>
            </div>

            <div>
              <label>PIN Code *</label>
              <input type="text" />
            </div>

            <div>
              <label>Upload Address Proof *</label>
              <input type="file" />
            </div>
          </div>
        </section>

        {/* Other Sections */}
         <section className="section">
  <h3 className="section-title">Projects Launched In The Past 5 Years</h3>

  <div className="radio-inline">
    <span>Last five years project details *</span>

    <label>
      <input type="radio" name="proj" /> Yes
    </label>

    <label>
      <input type="radio" name="proj" defaultChecked /> No
    </label>
  </div>
</section>

<section className="section">
  <h3 className="section-title">Litigations</h3>

  <div className="radio-inline">
    <span>Any Civil/Criminal Cases *</span>

    <label>
      <input type="radio" name="lit" /> Yes
    </label>

    <label>
      <input type="radio" name="lit" defaultChecked /> No
    </label>
  </div>
</section>


        <section className="section">
  <h3 className="section-title">Other State/UT RERA Registration Details</h3>

  <div className="radio-inline">
    <span>Do you have registration in other states *</span>

    <label className="radio-option">
      <input type="radio" name="other" /> Yes
    </label>

    <label className="radio-option">
      <input type="radio" name="other" defaultChecked /> No
    </label>
  </div>
</section>

        {/* Save Button */}
        <div className="btn-row">
          <button onClick={handleSaveContinue}>Save And Continue</button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;