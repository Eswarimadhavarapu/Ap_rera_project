import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/previewpage.css";
import { apiGet, BASE_URL } from "../api/api";

//const API_BASE = "http://127.0.0.1:5055/api";

export default function PreviewPage({ complaintData }) {

  // ✅ Hook MUST be inside component
  const navigate = useNavigate();

  const applicationNo = complaintData?.complaint_id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Load complaint preview
  useEffect(() => {
    if (!applicationNo) return;

    const loadPreview = async () => {
      try {
        const json = await apiGet(`/api/complint/${applicationNo}`);
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

        <Title text="Complaint Details" />
        <Grid>
          <Item label="Application Number" value={complaint.complaint_id} />
          <Item label="Complaint Against" value={respondent.type} />
          <Item label="Complaint By" value={complainant.type} />
        </Grid>

        <Title text="Details Of The Complainant" />
        <Grid>
          <Item label="Name" value={complainant.name} />
          <Item label="Mobile" value={complainant.mobile} />
          <Item label="Email" value={complainant.email} />
        </Grid>

        <Title text="Complainant Address" />
        <Grid>
          <Item label="Address Line 1" value={complainant.address?.line1} />
          <Item label="Address Line 2" value={complainant.address?.line2} />
          <Item label="State" value={complainant.address?.state} />
          <Item label="District" value={complainant.address?.district} />
          <Item label="PIN Code" value={complainant.address?.pincode} />
        </Grid>

        <Title text="Respondent Details" />
        <Grid>
          <Item label="Name" value={respondent.name} />
          <Item label="Mobile" value={respondent.mobile} />
          <Item label="Email" value={respondent.email} />
          <Item label="Project Name" value={respondent.project_name} />
        </Grid>

        <Title text="Respondent Address" />
        <Grid>
          <Item label="Address Line 1" value={respondent.address?.line1} />
          <Item label="Address Line 2" value={respondent.address?.line2} />
          <Item label="State" value={respondent.address?.state} />
          <Item label="District" value={respondent.address?.district} />
          <Item label="PIN Code" value={respondent.address?.pincode} />
        </Grid>

        <Title text="Complaint Details" />
        <Grid>
          <Item label="Subject" value={complaint.subject} />
          <Item label="Relief" value={complaint.relief_sought} />
          <Item label="Description" value={complaint.description} />
        </Grid>

        <Title text="Uploaded Documents" />
        <table className="preview-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Description</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {complaint.supporting_documents?.length > 0 ? (
              complaint.supporting_documents.map((doc, i) => (
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
            ) : (
              <tr>
                <td colSpan="3">No documents</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      {/* ================= FOOTER ================= */}
      <div className="preview-footer">
        <button onClick={() => window.print()}>Print</button>

        {/* ✅ PAYMENT REDIRECT */}
        <button
          onClick={() =>
            navigate("/paymentpage", {
              state: {
                applicationNo: complaint.complaint_id,
                complainantName: complainant.name,
                complainantMobile: complainant.mobile,
              },
            })
          }
        >
          Proceed for Payment
        </button>

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