import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getComplaints,
} from "../../api/api";

import "../../styles/legal.css";

const ComplaintList = () => {

  const navigate = useNavigate();

  const [complaints, setComplaints] =
    useState([]);

  const loadComplaints = async () => {

  try {

    const response =
      await getComplaints();

    console.log(response);

    setComplaints(
      response.data || []
    );

  } catch (error) {

    console.log(error);

  }
};

  useEffect(() => {
    loadComplaints();
  }, []);

  return (

    <div className="legal-complaint-container">

      <div className="legal-complaint-card">

        <div className="card-body">

          <h3 className="legal-complaint-title">
            Complaint List
          </h3>

          <div className="table-responsive">

            <table className="table legal-complaint-table">

              <thead>

                <tr>

                  <th>S.No</th>

                  <th>
                    Complaint Number
                  </th>

                  <th>
                    Complainant Name
                  </th>

                  <th>
  Respondent Name
</th>

<th>
  Status
</th>

<th>
  Action
</th>

                </tr>

              </thead>

              <tbody>

{
  complaints && complaints.length > 0 ? (

    complaints.map((item, index) => (

      <tr key={item.complaint_id}>

        <td>
          {index + 1}
        </td>

        <td>
          {item.complaint_register_no || "-"}
        </td>

        <td>
          {item.complainant_name || "-"}
        </td>

        <td>
          {item.respondent_name || "-"}
        </td>

        <td>

          <span className="badge bg-warning text-dark">

            {item.status}

          </span>

        </td>

        <td>

          <button
            className="btn btn-primary btn-sm"

            onClick={() =>
              navigate(
                `/admin/complaint/${item.complaint_id}`
              )
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
        colSpan="6"
        className="text-center"
      >
        No Complaints Found
      </td>

    </tr>

  )
}

</tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ComplaintList;