import React, { useState } from "react";
import "../styles/ApreatApplication.css";

import buildingImage from "../assets/images/apcrdaimage.jpeg";
import ministerImage from "../assets/images/download.jpeg";
import logoImage from "../assets/images/apreralogo.jpeg";
const cards = [
  "Cause List",
  "Display Board",
  "Roster",
  "Notice",
  "APHC Case Status",
  "NJDG Case Status",
];

function ApreatApplication() {

  const [selectedPage, setSelectedPage] = useState("");

  return (
    <>

      {/* TOP HEADER */}

      <div className="apreat_top-header">

       <div className="apreat_top-header-content">

  <img
    src={logoImage}
    alt=""
    className="apreat_top-logo"
  />

  <h1 className="apreat_top-title">
    ANDHRA PRADESH REAL ESTATE REGULATORY AUTHORITY
  </h1>

</div>

        </div>

      

      {/* NAVBAR */}

      <div className="apreat_navbar">

        <div className="apreat_nav-left">

          <button
  className="apreat_nav-btn"
  onClick={() => setSelectedPage("")}
>
  Home
</button>

          <button
  className="apreat_nav-btn"
  onClick={() => setSelectedPage("About Us")}
>
  About Us
</button>

        </div>

      </div>

      {/* PROCESS PAGE */}

      {selectedPage ? (

        <div className="apreat_process-page">

  <div className="apreat_process-box">

    <h1>{selectedPage}</h1>

    <p>This page is under process</p>

    <button onClick={() => setSelectedPage("")}>
      Back
    </button>

  </div>

  {/* SHOW ONLY FOR HOME PAGE */}

  {selectedPage !== "About Us" && (

    <div className="apreat_working-section">

      <h1>Website Under Development</h1>

      <p>
        More AP RERA services and features will be available soon.
      </p>

    </div>

  )}

</div>
        

      ) : (

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
                  onClick={() => setSelectedPage(item)}
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
                Chairperson Andhra Pradesh <br />
                Real Estate Regulatory Authority
              </h2>

            </div>

          </div>

        </div>

      )}
      {/* UNDER WORK SECTION */}

<div className="apreat_working-section">

  <h1>Website Under Development</h1>

  <p>
    More AP RERA services and features will be available soon.
  </p>

</div>

    </>
  );
}

export default ApreatApplication;