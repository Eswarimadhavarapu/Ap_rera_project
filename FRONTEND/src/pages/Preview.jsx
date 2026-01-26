import "../styles/preview.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api/api";

const Preview = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  /* ================= LOAD PREVIEW ================= */
  useEffect(() => {
    const agentId = localStorage.getItem("agentId");

    if (!agentId) {
      setError("Agent ID missing. Please start registration again.");
      setLoading(false);
      return;
    }

    apiGet(`/api/agent/preview/${agentId}`)
      .then((res) => {
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || "Failed to load preview");
        }
      })
      .catch(() => {
        setError("Error fetching preview details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    try {
      const res = await apiPost("/api/agent/send-otp", {
        agent_id: data.agent_id,
      });

      if (res.success) {
        alert("OTP sent to registered mobile number");
        setOtpSent(true);
      } else {
        alert(res.message || "Failed to send OTP");
      }
    } catch {
      alert("OTP service error");
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    setVerifying(true);

    try {
      const res = await apiPost("/api/agent/verify-otp", {
        agent_id: data.agent_id,
        otp,
      });

      if (res.success) {
        alert("OTP verified successfully");
        setOtpVerified(true);
      } else {
        alert(res.message || "Invalid OTP");
      }
    } catch {
      alert("OTP verification failed");
    }

    setVerifying(false);
  };

  if (loading) return <div className="loading">Loading preview...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="agentpreview-main-container">
      {/* BREADCRUMB */}
      <div className="agentpreview-breadcrumb-bar">
        You are here :
        <span> Home </span> /
        <span> Registration </span> /
        <span className="agentpreview-active"> Real Estate Agent Registration</span>
      </div>

      <div className="agentpreview-content-padding">
        <h2 className="agentpreview-page-title">Real Estate Agent Registration</h2>

        {/* ================= APPLICANT DETAILS ================= */}
        <h3 className="agentpreview-section-title">Applicant Details</h3>

        <div className="agentpreview-preview-grid">
          <div className="agentpreview-preview-label">Agent Name</div>
          <div className="agentpreview-preview-value">{data.agent_name}</div>

          <div className="agentpreview-preview-label">Father's Name</div>
          <div className="agentpreview-preview-value">{data.father_name}</div>

          <div className="agentpreview-preview-label">Occupation</div>
          <div className="agentpreview-preview-value">{data.occupation_name}</div>

          <div className="agentpreview-preview-label">Email Id</div>
          <div className="agentpreview-preview-value">{data.email}</div>

          <div className="agentpreview-preview-label">Aadhaar Number</div>
          <div className="agentpreview-preview-value">{data.aadhaar}</div>

          <div className="agentpreview-preview-label">PAN Card Number</div>
          <div className="agentpreview-preview-value">{data.pan}</div>

          <div className="agentpreview-preview-label">Mobile Number</div>
          <div className="agentpreview-preview-value">{data.mobile}</div>

          <div className="agentpreview-preview-label">Address</div>
          <div className="agentpreview-preview-value">
            {data.address1}, {data.address2}
          </div>
        </div>

        {/* ================= DOCUMENT DETAILS ================= */}
        <h3 className="agentpreview-section-title">Uploaded Documents</h3>

        <table className="agentpreview-doc-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>ITR Year 1</th>
              <th>ITR Year 2</th>
              <th>ITR Year 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{data.itr_year1?.original_name}</td>
              <td>{data.itr_year2?.original_name}</td>
              <td>{data.itr_year3?.original_name}</td>
            </tr>
          </tbody>
        </table>

        {/* ================= DECLARATION ================= */}
        <h3 className="agentpreview-section-title">Declaration</h3>

<div className="agentpreview-declaration-center">
  <p className="agentpreview-declaration-text">
    I / We <b>{data.agent_name}</b> solemnly affirm and declare that the
    particulars given above are true and correct to the best of my knowledge
    and belief.
  </p>

  <div className="agentpreview-otp-center-box">
    <label className="agentpreview-otp-label">Mobile Number *</label>
   

    <div className="agentpreview-otp-row">
      <input
        type="text"
        value={data.mobile}
        readOnly
      />

      <button onClick={sendOtp}>
        {otpSent ? "Resend OTP" : "Get OTP"}
      </button>
    </div>

    {otpSent && (
      <div className="agentpreview-otp-row">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={verifyOtp}>
          Verify OTP
        </button>
      </div>
    )}
  </div>
</div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="agentpreview-form-footer-row">
          <button
            type="button"
            className="agentpreview-applicant-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="agentpreview-action-buttons agentpreview-space-top">
            <button className="agentpreview-submit-btn" onClick={() => window.print()}>
              Print
            </button>

            <button
  className="agentpreview-submit-btn agentpreview-primary"
  onClick={async () => {
    const agentId = localStorage.getItem("agentId");

    await apiPost(`/api/agent/create-payment/${agentId}`);
    navigate("/agent-payment");
  }}
>
  Proceed for Payment
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;