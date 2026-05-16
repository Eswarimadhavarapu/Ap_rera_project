import React from "react";

const HearingHistory = () => {

  return (

    <div>

      <h2>Hearing History</h2>

      <table className="table">

        <thead>
          <tr>
            <th>Case No</th>
            <th>Status</th>
            <th>Hearing Date</th>
            <th>Venue</th>
          </tr>
        </thead>

        <tbody>

          {/* map hearings here */}

        </tbody>

      </table>

    </div>
  );
};

export default HearingHistory;