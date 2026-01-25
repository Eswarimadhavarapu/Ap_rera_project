import "../styles/Certificate.css";
import html2pdf from "html2pdf.js";


const Certificate = () => {

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById("certificate-print");

    html2pdf()
      .set({
        margin: 10,
        filename: "APRERA_Extension_Certificate.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .from(element)
      .save();
  };

  return (
    <div className="c-cert-page">

      {/* CERTIFICATE ONLY */}
      <div className="c-cert-paper" id="certificate-print">

        {/* HEADER */}
        <div className="c-cert-header">
          <img
            src="/assets/images/logo.jpg"
            alt="AP RERA"
            className="cert-logo"
          />
          <div className="c-cert-title">
            CERTIFICATE FOR EXTENSION OF REGISTRATION OF PROJECT
          </div>
        </div>

        {/* DATE */}
        <div className="c-cert-date-row">
          Dated: As per digital signature
        </div>

        <hr className="c-cert-line" />

        {/* REGISTRATION ROW */}
        <div className="c-reg-row">
          <p className="c-reg-text">
            This extension of registration is granted under section 6 of the Act,
            with project registration No.
          </p>

          <div className="c-reg-box">
            {["P","0","4","6","5","0","1"].map((v,i)=>(
              <span key={i}>{v}</span>
            ))}
          </div>
        </div>

        <p>
          The registration is granted under section 5 of the Act with registration
          period from <b>25 APRIL 2022</b> to <b>27 JANUARY 2025</b>.
        </p>

        <p><b>Project Name :</b> JUPUDY ELITE BY NXTSPACE</p>
        <p><b>Promoter Name :</b> M/s. NXTSPACE ENTERPRISES</p>
        <p>
          <b>Project Address :</b> D No. 90-5-120, Alcott Gardens, 533101,
          Ward-18(V), Rajamahendravaram(U)(M), East Godavari(D).
        </p>

        {/* CONDITIONS */}
        <ol className="c-main-list">
          <li>
            <b>NXTSPACE ENTERPRISES</b>, having its registered office/principal
            place of business at H No. 6/254, 6<sup>th</sup> Block,
            5<sup>th</sup> Floor, 533342, Anaparthi(V), Anaparthi(M),
            East Godavari(D), has applied for extension of project registration.
          </li>

          <li>
            This renewal of registration is granted subject to the following
            conditions, namely:-
            <ol className="c-roman-list">
              <li>
                The promoter shall execute and register a conveyance deed in favour
                of the allottee or the association of the allottees, as the case may be,
                of the apartment or the common areas as per section 17.
              </li>

              <li>
                The promoter shall deposit seventy percent of the amounts realized
                by the promoter in a separate account to be maintained in a scheduled
                bank to cover the cost of construction and the land cost to be used
                only for that purpose as per sub-clause (D) of clause (1) of
                sub-section (2) of section 4.
              </li>

              <li>
                The registration shall be valid for a period of <b>one</b> year
                commencing from <b>28 JANUARY 2025</b> and ending with{" "}
                <b>27 JANUARY 2026</b> unless renewed by the Real Estate Regulatory
                Authority in accordance with section 6 read with rule 7 of the Act.
              </li>

              <li>
                The promoter shall comply with the provisions of the Act and the
                rules and regulations made thereunder.
              </li>

              <li>
                The promoter shall not contravene the provisions of any other law
                for the time being in force in the area where the project is being
                developed.
              </li>

              {/* ✅ NEW POINT (vi) ADDED */}
              <li>
                If the above mentioned conditions are not fulfilled by the promoter,
                the regulatory authority may take necessary action against the
                promoter including revoking the registration granted herein, as per
                the Act and the rules and regulations made thereunder.
              </li>
            </ol>
          </li>
        </ol>

        {/* SIGNATURE */}
        <div className="c-cert-sign">
          Signature of the Regulatory Authority <br />
          AP Real Estate Regulatory Authority
        </div>

      </div>

      {/* BUTTONS — OUTSIDE BORDER */}
      <div className="c-cert-actions c-no-print">
        <button className="c-print-btn" onClick={handlePrint}>Print</button>
        <button className="c-download-btn" onClick={handleDownload}>Download</button>
      </div>

    </div>
  );
};

export default Certificate;