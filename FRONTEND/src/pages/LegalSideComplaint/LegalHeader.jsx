import React from "react";

import "../../styles/legal.css";

const LegalHeader = () => {

  return (

    <div className="legal-header">

      {/* LOGO */}

      <img
        src="/logo.png"
        alt="logo"
        className="legal-header-logo"
      />

      {/* TITLE */}

      <div>

        <h2 className="legal-header-title">
          ANDHRA PRADESH
        </h2>

        <h2 className="legal-header-title">
          LEGAL COMPLAINT MANAGEMENT
        </h2>

      </div>

    </div>
  );
};

export default LegalHeader;