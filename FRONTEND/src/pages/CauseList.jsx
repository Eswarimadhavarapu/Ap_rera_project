import React, { useEffect, useState } from "react";
import "../styles/causeList.css";

export default function CauseList() {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [causeListData, setCauseListData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch API Data
  useEffect(() => {
    fetch(
      "https://0jv8810n-8080.inc1.devtunnels.ms/api/complint/all-hearings"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setCauseListData(data.data || []);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cause list:", error);
        setLoading(false);
      });
  }, []);

  // Format Date

  const formatHearingTime = (dateTime) => {
    if (!dateTime) return "N/A";

    try {
      // Example: 20-05-2026 11:30:00
      const [date, time] = dateTime.split(" ");

      if (!date || !time) {
        return dateTime;
      }

      const [hours, minutes] = time
        .split(":")
        .map(Number);

      // Add 2 hours
      const endHours = hours + 2;

      const startTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      const endTime = `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      return (
        <>
          <div>{date}</div>
          <div>
            {startTime} - {endTime}
          </div>
        </>
      );
    } catch {
      return dateTime;
    }
  };


  // const formatDate = (date) => {
  //   if (!date) return "N/A";

  //   try {
  //     let formattedDate;


  //     if (date.includes("-")) {
  //       const parts = date.split("-");


  //       if (parts[0].length === 2) {
  //         formattedDate = new Date(
  //           `${parts[2]}-${parts[1]}-${parts[0]}`
  //         );
  //       } else {

  //         formattedDate = new Date(date);
  //       }
  //     } else {
  //       formattedDate = new Date(date);
  //     }


  //     if (isNaN(formattedDate.getTime())) {
  //       return "N/A";
  //     }

  //     return formattedDate.toLocaleDateString("en-IN", {
  //       day: "2-digit",
  //       month: "short",
  //       year: "numeric",
  //     });
  //   } catch (error) {
  //     return "N/A";
  //   }
  // };

  // Search + Date Filter
  const filteredData = causeListData.filter((item) => {
    const searchValue = search.toLowerCase();

    // Search filter
    const searchMatch =
      !searchValue ||
      String(item.case_no || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(item.complaint_name || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(item.respondent_name || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(item.status || "")
        .toLowerCase()
        .includes(searchValue);

    // Date filter
    // From Date & To Date Filter
    const itemDate = (() => {
      if (!item.hearing_date) return null;

      const onlyDate = item.hearing_date.split(" ")[0];
      const parts = onlyDate.split("-");

      if (parts.length === 3) {
        const [day, month, year] = parts;

        return new Date(`${year}-${month}-${day}`);
      }

      return null;
    })();

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const dateMatch =
      (!from || itemDate >= from) &&
      (!to || itemDate <= to);

    return searchMatch && dateMatch;
  });


  return (
    <div className="causelist-page-wrapper">
      <div className="causelist-container">

        {/* Breadcrumb */}
        <div className="causelist-breadcrumb">
          <span>You are here : </span>
          <a href="/home">Home</a> / Complaint Corner /
          <span> Cause List</span>
        </div>

        {/* Heading */}
        <h2 className="causelist-main-heading">
          Cause List
        </h2>

        {/* Search Section */}
        <div className="causelist-search-section">

          {/* Date Filter */}
          <div className="date-filter-box">
            <label className="date-label">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
              className="date-input"
            />
          </div>

          <div className="date-filter-box">
            <label className="date-label">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
              className="date-input"
            />
          </div>

          {/* Search Bar */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search Complaint No, Name..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="causelist-search-input"
            />
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button className="search-btn">
              Search
            </button>

            <button
              className="ca-reset-btn"
              onClick={() => {
                setSearch("");
                setFromDate("");
                setToDate("");
              }}
            >
              Reset
            </button>
          </div>

        </div>

        {/* Table */}
        <div className="causelist-table-wrapper">
          <table className="causelist-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Complaint / Case No</th>
                <th>Complaint Name</th>
                <th>Respondent Name</th>
                <th>Status</th>
                <th>Hearing Date</th>
                <th>Next Hearing</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    Loading Cause List...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{item.case_no || "N/A"}</td>

                    <td>{item.complaint_name || "N/A"}</td>

                    <td>{item.respondent_name || "N/A"}</td>

                    {/* Status */}
                    <td>
                      <span
                        className={`status-badge ${(
                          item.status || "pending"
                        ).toLowerCase()}`}
                      >
                        {item.status || "Pending"}
                      </span>
                    </td>

                    {/* Hearing Date */}
                    <td>
                      {formatHearingTime(item.hearing_date)}
                    </td>

                    {/* Next Hearing */}
                    <td>
                      {formatHearingTime(item.next_hearing_date)}
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