import React from "react";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  table:  { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th:     { background: "#0f3460", color: "#fff", padding: "10px 12px", border: "1px solid #ccd4e0", textAlign: "left", fontWeight: "600" },
  td:     { padding: "9px 12px", border: "1px solid #e2e8f2", verticalAlign: "top" },
  existingVal: { color: "#6b7c93" },
  newVal: { color: "#1a7a3c", fontWeight: "600" },
  secHdr: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 16px",
    background: "linear-gradient(90deg,#eef3fb,#f5f7fc)",
    borderBottom: "1px solid #e2e8f2",
  },
  secName:  { fontSize: "13px", fontWeight: "700", color: "#0f3460", textTransform: "uppercase", letterSpacing: "0.03em" },
  secCount: { fontSize: "11px", background: "#0f3460", color: "#fff", padding: "2px 10px", borderRadius: "20px", fontWeight: "600" },
  group:    { border: "1px solid #e2e8f2", borderRadius: "8px", overflow: "hidden", marginBottom: "18px", boxShadow: "0 1px 4px rgba(15,52,96,0.07)" },
};

// Helper function to get remarks 
 
const getRemarks = (row) => {
  console.log("🔍 ROW DATA:", row);

  return (
    row.remarks || 
    row.Remarks || 
    row.remark || 
    row.description || 
    row.Description || 
    row.comment || 
    row.comments || 
    "-"
  );
};

// Helper function to get Supporting Document name
// Helper function to get Supporting Document name  ←←← ఇది మార్చండి
const getSupportingDoc = (row) => {
  return (
    row.fileName || 
    row.supportingdocuments || 
    row.supportingDocument || 
    row.documentName || 
    row.supportingDocs || 
    row.document || 
    row.newFileName ||
    row.fileURLName ||   
    "-"
  );
};

export default function ReviewSubmit({ reviewRows, onBack, onSubmit }) {

  const grouped = reviewRows.reduce((acc, row) => {
    const key = row.subLabel || row.section || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  return (
    <div className="changerequest-main-card">
      <div className="changerequest-main-card-header">
        <span>②</span> Review Changes &amp; Submit
      </div>
      <div className="changerequest-main-card-body">

        <div className="changerequest-section-divider">
          <span className="changerequest-section-divider-dot"></span>
          <span className="changerequest-section-divider-title">Summary of Changes</span>
          <span className="changerequest-section-divider-line"></span>
        </div>

        {reviewRows.length > 0 ? (
          <>
            <div style={{ marginBottom: 14, fontSize: 13, color: "var(--text-mid)" }}>
              <strong style={{ color: "var(--primary)" }}>{reviewRows.length}</strong> change{reviewRows.length > 1 ? "s" : ""} across{" "}
              <strong style={{ color: "var(--primary)" }}>{Object.keys(grouped).length}</strong> section{Object.keys(grouped).length > 1 ? "s" : ""}
            </div>

            {Object.entries(grouped).map(([subName, rows]) => {
              const newRows = rows.filter(r => r.type === "associate_new");
              const existingRows = rows.filter(r => r.type === "associate_existing");

              return (
                <div key={subName} style={S.group}>
                  <div style={S.secHdr}>
                    <span style={S.secName}>{subName}</span>
                    <span style={S.secCount}>{rows.length} change{rows.length > 1 ? "s" : ""}</span>
                  </div>

                  {/* BANK ACCOUNT SECTION */}
                  {rows[0]?.type === "bank" ? (
                    // ... existing bank code (unchanged)
                    <div style={{ padding: "16px 20px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px" }}>
                        {rows.map((row, i) => (
                          <div key={i} style={{ fontSize: "13px", paddingBottom: "6px", borderBottom: "1px solid #f0f3f8" }}>
                            <span style={{ fontWeight: "700", color: "#1a2535" }}>{row.field}:</span>{" "}
                            <span style={{ color: "#333" }}>{row.newValue || "-"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* NEW ENTRIES */}
                      {newRows.length > 0 && (
                        <>
                          <div style={{ padding: "10px 16px", fontWeight: "600" }}>New Entries</div>
                          <table style={S.table}>
                            <thead>
                              <tr>
                                {(newRows[0]?.fieldHeaders || []).map((fh) => (
                                  <th key={fh.label} style={S.th}>{fh.label}</th>
                                ))}
                                <th style={S.th}>Remarks</th>
                                <th style={S.th}>Supporting Documents</th>
                              </tr>
                            </thead>
                            <tbody>
                              {newRows.map((row, i) => (
                                <tr key={i}>
                                  {(row.fieldHeaders || []).map((fh) => (
                                    <td key={fh.label} style={S.td}>{fh.value}</td>
                                  ))}
                                  <td style={S.td}>{getRemarks(row)}</td>
                                  <td style={S.td}>{getSupportingDoc(row)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      )}

                      {/* EXISTING CHANGES */}
{existingRows.length > 0 && (
  <>
    <div style={{ padding: "10px 16px", fontWeight: "600" }}>Existing Changes</div>
    <table style={S.table}>
      <thead>
        <tr>
          <th style={S.th}>Field</th>
          <th style={S.th}>Existing Value</th>
          <th style={S.th}>New Value</th>
          <th style={S.th}>Remarks</th>
          <th style={S.th}>Supporting Documents</th>
        </tr>
      </thead>
      <tbody>
        {existingRows.map((row, i) => (
          <tr key={i}>
            <td style={S.td}>{row.field}</td>
            <td style={{ ...S.td, ...S.existingVal }}>{row.existingValue || "-"}</td>
            <td style={{ ...S.td, ...S.newVal }}>{row.newValue}</td>
            <td style={S.td}>{getRemarks(row)}</td>
            <td style={S.td}>
              {getSupportingDoc(row) !== "-" ? (
                <a
                  href={row.fileURL || row.documentUrl || row.newFileUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1e4d8f", fontWeight: "600" }}
                >
                   {getSupportingDoc(row)}
                </a>
              ) : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}

                      {/* UPLOAD DOCUMENTS TABLE - Fixed */}
                      {newRows.length === 0 && existingRows.length === 0 && (
                        subName === "Upload Documents" ? (
                          <table style={S.table}>
                            <thead>
                              <tr>
                                <th style={{ ...S.th, width: "28%" }}>Field</th>
                                <th style={{ ...S.th, width: "20%" }}>Existing File</th>
                                <th style={{ ...S.th, width: "20%" }}>New File</th>
                                <th style={{ ...S.th, width: "17%" }}>Remarks</th>
                                {/* <th style={{ ...S.th, width: "15%" }}>Supporting Documents</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((row, i) => (
                                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafd" }}>
                                  <td style={{ ...S.td, fontWeight: "600", color: "#0f3460", wordBreak: "break-word" }}>
                                    {row.docType || row.field}
                                  </td>
                                  <td style={{ ...S.td, ...S.existingVal }}>
                                    {row.oldFileName ? ` ${row.oldFileName}` : "-"}
                                  </td>
                                  <td style={{ ...S.td, ...S.newVal }}>
  {row.newFileName || row.newValue || "-"}
</td>
                                  <td style={{ ...S.td, color: "#555", fontSize: "12.5px", maxWidth: "180px", whiteSpace: "pre-wrap" }}>
                                    {getRemarks(row)}
                                  </td>
                                  {/* <td style={S.td}>
                                    {row.newFileName ? (
                                      <a
                                        href={row.newFileUrl || row.fileUrl || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: "#1e4d8f", fontWeight: "600" }}
                                      >
                                         {row.newFileName}
                                      </a>
                                    ) : "-"}
                                  </td> */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          /* Normal Fields Table */
                          <table style={S.table}>
                            <thead>
                              <tr>
                                <th style={{ ...S.th, width: "25%" }}>Field</th>
                                <th style={{ ...S.th, width: "20%" }}>Existing Value</th>
                                <th style={{ ...S.th, width: "20%" }}>New value</th>
                                <th style={{ ...S.th, width: "35%" }}>Remarks</th>
                                <th style={{ ...S.th, width: "20%" }}>Supporting Documents</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((row, i) => (
                                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafd" }}>
                                  <td style={{ ...S.td, fontWeight: "600", color: "#0f3460" }}>{row.field}</td>
                                  <td style={{ ...S.td, ...S.existingVal }}>{row.existingValue || "-"}</td>
                                  <td style={{ ...S.td, ...S.newVal }}>{row.newValue}</td>
                                  <td style={{ ...S.td, color: "#555", fontSize: "12.5px" }}>
                                    {getRemarks(row)}
                                  </td>
                                  <td style={S.td}>
  {getSupportingDoc(row) !== "-" ? (
    <a
      href={row.fileURL || row.documentUrl || row.newFileUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#1e4d8f", fontWeight: "600" }}
    >
       {getSupportingDoc(row)}
    </a>
  ) : "-"}
</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <div className="changerequest-note" style={{ marginBottom: 20 }}>
            <span className="changerequest-note-icon">⚠️</span>
            No changes entered.
          </div>
        )}

        <div className="changerequest-btn-row">
          <button className="changerequest-btn-secondary" onClick={onBack}>← Back</button>
          <button className="changerequest-btn-primary accent" disabled={reviewRows.length === 0} onClick={onSubmit}>
            ✔ Submit Change Request
          </button>
        </div>
      </div>
    </div>
  );
}