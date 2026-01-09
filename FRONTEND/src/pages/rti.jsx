import { useState } from "react";
import "../styles/rti.css";

export default function RTI() {
  const [open, setOpen] = useState(1);

  const toggle = (id) => {
    setOpen(open === id ? null : id);
  };

  return (
    <div className="rti-wrapper">

      {/* Breadcrumb */}
      <div className="breadcrumb">
  <div className="breadcrumb-inner">
    You are here :
    <a href="/"> Home</a> /
    <a href="/about-us"> About Us</a> /
    <span className="active"> RTI</span>
  </div>
</div>


      <div className="rti-container">
        <h2>THE RIGHT TO INFORMATION ACT 2005</h2>
        <div className="title-line"></div>

        <p className="intro-text">
          An Act to provide for setting out the practical regime of right to
          information for citizens to secure access to information under the
          control of public authorities, in order to promote transparency and
          accountability in the working of every public authority, the
          constitution of a Central Information Commission and State Information
          Commissions and for matters connected therewith or incidental thereto.
        </p>

        {/* RTI Act */}
        <div className="acc-header dark" onClick={() => toggle(1)}>
          {open === 1 ? "−" : "+"} Right To Information Act 2005
        </div>
        {open === 1 && (
          <div className="acc-body blue-left">
            <a href="#" className="rti-link">RTI Act 2005</a><br />
            <a href="#" className="rti-link">సమాచార హక్కు చట్టం 2005</a>
          </div>
        )}

        {/* Notification */}
        <div className="acc-header dark" onClick={() => toggle(2)}>
          {open === 2 ? "−" : "+"} Notification
        </div>
        {open === 2 && (
          <div className="acc-body blue-left">
            <p className="red-text">
              This content will be published very soon...
            </p>
          </div>
        )}

        {/* Appeals */}
        <div className="acc-header dark" onClick={() => toggle(3)}>
          {open === 3 ? "−" : "+"} Appeals
        </div>
        {open === 3 && (
          <div className="acc-body blue-left">
            <p>
              <b>The First Appeal:</b> The first appeal to the officer senior in
              rank to the PIO in the concerned public authority within 30 days
              from the expiry of the prescribed time limit or from the receipt of
              the decision (delay may be condoned by the appellate authority if
              sufficient cause is shown).
            </p>
            <p>
              <b>The Second Appeal:</b> The second appeal to the central
              information commission or the state information commission as the
              case may be, within 90 days of the date on which the decision was
              given or should have been made by the first appellate authority
              (delay may be condoned by the commission if sufficient cause is
              shown).
            </p>
            <p>
              <b>The Third Appeal:</b> The third party appeal against PIO's
              decision must be filed within 30 days before first appellate
              authority; and, within 90 days of the decision on the first appeal,
              before the appropriate information commission which is the second
              appellate authority.
            </p>
          </div>
        )}

        {/* CPIO / APIO */}
        <div className="acc-header dark" onClick={() => toggle(4)}>
          {open === 4 ? "−" : "+"} CPIO, Appellate Authority Contact Details
        </div>
        {open === 4 && (
          <div className="acc-body">
            <table className="rti-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Designation of the Officer</th>
                  <th>Designation under RTI Act</th>
                  <th>Mobile Number</th>
                  <th>Email Address</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Smt K Naga Sundari</td>
                  <td>Director</td>
                  <td>Appellate Authority</td>
                  <td>9347271464</td>
                  <td>nagasundari.k@gov.in</td>
                  <td>
                    D.No.: 60-5-1, 3rd & 4th Floors, Y Tower, Siddhartha Nagar 1st
                    Lane, Pinnamaneni Polyclinic Road, Vijayawada – 520010,
                    Krishna District, Andhra Pradesh.
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>SRI M Ranga Prasad</td>
                  <td>Assistant Director</td>
                  <td>Public Information Officer</td>
                  <td>8688300973</td>
                  <td>rp.makarla@gov.in</td>
                  <td>Vijayawada</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Smt Y.N.L. Sirisha</td>
                  <td>TPS</td>
                  <td>Asst. Public Information Officer</td>
                  <td>9989890596</td>
                  <td>nlsirisha.yerrapothu@ap.gov.in</td>
                  <td>Krishna District, Andhra Pradesh</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Section 4(1)(b) */}
        <div className="acc-header dark" onClick={() => toggle(5)}>
          {open === 5 ? "−" : "+"} Published information as per Right to
          Information Act, 2005, Sec 4(1)(b)
        </div>
        {open === 5 && (
          <div className="acc-body blue-left">
            <p className="red-text">
              This content will be published very soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}