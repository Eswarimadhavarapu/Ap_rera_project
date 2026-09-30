import "../styles/ContactUs.css";
import { Link } from "react-router-dom";


export default function ContactUs() {
  return (
    <div className="contactuss-wrapper">

      {/* Breadcrumb */}
      <div className="contactuss-breadcrumb-bar">
  You are here :
  <Link to="/home" className="contactuss-breadcrumb-home">
    Home
    <span className="contactuss-home-underline"></span>
  </Link>
  <span className="contactuss-breadcrumb-sep"> / </span>

  <span className="contactuss-breadcrumb-text">About Us</span>
  <span className="contactuss-breadcrumb-sep"> / </span>

  <span className="contactuss-breadcrumb-text">Contact Us</span>
  <span className="contactuss-breadcrumb-sep"> / </span>

  <span className="contactuss-breadcrumb-active">Staff</span>
</div>

      {/* Help Desk */}
     {/* PAGE HEADER */}
<div className="contactuss-page-header">
  <div className="contactuss-header-row">

    {/* LEFT SIDE – EMPTY (or future title if needed) */}
    <div></div>

    {/* RIGHT SIDE – HELP DESK */}
    <div className="contactuss-helpdesk contactus-blink-effect">
      <span className="contactuss-helpdesk-text">Help Desk :</span>
      <span className="contactuss-helpdesk-icon">
        <img src="../../public/assets/images/image.png" />
      </span>
      <span className="contactuss-helpdesk-number">number</span>
    </div>

  </div>
</div>



      {/* A. CHAIRPERSON */}
      <section>
        {/* <h3 className="contactuss-section-title">A. CHAIRPERSON</h3> */}
        <h3 className="contactuss-section-title">JC TEST PAGE</h3>
        <table className="contactuss-data-table">
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
              <td>JC</td>
              <td>-</td>
              <td>Jhaishna Technologies pvt ltd</td>
              <td>
                <img src="../../public/assets/images/Chairperson_APRERA.jpeg" alt="Chairperson" />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* B. MEMBERS */}
      <section>
        <h3 className="contactuss-section-title">B. MEMBERS</h3>
        <table className="contactuss-data-table">
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
              // ["1", "SRI RAJASEKHARA REDDY EADA", "rsr@ap-rera.in","../../public/assets/images/Rajasekhar sir.jpeg"],
              // ["2", "SRI U.S.L.N. KAMESWARA RAO", "kameswararao@ap-rera.in", "../../public/assets/images/kameswararao sir.jpeg"],
              // ["3", "SRI AVALA JAGANNADHA RAO", "ajrao1965@ap-rera.in", "../../public/assets/images/JagannadhaRao Sir New.jpeg"],
              // ["4", "SRI MANTRIRAO VENKATA RATNAM", "mantrirao@ap-rera.in", "../../public/assets/images/Venkata Ratnam Sir.jpg"],
              // ["5", "SRI SRINIVASA RAO DAMACHERLA", "dsrgntrm@ap-rera.in", "../../public/assets/images/Srinivasa Rao Sir.jpg"],
              // ["6", "SRI VENKATESWARLU MERUVA", "venkatmember@ap-rera.in", "../../public/assets/images/Venkateswarlu Sir.jpg"],
              // ["7", "SRI KULADEEP JUJJAVARAPU", "kuldeepmember@ap-rera.in", "../../public/assets/images/Kuladeep Sir.png"],
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
        <h3 className="contactuss-section-title">C. ADJUDICATION</h3>
        <table className="contactuss-data-table">
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
              <td>name</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* D. RTI */}
      <section>
        <h3 className="contactuss-section-title">D. RTI</h3>
        <table className="contactuss-data-table">
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
              <td>name</td>
              <td>number</td>
              <td>officer@jhaishna.com</td>
              <td>-</td>
            </tr>
            <tr>
              <td>2</td>
              <td>ASST. PUBLIC INFORMATION OFFICER</td>
              <td>name</td>
              <td>number</td>
              <td>officer@jhaishna.com</td>
              <td>-</td>
            </tr>
            <tr>
              <td>3</td>
              <td>APPELLATE AUTHORITY</td>
              <td>name</td>
              <td>number</td>
              <td>director@jhaishna.com</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* E. ACCOUNTS & AUDIT */}
      <section>
        <h3 className="contactuss-section-title">E. ACCOUNTS & AUDIT</h3>
        <table className="contactuss-data-table">
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
              <td>name</td>
              <td>-</td>
              <td>accountsofficer@jhaishna.com</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ================= OFFICE SECTION ================= */}
      <section>
        <h3 className="contactuss-section-title">Office</h3>

        <div className="contactuss-office-box">
          <div className="contactuss-office-left">
            <h4>JC REAL ESTATE REGULATORY AUTHORITY</h4>
            <p>
        Jhaishna Technologies Pvt. Ltd.<br />
        [Office Address],<br />
        [City], [State],<br />
        India - [PIN Code].
      </p>

            <p className="contactuss-office-help">
              <strong>Help Desk :</strong>{" "}
              <span>mobile number</span> (All Working Days, 10AM - 5.30PM)
            </p>

            <p className="contactuss-office-mail">
              Write to<br />
              authority.rera@jhaishna.com<br />
              helpdesk-rera@jhaishna.com<br />
              complaint@jhaishna.com
            </p>
          </div>

          <div>
    <iframe
      src="YOUR_NEW_GOOGLE_MAPS_EMBED_URL"
      width="100%"
      height="450"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Jhaishna Technologies Office Location"
    ></iframe>
  </div>
</div>
      </section>
    </div>
  );
}