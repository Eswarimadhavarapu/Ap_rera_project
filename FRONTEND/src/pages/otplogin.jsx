import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/otplogin.css";

const DUMMY_OTP = "123456";

const OTPLogin = () => {
  const navigate = useNavigate(); // ✅ IMPORTANT

  
  const [pan, setPan] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* SEND OTP */
  const handleGetOtp = () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!panRegex.test(pan)) {
      setShowPopup(true);
      return;
    }

    setOtpSent(true);
    setErrorMsg("");
  };

  /* VERIFY OTP */
  const handleVerifyOtp = () => {
    if (otp === DUMMY_OTP) {
      alert("OTP Verified Successfully ✅");

      // ✅ OK click ayyaka idhe execute avtundi
      navigate("/ExtensionProcess");
    } else {
      setErrorMsg("Invalid OTP. Please try again.");
    }
  };

  return (
    <>
      <div className="otplogin-page-bg">
        <div className="otplogin-outer-frame">

          {/* BREADCRUMB */}
          <div className="otplogin-breadcrumb-bar">
            <div className="otplogin-breadcrumb-inner">
              You are here :
              <a href="/" className="otplogin-bc-link"> Home</a> /
              <span className="otplogin-bc-text"> Registration</span> /
              <span className="otplogin-bc-text"> Project Registration</span> /
              <span className="otplogin-bc-active"> Extension</span>
            </div>
          </div>

          {/* CONTENT */}
          <div className="otplogin-otp-container">

            {/* USER NAME */}
            

            {/* PAN */}
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
                  <button className="otplogin-otp-btn" onClick={handleGetOtp}>
                    Get OTP
                  </button>
                ) : (
                  <button className="otplogin-otp-btn">Resend OTP</button>
                )}
              </div>
            </div>

            {/* OTP SECTION */}
            {otpSent && (
              <>
                <div className="otplogin-form-group">
                  <label>
                    OTP (One Time Password)
                    <span className="otplogin-required">*</span>
                  </label>

                  <div className="otplogin-pan-row">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      maxLength={6}
                      onChange={(e) => setOtp(e.target.value)}
                    />

                    <button className="otplogin-otp-btn" onClick={handleVerifyOtp}>
                      Verify OTP
                    </button>
                  </div>
                </div>

                <p className="otplogin-otp-info">
                  The OTP has been sent to <b>XXXXXX 6044</b>
                </p>

                {errorMsg && (
                  <p style={{ color: "red", textAlign: "center" }}>
                    {errorMsg}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* INVALID PAN POPUP */}
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