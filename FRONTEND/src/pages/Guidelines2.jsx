import "../styles/Guidelines2.css";

const Guidelines2 = () => {
  return (
    <div className="guidelines-wrapper">

      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        You are here : <span>Home</span> / <span>Registration</span> /{" "}
        <b>Guidelines for Registration</b>
      </div>

      {/* STEP 1 */}
      <div className="step-card">
        <div className="step-left step-red">
          <div className="step-arrow">
            <span>STEP</span>
            <strong>1</strong>
          </div>
        </div>

        <div className="step-content">
          <p>
            Download the forms for Project/Agent/Complaint Registration from
            the link given below.
          </p>
          <ul>
            <li>
              Application form for Project/Agent/Complaint Registration{" "}
              <a href="#" className="link-red">Click Here</a>
            </li>
          </ul>
          <p className="note">
            <b>NOTE :</b> The documents and Drawings must be self-attested and
            in PDF Format (70MB), Photo in JPEG Format (35mm × 45mm, 300 DPI,
            straight view/light background)
          </p>
        </div>

        <div className="step-icon step-red-bg">
          <img
            src="https://rera.ap.gov.in/RERA/images/download.png"
            alt="download"
          />
        </div>
      </div>

      {/* STEP 2 */}
      <div className="step-card">
        <div className="step-left step-orange">
          <div className="step-arrow">
            <span>STEP</span>
            <strong>2</strong>
          </div>
        </div>

        <div className="step-content">
          <p>
            Fill the required application form printable/digital, it would be
            more useful during the submission for online application.
          </p>
        </div>

        <div className="step-icon step-orange-bg">
          <img
            src="https://rera.ap.gov.in/RERA/images/application.png"
            alt="application"
          />
        </div>
      </div>

      {/* STEP 3 */}
      <div className="step-card">
        <div className="step-left step-blue">
          <div className="step-arrow">
            <span>STEP</span>
            <strong>3</strong>
          </div>
        </div>

        <div className="step-content">
          <p>
            For better understanding of registration screens verify the below
            user manuals and videos tutorials.
          </p>
          <ul>
            <li>
              User manuals for Project/Agent/Complaint Registration{" "}
              <a href="#" className="link-blue">Click Here</a>
            </li>
            <li>
              Video tutorials <a href="#" className="link-blue">Click Here</a>
            </li>
          </ul>
        </div>

        <div className="step-icon step-blue-bg">
          <img
            src="https://rera.ap.gov.in/RERA/images/help.png"
            alt="help"
          />
        </div>
      </div>
    </div>
  );
};

export default Guidelines2;