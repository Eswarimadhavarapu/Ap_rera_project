import React from "react";
import "../styles/apreat.css";

export default function Apreat() {
  return (
    <div className="apreat-page-wrapper">
      <div className="apreat-content-box">

        {/* Breadcrumb */}
        <div className="apreat-breadcrumb">
          You are here : APREAT Contact Us
        </div>

        {/* 🔽 INNER CONTENT */}
        <div className="apreat-inner-content">

          {/* CHAIRPERSON */}
          <div className="apreat-section-title">CHAIRPERSON</div>
          <div className="apreat-underline"></div>

          <table className="apreat-table">
            <thead className="apreat-thead">
              <tr>
                <th>S.No.</th>
                <th>Designation</th>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Email ID</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody className="apreat-tbody">
              <tr>
                <td>1</td>
                <td>CHAIRPERSON</td>
                <td className="apreat-name">
                  HON'BLE JUSTICE SRI M. GANGARAO
                </td>
                <td>-</td>
                <td>-</td>
                <td>
                  <img
                    className="apreat-photo"
                    src="../../public/assets/images/JUSTICEMGangarao.jpg"
                    alt="Chairperson"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* MEMBERS */}
          <div className="apreat-section-title">MEMBERS</div>
          <div className="apreat-underline"></div>

          <table className="apreat-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Designation</th>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Email ID</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>JUDICIAL MEMBER</td>
                <td className="apreat-name">
                  SRI RAMACHANDRA REDDY MANDALAPU
                </td>
                <td>-</td>
                <td>-</td>
                <td>
                  <img
                    className="apreat-photo"
                    src="../../public/assets/images/Ramachandrareddy sir.jpeg"
                    alt="Ramachandra Reddy Sir"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* REGISTRAR */}
          <div className="apreat-section-title">REGISTRAR</div>
          <div className="apreat-underline"></div>

          <table className="apreat-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Designation</th>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Email ID</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>REGISTRAR</td>
                <td className="apreat-name">SRI GUDURI RAMA KRISHNA</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}