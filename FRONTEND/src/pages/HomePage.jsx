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
    <header className="navbar">
      <div className="top-bar">
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

      <div className="notice-board">
        <div className="notice-line">
          <span className="notice-text">
            <a href="../../public/assets/pdfs/Circular-P-18.pdf" target="_blank" className="new-badge-a">
            <span className="new-badge">NEW</span>
            One Time Opportunity with 50% Concession on Late Fee for Un-registered
            Projects.
            <span className="new-badge">NEW</span>
            </a>
          </span>
        </div>

        <div className="notice-line">
          <span className="notice-text">
            <span className="new-badge">NEW</span>
            Quarterly Updates: All the promoters have to submit the Quarterly
            Updates of October 2025 – December 2025 on or before 21/01/2026
            without fail.
            <span className="new-badge">NEW</span>
          </span>
        </div>

        <div className="notice-line">
          <span className="notice-text">
            <span className="new-badge">NEW</span>
            All promoters are hereby informed that the Project Extension Module
            has been enabled online.
            <span className="new-badge">NEW</span>
          </span>
        </div>

        <div className="notice-line">
          <span className="notice-text">
            <span className="new-badge">NEW</span>
            Promoters are requested to display the APRERA Registration
            Certificate / ID at the respective project site for information of
            buyers.
            <span className="new-badge">NEW</span>
          </span>
        </div>

        <div className="notice-line">
          <span onClick={() => navigate("/promotregistration")} className="notice-text">
            <span className="new-badge">NEW</span>
            All the promoters are instructed to register themselves in the AP
            RERA web portal for creation of the Promoter's database.
            <span className="new-badge">NEW</span>
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

function Hero() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
    >
      <h2 className="hero-title">GREATER ACCOUNTABILITY, ASSURED.</h2>

      <div className="leaders">
        <div className="leader-card">
          <img
            src="data:image/jpeg;base64,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"
            alt="CM"
          />
          <div className="leader-info">
            <h4>Sri N. Chandrababu Naidu</h4>
            <p>
              Hon'ble Chief Minister <br />
              Government of Andhra Pradesh
            </p>
          </div>
        </div>

        <div className="leader-card">
          <img
            src="data:image/jpeg;base64,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"
            alt="Minister"
          />
          <div className="leader-info">
            <h4>Sri P. Narayana</h4>
            <p>
              Hon'ble Minister for <br />
              MA & UD
            </p>
          </div>
        </div>

        <div className="leader-card">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvYbO0kkDIqnDiHndh_Fu04lmISxIKEP_fvw&s"
            alt="Chairperson"
          />
          <div className="leader-info">
            <h4>Sri A. Siva Reddy</h4>
            <p>
              Chairperson <br />
              Andhra Pradesh RERA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   ✅ SERVICES COMPONENT
=========================== */
function Services() {
  return (
    <section className="services">
      <div className="service-card">
        <div className="service-icon">
          <img src="../../public/assets/images/imag1.png" alt="Project Registration" />
        </div>
        <h3>Project Registration</h3>
      </div>

      <div className="service-card">
        <div className="service-icon">
          <img src="../../public/assets/imagesimg2.png" alt="Agent Registration" />
        </div>
        <h3>Agent Registration</h3>
      </div>

      <div className="service-card">
        <div className="service-icon">
          <img src="../../public/assets/images/img3.png" alt="Complaint Registration" />
        </div>
        <h3>Complaint Registration</h3>
      </div>

      <div className="service-card">
        <div className="service-icon">
          <img src="../../public/assets/images/img4.png" alt="Guidelines for Registration" />
        </div>
        <h3>Guidelines for Registration</h3>
      </div>

      <div className="service-card">
        <div className="service-icon">
          <img src="../../public/assets/images/img5.png" alt="FAQ" />
        </div>
        <h3>Frequently Asked Questions</h3>
      </div>
    </section>
  );
}

/* ===========================
   ✅ PHILOSOPHY COMPONENT
=========================== */
function Philosophy() {
  return (
    <section className="philosophy-wrapper">
      <div className="philosophy-box">
        <div className="philosophy-left">
          <h2>OUR PHILOSOPHY</h2>
          <div className="title-line"></div>

          <p>
            APRERA's philosophy is to have holistic approach towards promoting
            the interests of the consumers as well as builders and boost
            investments into real estate in an environment of trust and
            confidence.
          </p>

          <div className="philo-grid">
            <div className="philo-item">
              <div className="icon-box">
                <img
                  src="../../public/assets/images/img6.png"
                  alt="Trust"
                  className="philo-icon"
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

            <div className="philo-item">
              <div className="icon-box">
                <img
                  src="../../public/assets/images/img7.png"
                  alt="Transparency"
                  className="philo-icon"
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

            <div className="philo-item">
              <div className="icon-box">
                <img
                  src="../../public/assets/images/img8.png"
                  alt="Control"
                  className="philo-icon"
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

            <div className="philo-item">
              <div className="icon-box">
                <img
                  src="../../public/assets/images/img9.png"
                  alt="Credibility"
                  className="philo-icon"
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

        <div className="philosophy-right">
          <h2>MAGNIFYING TOWARDS...</h2>
          <div className="title-line"></div>

          <ul className="arrow-list">
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
    <section className="dashboard-wrapper">
      <div className="analysis-box">
        <div className="box-header">DATA ANALYSIS</div>

        <div className="filters">
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

        <h4 className="analysis-title">
          STATUS OF PROJECTS, AGENTS AND COMPLAINTS
        </h4>

        <AnalysisChart />
      </div>

      <div className="dashboard-box">
        <div className="box-header">DASHBOARD</div>

        <div className="dash-row">
          <div className="dash-icon">📊</div>
          <div className="dash-content">
            <h4>STATUS OF PROJECTS</h4>
            <p>
              Received : <b>7134</b>
            </p>
            <p>
              Approved : <b>6289</b>
            </p>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-icon">👥</div>
          <div className="dash-content">
            <h4>STATUS OF AGENTS</h4>
            <p>
              Received : <b>303</b>
            </p>
            <p>
              Approved : <b>295</b>
            </p>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-icon">⚖️</div>
          <div className="dash-content">
            <h4>STATUS OF COMPLAINTS</h4>

            <div className="complaints-grid">
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
    <section className="expertise">
      <h2 className="section-title">OUR EXPERTISE</h2>
      <div className="title-line"></div>

      <p className="section-subtitle">
        APRERA strives to achieve its objectives by providing an integrated
        platform for real estate sector
      </p>

      <div className="expertise-grid">
        {[
          { icon: "👤", title: "CONSULTATION" },
          { icon: "🤝", title: "PROMOTION" },
          { icon: "🛡️", title: "PROTECTION" },
          { icon: "💰", title: "FINANCIAL DISCIPLINE" },
          { icon: "👍", title: "QUALITY ASSURANCE" },
          { icon: "🏢", title: "DISPUTE REDRESSAL" },
        ].map((item, idx) => (
          <div className="expertise-card" key={idx}>
            <div className="expertise-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>
              APRERA provides strong support and guidance to stakeholders in the
              real estate sector through structured processes and transparency.
            </p>
          </div>
        ))}
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
    <section className="learning">
      <h2 className="section-title">LEARNING WITH US</h2>
      <div className="title-line"></div>

      <p className="section-subtitle">
        Technology intervention in Infrastructure
      </p>

      <div className="learning-grid">
        {learningItems.map((item, idx) => (
          <div className="learning-card" key={idx}>
            <div className="learning-img">
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
  return (
    <section className="feedback-wrapper">
      <div className="reach-box">
        <div className="reach-inner">
          <h4>REACH US</h4>

          <h2>
            ANDHRA PRADESH <br />
            REAL ESTATE REGULATORY AUTHORITY
          </h2>

          <p>
            6th & 7th Floors, APCRDA Project Office, <br />
            Rayapudi, Tulluru Mandal, Amaravati, <br />
            Guntur District, Andhra Pradesh. <br />
            Pin - 522237.
          </p>

          <p className="helpdesk">
            Help Desk : <span>6304906011</span> <br />
            (All Working Days, 10AM - 6PM)
          </p>

          <p className="email">
            Write to : <span>helpdesk-rera[at]ap[dot]gov[dot]in</span>
          </p>
        </div>
      </div>

      <div className="feedback-box">
        <h2>FEEDBACK / SUGGESTION</h2>
        <div className="title-line"></div>

        <form className="feedback-form">
          <div className="form-row">
            <input type="text" placeholder="Name*" />
            <input type="text" placeholder="Mobile*" />
          </div>

          <div className="form-row">
            <select>
              <option>Select *</option>
              <option>Feedback</option>
              <option>Suggestion</option>
            </select>
            <input type="email" placeholder="Email ID" />
          </div>

          <textarea placeholder="Feedback* (Maximum of 1000 Character)"></textarea>

          <button type="submit">Submit</button>
        </form>
      </div>
    </section>
  );
}

/* ===========================
   ✅ FOOTER COMPONENT
=========================== */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logos">
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

      <div className="footer-policy">
        <span>Privacy Policy</span>
        <span>› Hyperlinking Policy</span>
        <span>› Copyright Policy</span>
        <span>› Disclaimer</span>
        <span>› Accessibility</span>
        <span>› Terms & Conditions</span>
        <span>› Site Map</span>
        <span>› Rate our website</span>

        <div className="social-icons">
          <span className="fb">f</span>
          <span className="tw">t</span>
          <span className="yt">▶</span>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="left">© 2017, All Rights Reserved by APRERA, Govt of A.P. India</div>
        <div className="center">
          <span>No. Of Visitors : </span>
          <b>940905</b>
        </div>
        <div className="right">
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