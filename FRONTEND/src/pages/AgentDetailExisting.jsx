import { useState } from "react";
import { apiPost } from "../api/api";
import "../styles/agentDetail.css";
import { useNavigate } from "react-router-dom";

const steps = [
  "Agent Detail",
  "Upload Documents",
  "Preview",
  "Payment",
  "Acknowledgement",
];

const AgentDetailExisting = () => {
  const [pan, setPan] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* SEND OTP */
  const handleGetOtp = async () => {
    if (pan.length !== 10) {
      alert("Please enter valid PAN number");
      return;
    }

    try {
      setLoading(true);

      await apiPost("api/otp/send-email", {
        panNumber: pan,
      });

      setOtpSent(true);
      alert("OTP sent to registered email");
    } catch (error) {
      alert(
        error?.error ||
        error?.message ||
        "PAN not registered or OTP not sent"
      );
    } finally {
      setLoading(false);
    }
  };

  /* VERIFY OTP */
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
          const res = await apiPost("api/otp/verify", {
      panNumber: pan,
      otp,
    });
     // ✅ SAVE PAN FOR DASHBOARD
    sessionStorage.setItem("agent_pan", pan);

    // ✅ redirect
    navigate("/agent-dashboard");
    // ✅ SAVE PAN FOR DASHBOARD
    sessionStorage.setItem("agent_pan", pan);
    } catch (error) {
      alert(
        error?.error ||
        error?.message ||
        "Invalid or expired OTP"
      );
    }
  };

  return (
    <div className="agent-registration-page">
      <div className="outer-box">

        <div className="breadcrumb-box">
          You are here :
          <span className="crumb-link"> Home </span> /
          <span> Registration </span> /
          <span> Real Estate Agent Registration</span>
        </div>

        <h2 className="page-title">Real Estate Agent Registration</h2>

        <div className="stepper-box">
          <div className="stepper-line"></div>
          {steps.map((step, index) => (
            <div className="stepper-item" key={index}>
              <div className={`stepper-circle ${index === 0 ? "active" : ""}`}>
                {index + 1}
              </div>
              <div className="stepper-text">{step}</div>
            </div>
          ))}
        </div>

        <div className="form-box">
          <div className="pan-wrapper">

            <div className="pan-input-group">
              <label>
                PanCard Number <span className="required">*</span>
              </label>
              <input
                type="text"
                value={pan}
                maxLength={10}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="PanCard Number"
              />
            </div>

            <button className="btn-primary" onClick={handleGetOtp}>
              {otpSent ? "Resend OTP" : "Get OTP"}
            </button>
          </div>

          {otpSent && (
            <div className="pan-wrapper">
              <div className="pan-input-group">
                <label>
                  OTP <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
              </div>

              <button className="btn-primary" onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AgentDetailExisting;