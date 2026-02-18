import "../styles/preview.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://0jv8810n-8080.inc1.devtunnels.ms";

const getFileUrl = (path) => {
  if (!path) return null; // Return null instead of "#" for invalid paths
  return `${BASE_URL}/api/${path}`;
};

const PreviewOther = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // ✅ Get Yes/No from AgentDetails
  // ===== YES / NO FLAGS (NAVIGATION + API FALLBACK) =====

  /* ================= STATE ================= */

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= IDS ================= */

  const [ids] = useState(() => ({
    application_id: location.state?.application_id,
    organisation_id: location.state?.organisation_id,
    pan_card_number: location.state?.pan_card_number,
  }));

  const { application_id, organisation_id, pan_card_number } = ids;

  /* ================= API CALL ================= */

  useEffect(() => {
    if (!organisation_id || !pan_card_number) {
      navigate("/agent-details"); // change if needed
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/agent/other-than-individual/details`,
          {
            params: {
              organisation_id,
              pan_card_number,
            },
          }
        );

        if (res.data.status === "success") {
          console.log("API Full Response:", res.data);
          setApiData(res.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organisation_id, pan_card_number, navigate]);

  /* ================= DATA ================= */

  const data = apiData || {};

  const org = apiData?.organisation || {};
  // ===== YES / NO FLAGS (NAV + API FALLBACK) =====
  const nav = location.state || {};

  const finalHasProjects =
    nav.hasProjects ||
    (org.last_five_year_projects?.length > 0 ? "Yes" : "No");

  const finalHasOtherRera =
    nav.hasOtherRera ||
    (org.other_state_rera_details?.length > 0 ? "Yes" : "No");

  const finalHasLitigation =
    nav.hasLitigation || (apiData?.litigation?.case_no ? "Yes" : "No");

  const itrs = apiData?.itr || {
    itr1: apiData?.itr_year1_doc,
    itr2: apiData?.itr_year2_doc,
    itr3: apiData?.itr_year3_doc,
  };

  const director = apiData?.entity || {};
  const auth = apiData?.authorized || {};
  const litigation = apiData?.litigation || {};
  const hasLitigationFinal = finalHasLitigation;

  const directors = apiData?.entity ? [apiData.entity] : [];

  const projects = org.last_five_year_projects || [];

  const litigations = apiData?.litigation ? [apiData.litigation] : [];

  const otherStates = org.other_state_rera_details || [];

  /* ================= HELPER FUNCTION FOR DOCUMENT LINKS ================= */
  const renderDocumentLink = (docPath, linkText = "View") => {
    const fileUrl = getFileUrl(docPath);
    if (!fileUrl || !docPath) {
      return <span className="mpreview-na">NA</span>;
    }
    return (
      <a href={fileUrl} target="_blank" rel="noreferrer">
        {linkText}
      </a>
    );
  };

  /* ================= LOADING / ERROR ================= */

  if (loading) {
    return <div className="mpreview-loading">Loading...</div>;
  }

  if (error) {
    return <div className="mpreview-error">{error}</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="mpreview-page-container">
      {/* TITLE */}
      <h2 className="mpreview-title">Real Estate Agent Registration</h2>

      {/* ================= STEPPER ================= */}
      <div className="mpreview-stepper">
        {[
          "Agent Detail",
          "Upload Documents",
          "Preview",
          "Payment",
          "Acknowledgement",
        ].map((step, i) => {
          const isCompleted = i < 2; // Step 1 & 2 done
          const isActive = i === 2; // Step 3 = Preview

          return (
            <div
              key={i}
              className={`mpreview-step 
                ${isCompleted ? "completed" : ""} 
                ${isActive ? "active" : ""}`}
            >
              <div className="circle">{i + 1}</div>
              <span>{step}</span>
            </div>
          );
        })}
      </div>

      {/* ================= AGENT TYPE ================= */}
      <div className="mpreview-agent-type">
        <b>Agent Type : Other Than Individual</b>
      </div>

      {/* ================= ORGANISATION ================= */}

      <section className="mpreview-section">
        <h3 className="mpreview-heading">Organisation Details</h3>

        <div className="mpreview-grid">
          <p>
            <b>Organisation Type:</b> {org.organisation_type || "NA"}
          </p>
          <p>
            <b>Organisation Name:</b> {org.organisation_name || "NA"}
          </p>

          <p>
            <b>Registration No:</b> {org.registration_identifier || "NA"}
          </p>
          <p>
            <b>Date of Registration:</b> {org.registration_date || "NA"}
          </p>

          <p>
            <b>Registration Certificate:</b>{" "}
            {renderDocumentLink(org.registration_cert_doc)}
          </p>

          <p>
            <b>PAN Card Number:</b> {org.pan_card_number || "NA"}
          </p>

          <p>
            <b>PAN card Proof:</b>{" "}
            {renderDocumentLink(org.pan_card_doc)}
          </p>

          <p>
            <b>Email ID:</b> {org.email_id || "NA"}
          </p>
          <p>
            <b>Mobile Number:</b> {org.mobile_number || "NA"}
          </p>

          <p>
            <b>GST Num:</b> {org.gst_number || "NA"}
          </p>

          <p>
            <b>GST Num Document:</b>{" "}
            {renderDocumentLink(org.gst_doc)}
          </p>

          <p>
            <b>Memorandum of articles/Bye-laws:</b>{" "}
            {renderDocumentLink(org.address_proof_doc)}
          </p>
        </div>
      </section>

      {/* ================= LOCAL ADDRESS ================= */}

      <section className="mpreview-section">
        <h3 className="mpreview-heading">Local Address For Communication</h3>

        <div className="mpreview-grid">
          <p>
            <b>Address Line 1:</b> {org.address_line1 || "NA"}
          </p>

          <p>
            <b>Address Line 2:</b> {org.address_line2 || "NA"}
          </p>

          <p>
            <b>State:</b> {org.state || "NA"}
          </p>

          <p>
            <b>District:</b> {org.district || "NA"}
          </p>

          <p>
            <b>Mandal:</b> {org.mandal || "NA"}
          </p>

          <p>
            <b>Village:</b> {org.village || "NA"}
          </p>

          <p>
            <b>PIN Code:</b> {org.pincode || "NA"}
          </p>
          <p>
            <b>Address proof :</b>{" "}
            {renderDocumentLink(org.address_proof_doc)}
          </p>
        </div>
      </section>

      {/* ================= DIRECTOR DETAILS ================= */}

      <section className="mpreview-section">
       <h3 className="mpreview-heading">
  {org.organisation_type === "Trust/Society"
    ? "Trust Details"
    : org.organisation_type === "Partnership/LLP Firm"
    ? "Partner Details"
    : "Director Details"}
</h3>
        {/* Scroll Wrapper */}
        <div className="mpreview-table-wrapper">
          <table className="mpreview-director-table wide-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Nationality</th>
                <th>Designation</th>
                <th>Name</th>
                <th>DIN</th>
                <th>Aadhaar</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>State/UT</th>
                <th>District</th>
                <th>Address Line 1</th>
                <th>Address Line 2</th>
                <th>PIN Code</th>
                <th>PAN</th>
                <th>Address Proof</th>
                <th>PAN Proof</th>
                <th>Aadhaar Proof</th>
                <th>Photo</th>
              </tr>
            </thead>

            <tbody>
              {directors.map((d, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>Indian</td> {/* Static if API not sending */}
                  <td>{d.designation || "NA"}</td>
                  <td>{d.name || "NA"}</td>
                  <td>{d.din_number || "NA"}</td>
                  <td>{d.aadhaar_number || "NA"}</td>
                  <td>{d.email_id || "NA"}</td>
                  <td>{d.mobile_number || "NA"}</td>
                  <td>{d.state_ut || "NA"}</td>
                  <td>{d.district || "NA"}</td>
                  <td>{d.address_line1 || "NA"}</td>
                  <td>{d.address_line2 || "NA"}</td>
                  <td>{d.pincode || "NA"}</td>
                  <td>{d.pan_card_number || "NA"}</td>
                  <td>{renderDocumentLink(d.address_proof)}</td>
                  <td>{renderDocumentLink(d.pan_card_doc)}</td>
                  <td>{renderDocumentLink(d.aadhaar_doc)}</td>
                  <td>
                    {d.photograph ? (
                      <img
                        src={getFileUrl(d.photograph)}
                        alt="Photo"
                        className="mpreview-photo"
                      />
                    ) : (
                      <span className="mpreview-na">NA</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= AUTHORIZED ================= */}

      <section className="mpreview-section">
        <h3 className="mpreview-heading">Authorized Signatory</h3>

        <div className="mpreview-grid">
          <p>
            <b>Name:</b> {auth.name || "NA"}
          </p>
          <p>
            <b>Mobile Number:</b> {auth.mobile_number || "NA"}
          </p>
          <p>
            <b>Email ID:</b> {auth.email_id || "NA"}
          </p>

          <p>
            <b>Photo:</b>{" "}
            {auth.photo ? (
              <img
                src={getFileUrl(auth.photo)}
                className="mpreview-photo-large"
                alt="Authorized"
              />
            ) : (
              <span className="mpreview-na">NA</span>
            )}
          </p>

          <p>
            <b>Board Resolution for authorized signatory:</b>{" "}
            {renderDocumentLink(auth.board_resolution)}
          </p>
        </div>
      </section>

      {/* ================= PROJECTS ================= */}

      <section className="mpreview-section">
        <h3 className="mpreview-heading">
          Projects Launched In The Past 5 Years
        </h3>

        <p className="mpreview-yesno">
          <b>Last five years project details :</b> {finalHasProjects}
        </p>

        {finalHasProjects === "Yes" && (
          <table className="mpreview-director-table mpreview-normal-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Project Name</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{p.project_name || "NA"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ================= LITIGATIONS ================= */}

      <section className="mpreview-section">
        <h3 className="mpreview-heading">Litigations</h3>

        <p className="mpreview-yesno">
          <b>Any Civil/Criminal Cases :</b> {hasLitigationFinal}
        </p>

{/* Show affidavit only when Litigation = NO */}
{hasLitigationFinal === "No" && (
  <p>
    <b>Self Declared Affidavit :</b>{" "}
    {renderDocumentLink(litigation?.self_declared_affidavit)}
  </p>
)}

        {/* Show table ONLY if Yes */}
        {hasLitigationFinal === "Yes" && (
          <div className="mpreview-table-wrapper">
            <table className="mpreview-director-table wide-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Case No</th>
                  <th>Tribunal Name & Place</th>
                  <th>Petitioner</th>
                  <th>Respondent</th>
                  <th>Facts</th>
                  <th>Status</th>
                  <th>Interim</th>
                  <th>Final</th>
                </tr>
              </thead>

              <tbody>
                {litigations.map((l, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{l.case_no || "NA"}</td>
                    <td>{l.tribunal_name_place || "NA"}</td>
                    <td>{l.petitioner_name || "NA"}</td>
                    <td>{l.respondent_name || "NA"}</td>
                    <td>{l.case_facts || "NA"}</td>
                    <td>{l.present_status || "NA"}</td>
                    <td>{renderDocumentLink(l.interim_order)}</td>
                    <td>{renderDocumentLink(l.final_order_details)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ================= OTHER STATE RERA ================= */}

      <section className="mpreview-section">
        <h3 className="mpreview-heading">
          Other State/UT RERA Registration Details
        </h3>

        <p className="mpreview-yesno">
          <b>Do you have registration in other states :</b> {finalHasOtherRera}
        </p>

        {finalHasOtherRera === "Yes" && (
          <div className="mpreview-table-wrapper">
            <table className="mpreview-director-table wide-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Registration Number</th>
                  <th>State/UT</th>
                  <th>District</th>
                </tr>
              </thead>

              <tbody>
                {otherStates.map((s, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{s.rera_no || "NA"}</td>
                    <td>{s.state || "NA"}</td>
                    <td>{s.district || "NA"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ================= ITR DETAILS ================= */}

      <section className="mpreview-section">
        <h3 className="mpreview-heading">ITR Details</h3>

        <div className="mpreview-table-wrapper">
          <table className="mpreview-director-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>ITR Of Preceding Year 1</th>
                <th>ITR Of Preceding Year 2</th>
                <th>ITR Of Preceding Year 3</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>{renderDocumentLink(org.itr_year1_doc)}</td>
                <td>{renderDocumentLink(org.itr_year2_doc)}</td>
                <td>{renderDocumentLink(org.itr_year3_doc)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= DECLARATION ================= */}

      <section className="mpreview-section">
        <h3 className="mpreview-heading">Declaration</h3>

        <div className="mpreview-declaration">
          <label className="mpreview-declare-line">
            <input type="checkbox" />
            I/We <b>{org.organisation_name || "Applicant"}</b> solemnly affirm
            and declare that the particulars given above are correct.
          </label>

          <div className="mpreview-otp-row">
            <div>
              <label>
                Mobile Number <span className="mpreview-required">*</span>
              </label>

              <input
                type="text"
                value={org.mobile_number || "6301836044"}
                readOnly
              />
            </div>

            <button className="mpreview-otp-btn">Get OTP</button>
          </div>
        </div>
      </section>

      {/* ================= ACTION ================= */}

      <div className="mpreview-actions">
        <button className="mpreview-btn" onClick={() => window.print()}>
          Print
        </button>

        <button
          className="mpreview-btn primary"
          onClick={() =>
            navigate("/agent-paymentpage", {
              state: {
                application_no: org.application_id,
                name: director.name,
                mobile: org.mobile_number,
              },
            })
          }
        >
          Proceed to Pay
        </button>
      </div>
    </div>
  );
};

export default PreviewOther;