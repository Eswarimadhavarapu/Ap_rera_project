import React from "react";
import "../../styles/scrutiny/ScrutinyViewFiles.css";
import { useNavigate } from "react-router-dom";

const ScrutinyViewFiles = () => {
  const navigate = useNavigate();

  return (
    <div className="Svff-svf-main">

      <div className="Svff-svf-body">

        <div className="Svff-svf-content">

          {/* Breadcrumb */}
          <p className="Svff-breadcrumb">
  You are here :{" "}
  <span
    style={{ cursor: "pointer", color: "blue" }}
    onClick={() => navigate("/fpms/dashboard")}
  >
    DashBoard
  </span>{" "}
  / View Files
</p>

          {/* Card */}
          <div className="Svff-svf-card">

            <h3>Scrutiny View Files</h3>

            <div className="Svff-svf-form">

              <div className="Svff-row">
                <div className="Svff-field">
                  <label>From Date<span>*</span></label>
                  <input type="date" />
                </div>

                <div className="Svff-field">
                  <label>To Date<span>*</span></label>
                  <input type="date" />
                </div>
              </div>

              <div className="Svff-or">OR</div>

              <div className="Svff-row">
                <div className="Svff-field full">
                  <label>File Number<span>*</span></label>
                  <input type="text" placeholder="File Number" />
                </div>
              </div>

              <div className="Svff-buttons">
                <button className="Svff-btn-blue">Get Details</button>

                <button className="Svff-btn-red">
                  Clear
                </button>
                <button
                  type="button"
                  className="scf-clear"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ScrutinyViewFiles;