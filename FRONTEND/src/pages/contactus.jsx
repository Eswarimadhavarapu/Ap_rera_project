import "../styles/ContactUs.css";

export default function ContactUs() {
  return (
    <div className="contactus-wrapper">

      {/* Breadcrumb */}
      <div className="contactus-breadcrumb-bar">
        You are here : <span>Home</span> / <span>About Us</span> /{" "}
        <span>Contact Us</span> / <b>APRERA</b>
      </div>

      {/* Help Desk */}
      <div className="contactus-helpdesk">
        Help Desk : <span>📞 6304906011</span>
      </div>

      {/* A. CHAIRPERSON */}
      <section>
        <h3 className="contactus-section-title">A. CHAIRPERSON</h3>
        <table className="contactus-data-table">
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
              <td>CHAIRPERSON</td>
              <td>SRI A. SIVA REDDY</td>
              <td>-</td>
              <td>chairperson@ap-rera.in</td>
              <td>
                <img src="../../public/assets/images/Chairperson_APRERA.jpeg" alt="Chairperson" />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* B. MEMBERS */}
      <section>
        <h3 className="contactus-section-title">B. MEMBERS</h3>
        <table className="contactus-data-table">
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
            {[
              ["1", "SRI RAJASEKHARA REDDY EADA", "rsr@ap-rera.in","Rajasekhar sir.jpeg"],
              ["2", "SRI U.S.L.N. KAMESWARA RAO", "kameswararao@ap-rera.in", "kameswararao sir.jpeg"],
              ["3", "SRI AVALA JAGANNADHA RAO", "ajrao1965@ap-rera.in", "JagannadhaRao Sir New.jpeg"],
              ["4", "SRI MANTRIRAO VENKATA RATNAM", "mantrirao@ap-rera.in", "Venkata Ratnam Sir.jpg"],
              ["5", "SRI SRINIVASA RAO DAMACHERLA", "dsrgntrm@ap-rera.in", "Srinivasa Rao Sir.jpg"],
              ["6", "SRI VENKATESWARLU MERUVA", "venkatmember@ap-rera.in", "Venkateswarlu Sir.jpg"],
              ["7", "SRI KULADEEP JUJJAVARAPU", "kuldeepmember@ap-rera.in", "Kuladeep Sir.png"],
            ].map((m, i) => (
              <tr key={i}>
                <td>{m[0]}</td>
                <td>MEMBER</td>
                <td>{m[1]}</td>
                <td>-</td>
                <td>{m[2]}</td>
                <td>
                  <img src={`/images/${m[3]}`} alt={m[1]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* C. ADJUDICATION */}
      <section>
        <h3 className="contactus-section-title">C. ADJUDICATION</h3>
        <table className="contactus-data-table">
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
              <td>ADJUDICATING OFFICER</td>
              <td>SRI SUVARNA RAJU</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* D. RTI */}
      <section>
        <h3 className="contactus-section-title">D. RTI</h3>
        <table className="contactus-data-table">
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
              <td>PUBLIC INFORMATION OFFICER</td>
              <td>SRI M RANGA PRASAD</td>
              <td>8688300973</td>
              <td>rp.makarla@ap-rera.in</td>
              <td>-</td>
            </tr>
            <tr>
              <td>2</td>
              <td>ASST. PUBLIC INFORMATION OFFICER</td>
              <td>SMT Y.N.L SIRISHA</td>
              <td>9989890596</td>
              <td>sirisha@ap-rera.in</td>
              <td>-</td>
            </tr>
            <tr>
              <td>3</td>
              <td>APPELLATE AUTHORITY</td>
              <td>SMT K NAGA SUNDARI</td>
              <td>9347271464</td>
              <td>director@ap-rera.in</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* E. ACCOUNTS & AUDIT */}
      <section>
        <h3 className="contactus-section-title">E. ACCOUNTS & AUDIT</h3>
        <table className="contactus-data-table">
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
              <td>ACCOUNTS OFFICER</td>
              <td>SRI G V SATYANARAYANA</td>
              <td>-</td>
              <td>accountsofficer@ap-rera.in</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ================= OFFICE SECTION ================= */}
      <section>
        <h3 className="contactus-section-title">Office</h3>

        <div className="contactus-office-box">
          <div className="contactus-office-left">
            <h4>ANDHRA PRADESH REAL ESTATE REGULATORY AUTHORITY</h4>
            <p>6th &amp; 7th Floors,</p>
            <p>APCRDA Project Office,</p>
            <p>Rayapudi, Tulluru Mandal,</p>
            <p>Amaravati, Guntur District,</p>
            <p>Andhra Pradesh. Pin - 522237.</p>

            <p className="contactus-office-help">
              <strong>Help Desk :</strong>{" "}
              <span>6304906011</span> (All Working Days, 10AM - 5.30PM)
            </p>

            <p className="contactus-office-mail">
              Write to<br />
              authority.aprera@gmail.com<br />
              helpdesk-rera@ap.gov.in<br />
              complaint@ap-rera.in
            </p>
          </div>

          <div className="contactus-office-right">
            <iframe
              title="APRERA Office"
              src="https://www.google.com/maps?q=16.5439,80.2911&z=15&output=embed"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
}