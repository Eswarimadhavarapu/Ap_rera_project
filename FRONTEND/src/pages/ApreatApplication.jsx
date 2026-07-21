import React, { useState } from "react";
import "../styles/ApreatApplication.css";

import buildingImage from "../assets/images/apcrdaimage.jpeg";
import ministerImage from "../assets/images/download.jpeg";
import logoImage from "../assets/images/apreralogo.jpeg";
import memberImage from "../assets/images/member.jpeg";
import registrarImage from "../assets/images/registrar.jpg";

const openCauseListPdf = () => {
  window.open("/assets/pdfs/APRERAT_CAUSE_LIST.pdf", "_blank");
};
const openProceedingListPdf = () => {
  window.open("/assets/pdfs/PROCEEDING_LIST.pdf", "_blank");
};
const openAppearancePdf = () => {
  window.open("/assets/pdfs/APPEARANCE.pdf", "_blank");
};
const openSpecialHospitalPdf = () => {
  window.open("/assets/pdfs/APRERAT_SpecialHoliday.pdf", "_blank");
};

const openRegulationsPdf = () => {
  window.open("/assets/pdfs/REGULATIONS_2023.pdf", "_blank");
};
import { FaDownload } from "react-icons/fa";

const cards = [
  "Contact Us",
  "Orders / Delay Condoned",
  "Cause List",
  "Proceeding List",
  "Appearance",
  "Special Hospital",
  "Regulations 2023",
];

function ApreatApplication() {

  const [searchTerm, setSearchTerm] = useState("");

  const complaintStatusData = [
  {
    id: 1,
    complaintName: "Project Registration Delay",
    respondent: "ABC Builders",
    description: "Delay in project registration approval",
    complaintDate: "2026-05-01",
    firstHearing: "2026-05-2",
    secondHearing: "2026-05-20",
    status: "Pending",
  },

  {
    id: 2,
    complaintName: "Construction Quality Issue",
    respondent: "XYZ Constructions",
    description: "Poor construction quality complaint",
    complaintDate: "2026-05-05",
    firstHearing: "2026-05-15",
    secondHearing: "2026-05-25",
    status: "In Progress",
  },

  {
    id: 3,
    complaintName: "Refund Delay",
    respondent: "Urban Infra",
    description: "Refund not processed",
    complaintDate: "2026-05-08",
    firstHearing: "2026-05-18",
    secondHearing: "2026-05-28",
    status: "Closed",
  },
];
const getRemainingDays = (complaintDate) => {
  const startDate = new Date(complaintDate);
  const today = new Date();

  const diffTime = today - startDate;

  const passedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const remainingDays = 60 - passedDays;

  return remainingDays > 0 ? remainingDays : 0;
};
const ordersData = [
  {
    id: 1,
    complaint:
      "Appeal No. 4 of 2025, Appeal No. 6 of 2025 and Appeal No. 5 of 2026 (Against Complaint No 41 of 2024)",
    date: "21-04-2026",
  },
  {
    id: 2,
    complaint:
      "Appeal No. 3 of 2025, Appeal No. 5 of 2025 and Appeal No. 4 of 2026",
    date: "21-04-2026",
  },
  {
    id: 3,
    complaint: "Appeal No. 53 of 2025",
    date: "24-02-2026",
  },
  {
    id: 4,
    complaint:
      "Appeal No. 6 of 2025 (Against Complaint No 41 of 2024)",
    date: "24-02-2026",
  },

  {
    id: 5,
    complaint:
      "Appeal No. 53 of 2025 (Against Complaint No 41 of 2024)",
    date: "24-02-2026",
  },

  {
    id: 6,
    complaint:
      "Appeal No. 52 of 2025 (Against Complaint No 1 of 2025)",
    date: "24-02-2026",
  },

  {
    id: 7,
    complaint:
      "Appeal No. 2 of 2025 (Against Complaint No 41 of 2025)",
    date: "02-12-2025",
  },
];



const filteredOrders = ordersData.filter((item) =>
  item.complaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.date.includes(searchTerm)
);
  const [selectedPage, setSelectedPage] = useState("");

  // PDF OPEN FUNCTION


  return (
    <>
      {/* TOP HEADER */}

      <div className="apreat_top-header">
        <div className="apreat_top-header-content">
          <img src={logoImage} alt="" className="apreat_top-logo" />

          <h1 className="apreat_top-title">
            ANDHRA PRADESH REAL ESTATE REGULATORY AUTHORITY
          </h1>
        </div>
      </div>

    

      {/* CONTACT US PAGE */}

      {selectedPage === "contact" ? (

        <div className="apreat_contact-page">

          <div className="apreat_contact-breadcrumb">
            You are here : APREAT Contact Us
          </div>

          {/* CHAIRPERSON */}

          <div className="apreat_contact-section">

            <h1>CHAIRPERSON</h1>

            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>DESIGNATION</th>
                  <th>NAME</th>
                  <th>MOBILE NUMBER</th>
                  <th>EMAIL ID</th>
                  <th>PHOTO</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>CHAIRPERSON</td>
                  <td>HON'BLE JUSTICE SRI M.GANGARAO</td>
                  <td>7901097368</td>
                  <td>-</td>

                  <td>
                    <img
                      src={ministerImage}
                      alt=""
                      className="apreat_contact-photo"
                    />
                  </td>

                </tr>
              </tbody>
            </table>

          </div>

          {/* MEMBERS */}

          <div className="apreat_contact-section">

            <h1>MEMBERS</h1>

            <table>

              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>DESIGNATION</th>
                  <th>NAME</th>
                  <th>MOBILE NUMBER</th>
                  <th>EMAIL ID</th>
                  <th>PHOTO</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>JUDICIAL MEMBER</td>
                  <td>SRI RAMACHANDRA REDDY MANDALAPU</td>
                  <td>9914756999</td>
                  <td>-</td>

                  <td>
                    <img
                      src={memberImage}
                      alt=""
                      className="apreat_contact-photo"
                    />
                  </td>

                </tr>
              </tbody>

            </table>

          </div>

          {/* REGISTRAR */}

          <div className="apreat_contact-section">

            <h1>REGISTRAR</h1>

            <table>

              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>DESIGNATION</th>
                  <th>NAME</th>
                  <th>MOBILE NUMBER</th>
                  <th>EMAIL ID</th>
                  <th>PHOTO</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>REGISTRAR</td>
                  <td>SRI GUDURI RAMA KRISHNA</td>
                  <td>-</td>
                  <td>registrar.apreat@gmail.com</td>

                  <td>
                    <img
                      src={registrarImage}
                      alt=""
                      className="apreat_contact-photo"
                    />
                  </td>

                </tr>
              </tbody>

            </table>

          </div>

          <button
            className="apreat_contact-back-btn"
            onClick={() => setSelectedPage("")}
          >
            Back
          </button>

        </div>

      ) : selectedPage === "orders" ? (

        <div className="apreat_orders-page">

          {/* TOP BAR */}

          <div className="apreat_orders-breadcrumb">

            You are here :

            <span
              className="apreat_orders-home-link"
              onClick={() => setSelectedPage("")}
            >
              Home
            </span>

            / APREAT Complaint Orders

          </div>

          {/* TITLE */}

          <div className="apreat_orders-title-section">
            <h1>APREAT Complaint Orders</h1>
            <div className="apreat_orders-line"></div>
          </div>

          {/* TOP FILTER */}

          <div className="apreat_orders-top-bar">

            <div className="apreat_orders-show">

              <span>Show</span>

              <select>
                <option>50</option>
                <option>25</option>
                <option>10</option>
              </select>

              <span>entries</span>

            </div>

            <div className="apreat_orders-search">
              <label>Search:</label>
              <input
  type="text"
  placeholder="Search complaint or date"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
            </div>

          </div>

          {/* TABLE */}
<table className="apreat_orders-table">

  <thead>
    <tr>
      <th>S.No</th>
      <th>Complaint No.</th>
      <th>Date</th>
      <th>Download</th>
    </tr>
  </thead>

  <tbody>
    {filteredOrders.map((item) => (
      <tr key={item.id}>

        <td>{item.id}</td>

        <td>
          {item.complaint}

          {item.id === 1 && (
            <span className="apreat_blink-text"> NEW</span>
          )}
           {item.id === 2 && (
            <span className="apreat_blink-text"> NEW</span>
          )}
           {item.id === 3 && (
            <span className="apreat_blink-text"> NEW</span>
          )}
           {item.id === 4 && (
            <span className="apreat_blink-text"> NEW</span>
          )}
           {item.id === 5 && (
            <span className="apreat_blink-text"> NEW</span>
          )}
           {item.id === 6 && (
            <span className="apreat_blink-text"> NEW</span>
          )}
           {item.id === 7 && (
            <span className="apreat_blink-text"> NEW</span>
          )}
        </td>
        

        <td>{item.date}</td>

        <td>
          <FaDownload
            className="apreat_download-icon"
            onClick={openCauseListPdf}
            style={{ cursor: "pointer" }}
          />
        </td>

      </tr>
    ))}
  </tbody>

</table>

          {/* PAGINATION */}

          <div className="apreat_orders-pagination">

            <span>Previous</span>

            <button>1</button>

            <span>Next</span>

          </div>

          {/* BACK */}

          <button
            className="apreat_contact-back-btn"
            onClick={() => setSelectedPage("")}
          >
            Back
          </button>

        </div>

      ) : selectedPage ? (

        /* OTHER PAGES */

        <div className="apreat_process-page">

          <div className="apreat_process-box">

            <h1>{selectedPage}</h1>

            <p>This page is under process</p>

            <button onClick={() => setSelectedPage("")}>
              Back
            </button>

          </div>

        </div>

      ) : (

        /* HOME PAGE */

        <div className="apreat_home-main">

          {/* LEFT IMAGE */}

          <div className="apreat_left-container">

            <img
              src={buildingImage}
              alt=""
              className="apreat_main-image"
            />

            {/* BUTTONS */}

            <div className="apreat_card-container">

              {cards.map((item, index) => (

                <div
                  className="apreat_home-card"
                  key={index}

                  onClick={() => {

                    if (item === "Contact Us") {
                      setSelectedPage("contact");
                    }

                    else if (item === "Orders / Delay Condoned") {
                      setSelectedPage("orders");
                    }

                    // CAUSE LIST PDF OPEN
                    else if (item === "Cause List") {
                      openCauseListPdf();
                    }
                    else if (item === "Proceeding List") {
   openProceedingListPdf();
}
else if (item === "Appearance") {
   openAppearancePdf();
}
else if (item === "Special Hospital") {
   openSpecialHospitalPdf();
}

else if (item === "Regulations 2023") {
   openRegulationsPdf();
}

                    else {
                      setSelectedPage(item);
                    }

                  }}
                >
                  {item}
                </div>

              ))}

            </div>

          </div>
          

          {/* RIGHT SECTION */}

          <div className="apreat_right-container">

            <div className="apreat_judge-container">

              <img
                src={ministerImage}
                alt=""
                className="apreat_judge-image"
              />

              <h1>
                HON'BLE JUSTICE <br />
                SRI M. GANGARAO
              </h1>

              <h2>
                Chairperson APREAT<br />
            
              </h2>

            </div>



          </div>
          

        </div>
        

      )}
      {selectedPage === "" && (
  <div className="apreat_status-complaint-wrapper">

    <div className="apreat_status-complaint-section">

      <h1>Status Of Complaint</h1>

      <table className="apreat_status-complaint-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name Of Complaint</th>
            <th>Name Of Respondent</th>
            <th>Complaint Description</th>
            <th>Date Of Complaint</th>
            <th>1st Hearing Date</th>
            <th>2nd Hearing Date</th>
            <th>Status</th>
            <th>Remaining Days</th>
          </tr>
        </thead>

        <tbody>
          {complaintStatusData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.complaintName}</td>
              <td>{item.respondent}</td>
              <td>{item.description}</td>
              <td>{item.complaintDate}</td>
              <td>{item.firstHearing}</td>
              <td>{item.secondHearing}</td>
              <td>{item.status}</td>
              <td>{getRemainingDays(item.complaintDate)} Days</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>

  </div>
)}

    </>
  );
}

export default ApreatApplication;