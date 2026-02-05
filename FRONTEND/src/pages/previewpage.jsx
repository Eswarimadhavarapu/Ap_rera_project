import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/previewpage.css";
import { apiGet, BASE_URL } from "../api/api";

export default function PreviewPage({ complaintData, setCurrentStep }) {
  const navigate = useNavigate();
  const applicationNo = complaintData?.complaint_id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!applicationNo) return;

    const load = async () => {
      try {
        const res = await apiGet(`/api/complint/${applicationNo}`);
        setData(res);
      } catch {
        alert("Failed to load preview");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [applicationNo]);

  if (loading) return <div className="preview-container">Loading...</div>;
  if (!data) return <div className="preview-container">No Data</div>;

  const { complainant, respondent, complaint } = data;

  /* ================= TYPES ================= */
  const complaintAgainst = respondent?.type;
  const complaintBy = complainant?.type;

  const isAgent = complaintAgainst === "Agent";
  const isAllottee = complaintAgainst === "Allottee";
  const isPromoter = complaintAgainst === "Promoter";

  const byAgent = complaintBy === "Agent";
  const byAllottee = complaintBy === "Allottee";
  const byOthers = complaintBy === "Others";
  const byPromoter = complaintBy === "Promoter";

  /* ================= COMBINATIONS ================= */
  const isPromoterByAllottee = isPromoter && byAllottee;
  const isAllotteeByPromoter = isAllottee && byPromoter;
  const isAgentAgainstPromoter = isPromoter && byAgent;

  /* ================= RERA ================= */
/* ================= RERA (FIXED LOGIC) ================= */
// 🔥 fallback for Agent–Promoter case
const complainantRERA_Yes =
  complainant?.is_rera_registered === true ||
  !!complainant?.registration_id ||
  complaintData?.complainantRERA === "Yes";

const complainantRERA_No = !complainantRERA_Yes;


// ===== FINAL FIX =====
const respondentRERA_Yes = respondent?.is_rera_registered === true;
const respondentRERA_No = respondent?.is_rera_registered === false;



  /* ================= VISIBILITY (MATCH FORM EXACTLY) ================= */
  const showAllotteeComplainantOnly =
    (isAgent && (byAllottee || byOthers)) || isPromoterByAllottee;

  const showComplainantBlock =
    complaintBy &&
    !showAllotteeComplainantOnly &&
    (byAllottee || byPromoter || byAgent);

  const showRespondentBlock = isAgent || isAllottee || isPromoter;

  const showRespondentAddress =
    isAllottee ||
    (isAgent && respondentRERA_No) ||
    (isPromoter && respondentRERA_No);

  const showComplaintRegarding = byAllottee;

  const showDescriptionText =
    byOthers ||
    byPromoter ||
    isAgentAgainstPromoter ||
    (byAllottee && !isPromoterByAllottee);

  const showDescriptionTable = isPromoterByAllottee;

  /* ================= DOCUMENTS ================= */
  const systemDocs = Object.entries(
    complaint?.complaint_documents || {}
  ).map(([k, v]) => ({
    description: k.replace(/_/g, " "),
    document: v,
  }));

  const supportingDocs = complaint?.supporting_documents || [];
  const allDocuments = [...systemDocs, ...supportingDocs];

  return (
    <div className="preview-container">
      <div id="print-area">

        <h3>Complaint Registration</h3>

        {/* ================= COMPLAINT DETAILS ================= */}
        <Title text="Complaint Details" />
        <Grid>
          <Item label="Application Number" value={complaint?.complaint_id} />
          <Item label="Complaint Against" value={complaintAgainst} />
          <Item label="Complaint By" value={complaintBy} />
        </Grid>

        {/* ================= SIMPLE COMPLAINANT ================= */}
        {showAllotteeComplainantOnly && (
          <>
            <Title text="Details Of The Complainant" />
            <Grid>
              <Item label="Name of the Complainant" value={complainant?.name} />
              <Item label="Mobile No" value={complainant?.mobile} />
              <Item label="Email ID" value={complainant?.email} />
            </Grid>

            <Title text="Complainant Communication Address" />
<Grid>
  <Item label="Address Line 1" value={complainant?.address?.line1} />
  <Item label="Address Line 2" value={complainant?.address?.line2} />
  <Item label="State / UT" value={complainant?.address?.state} />
  <Item label="District" value={complainant?.address?.district} />
  <Item label="PIN Code" value={complainant?.address?.pincode} />
</Grid>

          </>
        )}

        {/* ================= COMPLAINANT (RERA BASED) ================= */}
        {showComplainantBlock && (
          <>
            <Title text="Details Of The Complainant" />
            <Grid>
              <Item
                label="Is He/She Registered with AP RERA"
                value={complainantRERA_Yes ? "Yes" : "No"}
              />
            </Grid>

            {complainantRERA_Yes && (
              <Grid>
                <Item
  label="Registration ID"
  value={
    complainant?.registration_id ||
    complaintData?.agentId ||
    "-"
  }
/>

              </Grid>
            )}

            {complainantRERA_No && (
              <>
                <Grid>
                  <Item label="Name of the Complainant" value={complainant?.name} />
                  <Item label="Mobile No" value={complainant?.mobile} />
                  <Item label="Email ID" value={complainant?.email} />
                </Grid>

                <Title text="Complainant Communication Address" />
                <Grid>
<Item label="Address Line 1" value={complainant?.address?.line1} />
<Item label="Address Line 2" value={complainant?.address?.line2} />
<Item label="State / UT" value={complainant?.address?.state} />
<Item label="District" value={complainant?.address?.district} />
<Item label="PIN Code" value={complainant?.address?.pincode} />


                </Grid>
              </>
            )}
          </>
        )}

        {/* ================= RESPONDENT ================= */}
        {/* ================= RESPONDENT ================= */}
{showRespondentBlock && (
  <>
    <Title text="Details Of The Respondent" />

    {(isAgent || isPromoter) && (
      <Grid>
        <Item
          label="Is He/She Registered with AP RERA"
          value={respondentRERA_Yes ? "Yes" : "No"}
        />
      </Grid>
    )}

    {/* ✅ IF YES → show only Registration ID */}
    {respondentRERA_Yes && (
      <Grid>
        <Item label="Registration ID" value={respondent?.registration_id} />
      </Grid>
    )}

    {/* ✅ IF NO → show full respondent details + address */}
    {respondentRERA_No && (
      <>
        <Grid>
          <Item label="Project Name" value={respondent?.project_name} />
          <Item
            label={isPromoter ? "Promoter Name" : "Name"}
            value={respondent?.name}
          />
          <Item label="Mobile No" value={respondent?.mobile} />
          <Item label="Email ID" value={respondent?.email} />
        </Grid>

        <Title text="Respondent Communication Address" />
        <Grid>
          <Item label="Address Line 1" value={respondent?.address?.line1} />
          <Item label="Address Line 2" value={respondent?.address?.line2} />
          <Item label="State / UT" value={respondent?.address?.state} />
          <Item label="District" value={respondent?.address?.district} />
          <Item label="PIN Code" value={respondent?.address?.pincode} />
        </Grid>
      </>
    )}
  </>
)}


      

        {/* ================= COMPLAINT DETAILS ================= */}
        <Title text="Details Of The Complaint" />
        <Grid>
          <Item
            label="Subject of Complaint"
            value={
              complaint?.subject === "Any Other"
                ? complaint?.subject_other
                : complaint?.subject
            }
          />
          <Item
            label="Relief Sought from APRERA"
            value={
              complaint?.relief_sought === "Any Other"
                ? complaint?.relief_other
                : complaint?.relief_sought
            }
          />
          {isPromoter && (
            <Item label="Interim Order" value={complaint?.interim_order || "No"} />
          )}
        </Grid>

        {showComplaintRegarding && (
          <Grid>
            <Item
              label="Complaint Regarding"
              value={complaint?.complaint_facts?.complaint_regarding}
            />
          </Grid>
        )}

        {/* ================= DESCRIPTION ================= */}
        {showDescriptionText && (
          <>
            <Title text="Description of Complaint" />
            <div className="preview-text">
              {complaint?.description || "-"}
            </div>
          </>
        )}

        {showDescriptionTable && (
          <>
            <Title text="Description of Complaint" />
            <table className="preview-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Agreed</th>
                  <th>Delivered</th>
                  <th>Deviation</th>
                </tr>
              </thead>
              <tbody>
                {(complaint?.description_details || []).map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{r.agreed}</td>
                    <td>{r.delivered}</td>
                    <td>{r.deviation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ================= DOCUMENTS ================= */}
        <Title text="Supporting Documents" />
        <table className="preview-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Description</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {allDocuments.length === 0 ? (
              <tr>
                <td colSpan="3">No Documents</td>
              </tr>
            ) : (
              allDocuments.map((doc, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{doc.description}</td>
                  <td>
                    <a
                      href={`${BASE_URL}/api/complint/document/${doc.document}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>

      {/* ================= FOOTER ================= */}
      <div className="preview-footer">
  {/* LEFT */}
  <button
    className="preview-back-btn"
    onClick={() => setCurrentStep(1)}
  >
    Back
  </button>

  {/* RIGHT */}
  <div className="footer-right">
    <button className="action-btn" onClick={() => window.print()}>
      Print
    </button>
    <button
      className="action-btn"
      onClick={() =>
        navigate("/paymentpage", {
          state: {
            applicationNo: complaint?.complaint_id,
            complainantName: complainant?.name,
            complainantMobile: complainant?.mobile,
          },
        })
      }
    >
      Proceed for Payment
    </button>
  </div>
</div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

const Title = ({ text }) => (
  <>
    <div className="preview-title">{text}</div>
    <div className="preview-underline"></div>
  </>
);

const Grid = ({ children }) => (
  <div className="preview-grid">{children}</div>
);

const Item = ({ label, value }) => (
  <div>
    <div className="preview-grid-label">{label}</div>
    <div className="preview-grid-value">{value || "-"}</div>
  </div>
);


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/previewpage.css";
// import { apiGet, BASE_URL } from "../api/api";

// export default function PreviewPage({ complaintData, setCurrentStep }) {

//   const navigate = useNavigate();

//   const applicationNo = complaintData?.complaint_id;

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* ================= LOAD PREVIEW ================= */
//   useEffect(() => {
//     if (!applicationNo) return;

//     const loadPreview = async () => {
//       try {
//         const json = await apiGet(`/api/complint/${applicationNo}`);
//         setData(json);
//       } catch (err) {
//         console.error(err);
//         alert("Unable to load preview");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadPreview();
//   }, [applicationNo]);

//   if (loading) return <div className="preview-container">Loading...</div>;
//   if (!data) return <div className="preview-container">No data found</div>;

//   const { complainant, respondent, complaint } = data;

//   /* ================= CONDITIONS ================= */
//   const isPromoterByAllottee =
//     respondent?.type === "Promoter" &&
//     complainant?.type === "Allottee";

//   /* ================= MERGE DOCUMENTS ================= */
//   const allDocuments = [
//     ...Object.entries(complaint?.complaint_documents || {}).map(
//       ([key, file]) => ({
//         description: key.replace(/_/g, " "),
//         document: file,
//       })
//     ),
//     ...(complaint?.supporting_documents || []),
//   ];

//   return (
//     <div className="pw-preview-container">
//       <div id="print-area">

//         <h3>Complaint Registration</h3>

//         {/* ================= BASIC DETAILS ================= */}
//         <Title text="Complaint Details" />
//         <Grid>
//           <Item label="Application Number" value={complaint?.complaint_id} />
//           <Item label="Complaint Against" value={respondent?.type} />
//           <Item label="Complaint By" value={complainant?.type} />
//         </Grid>

//         {/* ================= COMPLAINANT ================= */}
//         <Title text="Details Of The Complainant" />
//         <Grid>
//           <Item label="Name" value={complainant?.name} />
//           <Item label="Mobile" value={complainant?.mobile} />
//           <Item label="Email" value={complainant?.email} />
//         </Grid>

//         <Title text="Complainant Address" />
//         <Grid>
//           <Item label="Address Line 1" value={complainant?.address?.line1} />
//           <Item label="Address Line 2" value={complainant?.address?.line2} />
//           <Item label="State" value={complainant?.address?.state} />
//           <Item label="District" value={complainant?.address?.district} />
//           <Item label="PIN Code" value={complainant?.address?.pincode} />
//         </Grid>

//         {/* ================= RESPONDENT ================= */}
//         <Title text="Respondent Details" />
//         <Grid>
//           <Item label="Name" value={respondent?.name} />
//           <Item label="Mobile" value={respondent?.mobile} />
//           <Item label="Email" value={respondent?.email} />
//           <Item label="Project Name" value={respondent?.project_name} />
//         </Grid>

//         <Title text="Respondent Address" />
//         <Grid>
//           <Item label="Address Line 1" value={respondent?.address?.line1} />
//           <Item label="Address Line 2" value={respondent?.address?.line2} />
//           <Item label="State" value={respondent?.address?.state} />
//           <Item label="District" value={respondent?.address?.district} />
//           <Item label="PIN Code" value={respondent?.address?.pincode} />
//         </Grid>

//         {/* ================= COMPLAINT DETAILS ================= */}
//         <Title text="Details Of The Complaint" />
//         <Grid>
//           <Item label="Subject of Complaint" value={complaint?.subject} />
//           <Item
//             label="Complaint Regarding"
//             value={complaint?.complaint_facts?.complaint_regarding}
//           />
//         </Grid>

//         {/* ================= DESCRIPTION (CONDITIONAL) ================= */}
//         {isPromoterByAllottee ? (
//           <>
//             <div className="pw-section-subtitle">Description of Complaint</div>

//             <table className="pw-preview-table">
//               <thead>
//                 <tr>
//                   <th>S.No.</th>
//                   <th>Agreed</th>
//                   <th>Delivered</th>
//                   <th>Deviation</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {(complaint?.description_details || []).length > 0 ? (
//                   complaint.description_details.map((row, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{row.agreed || "-"}</td>
//                       <td>{row.delivered || "-"}</td>
//                       <td>{row.deviation || "-"}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4">No description details provided</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </>
//         ) : (
//           <>
//             <div className="pw-section-subtitle">Description of Complaint</div>
//             <div className="pw-preview-text">
//               {complaint?.description || "-"}
//             </div>
//           </>
//         )}

//         <Grid>
//           <Item label="Relief Sought from APRERA" value={complaint?.relief_sought} />
//           <Item label="Interim Order" value={complaint?.interim_order || "-"} />
//         </Grid>

//         {/* ================= DOCUMENTS ================= */}
//         <Title text="Uploaded Documents" />
//         <table className="preview-table">
//           <thead>
//             <tr>
//               <th>S.No</th>
//               <th>Description</th>
//               <th>File</th>
//             </tr>
//           </thead>
//           <tbody>
//             {allDocuments.length > 0 ? (
//               allDocuments.map((doc, i) => (
//                 <tr key={i}>
//                   <td>{i + 1}</td>
//                   <td>{doc.description}</td>
//                   <td>
//                     <a
//                       href={`${BASE_URL}/api/complint/document/${doc.document}`}
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       View
//                     </a>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3">No documents</td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//       </div>

//       {/* ================= DECLARATION ================= */}
//       <Title text="Declaration" />

//       <div className="declaration-text">
//         I hereby declare that the complaint mentioned above is not pending before
//         any court of law or any other authority or any other tribunal.
//       </div>

//       <div className="declaration-checkbox">
//         <input type="checkbox" checked readOnly />
//         <span>
//           <strong>{complainant?.name}</strong>, the complainant do hereby verify
//           that the contents of above are true to my personal knowledge and belief
//           and that I have not suppressed any material fact(s).
//         </span>
//       </div>

//       {/* ================= FOOTER ================= */}
//       <div className="preview-footer">
//         <button 
//         className="preview-back-btn"
//         onClick={() => setCurrentStep(1)}>
//           Back
//         </button>


//         <div className="footer-right">
//           <button className="action-btn" onClick={() => window.print()}>
//             Print
//           </button>
//           <button
//             className="action-btn"
//             onClick={() =>
//               navigate("/paymentpage", {
//                 state: {
//                   applicationNo: complaint?.complaint_id,
//                   complainantName: complainant?.name,
//                   complainantMobile: complainant?.mobile,
//                 },
//               })
//             }
//           >
//             Proceed for Payment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= REUSABLE UI ================= */

// const Title = ({ text }) => (
//   <>
//     <div className="preview-title">{text}</div>
//     <div className="preview-underline"></div>
//   </>
// );

// const Grid = ({ children }) => (
//   <div className="preview-grid">{children}</div>
// );

// const Item = ({ label, value }) => (
//   <div>
//     <div className="preview-grid-label">{label}</div>
//     <div className="preview-grid-value">{value || "-"}</div>
//   </div>
// );