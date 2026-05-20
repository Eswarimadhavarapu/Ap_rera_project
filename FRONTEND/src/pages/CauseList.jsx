import React, { useEffect, useState } from "react";
import "../styles/causeList.css";

export default function CauseList() {
  const [search, setSearch] = useState("");
  const [causeListData, setCauseListData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch API Data
  useEffect(() => {
    fetch("https://l9tzq6m2-8080.inc1.devtunnels.ms/api/complint/list")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setCauseListData(data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cause list:", error);
        setLoading(false);
      });
  }, []);

  // Search Filter
  const filteredData = causeListData.filter((item) =>
    String(item.complaint_id)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="causelist-page-wrapper">
      <div className="causelist-container">

        {/* Breadcrumb */}
        <div className="causelist-breadcrumb">
          <span>You are here : </span>
          <a href="/">Home</a> / Complaint Corner /{" "}
          <span>Cause List</span>
        </div>

        {/* Heading */}
        <h2 className="causelist-main-heading">
          Cause List
        </h2>

        {/* Search */}
        <div className="causelist-search-section">
          <input
            type="text"
            placeholder="Search Complaint Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="causelist-search-input"
          />
        </div>

        {/* Table */}
        <div className="causelist-table-wrapper">
          <table className="causelist-table">

            <thead>
              <tr>
                <th>Sr No</th>
                <th>Complaint No</th>
                <th>Complainant</th>
                <th>Respondent</th>
                <th>Last Hearing Date</th>
                <th>Application Type</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.complaint_id}>
                    <td>{index + 1}</td>

                    <td>{item.complaint_id}</td>

                    <td>
                      {item.complainant_name || "N/A"}
                    </td>

                    <td>
                      {item.respondent_name || "N/A"}
                    </td>

                    <td>
                      {item.last_hearing_date || "N/A"}
                    </td>

                    <td>
                      {item.application_type}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${item.status
                          .replace(/\s/g, "")
                          .toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No Cause List Found
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}