import React, { useEffect, useState } from "react";
import "../../styles/RTI/RtiUserLogin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RtiUserLogin = () => {

  const navigate = useNavigate();

  

  // EMAIL & MOBILE STATES
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  // OTP STATE
  const [otp, setOtp] = useState("");

  // LOADING
  const [loading, setLoading] = useState(false);

  // VALIDATION ERRORS
  const [errors, setErrors] = useState({});

  // LOGIN CAPTCHA
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");

  // OTP CAPTCHA
  const [otpCaptcha, setOtpCaptcha] = useState("");
  const [otpUserCaptcha, setOtpUserCaptcha] = useState("");

  // SHOW OTP SECTION
  const [showOtpSection, setShowOtpSection] = useState(false);

  // OTP SUCCESS POPUP
  const [showOtpSuccessPopup, setShowOtpSuccessPopup] =
    useState(false);

  // LOGIN SUCCESS POPUP
  const [showSuccessPopup, setShowSuccessPopup] =
    useState(false);

  // EMAIL VALIDATION
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // MOBILE VALIDATION
  const validateMobile = (mobile) => {
    return /^[6-9]\d{9}$/.test(mobile);
  };

  // GENERATE CAPTCHA
  const generateCaptcha = () => {

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let cap = "";

    for (let i = 0; i < 6; i++) {
      cap += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }

    setCaptcha(cap);
  };

  // GENERATE OTP CAPTCHA
  const generateOtpCaptcha = () => {

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let cap = "";

    for (let i = 0; i < 6; i++) {
      cap += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }

    setOtpCaptcha(cap);
  };

  useEffect(() => {
    generateCaptcha();
    generateOtpCaptcha();
  }, []);

  // LOGIN SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    let validationErrors = {};

    // EMAIL CHECK
    if (!email.trim()) {
      validationErrors.email =
        "Email is required";
    } else if (!validateEmail(email)) {
      validationErrors.email =
        "Invalid email format";
    }

    // MOBILE CHECK
    if (!mobile.trim()) {
      validationErrors.mobile =
        "Mobile number is required";
    } else if (!validateMobile(mobile)) {
      validationErrors.mobile =
        "Mobile number must be 10 digits";
    }

    // CAPTCHA CHECK
    if (userCaptcha.trim() !== captcha.trim()) {
      validationErrors.captcha =
        "Invalid Login Captcha";
    }

    // SHOW ERRORS
    if (
      Object.keys(validationErrors).length > 0
    ) {

      setErrors(validationErrors);

      if (validationErrors.captcha) {
        setUserCaptcha("");
        generateCaptcha();
      }

      return;
    }

    setErrors({});

    try {

      setLoading(true);

      // SEND EMAIL OTP API
      const response = await axios.post(
        "https://n7vxv3pg-8081.inc1.devtunnels.ms/api/rti/send-email-otp",
        {
          email,
          mobile,
        }
      );

      console.log(response.data);

      setShowOtpSuccessPopup(true);

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Failed to send OTP"
      );

    } finally {

      setLoading(false);

    }
  };

  // OTP POPUP OK
  const handleOtpPopupOk = () => {

    setShowOtpSuccessPopup(false);

    setShowOtpSection(true);

  };

  // LOGIN RESET
  const handleReset = () => {

    setEmail("");
    setMobile("");
    setOtp("");

    setUserCaptcha("");
    setOtpUserCaptcha("");

    setErrors({});

    setShowOtpSection(false);

    generateCaptcha();
    generateOtpCaptcha();
  };

  // OTP SUBMIT
  const handleOtpSubmit = async () => {

    // CAPTCHA CHECK
    if (
      otpUserCaptcha.trim() !==
      otpCaptcha.trim()
    ) {

      alert("Invalid OTP Captcha");

      setOtpUserCaptcha("");

      generateOtpCaptcha();

      return;
    }

    // OTP CHECK
    if (otp.length !== 6) {

      alert(
        "Please enter valid 6-digit OTP"
      );

      return;
    }

    try {

      setLoading(true);

      // VERIFY OTP API
      const response = await axios.post(
        "https://n7vxv3pg-8081.inc1.devtunnels.ms/api/rti/verify-email-otp",
        {
          email,
          otp,
        }
      );

      console.log(response.data);

      setShowSuccessPopup(true);

      setTimeout(() => {

        navigate("/RtireqForm", {
          state: {
            email,
            mobile,
          },
        });

      }, 2000);

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Invalid OTP"
      );

    } finally {

      setLoading(false);

    }
  };

  // OTP RESET
  const handleOtpReset = () => {

    setOtp("");

    setOtpUserCaptcha("");

    generateOtpCaptcha();
  };

  // OTP RESEND
  const handleResend = async () => {

    try {

      setLoading(true);

      const response = await axios.post(
        "https://n7vxv3pg-8081.inc1.devtunnels.ms/api/rti/send-email-otp",
        {
          email,
          mobile,
        }
      );

      console.log(response.data);

      alert("OTP Resent Successfully");

      setOtp("");

      generateOtpCaptcha();

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Failed to resend OTP"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="rtilog-container">

      {/* LOGIN SECTION */}
      {!showOtpSection && (

        <div className="rtilog-form-box">

          <h2 className="rtilog-title">
            RTI Request Form
          </h2>

          {/* EMAIL */}
          <div className="rtilog-form-group">

            <label>Email Id :</label>

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            {errors.email && (
              <p className="error-text">
                {errors.email}
              </p>
            )}

          </div>

          {/* MOBILE */}
          <div className="rtilog-form-group">

            <label>Mobile Number :</label>

            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={mobile}
              maxLength={10}
              onChange={(e) =>
                setMobile(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />

            {errors.mobile && (
              <p className="error-text">
                {errors.mobile}
              </p>
            )}

          </div>

          {/* CAPTCHA */}
          <div className="rtilog-captcha-box">

            <div className="rtilog-captcha-text">
              {captcha}
            </div>

            <input
              type="text"
              placeholder="Enter Captcha"
              value={userCaptcha}
              onChange={(e) =>
                setUserCaptcha(e.target.value)
              }
            />

          </div>

          {errors.captcha && (
            <p className="error-text">
              {errors.captcha}
            </p>
          )}

          {/* BUTTONS */}
          <div className="rtilog-button-group">

            <button
              className="rtilog-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Submit"}
            </button>

            <button
              className="rtilog-reset-btn"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>

          </div>

        </div>
      )}

      {/* OTP SECTION */}
      {showOtpSection && (

        <div className="rtilog-form-box rtilog-otp-section">

          <h2 className="rtilog-title">
            OTP Verification
          </h2>

          {/* OTP */}
          <div className="rtilog-form-group">

            <label>OTP :</label>

            <input
              type="text"
              placeholder="Enter 6 Digit OTP"
              value={otp}
              maxLength={6}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />

          </div>

          {/* OTP CAPTCHA */}
          <div className="rtilog-captcha-box">

            <div className="rtilog-captcha-text">
              {otpCaptcha}
            </div>

            <input
              type="text"
              placeholder="Enter Captcha"
              value={otpUserCaptcha}
              onChange={(e) =>
                setOtpUserCaptcha(
                  e.target.value
                )
              }
            />

          </div>

          {/* BUTTONS */}
          <div className="rtilog-button-group">

            <button
              className="rtilog-submit-btn"
              onClick={handleOtpSubmit}
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Submit"}
            </button>

            <button
              className="rtilog-submit-btn"
              onClick={handleResend}
              disabled={loading}
            >
              Resend
            </button>

            <button
              className="rtilog-reset-btn"
              onClick={handleOtpReset}
              disabled={loading}
            >
              Reset
            </button>

          </div>

        </div>
      )}

      {/* OTP SUCCESS POPUP */}
      {showOtpSuccessPopup && (

        <div className="rtilog-success-overlay">

          <div className="rtilog-success-popup">

            <div className="rtilog-success-icon">
              ✓
            </div>

            <h2 className="rtilog-success-title">
              Success
            </h2>

            <p className="rtilog-success-message">
              OTP sent successfully to your
              registered email and mobile number.
            </p>

            <button
              className="rtilog-success-btn"
              onClick={handleOtpPopupOk}
            >
              OK
            </button>

          </div>

        </div>
      )}

      {/* LOGIN SUCCESS POPUP */}
      {showSuccessPopup && (

        <div className="rtilog-success-overlay">

          <div className="rtilog-success-popup">

            <div className="rtilog-success-icon">
              ✓
            </div>

            <h2 className="rtilog-success-title">
              Success
            </h2>

            <p className="rtilog-success-message">
              OTP verified successfully.
              <br />
              Redirecting to RTI Request Form...
            </p>

          </div>

        </div>
      )}

    </div>
  );
};

export default RtiUserLogin;