import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/otplogin.css";

const DUMMY_OTP = "123456";

const OTPLogin = () => {
  const navigate = useNavigate();

  const [pan, setPan] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGetOtp = () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!panRegex.test(pan)) {
      setShowPopup(true);
      return;
    }

    setOtpSent(true);
    setErrorMsg("");
  };

  const handleVerifyOtp = () => {
    if (otp === DUMMY_OTP) {
      alert("OTP Verified Successfully ✅");

      navigate("/ExtensionProcess", {
        state: { panNumber: pan }
      });
    } else {
      setErrorMsg("Invalid OTP. Please try again.");
    }
  };

  return (
    <>
      <div className="otplogin-page-bg">
        <div className="otplogin-outer-frame">

          <div className="otplogin-otp-container">
            <div className="otplogin-form-group">
              <label>PanCard Number <span className="required">*</span></label>

              <div className="otplogin-pan-row">
                <input
                  type="text"
                  placeholder="PanCard Number"
                  value={pan}
                  maxLength={10}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  disabled={otpSent}
                />

                {!otpSent ? (
                  <button onClick={handleGetOtp}>Get OTP</button>
                ) : (
                  <button>Resend OTP</button>
                )}
              </div>
            </div>

            {otpSent && (
              <>
                <div className="otplogin-form-group">
                  <label>OTP *</label>

                  <div className="otplogin-pan-row">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      maxLength={6}
                      onChange={(e) => setOtp(e.target.value)}
                    />

                    <button onClick={handleVerifyOtp}>
                      Verify OTP
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <p style={{ color: "red" }}>{errorMsg}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="otplogin-popup-overlay">
          <div className="otplogin-popup-box">
            <p>Please enter a valid PAN number</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};

export default OTPLogin;
