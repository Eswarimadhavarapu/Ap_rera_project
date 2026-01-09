import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";
import OfficeorderPdf from "../assets/Officeorder.pdf";
import CAUSELISTPdf from "../assets/CAuselist.pdf";
import appealPdf from "../assets/AppealToBuyer.pdf";
import legalpdf from "../assets/LEGAL_APRERA_CORPORATE_PRESENTATION.pdf";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <div className="logo">
          <h2>AP RERA</h2>
          <p>ANDHRA PRADESH REAL ESTATE REGULATORY AUTHORITY</p>
        </div>

        <button className="search-btn">SEARCH RERA PROJECTS</button>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <ul className="nav-list">
          <li>HOME</li>

          {/* ABOUT US DROPDOWN */}
          <li className="dropdown">ABOUT US <span className="arrow">▾</span>

            <ul className="dropdown-menu">
              <li onClick={() => navigate("/aprera")}>
                What is APRERA
              </li>
              
              <li onClick={() => navigate("/organogram")}>
                Organogram
              </li>
              
              <li onClick={() => navigate("/ourservices")}>
                Our Services
              </li>
              <li onClick={() => navigate("/recruitment")}>Recruitment</li>
              
              <li onClick={() => navigate("/rti")}>Rti</li>
             
                           <li onClick={() => navigate("/our-leadership")}>
                Our Leadership
              </li>
             <li className="contact-submenu">
                <span className="contact-title">
                  Contact Us <span className="right-arrow">▶</span>
                </span>

                <ul className="contact-submenu-box">
                  <li onClick={() => navigate("/contact-us/aprera")}>
                    APRERA
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          {/* <li>APREAT</li> */}
          <li onClick={() => navigate("/apreat")}>APREAT</li>
          <li className="dropdown">NOTIFICATIONS <span className="arrow">▾</span>
            <ul className="dropdown-menu">
             <li onClick={() => navigate("/goinotifications")}>
               GOI Notifications
              </li>
              <li onClick={() => navigate("/goapnotifications")}>
               GOAP Notifications
              </li>
             <li onClick={() => navigate("/authoritynotifications")}>
              Authority Notificatoins
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
          <li className="dropdown">
            REGISTRATION <span className="arrow">▾</span>
            <ul className="dropdown-menu">
              <li onClick={() => navigate("/promotregistration")}>
                Promoter Registration
              </li>
              <li onClick={() => navigate("/guidelinesRegistration")}>
                Guidelines for Registration
              </li>
              <li onClick={() => navigate("/project-registration")}>
                Project Registration
              </li>
              <li onClick={() => navigate("/agent-registration")}>
                Agent Registration
              </li>
              <li onClick={() => navigate("/complaintRegistration")}>
                Complaint Registration
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
          <li className="dropdown">REPORTS <span className="arrow">▾</span>
            <ul className="dropdown-menu">
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
              <li>MIS reports</li>
              <li>GIS reports</li>
            </ul>
          </li>
          <li className="dropdown">REGISTERED <span className="arrow">▾</span>
            <ul className="dropdown-menu">
             <li onClick={() => navigate("/registered/projects")}>
                Projects
              </li>
              <li onClick={() => navigate("/registered/agents")}>
                Agents </li>
            </ul>
          </li>
          <li className="dropdown">JUDGEMENTS/ORDERS <span className="arrow">▾</span>
            <ul className="dropdown-menu">
               <li onClick={()=>navigate("/complaint-orders")}>Complaint Orders</li>
            </ul>
          </li>
          <li className="dropdown">KNOWLEDGE HUB <span className="arrow">▾</span>
            <ul className="dropdown-menu">
       <li onClick={() => navigate("/evolutionofrera")}>
              Evolution of RERA
            </li>
              <li onClick={() => navigate("/race")}>RACE</li>
              <li onClick={() => navigate("/taskvstime")}>
              Task Vs Time
            </li>
              <li onClick={() => navigate("/ChronologyOfEvents")}>Chronology of Events</li>
              <li onClick={() => window.open(legalpdf, "_blank")}> APRERA Presentation</li>
              <li onClick={() => navigate("/JudgementHub")}>Judgement</li>
              <li onClick={() => navigate("/vendordatabase")}>
              VendorDatabase
            </li>
              <li onClick={() => navigate("/AdvertisementGuidelines")}>Advertisement Guidelines</li>
              <li onClick={() => navigate("/audiovisualgallery")}> AudioVisualGallery </li>
              <li onClick={() => navigate("/PressRelease")}>Press Releases</li>
              <li onClick={() => navigate("/gradingofpromotors")}> GradingOfPromotors </li>
              <li onClick={() => navigate("/GradingOfAgents")}>Grading of Agents</li>
              <li onClick={() => navigate("/acf")}> acf </li>
              <li onClick={() => navigate("/Testimonials")}>Testimonials</li>
              <li onClick={() => window.open(appealPdf, "_blank")}>Appeal to Buyer</li>
            </ul>
          </li>

          <li>LOGIN</li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;