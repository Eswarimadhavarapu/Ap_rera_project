// Appeal.jsx

import React from "react";
import "../styles/RtiPage.css";

const RtiPage = () => {
  return (
    <div className="appeal-container">

      {/* TOP HEADER */}
      <div className="appeal-header">
        <h2>APPEAL</h2>

        <div className="total-result">
          Total Result - 0/0
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="appeal-filter-section">

        {/* LEFT SIDE */}
        <div className="appeal-left-filters">

          {/* DROPDOWN */}
          <div className="rti-filter-wrapper">
            <select className="rti-select">
              <option>--Select--</option>
              <option>CompNo</option>
              <option>Penalty</option>
              <option>Challan Amt</option>
              <option>Order No</option>
              <option>Challan No</option>
              <option>Challan Judgment No</option>
              <option>Order Date</option>
              <option>Order Uid</option>
            </select>
          </div>

          {/* SEARCH INPUT */}
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />

          {/* BUTTONS */}
          <button className="filter-btn">
            Filter
          </button>

          <button className="reset-btn">
            Reset
          </button>

        </div>

        {/* RIGHT SIDE */}
        <div className="appeal-right-search">
          <input
            type="text"
            placeholder="Search By Keyword"
            className="keyword-input"
          />
        </div>

      </div>

      {/* TABLE SECTION */}
      <div className="appeal-table-wrapper">

        <table className="appeal-table">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>CompNo</th>
              <th>Penalty</th>
              <th>Challan Amt</th>
              <th>Order No</th>
              <th>Challan No</th>
              <th>Challan Judgment No</th>
              <th>Order Date</th>
              <th>Order Uid</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="9" className="no-data">
                No Records Found
              </td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default RtiPage;