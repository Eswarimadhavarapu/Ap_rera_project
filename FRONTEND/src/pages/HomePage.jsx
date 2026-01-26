import React, { useEffect, useState } from "react";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";


// ✅ ChartJS
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
);

/* ===========================
   ✅ NAVBAR COMPONENT
=========================== */
function Navbar() {
  return (
    <header className="home-new-navbar">
      <div className="home-new-top-bar">
        {/* <div className="logo-center"> */}
          {/* <img
            // src="https://rera.ap.gov.in/RERA/images/finallogo-New4.jpg"
            // alt="AP RERA"
          /> */}
          {/* <h1>ANDHRA PRADESH REAL ESTATE REGULATORY AUTHORITY</h1> */}
        {/* </div> */}

        {/* <button className="search-btn">QSEARCH RERA PROJECTS</button> */}
      </div>

      {/* <nav className="menu">
        <a>HOME</a>
        <a>ABOUT US</a>
        <a>APREAT</a>
        <a>NOTIFICATIONS</a>
        <a>REGISTRATION</a>
        <a>REPORTS</a>
        <a>REGISTERED</a>
        <a className="highlight">JUDGEMENTS / ORDERS</a>
        <a>KNOWLEDGE HUB</a>
        <a>LOGIN</a>
      </nav> */}

      <div className="home-new-notice-board">
         <div className="home-new-notice-line">
          <span className="home-new-notice-text">
            <a href="../../public/assets/pdfs/Circular-P-18.pdf" target="_blank" className="new-badge-a">
           <span className="home-new-badge">NEW</span>
            One Time Opportunity with 50% Concession on Late Fee for Un-registered
            Projects.
            <span className="home-new-badge">NEW</span>
            </a>
          </span>
        </div>

        <div className="home-new-notice-line">
          <span className="home-new-notice-text">
            <span className="home-new-badge">NEW</span>
            Quarterly Updates: All the promoters have to submit the Quarterly
            Updates of October 2025 – December 2025 on or before 21/01/2026
            without fail.
            <span className="home-new-badge">NEW</span>
          </span>
        </div>

        <div className="home-new-notice-line">
          <span className="home-new-notice-text">
            <span className="home-new-badge">NEW</span>
            All promoters are hereby informed that the Project Extension Module
            has been enabled online.
            <span className="home-new-badge">NEW</span>
          </span>
        </div>

        <div className="home-new-notice-line">
          <span className="home-new-notice-text">
            <span className="home-new-badge">NEW</span>
            Promoters are requested to display the APRERA Registration
            Certificate / ID at the respective project site for information of
            buyers.
            <span className="home-new-badge">NEW</span>
          </span>
        </div>

        <div className="home-new-notice-line">
          <span className="home-new-notice-text" onClick={() => navigate("/promotregistration")}>
            <span className="home-new-badge">NEW</span>
            All the promoters are instructed to register themselves in the AP
            RERA web portal for creation of the Promoter's database.
            <span className="home-new-badge">NEW</span>
          </span>
        </div>
      </div>
    </header>
  );
}


/* ===========================
   ✅ HERO COMPONENT
=========================== */


const bgImages = [
  "https://i.pinimg.com/1200x/19/08/8b/19088b4df084b9b7b997316f313b3a46.jpg",
  "https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?cs=srgb&dl=pexels-pixabay-269077.jpg&fm=jpg",
  "https://img.freepik.com/free-photo/modern-business-center_1127-3122.jpg?semt=ais_hybrid&w=740&q=80",
];

const heroStatements = [
  "GREATER ACCOUNTABILITY, ASSURED.",
  "BUYERS AND DEVELOPERS INTERESTS. PROTECTED.",
  "HIGH QUALITY OF CONSTRUCTION. ENSURED.",
  "SPEEDY DISPUTE REDRESSAL. ESTABLISHED.",
  "FDI INFLOWS. REVIVED.",
];

function Hero() {
  const [bgIndex, setBgIndex] = useState(0);
  const [statementIndex, setStatementIndex] = useState(0);

  // ✅ Background slider
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Statement slider (must match CSS animation time: 7s)
  useEffect(() => {
  const interval = setInterval(() => {
    setStatementIndex(prev => (prev + 1) % heroStatements.length);
  }, 4000);   // ✅ must equal CSS animation time

  return () => clearInterval(interval);
}, []);


  return (
   <section
  className="home-new-hero"
  style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
>
  {/* ✅ Leaders FIRST */}
  <div className="home-new-leaders">

    {/* ✅ CM */}
    <div className="home-new-leader-card">
      <img
        className="home-new-leader-img"
        src="data:image/jpeg;base64,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"
        alt="CM"
      />
      <div className="home-new-leader-info">
        <h4>Sri N. Chandrababu Naidu</h4>
        <p>
          Hon'ble Chief Minister <br />
          Government of Andhra Pradesh
        </p>
      </div>
    </div>

    {/* ✅ Minister */}
    <div className="home-new-leader-card">
      <img
        className="home-new-leader-img"
        src="data:image/jpeg;base64,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"
        alt="Minister"
      />
      <div className="home-new-leader-info">
        <h4>Sri P. Narayana</h4>
        <p>
          Hon'ble Minister for <br />
          MA & UD
        </p>
      </div>
    </div>

    {/* ✅ Chairperson */}
    <div className="home-new-leader-card">
      <img
        className="home-new-leader-img"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvYbO0kkDIqnDiHndh_Fu04lmISxIKEP_fvw&s"
        alt="Chairperson"
      />
      <div className="home-new-leader-info">
        <h4>Sri A. Siva Reddy</h4>
        <p>
          Chairperson <br />
          Andhra Pradesh RERA
        </p>
      </div>
    </div>

  </div>

  {/* ✅ Statements AFTER images */}
  <div className="home-new-hero-title-wrap">
    <h2 key={statementIndex} className="home-new-hero-title home-new-hold-center">
      {heroStatements[statementIndex]}
    </h2>
  </div>
</section>

  );
}




/* ===========================
   ✅ SERVICES COMPONENT
=========================== */
/* ===========================
   ✅ SERVICES COMPONENT
=========================== */

function Services() {
  const navigate = useNavigate();

  return (
    <section className="home-new-services">

      {/* CARD 1 */}
      <div 
        className="home-new-service-card"
        onClick={() => navigate("/project-registration")}
      >
        <div className="home-new-service-icon">
          <img src="/src/assets/building (1).png" alt="Project Registration" />
        </div>
        <h3>
          Project <br /> Registration
        </h3>
      </div>

      {/* CARD 2 */}
      <div 
        className="home-new-service-card"
        onClick={() => navigate("/agent-registration")}
      >
        <div className="home-new-service-icon">
          <img src="/src/assets/user (1).png" alt="Agent Registration" />
        </div>
        <h3>
          Agent <br /> Registration
        </h3>
      </div>

      {/* CARD 3 */}
      <div 
        className="home-new-service-card"
        onClick={() => navigate("/complaintRegistration")}
      >
        <div className="home-new-service-icon">
          <img src="/src/assets/img3.png" alt="Complaint Registration" />
        </div>
        <h3>
          Complaint <br /> Registration
        </h3>
      </div>

      {/* CARD 4 */}
      <div 
        className="home-new-service-card"
        onClick={() => navigate("/guidelines")}
      >
        <div className="home-new-service-icon">
          <img src="/src/assets/img4.png" alt="Guidelines for Registration" />
        </div>
        <h3>
          Guidelines for <br /> Registration
        </h3>
      </div>

      {/* CARD 5 */}
      <div 
        className="home-new-service-card"
        onClick={() => navigate("/faq")}
      >
        <div className="home-new-service-icon">
          <img src="/src/assets/img5.png" alt="FAQ" />
        </div>
        <h3>
          Frequently Asked <br /> Questions
        </h3>
      </div>

    </section>
  );
}

/* ===========================
   ✅ PHILOSOPHY COMPONENT
=========================== */
function Philosophy() {
  return (
    <section className="home-new-philosophy-wrapper">
      <div className="home-new-philosophy-box">
        <div className="home-new-philosophy-left">
          <h2>OUR PHILOSOPHY</h2>
          <div className="home-new-title-line"></div>

          <p>
            APRERA's philosophy is to have holistic approach towards promoting
            the interests of the consumers as well as builders and boost
            investments into real estate in an environment of trust and
            confidence.
          </p>

          <div className="home-new-philo-grid">
            <div className="home-new-philo-item">
              <div className="home-new-icon-box">
                <img
                  src="/src/assets/img6.png"
                  alt="Trust"
                  className="home-new-philo-icon"
                />
              </div>
              <div>
                <h4>Trust</h4>
                <p>
                  APRERA helps developers in building credibility and
                  establishing a relationship of trust with customers.
                </p>
              </div>
            </div>

            <div className="home-new-philo-item">
              <div className="home-new-icon-box">
                <img
                  src="/src/assets/img7.png"
                  alt="Transparency"
                  className="home-new-philo-icon"
                />
              </div>
              <div>
                <h4>Transparency</h4>
                <p>
                  APRERA ensures fair & equitable transactions between consumers
                  and promoters.
                </p>
              </div>
            </div>

            <div className="home-new-philo-item">
              <div className="home-new-icon-box">
                <img
                  src="/src/assets/img8.png"
                  alt="Control"
                  className="home-new-philo-icon"
                />
              </div>
              <div>
                <h4>Control</h4>
                <p>
                  Ensures stricter control on management of funds and timely
                  delivery of projects.
                </p>
              </div>
            </div>

            <div className="home-new-philo-item">
              <div className="home-new-icon-box">
                <img
                  src="/src/assets/img9.png"
                  alt="Credibility"
                  className="home-new-philo-icon"
                />
              </div>
              <div>
                <h4>Credibility</h4>
                <p>
                  APRERA facilitates consumers while boosting developer
                  credibility.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="home-new-philosophy-right">
          <h2>MAGNIFYING TOWARDS...</h2>
          <div className="home-new-title-line"></div>

          <ul className="home-new-arrow-list">
            <li>Ensuring accountability towards allottees and protect their interest.</li>
            <li>Infusing transparency, ensure fair-play and reduce frauds & delays.</li>
            <li>Introducing professionalism and pan India standardization.</li>
            <li>Establishing symmetry of information between promoter and allottee.</li>
            <li>Imposing responsibilities on both promoter and allottees.</li>
            <li>Establishing regulatory oversight mechanism.</li>
            <li>Fast-track dispute resolution mechanism.</li>
            <li>Promoting good governance and investor confidence.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   ✅ ANALYSIS CHART COMPONENT
=========================== */
function AnalysisChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "PROJECTS",
        data: [45, 0, 0, 0, 0, 0],
        borderColor: "green",
        backgroundColor: "green",
        pointRadius: 5,
      },
      {
        label: "AGENTS",
        data: [3, 0, 0, 0, 0, 0],
        borderColor: "#00bcd4",
        backgroundColor: "#00bcd4",
        pointStyle: "rect",
        pointRadius: 5,
      },
      {
        label: "COMPLAINTS",
        data: [4, 0, 0, 0, 0, 0],
        borderColor: "red",
        backgroundColor: "red",
        pointStyle: "triangle",
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Count" },
        ticks: { stepSize: 10 },
      },
    },
  };

  return (
    <div style={{ height: "350px", padding: "20px" }}>
      <Line data={data} options={options} />
    </div>
  );
}

/* ===========================
   ✅ DASHBOARD COMPONENT
=========================== */

function Dashboard() {
  return (
    <section className="home-new-dashboard-wrapper">

      <div className="home-new-analysis-box">
        <div className="home-new-box-header">DATA ANALYSIS</div>

        <div className="home-new-filters">
          <div>
            Year :
            <select>
              <option>2026</option>
            </select>
          </div>

          <div>
            Month :
            <select>
              <option>All</option>
            </select>
          </div>
        </div>

        <h4 className="home-new-analysis-title">
          STATUS OF PROJECTS, AGENTS AND COMPLAINTS
        </h4>

        <AnalysisChart />
      </div>

      <div className="home-new-dashboard-box">
        <div className="home-new-box-header">DASHBOARD</div>

        {/* PROJECTS */}
        <div className="home-new-dash-row">
          <div className="home-new-dash-icon">
            <img src="/src/assets/img10.png" alt="Projects" />
          </div>
          <div className="home-new-dash-content">
            <h4>STATUS OF PROJECTS</h4>
            <p>Received : <b>7134</b></p>
            <p>Approved : <b>6289</b></p>
          </div>
        </div>

        {/* AGENTS */}
        <div className="home-new-dash-row">
          <div className="home-new-dash-icon">
            <img src="/src/assets/img11.png" alt="Agents" />
          </div>
          <div className="home-new-dash-content">
            <h4>STATUS OF AGENTS</h4>
            <p>Received : <b>303</b></p>
            <p>Approved : <b>295</b></p>
          </div>
        </div>

        {/* COMPLAINTS */}
        <div className="home-new-dash-row">
          <div className="home-new-dash-icon">
            <img src="/src/assets/img12.png" alt="Complaints" />
          </div>
          <div className="home-new-dash-content">
            <h4>STATUS OF COMPLAINTS</h4>

            <div className="home-new-complaints-grid">
              <div>
                <p>Total Cases (Form-M)</p>
                <p>Received : 657</p>
                <p>Disposed : 372</p>
                <p>Reserved : Nil</p>
                <p>Before NCLT : 04</p>
                <p>Running : 281</p>
              </div>

              <div>
                <p>Total Cases (Form-N)</p>
                <p>Received : 141</p>
                <p>Disposed : 133</p>
                <p>Reserved : Nil</p>
                <p>Before NCLT : 02</p>
                <p>Running : 06</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}


/* ===========================
   ✅ EXPERTISE COMPONENT
=========================== */

function Expertise() {
  return (
    <section className="home-new-expertise">
      <h2 className="home-new-section-title">OUR EXPERTISE</h2>
      <div className="home-new-title-line"></div>

      <p className="home-new-section-subtitle">
        APRERA strives to achieve its objectives by providing an integrated
        platform for real estate sector
      </p>

      <div className="home-new-expertise-grid">

        <div className="home-new-expertise-card">
          <div className="home-new-expertise-icon">
            <img src="/src/assets/img13.png" alt="Consultation" />
          </div>
          <h3>CONSULTATION</h3>
          <p>
            APRERA provides strong support and guidance to stakeholders in the
            real estate sector through structured processes and transparency.
          </p>
        </div>

        <div className="home-new-expertise-card">
          <div className="home-new-expertise-icon">
            <img src="/src/assets/img14.png" alt="Promotion" />
          </div>
          <h3>PROMOTION</h3>
          <p>
            APRERA provides strong support and guidance to stakeholders in the
            real estate sector through structured processes and transparency.
          </p>
        </div>

        <div className="home-new-expertise-card">
          <div className="home-new-expertise-icon">
            <img src="/src/assets/img15.png" alt="Protection" />
          </div>
          <h3>PROTECTION</h3>
          <p>
            APRERA provides strong support and guidance to stakeholders in the
            real estate sector through structured processes and transparency.
          </p>
        </div>

        <div className="home-new-expertise-card">
          <div className="home-new-expertise-icon">
            <img src="/src/assets/img16.png" alt="Financial Discipline" />
          </div>
          <h3>FINANCIAL DISCIPLINE</h3>
          <p>
            APRERA provides strong support and guidance to stakeholders in the
            real estate sector through structured processes and transparency.
          </p>
        </div>

        <div className="home-new-expertise-card">
          <div className="home-new-expertise-icon">
            <img src="/src/assets/img17.png" alt="Quality Assurance" />
          </div>
          <h3>QUALITY ASSURANCE</h3>
          <p>
            APRERA provides strong support and guidance to stakeholders in the
            real estate sector through structured processes and transparency.
          </p>
        </div>

        <div className="home-new-expertise-card">
          <div className="home-new-expertise-icon">
            <img src="/src/assets/img18.png" alt="Dispute Redressal" />
          </div>
          <h3>DISPUTE REDRESSAL</h3>
          <p>
            APRERA provides strong support and guidance to stakeholders in the
            real estate sector through structured processes and transparency.
          </p>
        </div>

      </div>
    </section>
  );
}

function Learning() {
  const navigate = useNavigate();

  const learningItems = [
    {
      img: "https://rera.ap.gov.in/RERA/images/news2.jpg",
      title: "BUILDING INFORMATION MODELLING (BIM)",
      path: "/bim",
    },
    {
      img: "https://rera.ap.gov.in/RERA/images/news1.jpg",
      title: "VIRTUAL REALITY INNOVATION",
      path: "/vr",
    },
    {
      img: "https://rera.ap.gov.in/RERA/images/news.jpg",
      title: "REAL TIME CONTEXT CAPTURE",
      path: "/rtc",
    },
  ];

  return (
    <section className="home-new-learning">
      <h2 className="home-new-section-title">LEARNING WITH US</h2>
      <div className="home-new-title-line"></div>

      <p className="home-new-section-subtitle">
        Technology intervention in Infrastructure
      </p>

      <div className="home-new-learning-grid">
        {learningItems.map((item, idx) => (
          <div className="home-new-learning-card" key={idx}>
            <div className="home-new-learning-img">
              <img src={item.img} alt={item.title} />
            </div>

            <h3>{item.title}</h3>

            <button onClick={() => navigate(item.path)}>View All</button>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ===========================
   ✅ FEEDBACK COMPONENT
=========================== */
function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    feedbackFor: "0",
    email: "",
    feedback: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile only numbers
    if (name === "mobile") {
      const onlyNums = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: onlyNums }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name.trim()) return alert("Please enter Name");
    if (!formData.mobile.trim() || formData.mobile.length !== 10)
      return alert("Please enter valid Mobile (10 digits)");
    if (formData.feedbackFor === "0") return alert("Please select Feedback For");
    if (!formData.feedback.trim()) return alert("Please enter Feedback");

    alert("Feedback submitted successfully ✅ (Demo)");
    console.log("Submitted:", formData);

    // reset (optional)
    setFormData({
      name: "",
      mobile: "",
      feedbackFor: "0",
      email: "",
      feedback: "",
    });
  };

  return (
    <section className="home-new-feedback-wrapper">
      <div className="home-new-contact-row" id="home-new-contactinfo">
        {/* LEFT */}
        <div className="home-new-contact-col">
          <div className="home-new-reach-card">
            <div className="home-new-reach-border">
              <h5 className="home-new-reach-title">Reach Us</h5>

              <p className="home-new-reach-heading">
                <b>
                  ANDHRA PRADESH <br />
                  REAL ESTATE REGULATORY AUTHORITY
                </b>
              </p>

              <p className="home-new-reach-address">
                6th &amp; 7th Floors, APCRDA Project Office,
                <br />
                Rayapudi, Tulluru Mandal, Amaravati, Guntur District,
                <br />
                Andhra Pradesh. Pin - 522237.
              </p>

              <p className="home-new-reach-helpdesk">
                Help Desk <span className="home-new-icon">📞</span>{" "}
                <span className="home-new-highlight">6304906011</span>{" "}
                (All Working Days, 10AM-6PM)
              </p>

              <p className="home-new-reach-email">
                Write to <span className="home-new-icon">✉</span>{" "}
                <a
                  href="mailto:helpdesk-rera@ap.gov.in"
                  className="home-new-mail-link"
                  rel="noreferrer"
                >
                  helpdesk-rera[at]ap[dot]gov[dot]in
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="home-new-contact-col">
          <div className="home-new-form-card">
            <h3 className="home-new-form-title">Feedback / Suggestion</h3>

            <form onSubmit={handleSubmit} className="home-new-feedback-form">
              <div className="home-new-grid-2">
                <div className="home-new-field">
                  <input
                    type="text"
                    name="name"
                    maxLength={50}
                    placeholder="Name*"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="home-new-field">
                  <input
                    type="text"
                    name="mobile"
                    maxLength={10}
                    placeholder="Mobile*"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>

                <div className="home-new-field home-new-select-field">
                  <select
                    name="feedbackFor"
                    value={formData.feedbackFor}
                    onChange={handleChange}
                  >
                    <option value="0">Select *</option>
                    <option value="1">General</option>
                    <option value="2">Tech Support</option>
                  </select>
                </div>

                <div className="home-new-field">
                  <input
                    type="email"
                    name="email"
                    maxLength={75}
                    placeholder="Email ID"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="home-new-textarea-wrap">
                <p className="home-new-char-limit">
                  {formData.feedback.length}/1000
                </p>

                <textarea
                  name="feedback"
                  placeholder="Feedback* (Maximum of 1000 Character)"
                  maxLength={1000}
                  rows={4}
                  value={formData.feedback}
                  onChange={handleChange}
                />
              </div>

              <div className="home-new-submit-row">
                <button type="submit" className="home-new-submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
/* ===========================
   ✅ FOOTER COMPONENT
=========================== */
function Footer() {
  return (
    <footer className="home-new-footer">
      <div className="home-new-footer-logos">
        <img
          src="https://rera.ap.gov.in/RERA/images/footerlinksimg/AP-STATE.png"
          alt="AP State Portal"
        />
        <img src="https://pgportal.gov.in/images/logo.png" alt="PGRS" />
        <img
          src="https://rera.ap.gov.in/RERA/images/footerlinksimg/core.png"
          alt="CORE"
        />
        <img
          src="https://rera.ap.gov.in/RERA/images/footerlinksimg/eOffice.png"
          alt="eOffice"
        />
        <img
          src="https://rera.ap.gov.in/RERA/images/footerlinksimg/india_gov_logo.png"
          alt="India Gov"
        />
      </div>

      <div className="home-new-footer-policy">
        <span>Privacy Policy</span>
        <span>› Hyperlinking Policy</span>
        <span>› Copyright Policy</span>
        <span>› Disclaimer</span>
        <span>› Accessibility</span>
        <span>› Terms & Conditions</span>
        <span>› Site Map</span>
        <span>› Rate our website</span>

        <div className="home-new-social-icons">
          <span className="fb">f</span>
          <span className="tw">t</span>
          <span className="yt">▶</span>
        </div>
      </div>

      <div className="home-new-footer-bottom">
        <div className="home-new-left">© 2017, All Rights Reserved by APRERA, Govt of A.P. India</div>
        <div className="home-new-center">
          <span>No. Of Visitors : </span>
          <b>940905</b>
        </div>
        <div className="home-new-right">
          Last Updated on : 22/12/2025 17:14:45 <br />
          Designed and Developed by <b>APOnline</b>
        </div>
      </div>
    </footer>
  );
}

/* ===========================
   ✅ MAIN SINGLE PAGE EXPORT
=========================== */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Philosophy />
      <Dashboard />
      <Expertise />
      <Learning />
      <Feedback />
    </>
  );
}