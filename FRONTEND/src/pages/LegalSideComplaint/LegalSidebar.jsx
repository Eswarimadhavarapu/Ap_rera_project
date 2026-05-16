import React from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  FileText,
  Scale,
  CheckCircle,
  XCircle,
} from "lucide-react";

import "../../styles/legal.css";

const LegalSidebar = () => {

  const navigate = useNavigate();

  return (

    <div className="legal-sidebar">

      {/* TITLE */}

      <div className="legal-sidebar-title">

        <h1>
          LEGAL
          <br />
          DASHBOARD
        </h1>

      </div>

      <hr className="legal-sidebar-divider" />

      {/* MENUS */}

      <div className="legal-sidebar-menu">

        {/* Dashboard */}

        <div
          className="legal-menu-item"
          onClick={() =>
            navigate("/legaldashboard")
          }
        >
          <LayoutDashboard size={26} />

          <span>
            Dashboard
          </span>
        </div>

        {/* Complaints */}

        <div
          className="legal-menu-item"
          onClick={() =>
            navigate("/legalcomplaintlist")
          }
        >
          <FileText size={26} />

          <span>
            Complaints
          </span>
        </div>

        {/* Hearings */}

        {/* Hearings */}

<div
  className="legal-menu-item"
  onClick={() =>
    navigate("/hearings")
  }
>

  <Scale size={26} />

  <span>
    Hearings
  </span>

</div>

        {/* Approved */}

        <div className="legal-menu-item">

          <CheckCircle size={26} />

          <span>
            Approved
          </span>

        </div>

        {/* Rejected */}

        <div className="legal-menu-item">

          <XCircle size={26} />

          <span>
            Rejected
          </span>

        </div>

      </div>

    </div>
  );
};

export default LegalSidebar;