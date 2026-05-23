import React, { useState, useEffect } from "react";

import Modal from "react-modal";
import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import "../styles/hearingCalendar.css";
import { holidays } from "../data/holidays";
import { getCalendarHearings } from "../api/api";

/* IMPORTANT */
Modal.setAppElement("#root");

const HearingCalendar = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [modalOpen, setModalOpen] = useState(false);

  const [hearingData, setHearingData] = useState({});

  useEffect(() => {

  const loadCalendarHearings = async () => {

    try {

      const response = await getCalendarHearings();

      if (response.data) {

  setHearingData(response.data);

}

    } catch (error) {

      console.error(
        "Failed to load calendar hearings:",
        error
      );

    }

  };

  loadCalendarHearings();

}, []);

  /* FORMAT DATE */

  const formatDate = (date) => {

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

  const formattedDate = formatDate(selectedDate);

  /* GET HEARINGS */

  const hearings = hearingData[formattedDate] || [];

  /* CALENDAR COLORS */

  const tileClassName = ({ date, view }) => {

    if (view === "month") {

      const formatted = formatDate(date);

      /* HOLIDAY */

      if (holidays.includes(formatted)) {
        return "holiday-date";
      }

      /* HEARING DATE */

      if (hearingData[formatted]) {
        return "hearing-date";
      }
    }
  };

  return (

    <div className="calendar-main-container">

      {/* TITLE */}

      <h2 className="calendar-title">
        Hearing Calendar
      </h2>

      {/* MAIN LAYOUT */}
       
      <div className="calendar-content">

        {/* LEFT SIDE */}

        <div className="calendar-left">

          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
          />

        </div>

        {/* RIGHT SIDE */}

        <div className="calendar-right">

          <h3>Hearing Summary</h3>

          <p>
            <strong>Date:</strong> {formattedDate}
          </p>

          <p>
            <strong>Total Hearings:</strong> {hearings.length}
          </p>

          {
            hearings.length > 0 ? (

              <button
                className="view-btn"
                onClick={() => setModalOpen(true)}
              >
                View Hearings
              </button>

            ) : (

              <div className="no-hearing">
                No Hearings Available
              </div>

            )
          }

        </div>

      </div>

      {/* MODAL */}

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="hearing-modal"
        overlayClassName="overlay"
      >

        {/* MODAL HEADER */}

        <div className="modal-header">

          <h2>Hearing Details</h2>

          <button
            className="close-btn"
            onClick={() => setModalOpen(false)}
          >
            ×
          </button>

        </div>

        {/* MODAL CONTENT */}

        <div className="modal-content">

          {
            hearings.map((item, index) => (

              <div
                className="hearing-card"
                key={index}
              >

                <h4>{item.caseNo}</h4>

                <p>
                  <strong>Complainant:</strong> {item.complainant}
                </p>

                <p>
                  <strong>Respondent:</strong> {item.respondent}
                </p>

                <p>
                  <strong>Time:</strong> {item.time}
                </p>

                <p>
                  <strong>Hall:</strong> {item.hall}
                </p>

                <p>
                  <strong>Status:</strong> {item.status}
                </p>

              </div>

            ))
          }

        </div>

      </Modal>

    </div>
  );
};

export default HearingCalendar;