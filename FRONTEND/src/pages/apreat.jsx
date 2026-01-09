import React from "react";
import "../styles/apreat.css";

export default function Apreat() {
  return (
    <>
      {/* ================= CONTENT ================= */}
      <div className="page-wrapper">
        <div className="content-box">
          <div className="breadcrumb">
            You are here : APREAT Contact Us
          </div>

          {/* CHAIRPERSON */}
          <div className="section-title">CHAIRPERSON</div>
          <div className="underline"></div>

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
                <td className="name">
                  HON'BLE JUSTICE SRI M. GANGARAO
                </td>
                <td>-</td>
                <td>-</td>
                <td>
                  <img
                    className="photo"
                    src="/public/images/JUSTICEMGangarao.jpg"
                    alt="Chairperson"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* MEMBERS */}
          <div className="section-title">MEMBERS</div>
          <div className="underline"></div>

          <table>
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
                <td className="name">
                  SRI RAMACHANDRA REDDY MANDALAPU
                </td>
                <td>-</td>
                <td>-</td>
                <td>
                  <img
                    className="photo"
                    src="/public/images/Ramachandrareddy sir.jpeg"
                    alt="Ramachandra Reddy Sir"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* REGISTRAR */}
          <div className="section-title">REGISTRAR</div>
          <div className="underline"></div>

          <table>
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
                <td className="name">SRI GUDURI RAMA KRISHNA</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

     
    </>
  );
}