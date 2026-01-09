import "../styles/guidelinesRegistration.css";
import { FaDownload, FaFileAlt, FaSearch } from "react-icons/fa";

export default function GuidelinesForRegistration() {
  return (
    <div className="rera-guidelines-page">

      {/* Breadcrumb */}
      <div className="breadcrumb">
        You are here :&nbsp;
        <a href="/">Home</a> /&nbsp;
        <a href="/registration">Registration</a> /&nbsp;
        <strong>Guidelines for Registration</strong>
      </div>

      {/* Main Container */}
      <div className="guidelines-container">

        {/* Info Bar */}
        <div className="blue-bar">
          Download the forms for Project/Agent/Complaint Registration from the link given below.
        </div>

        {/* STEP 1 */}
        <div className="step step-red">
          <div className="step-arrow">
            <div className="step-number">
              <small>STEP</small>
              <strong>1</strong>
            </div>
          </div>

          <div className="step-content">
            <div className="main-text">
              Application form for Project/Agent/Complaint Registration
              <a href="#" className="click-here">Click Here</a>
            </div>

            <div className="note">
              <strong>NOTE :</strong> The documents and Drawings must be self-attested and in
              PDF Format (70MB), Photo in JPEG Format (35mm×45mm, 300DPI,
              straight view/light background)
            </div>
          </div>

          <div className="step-icon red-icon">
            <FaDownload className="download-icon" />
          </div>
        </div>

        {/* STEP 2 */}
        <div className="step step-orange">
          <div className="step-arrow">
            <div className="step-number">
              <small>STEP</small>
              <strong>2</strong>
            </div>
          </div>

          <div className="step-content">
            Fill the required application form (printable/digital). It would be
            more useful during the submission for online application.
          </div>

          <div className="step-icon orange-icon">
            <FaFileAlt className="doc-icon" />
          </div>
        </div>

        {/* STEP 3 */}
        <div className="step step-blue">
          <div className="step-arrow">
            <div className="step-number">
              <small>STEP</small>
              <strong>3</strong>
            </div>
          </div>

          <div className="step-content">
            For better understanding of registration screens verify the below
            user manuals and video tutorials.

            <ul className="manual-list">
              <li>
                ► User manuals for Project/Agent/Complaint Registration
                <a href="#" className="click-here">Click Here</a>
              </li>
              <li>
                ► Video tutorials
                <a href="#" className="click-here">Click Here</a>
              </li>
            </ul>
          </div>

          <div className="step-icon blue-icon">
            <FaSearch className="search-icon" />
          </div>
        </div>

      </div>
    </div>
  );
}