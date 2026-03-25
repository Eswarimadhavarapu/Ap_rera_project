import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";
import OfficeorderPdf from "../../public/assets/pdfs/Officeorder.pdf";
import CAUSELISTPdf from "../../public/assets/pdfs/CAuselist.pdf";
import appealPdf from "../../public/assets/pdfs/AppealToBuyer.pdf";
import legalpdf from "../../public/assets/pdfs/LEGAL_APRERA_CORPORATE_PRESENTATION.pdf";
import Logo from "../../public/assets/images/logo.jpg";
import GoogleTranslate from "./GoogleTranslate";

const Navbar = () => {
  const navigate = useNavigate();
  const handleDropdownPosition = (e) => {
    const dropdown = e.currentTarget.querySelector(".agent-nav-dropdown-menu");
    const rect = e.currentTarget.getBoundingClientRect();

    const dropdownWidth = dropdown.offsetWidth;
    const viewportWidth = window.innerWidth;

    let leftPosition = rect.left;

    // If dropdown goes outside right screen edge, shift it left
    if (rect.left + dropdownWidth > viewportWidth) {
      leftPosition = viewportWidth - dropdownWidth - 10;
    }

    dropdown.style.top = rect.bottom - 5 + "px";
    dropdown.style.left = leftPosition + "px";
  };

  return (
    <>
      {/* Top Header */}
      <div className="agent-nav-top-header">
        <div className="agent-nav-header-center">
          <p className="agent-nav-header-title">
            <img src={Logo} alt="APRERA Logo" className="agent-nav-header-logo" />
            ANDHRA PRADESH REAL ESTATE REGULATORY AUTHORITY
          </p>
        </div>

        <div className="agent-nav-top-header-right">
          <GoogleTranslate />
          <button className="agent-nav-search-btn">SEARCH RERA PROJECTS</button>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="agent-nav-navbar">
        <div className="agent-nav-navbar-scroll">
          <div className="agent-nav-navbar-inner">
            <ul className="agent-nav-nav-list">

              <li onClick={() => navigate("/admin-login")}>
                ADMIN LOGIN
              </li>

              <li onClick={() => navigate("/")}>
                HOME
              </li>

              {/* ABOUT US */}
              <li className="agent-nav-dropdown" onMouseEnter={handleDropdownPosition}>
                ABOUT US <span className="agent-nav-arrow">▾</span>
                <ul className="agent-nav-dropdown-menu">
                  <li onClick={() => navigate("/organogram")}>
                    Organisation Structure
                  </li>

                  <li onClick={() => navigate("/ourservices")}>
                    Our Services
                  </li>

                  <li onClick={() => navigate("/recruitment")}>
                    Recruitment
                  </li>

                  <li onClick={() => navigate("/rti")}>
                    RTI
                  </li>

                  <li onClick={() => navigate("/our-leadership")}>
                    Our Leadership
                  </li>

                  <li className="agent-nav-contact-submenu">
                    <span className="agent-nav-contact-title">
                      Contact Us <span className="agent-nav-right-arrow">▶</span>
                    </span>

                    <ul className="agent-nav-contact-submenu-box">
                      <li onClick={() => navigate("/contact-us/aprera")}>
                        APRERA
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              {/* NOTIFICATIONS */}
              <li className="agent-nav-dropdown">
                NOTIFICATIONS <span className="arrow">▾</span>

                <ul className="agent-nav-dropdown-menu">

                  <li onClick={() => navigate("/goinotifications")}>
                    GOI Notifications
                  </li>

                  <li onClick={() => navigate("/goapnotifications")}>
                    GOAP Notifications
                  </li>

                  <li onClick={() => navigate("/authoritynotifications")}>
                    Authority Notifications
                  </li>

                  <li onClick={() => navigate("/cidcandaprerajoint")}>
                    CIDC and APRERA Joint Notifications
                  </li>

                  <li>
                    <a
                      href={CAUSELISTPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Complaints: Cause List Motion Hearing Before Adjudicating Officer
                    </a>
                  </li>

                  <li>
                    <a
                      href={OfficeorderPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Office Order
                    </a>
                  </li>

                </ul>
              </li>

              {/* REGISTRATION */}
              <li className="agent-nav-dropdown" onMouseEnter={handleDropdownPosition}>
                REGISTRATION <span className="arrow">▾</span>

                <ul className="agent-nav-dropdown-menu">

                  <li onClick={() => navigate("/promotregistration")}>
                    Promoter Registration
                  </li>

                  <li onClick={() => navigate("/guidelinesRegistration")}>
                    Guidelines for Registration
                  </li>

                  <li onClick={() => navigate("/feecalculater")}>
                    Fee Calculator
                  </li>

                  <li onClick={() => navigate("/usermanual")}>
                    User Manuals
                  </li>

                  <li onClick={() => navigate("/formsdownload")}>
                    Forms Download
                  </li>

                  <li onClick={() => navigate("/videoTutorial")}>
                    Video Tutorials
                  </li>

                  <li onClick={() => navigate("/mobileapp")}>
                    Mobile App
                  </li>

                </ul>
              </li>

              {/* REPORTS */}
              <li
                className="agent-nav-dropdown agent-nav-reports-dropdown"
                onMouseEnter={handleDropdownPosition}
              >
                REPORTS <span className="agent-nav-arrow">▾</span>

                <ul className="agent-nav-dropdown-menu" >
                  <li onClick={() => navigate("/misReports")}>MIS reports</li>
                  <li onClick={() => navigate("/GisReports")}>GIS reports</li>
                </ul>
              </li>

              {/* REGISTERED */}
              <li className="agent-nav-dropdown" onMouseEnter={handleDropdownPosition}>
                REGISTERED <span className="arrow">▾</span>

                <ul className="agent-nav-dropdown-menu">
                  <li onClick={() => navigate("/registered/projects")}>
                    Projects
                  </li>

                  <li onClick={() => navigate("/agents")}>
                    Agents
                  </li>
                </ul>
              </li>

              {/* JUDGEMENTS */}
              <li className="agent-nav-dropdown" onMouseEnter={handleDropdownPosition}>
                JUDGEMENTS/ORDERS <span className="arrow">▾</span>

                <ul className="agent-nav-dropdown-menu">
                  <li
                    onClick={() =>
                      window.open(
                        window.location.origin + "/statistics",
                        "_blank"
                      )
                    }
                  >
                    Statistics
                  </li>
                </ul>
              </li>

              {/* KNOWLEDGE HUB */}
              <li className="agent-nav-dropdown" onMouseEnter={handleDropdownPosition}>
                KNOWLEDGE HUB <span className="agent-nav-arrow">▾</span>

                <ul className="agent-nav-dropdown-menu">

                  <li onClick={() => navigate("/evolutionofrera")}>
                    Evolution of RERA
                  </li>

                  <li onClick={() => navigate("/race")}>
                    RACE
                  </li>

                  <li onClick={() => navigate("/taskvstime")}>
                    Task Vs Time
                  </li>

                  <li onClick={() => navigate("/ChronologyOfEvents")}>
                    Chronology of Events
                  </li>

                  <li onClick={() => window.open(legalpdf, "_blank")}>
                    APRERA Presentation
                  </li>

                  <li onClick={() => navigate("/JudgementHub")}>
                    Judgement
                  </li>

                  <li onClick={() => navigate("/vendordatabase")}>
                    VendorDatabase
                  </li>

                  <li onClick={() => navigate("/AdvertisementGuidelines")}>
                    Advertisement Guidelines
                  </li>

                  <li onClick={() => navigate("/audiovisualgallery")}>
                    AudioVisualGallery
                  </li>

                  <li onClick={() => navigate("/PressRelease")}>
                    Press Releases
                  </li>

                  <li onClick={() => navigate("/gradingofpromotors")}>
                    Grading Of Promotors
                  </li>

                  <li onClick={() => navigate("/GradingOfAgents")}>
                    Grading of Agents
                  </li>

                  <li onClick={() => navigate("/acf")}>
                    ACF
                  </li>

                  <li onClick={() => navigate("/Testimonials")}>
                    Testimonials
                  </li>

                  <li onClick={() => window.open(appealPdf, "_blank")}>
                    Appeal to Buyer
                  </li>

                </ul>
              </li>

              <li className="agent-nav-dropdown" onMouseEnter={handleDropdownPosition}>
                OTHER REQUIRED DEPARTMENT LINKS
                <span className="arrow">▾</span>

                <ul className="agent-nav-dropdown-menu">
                  <li>GST</li>
                  <li>DPMS</li>
                </ul>
              </li>
              <li className="agent-nav-dropdown" onMouseEnter={handleDropdownPosition}>
                PHOTO GALLERY
                <ul className="agent-nav-dropdown-menu">
                  <li onClick={() => navigate("/audiovisualgallery")}>
                    Audio Visual Gallery
                  </li>
                </ul>
              </li>
              <li>NEWS AND UPDATES</li>
              <li onClick={() => navigate("/promoter")}>PROMOTER LOGIN</li>

              <li className="agent-nav-dropdown" onMouseEnter={handleDropdownPosition}>
                COMPLAINT ORDERS
                <span className="agent-nav-arrow">▾</span>

                <ul className="agent-nav-dropdown-menu">
                  <li>FORM M</li>
                  <li>FORM N</li>
                </ul>
              </li>

              <li>DEPARTMENT LOGIN</li>

              <li onClick={() => navigate("/apreat")}>
                APREAT
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;