import React, { useState } from "react";
import "../styles/CaseStatus.css";

import { MdRefresh } from "react-icons/md";

const CaseStatus = () => {

  const [showModal, setShowModal] = useState(false);

  const [activeTab, setActiveTab] = useState("case");
  const [caseNumber, setCaseNumber] = useState("");

const [complaints, setComplaints] = useState([]);
const [selectedComplaint, setSelectedComplaint] =
  useState(null);
const handleSearch = async () => {

  try {

    const response = await fetch(
      `https://0jv8810n-8080.inc1.devtunnels.ms/api/complint/search/${caseNumber}`
    );


    const data = await response.json();
    console.log(data);


    console.log("API RESPONSE =", data);

    if (data.status === "success") {

      console.log("DATA =", data.data);

      setComplaints(data.data);

    } else {

      setComplaints([]);

    }

  } catch (error) {

    console.log("ERROR =", error);

  }
};
const handleView = async (complaintId) => {

  try {

    const response = await fetch(
      `https://0jv8810n-8080.inc1.devtunnels.ms/api/complint/${complaintId}`
    );

    const data = await response.json();

    console.log("VIEW DATA =", data);

    setSelectedComplaint(data);

    setShowModal(true);

  } catch (error) {

    console.log(error);

  }

};
  return (

    <div className="case-page">

      <div className="case-container">

        <h1>Search Case Status</h1>

        {/* TABS */}
        <div className="top-tabs">

          <button>Party Name</button>

          <button className="active-tab">
            Case Number
          </button>

          <button>Counsel/Rep Name</button>

          <button>Complaint Type</button>

        </div>

        {/* FORM */}

        <div className="form-section">

          <div className="form-group">

            <label>
              Case/ Complaint Number *
            </label>

            <input
  type="text"
  placeholder="Enter Case/ Complaint Number"
  value={caseNumber}
  onChange={(e) =>
    setCaseNumber(e.target.value)
  }
/>

          </div>

          {/* CAPTCHA */}

          <div className="captcha-row">

            <div className="captcha-box">
              843622
            </div>

            <button className="refresh-btn">

              <MdRefresh />

            </button>

            <input
              type="text"
              placeholder="Enter Captcha Text"
              className="captcha-input"
            />

          </div>

          {/* BUTTONS */}

          <div className="btn-row">

         <button
  className="search-btn"
  onClick={handleSearch}
>
  Search
</button>

            <button
  className="clear-btn"
  onClick={() => {
    setCaseNumber("");
    setComplaints([]);
  }}
>
  Clear
</button>

          </div>

        </div>

        {/* TABLE */}

        <div className="table-section">

          <table>

            <thead>

              <tr>

                <th>Sr.No</th>

                <th>Complaint Number</th>

                <th>Complainant Name</th>

                <th>Respondent Name</th>

          

                <th>Pending For/ Date of Decision</th>

                <th>View Details</th>

              </tr>

            </thead>

            <tbody>

{
  complaints?.length > 0 ? (

    complaints.map((item, index) => (

      <tr key={item.complaint_id}>

        <td>{index + 1}</td>

        <td>
          {item.complaint_register_no || item.complaint_id}
        </td>

        <td>{item.complainant_name}</td>

        <td>{item.respondent_name}</td>


        <td>{item.created_at}</td>

        <td>

          <button
            className="view-btn"
            onClick={() =>
  handleView(item.complaint_id)
}
          >
            View
          </button>

        </td>

      </tr>

    ))

  ) : (

    <tr>

      <td
        colSpan="7"
        style={{
          textAlign: "center",
          padding: "20px"
        }}
      >
        No Data Found
      </td>

    </tr>

  )
}

</tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}

      {
        showModal && (

          <div className="modal-overlay">

            <div className="modal-box">

              {/* HEADER */}

              <div className="modal-header">

                <h2>
                 Details of {

selectedComplaint?.complainant?.name
|| "--"

}

(

{
selectedComplaint?.complaint
?.case_no || "--"
}

)
                </h2>

                <button
                  className="close-icon"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>

              </div>

              {/* MODAL TABS */}

              <div className="modal-tabs">

                <button
                  className={
                    activeTab === "case"
                      ? "active-tab"
                      : ""
                  }
                  onClick={() => setActiveTab("case")}
                >
                  Case Details
                </button>

                <button
                  className={
                    activeTab === "history"
                      ? "active-tab"
                      : ""
                  }
                  onClick={() => setActiveTab("history")}
                >
                  History of Case Hearing
                </button>

                <button
                  className={
                    activeTab === "orders"
                      ? "active-tab"
                      : ""
                  }
                  onClick={() => setActiveTab("orders")}
                >
                  Order(s) Details
                </button>

                <button
                  className={
                    activeTab === "transfer"
                      ? "active-tab"
                      : ""
                  }
                  onClick={() => setActiveTab("transfer")}
                >
                  Case Transfer Details
                </button>

              </div>

              {/* CASE DETAILS */}

              {
                activeTab === "case" && (

                  <div className="details-section">

                    <table>

                     
                     <tbody>

<tr>

<td>
Case/ Complaint Type
</td>

<td>
{
selectedComplaint?.complaint
?.application_type || "--"
}
</td>

</tr>

<tr>

<td>
Case/ Complaint Number
</td>

<td>
{
selectedComplaint?.complaint
?.case_no || "--"
}
</td>

</tr>

<tr>

<td>
Filing Date
</td>

<td>
{
selectedComplaint?.complaint
?.created_at || "--"
}
</td>

</tr>

<tr>

<td>
Name of Complainant
</td>

<td>
{
selectedComplaint?.complainant
?.name || "--"
}
</td>

</tr>

<tr>

<td>
Name of Respondent
</td>

<td>
{
selectedComplaint?.respondent
?.name || "--"
}
</td>

</tr>

<tr>

<td>
Registration Number
</td>

<td>
{
selectedComplaint?.complaint
?.registration_number || "--"
}
</td>

</tr>

<tr>

<td>
Project Name
</td>

<td>
{
selectedComplaint?.complaint
?.project_name || "--"
}
</td>

</tr>

<tr>

<td>
Pending For / Decision Date
</td>

<td>
{
selectedComplaint?.complaint
?.pending_date || "--"
}
</td>

</tr>

<tr>

<td>
Purpose
</td>

<td>
{
selectedComplaint?.complaint
?.purpose || "--"
}
</td>

</tr>

</tbody>

                    </table>

                  </div>

                )
              }

              {/* HISTORY */}

              {
                activeTab === "history" && (

                  <div className="details-section">

                    <table>

                      <thead>

<tr>

<th>Sr.No</th>

<th>
Case/ Complaint Number
</th>

<th>
Next Hearing Date Fixed
</th>

<th>
Purpose of Hearing
</th>

</tr>

</thead>

                      <tbody>

{
selectedComplaint?.hearings?.length > 0 ? (

selectedComplaint.hearings.map(
(item, index) => (

<tr key={index}>

<td>{index + 1}</td>

<td>
{
selectedComplaint?.complaint
?.case_no || "--"
}
</td>

<td>
{
item.next_hearing_date || "--"
}
</td>

<td>
{
item.status || "--"
}
</td>

</tr>

))

) : (

<tr>

<td colSpan="4">

--

</td>

</tr>

)
}

</tbody>

                    </table>

                  </div>

                )
              }

              {/* ORDERS */}

              {
                activeTab === "orders" && (

                  <div className="details-section">

                    <table>

                      <thead>

                        <tr>

                          <th>Sr.No</th>

                          <th>
                            Name or title of Document
                          </th>

                          <th>
                            Order Date/ Upload Date
                          </th>

                          <th>View PDF</th>

                        </tr>

                      </thead>

                      <tbody>

{
selectedComplaint?.orders?.length > 0 ? (

selectedComplaint.orders.map(
(item, index) => (

<tr key={index}>

<td>{index + 1}</td>

<td>
{
item.document_name || "--"
}
</td>

<td>
{
item.upload_date || "--"
}
</td>

<td>

{
item.file_url ? (

<a
href={item.file_url}
target="_blank"
rel="noreferrer"
>

<button className="pdf-btn">

View File

</button>

</a>

) : (

"--"

)

}

</td>

</tr>

))

) : (

<tr>

<td colSpan="4">

--

</td>

</tr>

)
}

</tbody>
                    </table>

                  </div>

                )
              }

              {/* TRANSFER */}

              {
                activeTab === "transfer" && (

                  <div className="details-section">

                    <table>

                      <thead>

                        <tr>

                          <th>Sr.No</th>

                          <th>From (Bench Name)</th>

                          <th>To (Bench Name)</th>

                          <th>Transfer Number</th>

                          <th>Transfer Date</th>

                        </tr>

                      </thead>

                      <tbody>

                        <tr>

                          <td>--</td>

                          <td>--</td>

                          <td>--</td>

                          <td>--</td>

                          <td>--</td>

                        </tr>

                      </tbody>

                    </table>

                  </div>

                )
              }

            </div>

          </div>

        )
      }

    </div>

  );
};

export default CaseStatus;