import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Scale,
  CalendarDays,
  MapPin,
  BadgeCheck,
} from "lucide-react";

import "../../styles/hearingHistory.css";

const HearingHistory = () => {

  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHearing, setSelectedHearing] =
  useState(null);

const [openModal, setOpenModal] =
  useState(false);

  useEffect(() => {

    fetchHearings();

  }, []);

  const fetchHearings = async () => {

    try {

      const res = await axios.get(
        "https://n7vxv3pg-8081.inc1.devtunnels.ms/api/complint/all-hearings"
      );

      console.log("HEARINGS API 👉", res.data);

      setHearings(res.data.data || []);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="hearing-history-page">

      {/* HEADER */}

      <div className="hearing-top-section">

        <div>

          <h1>
            Hearing History
          </h1>

          <p>
            View all complaint hearings and status updates
          </p>

        </div>

        <div className="hearing-count-card">

          <Scale size={28} />

          <div>
            <h2>{hearings.length}</h2>
            <span>Total Hearings</span>
          </div>

        </div>

      </div>

      {/* LOADING */}

      {loading ? (

        <div className="hearing-loading">

          Loading hearings...

        </div>

      ) : hearings.length === 0 ? (

        <div className="hearing-empty">

          No hearings found

        </div>

      ) : (

        <div className="hearing-table-wrapper">

          <table className="hearing-table">

            <thead>

              <tr>
                <th>Case No</th>
                <th>Status</th>
                <th>Hearing Date</th>
                <th>Venue</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {hearings.map((item, index) => (

                <tr key={index}>

                  <td>

                    <div className="case-no">

                      #{item.case_no || "N/A"}

                    </div>

                  </td>

                  <td>

                    <div className="status-badge">

                      <BadgeCheck size={16} />

                      {item.status || "Pending"}

                    </div>

                  </td>

                  <td>

                    <div className="hearing-date">

                      <CalendarDays size={16} />

                      {item.hearing_date || "N/A"}

                    </div>

                  </td>

                  <td>

                    <div className="hearing-venue">

                      <MapPin size={16} />

                      {item.hearing_place || "N/A"}

                    </div>
                    

                  </td>
                   <td>

<button
  className="view-btn"
  onClick={() => {

    setSelectedHearing(item);

    setOpenModal(true);
  }}
>
  View
</button>

</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

{openModal && selectedHearing && (

  <div className="hearing-modal-overlay">

    <div className="hearing-modal">

      <div className="hearing-modal-header">

        <h2>
          Hearing Details
        </h2>

        <button
          className="modal-close-btn"
          onClick={() =>
            setOpenModal(false)
          }
        >
          ✕
        </button>

      </div>

      <div className="hearing-modal-body">

        <div className="hearing-detail-item">
          <strong>Case No:</strong>
          <span>
            {selectedHearing.case_no}
          </span>
        </div>

        <div className="hearing-detail-item">
          <strong>Status:</strong>
          <span>
            {selectedHearing.status}
          </span>
        </div>

        <div className="hearing-detail-item">
          <strong>Hearing Date:</strong>
          <span>
            {selectedHearing.hearing_date}
          </span>
        </div>

        <div className="hearing-detail-item">
          <strong>Next Hearing:</strong>
          <span>
            {selectedHearing.next_hearing_date || "N/A"}
          </span>
        </div>

        <div className="hearing-detail-item">
          <strong>Venue:</strong>
          <span>
            {selectedHearing.hearing_place}
          </span>
        </div>

        <div className="hearing-detail-item">
          <strong>Remarks:</strong>
          <span>
            {selectedHearing.remarks || "N/A"}
          </span>
        </div>

      </div>

    </div>

  </div>
)}
    </div>
  );
};

export default HearingHistory;