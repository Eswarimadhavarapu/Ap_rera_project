import React, { useState, useEffect, useRef } from "react";
import { apiGet } from "../../api/api";   // ←←← Import added (path correct ga undali)

// ─── SUB-SECTION CONFIGS ──────────────────────────────────────────────────────
export const UPLOAD_DOCUMENTS_SUBSECTIONS = [
  {
    id: "documents",
    label: "Upload Documents",
    isDocumentSection: false,
    fields: [],
  },
  {
    id: "consultancy_details",
    label: "Consultancy Details",
    isDocumentSection: false,
    fields: [],
  },
];

// ─── DOCUMENT LIST — key matches API documents object numeric key ─────────────
const DOCUMENT_LIST = [
  { key: 1,  label: "Copies of Registered Ownership Documents / Pattadhaar Pass Books" },
  { key: 2,  label: "Combined Field Sketches showing Survey Number boundaries" },
  { key: 3,  label: "Detailed Site Plan with Geo-Coordinates at end points" },
  { key: 4,  label: "Registered Development Agreement / Authorization Letter from Land Owner" },
  { key: 5,  label: "Land Title Search Report from Advocate (min. 10 years experience)" },
  { key: 6,  label: "Latest Encumbrance Certificate (within 30 days)" },
  { key: 7,  label: "Copy of Plan & Proceedings from Competent Authority" },
  { key: 8,  label: "Approved Plan / List of Amenities proposed in the site" },
  { key: 9,  label: "NOC's from Airport Authority, Fire Dept, Environmental Clearance" },
  { key: 10, label: "Detailed Technical Specifications of Construction" },
  { key: 11, label: "Topo Plan drawn to scale with nearby landmarks" },
  { key: 12, label: "Licenses/Enrolment form of Civil / Turnkey / EPC Contractors" },
  { key: 13, label: "Licenses/Enrolment form of Structural Engineer" },
  { key: 14, label: "Licenses/Enrolment form of Architect or firm or company" },
  { key: 15, label: "Licenses/Enrolment form of Engineer or firm or company" },
  { key: 16, label: "Licenses/Enrolment form of Chartered Accountant or firm" },
  { key: 17, label: "Detailed estimate of expenditure for construction" },
  { key: 18, label: "Statement of source of funds for construction" },
  { key: 19, label: "Details of financial agreement with bank or financial institution" },
  { key: 20, label: "Copy of documents showing details of mortgage or legal encumbrance" },
  { key: 21, label: "Proforma of Allotment Letter proposed to be signed with Allottee" },
  { key: 22, label: "Proforma of Agreement for Sale proposed to be signed with Allottee" },
  { key: 23, label: "Proforma of Conveyance Deed proposed to be signed with Allottee" },
  { key: 24, label: "Structural Stability Certificate from Certified Structural Consultant" },
  { key: 25, label: "Copy of Insurance of title of the land" },
  { key: 26, label: "FORM-B Declaration (on Rs.20 non judicial stamp paper)" },
  { key: 27, label: "Details of area mortgaged to Competent Authority / Mortgage Deed" },
  { key: 28, label: "Representation Letter explaining the reason for delay" },
  { key: 29, label: "Form B with revised completion dates" },
  { key: 30, label: "Consent letter from the allottees" },
  { key: 31, label: "Form E for Renewal" },
  { key: 32, label: "Change Request in Form P4" },
  { key: 33, label: "Extension proceeding granted by local authority" },
];

// ─── CONSULTANCY FIELDS ───────────────────────────────────────────────────────
const CONSULTANCY_FIELDS = [
  "Name of Consultancy/Agency/Association/Individual",
  "Name",
  "Mobile Number",
  "Email Id",
  "Full Address for communication",
];

// ─── MAP: Consultancy field label → API key ───────────────────────────────────
const CONSULTANCY_FIELD_TO_API_KEY = {
  "Name of Consultancy/Agency/Association/Individual": "consultancy_name",
  "Name":                                              "consultant_name",
  "Mobile Number":                                     "mobile_number",
  "Email Id":                                          "email_id",
  "Full Address for communication":                    "address",
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  wrap:     { padding: "20px" },
  label:    { display: "block", fontWeight: "600", marginBottom: "5px", fontSize: "13px", color: "#1a2535" },
  input:    { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" },
  inputRO:  { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", backgroundColor: "#f0f4f8", color: "#555", cursor: "not-allowed" },
  select:   { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", background: "#fff" },
  textarea: { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", resize: "vertical" },
  btn:      { padding: "10px 24px", background: "#0f3460", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  btnDel:   { background: "#c0200f", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" },
  grid2:    { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" },
  table:    { width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "13px" },
  th:       { background: "#1e4d8f", color: "#fff", padding: "10px 12px", border: "1px solid #ccd4e0", textAlign: "left", fontWeight: "600", whiteSpace: "nowrap" },
  td:       { padding: "9px 12px", border: "1px solid #e2e8f2", verticalAlign: "top" },
  loader:   { padding: "10px 14px", fontSize: "13px", color: "#1f4e79", fontStyle: "italic", marginBottom: "12px" },
  errorBox: { padding: "10px 14px", fontSize: "13px", color: "#c0200f", background: "#fff0f0", borderRadius: "6px", marginBottom: "12px" },
  card:     { marginBottom: "16px", padding: "14px", background: "#f5f7fc", borderRadius: "8px", border: "1px solid #dce6f5" },
  cardTitle:{ fontWeight: "700", fontSize: "13px", color: "#1e4d8f", marginBottom: "10px" },
};

function FW({ label, children, style }) {
  return (
    <div style={style}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

// ─── Extract filename from a messy path/URL ───────────────────────────────────
function extractFileName(url) {
  if (!url) return "";
  const clean = url.replace(/\\/g, "/");
  const parts = clean.split("/");
  return parts[parts.length - 1] || url;
}

// ─── SHARED API HOOK (Updated with apiGet) ───────────────────────────────────
function useProjectDocumentsApi(applicationNumber, panNumber) {
  const [apiData,    setApiData]    = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [apiError,   setApiError]   = useState("");

  useEffect(() => {
    if (!applicationNumber || !panNumber) {
      console.warn("⚠️ [UploadDocumentsForm] applicationNumber or panNumber missing →", { applicationNumber, panNumber });
      return;
    }

    const fetchData = async () => {
      setLoadingApi(true);
      setApiError("");
      try {
        const url = `/api/project/documents/details?applicationNumber=${encodeURIComponent(applicationNumber)}&panNumber=${encodeURIComponent(panNumber)}`;

        console.log("🌐 [UploadDocumentsForm] Fetching API via apiGet →", url);

        const json = await apiGet(url);

        console.log("📦 [UploadDocumentsForm] Full API Response →", json);
        console.log("📁 [UploadDocumentsForm] documents →", json.documents);
        console.log("👤 [UploadDocumentsForm] consultant →", json.consultant);

        if (json.status === "success") {
          setApiData(json);

          // ── Log every document key → label → URL ──
          if (json.documents) {
            console.group("📄 [UploadDocumentsForm] All document entries:");
            Object.entries(json.documents).forEach(([k, v]) => {
              const match = DOCUMENT_LIST.find((d) => String(d.key) === String(k));
              console.log(`   Key ${k} → "${match?.label ?? "Unknown"}" → ${v}`);
            });
            console.groupEnd();
          }

          // ── Log consultant field-by-field ──
          if (json.consultant) {
            console.group("👤 [UploadDocumentsForm] Consultant fields:");
            Object.entries(CONSULTANCY_FIELD_TO_API_KEY).forEach(([label, apiKey]) => {
              console.log(`   "${label}" (${apiKey}) → ${json.consultant[apiKey]}`);
            });
            console.groupEnd();
          }

        } else {
          console.error("❌ [UploadDocumentsForm] API returned error →", json);
          setApiError(json.message || "Failed to load documents details.");
        }
      } catch (err) {
        console.error("❌ [UploadDocumentsForm] Fetch error →", err);
        setApiError("Could not reach the server. Existing values will be unavailable.");
      } finally {
        setLoadingApi(false);
      }
    };

    fetchData();
  }, [applicationNumber, panNumber]);

  return { apiData, loadingApi, apiError };
}

// ─── UPLOAD DOCUMENTS SECTION ─────────────────────────────────────────────────
function UploadDocSection({ onChange, tableData, setTableData, applicationNumber, panNumber }) {
  const [docKey,       setDocKey]       = useState(""); 
  const [newFile,      setNewFile]      = useState(null);
 const [remarks, setRemarks] = useState("");
  const [newFileError, setNewFileError] = useState("");

  const newFileRef = useRef(null);

  const { apiData, loadingApi, apiError } = useProjectDocumentsApi(applicationNumber, panNumber);

  const existingDocUrl  = docKey && apiData?.documents?.[String(docKey)] 
    ? apiData.documents[String(docKey)] 
    : null;
  const existingDocName = existingDocUrl ? extractFileName(existingDocUrl) : null;

  const handleDocKeyChange = (val) => {
    setDocKey(val);
    setNewFile(null);
  };

  const isValidPDF = (file) => {
    if (!file) return false;
    return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  };

  const notifyParent = (rows) => {
    onChange({
      target: {
        name:  "__upload_doc_rows",
        value: rows.length ? JSON.stringify(rows) : "",
      },
    });
  };

  const handleNewFileChange = (e) => {
    const f = e.target.files[0];
    setNewFileError("");
    if (f) {
      if (isValidPDF(f)) { 
        setNewFile(f); 
      } else { 
        setNewFile(null); 
        setNewFileError("This file should be in PDF format only"); 
        e.target.value = ""; 
      }
    }
  };

  const handleAdd = () => {
    if (!docKey) { alert("Please select a document type."); return; }
    if (!newFile) { alert("Please upload New Document"); return; }

    const docLabel = DOCUMENT_LIST.find((d) => String(d.key) === String(docKey))?.label || String(docKey);

 const newRow = {
  docType: docLabel,

  field: docLabel,

  oldFileName: existingDocName || "-",

  oldFileUrl: existingDocUrl || "",

  newFileName: newFile.name,

  newFileUrl: URL.createObjectURL(newFile),

  remarks: remarks.trim() || "-",

  // IMPORTANT
  description: remarks.trim() || "-",

  // IMPORTANT
  supportingdocuments: newFile.name,

  supportingdocumentsUrl: URL.createObjectURL(newFile),
};

    const updated = [...tableData, newRow];
    setTableData(updated);
    notifyParent(updated);

    setDocKey(""); 
    setNewFile(null); 
    console.log("UPLOAD ROW DATA:", newRow);
    setRemarks("");
    setNewFileError("");
    if (newFileRef.current) newFileRef.current.value = "";
  };

  const handleDelete = (idx) => {
    const updated = tableData.filter((_, i) => i !== idx);
    setTableData(updated);
    notifyParent(updated);
  };

  return (
    <div style={S.wrap}>
      {loadingApi && <div style={S.loader}>⏳ Loading existing documents…</div>}
      {!loadingApi && apiError && <div style={S.errorBox}>⚠️ {apiError}</div>}

      <div style={{ marginBottom: "16px", width: "50%" }}>
        <FW label="Select Document Type">
          <select
            style={S.select}
            value={docKey}
            onChange={(e) => handleDocKeyChange(e.target.value)}
          >
            <option value="">-- Select --</option>
            {DOCUMENT_LIST.map((d) => (
              <option key={d.key} value={d.key}>
                {d.key}. {d.label}
              </option>
            ))}
          </select>
        </FW>
      </div>

      <div style={S.grid2}>
        {/* ==================== EXISTING DOCUMENT - SAME SIZE AS NEW ==================== */}
        <FW label="EXISTING Document">
          <div style={{
            width: "100%",
            padding: "9px 12px",
            background: "#f0f7ff",
            border: "1px solid #ccd4e0",
            borderRadius: "6px",
            minHeight: "42px",           // Same height as input field
            display: "flex",
            alignItems: "center",
            fontSize: "13px",
            boxSizing: "border-box"
          }}>
            {docKey && existingDocUrl ? (
              <a 
                href={existingDocUrl.startsWith("http") ? existingDocUrl : `https://7zgjxth4-5056.inc1.devtunnels.ms/${existingDocUrl}`}
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: "#0f3460", fontWeight: "600", textDecoration: "underline" }}
              >
                📄 {existingDocName}
              </a>
            ) : docKey ? (
              <span style={{ color: "#666" }}>No existing document found</span>
            ) : (
              <span style={{ color: "#999" }}>Select document type to view existing file</span>
            )}
          </div>
        </FW>

        {/* ==================== NEW DOCUMENT ==================== */}
        <FW label="NEW Document (Upload New PDF)">
          <input 
            ref={newFileRef} 
            style={S.input} 
            type="file" 
            accept=".pdf,application/pdf" 
            onChange={handleNewFileChange} 
          />
          {newFile && <div style={{ fontSize: "12px", marginTop: "4px", color: "#1a7a3c" }}>📄 {newFile.name}</div>}
          {newFileError && <div style={{ color: "#e74c3c", fontSize: "12px", marginTop: "4px" }}>{newFileError}</div>}
        </FW>
      </div>

      <div style={{ marginBottom: "16px", width: "50%" }}>
        <FW label="Remarks">
          <textarea 
            style={S.textarea} 
            rows={2} 
           value={remarks} 
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks..." 
          />
        </FW>
      </div>

      <button style={S.btn} onClick={handleAdd}>+ Add</button>

      {/* Table remains same */}
            {/* ==================== UPLOAD DOCUMENTS TABLE ==================== */}
      {tableData.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table style={{ ...S.table, marginTop: 0, minWidth: "950px" }}>
            <thead>
              <tr>
                <th style={S.th}>Field</th>
                <th style={S.th}>Existing Value</th>
                <th style={S.th}>New Value</th>
                <th style={{ ...S.th, minWidth: "160px" }}>Remarks</th>
                {/* <th style={S.th}>Supporting Documents</th> */}
                <th style={{ ...S.th, width: "60px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafd" }}>
                  <td style={{ ...S.td, fontWeight: "600", color: "#0f3460", maxWidth: "280px", wordBreak: "break-word" }}>
                    {r.docType}
                  </td>
                  <td style={S.td}>
                    {r.oldFileUrl ? (
                      <a 
                        href={r.oldFileUrl.startsWith("http") ? r.oldFileUrl : `https://7zgjxth4-5056.inc1.devtunnels.ms/${r.oldFileUrl}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: "#0f3460", fontWeight: "600" }}
                      >
                        {r.oldFileName}
                      </a>
                    ) : "-"}
                  </td>
                  <td style={S.td}>
                    {r.newFileUrl ? (
                      <a 
                        href={r.newFileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: "#1a7a3c", fontWeight: "600" }}
                      >
                        {r.newFileName}
                      </a>
                    ) : "-"}
                  </td>
                  <td style={{ ...S.td, maxWidth: "200px" }}>
                    <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap", maxHeight: "60px", overflowY: "auto" }}>
                      {r.remarks || "-"}
                    </div>
                  </td>
                  {/* <td style={S.td}>
                    {r.newFileUrl ? (
                      <a 
                        href={r.newFileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: "#0f3460", fontWeight: "600" }}
                      >
                        📄 {r.newFileName}
                      </a>
                    ) : "-"}
                  </td> */}
                  <td style={{ ...S.td, textAlign: "center" }}>
                    <button style={S.btnDel} onClick={() => handleDelete(i)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── CONSULTANCY DETAILS SECTION ──────────────────────────────────────────────
function ConsultancySection({ onChange, tableData, setTableData, applicationNumber, panNumber }) {
  // ... (full code same as you gave)
  const [selectedField, setSelectedField] = useState("");
  const [oldValue,      setOldValue]      = useState("");
  const [newValue,      setNewValue]      = useState("");
  const [remarks, setRemarks] = useState(""); 
  const [file,          setFile]          = useState(null);
  const [fileError,     setFileError]     = useState("");

  const fileInputRef = useRef(null);

  const { apiData, loadingApi, apiError } = useProjectDocumentsApi(applicationNumber, panNumber);
  const consultantData = apiData?.consultant || null;

  const resolveExistingValue = (fieldLabel) => {
    if (!consultantData) {
      console.warn(`⚠️ [ConsultancySection] consultantData not loaded for "${fieldLabel}"`);
      return "";
    }
    const apiKey = CONSULTANCY_FIELD_TO_API_KEY[fieldLabel];
    if (!apiKey) return "";
    const raw = consultantData[apiKey];
    return (raw !== null && raw !== undefined) ? String(raw) : "No data available";
  };

  const isValidPDF = (file) => {
    if (!file) return false;
    return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  };

  const notifyParent = (rows) => {
    onChange({
      target: { name: "__consultancy_rows", value: rows.length ? JSON.stringify(rows) : "" }
    });
  };

  const handleFieldChange = (val) => {
    setSelectedField(val);
    setNewValue("");
    setFileError("");
    if (val) {
      setOldValue(resolveExistingValue(val));
    } else {
      setOldValue("");
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFileError("");
    if (f) {
      if (isValidPDF(f)) setFile(f);
      else { setFile(null); setFileError("This file should be in PDF format only"); e.target.value = ""; }
    }
  };

  const handleAdd = () => {
    if (!selectedField)   { alert("Please select a field."); return; }
    if (!newValue.trim()) { alert("Please enter the new value."); return; }
    if (selectedField === "Mobile Number" && !/^[6-9]\d{9}$/.test(newValue)) {
      alert("Invalid mobile number. Must be 10 digits starting with 6-9."); return;
    }
    if (selectedField === "Email Id" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
      alert("Invalid email address."); return;
    }
    if (!remarks.trim()) { alert("Please enter a remarks."); return; }
    if (file && !isValidPDF(file)) { setFileError("This file should be in PDF format only"); return; }

   const newRow = {
  type: "field",

  subLabel: "Consultancy Details",

  field: selectedField,

  existingValue: oldValue || "-",

  oldValue: oldValue || "-",

  newValue: newValue,

  remarks: remarks || "-",

  description: remarks || "-",

  // IMPORTANT ADD THESE
  supportingdocuments: file?.name || "-",

  supportingdocumentsUrl: file
    ? URL.createObjectURL(file)
    : "",

  // OPTIONAL KEEP THESE ALSO
  fileName: file?.name || "-",
  supportingdocuments: file?.name || "-",

supportingdocumentsUrl: file
  ? URL.createObjectURL(file)
  : "",

  fileUrl: file
    ? URL.createObjectURL(file)
    : "",
};

    const updated = [...tableData, newRow];
    setTableData(updated);
    notifyParent(updated);

    setSelectedField(""); setOldValue(""); setNewValue(""); setRemarks("");
    setFile(null); setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (idx) => {
    const updated = tableData.filter((_, i) => i !== idx);
    setTableData(updated);
    notifyParent(updated);
  };

  return (
    <div style={S.wrap}>
      {loadingApi && <div style={S.loader}>⏳ Loading existing consultancy details…</div>}
      {!loadingApi && apiError && <div style={S.errorBox}>⚠️ {apiError}</div>}

      {/* {!loadingApi && consultantData && (
        <div style={S.card}>
          <div style={S.cardTitle}>👤 Existing Consultancy Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px", fontSize: "13px" }}>
            {CONSULTANCY_FIELDS.map((label) => {
              const apiKey = CONSULTANCY_FIELD_TO_API_KEY[label];
              const val = apiKey ? consultantData[apiKey] : null;
              return (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "11px", color: "#6b7c93", fontWeight: "600", textTransform: "uppercase" }}>{label}</span>
                  <span style={{ color: "#0f3460", fontWeight: "500" }}>{val || "—"}</span>
                </div>
              );
            })}
          </div>
        </div>
      )} */}

      <div style={{ marginBottom: "16px", width: "50%" }}>
        <FW label="Select Consultancy Field">
          <select style={S.select} value={selectedField} onChange={(e) => handleFieldChange(e.target.value)}>
            <option value="">-- Select --</option>
            {CONSULTANCY_FIELDS.map((f, i) => <option key={i} value={f}>{f}</option>)}
          </select>
        </FW>
      </div>

      {selectedField && (
        <>
          <div style={S.grid2}>
            <FW label={`Existing ${selectedField}`}>
              <input style={S.inputRO} type="text" value={loadingApi ? "Loading…" : oldValue} readOnly />
            </FW>
            <FW label={`New ${selectedField}`}>
              <input style={S.input} type={selectedField === "Mobile Number" ? "tel" : selectedField === "Email Id" ? "email" : "text"} value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder={`Enter new ${selectedField}`} />
            </FW>
          </div>

          <div style={S.grid2}>
            <FW label="Remarks">
              <textarea style={S.textarea} rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter reason for this change..." />
            </FW>
            <FW label="Supporting Document">
              <input ref={fileInputRef} style={S.input} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} />
              {file && <div style={{ fontSize: "12px", marginTop: "4px", color: "#1a7a3c" }}>📄 {file.name}</div>}
              {fileError && <div style={{ color: "#e74c3c", fontSize: "12px", marginTop: "4px", fontWeight: "500" }}>{fileError}</div>}
            </FW>
          </div>
        </>
      )}

      <button style={S.btn} onClick={handleAdd}>+ Add</button>

      {tableData.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table style={{ ...S.table, marginTop: 0, minWidth: "700px" }}>
            <thead>
              <tr>
                <th style={S.th}>Field</th>
                <th style={S.th}>Old Value</th>
                <th style={S.th}>New Value</th>
                <th style={{ ...S.th, minWidth: "160px" }}>Remarks</th>
                <th style={S.th}>Supporting Documents</th>
                <th style={{ ...S.th, width: "60px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafd" }}>
                  <td style={{ ...S.td, fontWeight: "600", color: "#0f3460" }}>{r.field}</td>
                  <td style={{ ...S.td, color: "#6b7c93" }}>{r.oldValue}</td>
                  <td style={{ ...S.td, color: "#1a7a3c", fontWeight: "600" }}>{r.newValue}</td>
                  <td style={{ ...S.td, maxWidth: "200px" }}><div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap", maxHeight: "60px", overflowY: "auto" }}>{r.remarks}</div></td>
                  <td style={S.td}>
                    {r.fileUrl ? <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0f3460", fontWeight: "600" }}>{r.fileName}</a> : "-"}
                  </td>
                  <td style={{ ...S.td, textAlign: "center" }}>
                    <button style={S.btnDel} onClick={() => handleDelete(i)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function UploadDocumentsForm({
  subSectionId,
  onChange = () => {},
  tableStore = {},
  setTableStore = () => {},
  applicationNumber,
  panNumber,
}) {
  const tableData = tableStore[subSectionId] || [];
  const setTableData = (rows) => setTableStore((prev) => ({ ...prev, [subSectionId]: rows }));

  if (subSectionId === "consultancy_details") {
    return <ConsultancySection onChange={onChange} tableData={tableData} setTableData={setTableData} applicationNumber={applicationNumber} panNumber={panNumber} />;
  }

  return <UploadDocSection onChange={onChange} tableData={tableData} setTableData={setTableData} applicationNumber={applicationNumber} panNumber={panNumber} />;
}