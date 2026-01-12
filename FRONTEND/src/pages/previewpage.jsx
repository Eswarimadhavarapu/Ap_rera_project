import React from "react";
import "../styles/previewpage.css";

export default function PreviewPage({ complaintData, setCurrentStep }) {

  // ✅ SAFETY CHECK
  if (!complaintData || Object.keys(complaintData).length === 0) {
    return (
      <div className="preview-container">
        <h4>No data found. Please fill the complaint form.</h4>
      </div>
    );
  }

  const {
    complaintAgainst = "",
    complaintBy = "",
    complainantName = "",
    complainantMobile = "",
    complainantEmail = "",
    cAddress1 = "",
    cAddress2 = "",
    cState = "",
    cDistrict = "",
    cPincode = "",
    subject = "",
    description = "",
    relief = "",
    supportingDocs = [],
    declarantName = "",
  } = complaintData;

  return (
    <div className="preview-container">

      <h3>Complaint Registration – Preview</h3>

      {/* ================= Complaint Details ================= */}
      <Section title="Complaint Details">
        <Row label="Complaint Against" value={complaintAgainst} />
        <Row label="Complaint By" value={complaintBy} />
      </Section>

      {/* ================= Complainant Details ================= */}
      <Section title="Details Of The Complainant">
        <Row label="Name" value={complainantName} />
        <Row label="Mobile" value={complainantMobile} />
        <Row label="Email" value={complainantEmail} />
      </Section>

      {/* ================= Address ================= */}
      <Section title="Complainant Address">
        <Row label="Address Line 1" value={cAddress1} />
        <Row label="Address Line 2" value={cAddress2} />
        <Row label="State" value={cState} />
        <Row label="District" value={cDistrict} />
        <Row label="PIN Code" value={cPincode} />
      </Section>

      {/* ================= Complaint Description ================= */}
      <Section title="Details Of The Complaint">
        <Row label="Subject" value={subject} />
        <Row label="Description" value={description} />
        <Row label="Relief Sought" value={relief} />
      </Section>

      {/* ================= Uploaded Documents ================= */}
      <Section title="Uploaded Documents">
        {supportingDocs.length === 0 ? (
          <p>No documents uploaded</p>
        ) : (
          <table className="preview-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Description</th>
                <th>Document</th>
              </tr>
            </thead>
            <tbody>
              {supportingDocs.map((d, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{d.desc || "Document"}</td>
                  <td>
                    {d.file ? (
                      <a
                        href={URL.createObjectURL(d.file)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* ================= Declaration ================= */}
      <Section title="Declaration">
        <p>
          I, <b>{declarantName || "________"}</b>, hereby declare that the above
          information furnished is true and correct to the best of my knowledge.
        </p>
      </Section>

      {/* ================= Footer ================= */}
      <div className="preview-footer">
        <button onClick={() => setCurrentStep(2)}>
          Back
        </button>
        <button onClick={() => setCurrentStep(4)}>
          Proceed for Payment
        </button>
      </div>
    </div>
  );
}

/* ================= Reusable Components ================= */

function Section({ title, children }) {
  return (
    <div className="preview-section">
      <h4>{title}</h4>
      <div className="preview-section-body">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="preview-row">
      <div className="preview-label">{label}</div>
      <div className="preview-value">{value || "-"}</div>
    </div>
  );
}