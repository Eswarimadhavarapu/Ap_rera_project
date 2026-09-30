import React from "react";
import "../styles/TermsConditions.css";
import termsImg from "../../public/assets/images/termes_conditions.jpg";

const TermsConditions = () => {
  return (
    <div className="terms-page">

      {/* Breadcrumb */}
      <div className="terms-breadcrumb">
        <span>You are here :</span>
        <a href="/home"> Home</a>
        <span> / Terms and Conditions</span>
      </div>

      {/* Body Wrapper */}
      <div className="terms-body">

        <h2 className="terms-title animate-title">
          Terms And Conditions
        </h2>

        <div className="terms-underline animated-line"></div>

        <div className="terms-content-row">

          {/* LEFT CONTENT */}
          <div className="terms-text fade-left">
            

            <p>
  This website is designed, developed, and maintained by Jhasina
  Technologies Pvt. Ltd. The website provides digital information and
  technology-enabled services related to the real estate sector. By
  accessing and using this website, you acknowledge and agree to comply
  with the applicable terms and conditions. If you do not agree with
  these terms and conditions, please do not use the website.
</p>

            <p>
  Jhasina Technologies Pvt. Ltd. makes reasonable efforts to ensure that
  the information provided on this website is accurate and up to date.
  However, the information is provided for general informational
  purposes and should not be considered as legal, financial, or
  professional advice. Users are advised to independently verify
  important information with the relevant authorities, developers,
  property owners, or concerned parties before making any
  real-estate-related decisions.
</p>

            <p>
              These terms shall be governed by Indian Laws and disputes shall be
              subject to the jurisdiction of courts of India.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="terms-image fade-right">
            <img src={termsImg} alt="Terms and Conditions" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsConditions;