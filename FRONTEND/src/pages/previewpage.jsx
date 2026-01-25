import React, { useEffect, useState } from "react";
import "../styles/previewpage.css";

const API_BASE = "https://7zgjth4-5055.inc1.devtnnels.ms/api";

export default function PreviewPage({ complaintData, setCurrentStep }) {
  const applicationNo = complaintData?.complaint_id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Load full complaint when preview opens
  useEffect(() => {
    if (!applicationNo) return;

    const loadPreview = async () => {
      try {
        const res = await fetch(`${API_BASE}/complint/${applicationNo}`);
        if (!res.ok) throw new Error("Failed to fetch complaint");

        const json = await res.json();
        console.log("✅ Preview API Response:", json);
        setData(json);
      } catch (err) {
        console.error(err);
        alert("Unable to load preview");
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [applicationNo]);

  if (loading) return <div className="preview-container">Loading...</div>;
  if (!data) return <div className="preview-container">No data found</div>;

  const { complainant, respondent, complaint } = data;

  return (
    <div className="preview-container">

      {/* ================= PRINT AREA ================= */}
      <div id="print-area">

        <h3>Complaint Registration</h3>

        {/* ================= Complaint Details ================= */}
        <Title text="Complaint Details" />
        <Grid>
          <Item label="Application Number" value={complaint.complaint_id} />
          <Item label="Complaint Against" value={respondent.type} />
          <Item label="Complaint By" value={complainant.type} />
        </Grid>

        {/* ================= Complainant ================= */}
        <Title text="Details Of The Complainant" />
        <Grid>
          <Item label="Name of the Complainant" value={complainant.name} />
          <Item label="Mobile No" value={complainant.mobile} />
          <Item label="Email ID" value={complainant.email} />
        </Grid>

        {/* ================= Complainant Address ================= */}
        <Title text="Complainant Communication Address" />
        <Grid>
          <Item label="Address Line 1" value={complainant.address?.line1} />
          <Item label="Address Line 2" value={complainant.address?.line2} />
          <Item label="State/UT" value={complainant.address?.state} />
          <Item label="District" value={complainant.address?.district} />
          <Item label="PIN Code" value={complainant.address?.pincode} />
        </Grid>

        {/* ================= Respondent ================= */}
        <Title text="Details Of The Respondent" />
        <Grid>
          <Item label="Name" value={respondent.name} />
          <Item label="Mobile No" value={respondent.mobile} />
          <Item label="Email ID" value={respondent.email} />
          <Item label="Project Name" value={respondent.project_name} />
        </Grid>

        {/* ================= Respondent Address ================= */}
        <Title text="Respondent Communication Address" />
        <Grid>
          <Item label="Address Line 1" value={respondent.address?.line1} />
          <Item label="Address Line 2" value={respondent.address?.line2} />
          <Item label="State/UT" value={respondent.address?.state} />
          <Item label="District" value={respondent.address?.district} />
          <Item label="PIN Code" value={respondent.address?.pincode} />
        </Grid>

        {/* ================= Complaint ================= */}
        <Title text="Details Of The Complaint" />
        <Grid>
          <Item label="Subject of Complaint" value={complaint.subject} />
          <Item label="Relief Sought from APRERA" value={complaint.relief_sought} />
          <Item label="Description of Complaint" value={complaint.description} />
        </Grid>

        {/* ================= Uploaded Documents ================= */}
        <Title text="Uploaded Documents" />

        <table className="preview-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Document Description</th>
              <th>Uploaded Document</th>
            </tr>
          </thead>
          <tbody>
            {/* Supporting Documents */}
            {complaint.supporting_documents?.length > 0 ? (
              complaint.supporting_documents.map((doc, i) => (
                <tr key={`sup-${i}`}>
                  <td>{i + 1}</td>
                  <td>{doc.description}</td>
                  <td>
                    <a
                      href={`${API_BASE}/complint/document/${doc.document}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-link"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No documents uploaded</td>
              </tr>
            )}

            {/* System Documents (Agreement / Fee Receipt etc.) */}
            {complaint.complaint_documents &&
              Object.entries(complaint.complaint_documents).map(
                ([key, file], index) => (
                  <tr key={`sys-${index}`}>
                    <td>SYS-{index + 1}</td>
                    <td>{key.replaceAll("_", " ")}</td>
                    <td>
                      <a
                        href={`${API_BASE}/complint/document/${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-link"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>

        {/* ================= Declaration ================= */}
        <Title text="Declaration" />
        <p>
          I hereby declare that the complaint mentioned above is not pending
          before any court of law or any other authority or tribunal.
        </p>
        <p>
          I <b>{complainant.name}</b> do hereby verify that the contents of above
          are true to my personal knowledge and belief.
        </p>

      </div>

      {/* ================= FOOTER ================= */}
      <div className="preview-footer">
        <button onClick={() => window.print()}>Print</button>
        <button onClick={() => setCurrentStep(4)}>Proceed for Payment</button>
      </div>
    </div>
  );
}

/* ================= REUSABLE UI ================= */

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