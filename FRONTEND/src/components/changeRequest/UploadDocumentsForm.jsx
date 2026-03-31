import React, { useState } from "react";

// ─── SUB-SECTION CONFIGS ──────────────────────────────────────────────────────
export const UPLOAD_DOCUMENTS_SUBSECTIONS = [
  {
    id: "documents",
    label: "Upload Documents",
    isDocumentSection: false,   // handled by custom table, NOT docFiles
    fields: [],
  },
  {
    id: "consultancy_details",
    label: "Consultancy Details",
    isDocumentSection: false,
    fields: [],
  },
];

const DOCUMENT_DROPDOWN = [
  "Copies of the registered ownership documents / Pattadhar pass books issued by Revenue department along with link documents and authorization letter given by the Land Owner (refer Form P20 in form download).",
  "Copies of the combined field sketches showing the Survey Number boundaries, Subdivision boundaries, and Layout boundaries duly marking the Geo-Coordinates at every corner of the site.",
  "Detailed site plan showing the measurements as on ground including diagonals along with Geo-Coordinates (Latitude and Longitude) at end points of the project site along with incorporation on Satellite Imagery.",
  "Copy of the registered development agreement between the Owner of the land and the Promoter / Authorization letter given by the Land owner to undertake the construction of the building by the promoter.",
  "Land Title search Report from an Advocate (include Advocate Enrolment Number) having experience of atleast ten years in land related matters.",
  "Latest (by 30 days) Encumbrance certificate (for entire period of document) issued by the Registration and Stamps department.",
  "Copy of the plan and proceedings issued by the competent Authority for approval of plans (TDR Bonds, if any).",
  "Approved plan / list of amenities proposed in the site.",
  "NOC’s issued by Authority (where applicable viz., Airport Authority, Fire Department, Environmental Clearance, etc.).",
  "Detailed technical specifications of the construction of the buildings and facilities proposed in the project including brand details, specifications of infrastructure and details of fixtures and fittings (refer Form P18 in forms download).",
  "Topo Plan drawn to a scale with nearby land marks of the site.",
  "Licenses / Enrolment form of Civil Contractors, or turnkey contractor, or EPC Contractors of the project (if any).",
  "Licenses / Enrolment form of Engineer or firm or company (if any).",
  "Licenses / Enrolment form of Chartered Accountant or firm or company.",
  "Detailed estimate of the expenditure for construction of the building (refer Form P16 in forms download).",
  "Statement of source of funds for construction of building (refer Form P9 in forms download).",
  "Details of financial agreement made with any bank or other financial institution recognised by the Reserve Bank of India and of legal safeguards taken, if any, for the construction of building, or transfer of building by sale, gift or mortgage or otherwise (wherever applicable).",
  "Copy of documents showing details of mortgage or any other legal encumbrance created on land in favour of any bank or financial institution recognised by the RBI (where applicable).",
  "Proforma of the Allotment Letter proposed to be signed with the Allottee (refer Form P14 in forms download).",
  "Proforma of the Agreement for Sale proposed to be signed with the Allottee (refer Form P15 in forms download).",
  "Proforma of the Conveyance Deed proposed to be signed with the Allottee.",
  "Structural Stability Certificate duly issued by Certified Structural Consultant (refer Form P19 in forms download).",
  "Copy of Insurance of title of the land.",
  "FORM - B, Declaration, supported by an affidavit (on Rs.20 non judicial stamp paper), which shall be signed by the promoter or any person authorized by the promoter under Rule 3-B(2)(a) of AP Real Estate Rules-2017 (refer Form P11 in forms download).",
  "Details of the area mortgaged to the Competent Authority for approval of Plans / Mortgage Deed."
];

const CONSULTANCY_FIELDS = [
  "Name of Consultancy/Agency/Association/Individual",
  "Name",
  "Mobile Number",
  "Email Id",
  "Full Address for communication",
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  wrap: { padding: "20px" },
  label: { display: "block", fontWeight: "600", marginBottom: "5px", fontSize: "13px", color: "#1a2535" },
  input: { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" },
  select: { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", background: "#fff" },
  textarea: { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", resize: "vertical" },
  btn: { padding: "10px 24px", background: "#0f3460", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  btnDel: { background: "#c0200f", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "13px" },
  th: { background: "#1e4d8f", color: "#fff", padding: "10px 12px", border: "1px solid #ccd4e0", textAlign: "left", fontWeight: "600" },
  td: { padding: "9px 12px", border: "1px solid #e2e8f2", verticalAlign: "top" },
};

function FW({ label, children, style }) {
  return (
    <div style={style}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

// ─── UPLOAD DOCUMENTS SECTION ─────────────────────────────────────────────────
function UploadDocSection({ onChange, tableData, setTableData, previewData }) {
  const [docType, setDocType] = useState("");
  const [oldFile, setOldFile] = useState(null);
  const [oldFileNameDb, setOldFileNameDb] = useState("");
  const [oldFileUrlDb, setOldFileUrlDb] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [description, setDescription] = useState("");

  const notifyParent = (rows) => {
    onChange({
      target: {
        name: "__upload_doc_rows",
        value: rows.length ? JSON.stringify(rows) : "",
      },
    });
  };

  const handleAdd = () => {
    if (!docType) { alert("Please select a document type."); return; }
    if (!oldFile && !oldFileNameDb && !newFile) { alert("Please upload at least one file or ensure an old document exists."); return; }

    const newRow = {
      docType,
      oldFileName: oldFile ? oldFile.name : (oldFileNameDb || "-"),
      oldFileUrl: oldFile ? URL.createObjectURL(oldFile) : (oldFileUrlDb || ""),
      newFileName: newFile?.name || "-",
      newFileUrl: newFile ? URL.createObjectURL(newFile) : "",
      description: description || "-",
    };

    const updated = [...tableData, newRow];
    setTableData(updated);
    notifyParent(updated);

    setDocType(""); setOldFile(null); setOldFileNameDb(""); setOldFileUrlDb(""); setNewFile(null); setDescription("");
  };

  const handleDelete = (idx) => {
    const updated = tableData.filter((_, i) => i !== idx);
    setTableData(updated);
    notifyParent(updated);
  };

  return (
    <div style={S.wrap}>
      {/* Document Type */}
      <div style={{ marginBottom: "16px" }}>
        <FW label="Select Document Type">
          <select style={S.select} value={docType} onChange={(e) => {
            const val = e.target.value;
            setDocType(val);
            setOldFile(null);
            setOldFileNameDb("");
            setOldFileUrlDb("");

            if (previewData && previewData.project_upload_documents && val) {
              const doc = previewData.project_upload_documents.find(d =>
                d.document_name.trim().toLowerCase() === val.trim().toLowerCase() ||
                d.document_name.includes(val) ||
                val.includes(d.document_name)
              );
              if (doc && doc.file_path) {
                // Determine BACKEND_URL or just use path
                const path = doc.file_path.startsWith("http") ? doc.file_path : `http://localhost:5000/${doc.file_path}`;
                setOldFileNameDb(doc.document_name);
                setOldFileUrlDb(path);
              }
            }
          }}>
            <option value="">-- Select --</option>
            {DOCUMENT_DROPDOWN.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </FW>
      </div>

      {/* Old + New Files */}
      <div style={S.grid2}>
        <FW label="OLD Document">
          {oldFileNameDb ? (
            <div style={{ padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", backgroundColor: "#f0f0f0" }}>
              <a href={oldFileUrlDb} target="_blank" rel="noopener noreferrer" style={{ color: "#0f3460", fontWeight: "600", fontSize: "13px" }}>
                📄 Existing: {oldFileNameDb}
              </a>
            </div>
          ) : (
            <>
              <input style={S.input} type="file" onChange={(e) => setOldFile(e.target.files[0])} />
              {oldFile && <div style={{ fontSize: "12px", marginTop: "4px", color: "#1a7a3c" }}>📄 {oldFile.name}</div>}
              {!docType && <div style={{ fontSize: "11px", color: "#6b7c93", marginTop: "4px" }}>Select a document type to check for existing files.</div>}
            </>
          )}
        </FW>
        <FW label="NEW Document">
          <input style={S.input} type="file" onChange={(e) => setNewFile(e.target.files[0])} />
          {newFile && <div style={{ fontSize: "12px", marginTop: "4px", color: "#1a7a3c" }}>📄 {newFile.name}</div>}
        </FW>
      </div>

      {/* Description + Add */}
      <div style={{ marginBottom: "16px" }}>
        <FW label="Description">
          <textarea style={S.textarea} rows={2} value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..." />
        </FW>
      </div>

      <button style={S.btn} onClick={handleAdd}>+ Add</button>

      {/* TABLE */}
      {tableData.length > 0 && (
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Document Type</th>
              <th style={S.th}>Old File</th>
              <th style={S.th}>New File</th>
              <th style={S.th}>Description</th>
              <th style={{ ...S.th, width: "60px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafd" }}>
                <td style={{ ...S.td, fontWeight: "600", color: "#0f3460" }}>{r.docType}</td>
                <td style={S.td}>
                  {r.oldFileUrl
                    ? <a href={r.oldFileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0f3460", fontWeight: "600" }}>{r.oldFileName}</a>
                    : "-"}
                </td>
                <td style={S.td}>
                  {r.newFileUrl
                    ? <a href={r.newFileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#1a7a3c", fontWeight: "600" }}>{r.newFileName}</a>
                    : "-"}
                </td>
                <td style={S.td}>{r.description}</td>
                <td style={{ ...S.td, textAlign: "center" }}>
                  <button style={S.btnDel} onClick={() => handleDelete(i)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── CONSULTANCY DETAILS SECTION ──────────────────────────────────────────────
function ConsultancySection({ onChange, tableData, setTableData, previewData }) {
  const [selectedField, setSelectedField] = useState("");
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const notifyParent = (rows) => {
    onChange({
      target: {
        name: "__consultancy_rows",
        value: rows.length ? JSON.stringify(rows) : "",
      },
    });
  };

  const handleAdd = () => {
    if (!selectedField) { alert("Please select a field."); return; }
    if (!newValue.trim()) { alert("Please enter the new value."); return; }

    const newRow = {
      field: selectedField,
      oldValue: oldValue.trim() || "-",
      newValue: newValue.trim(),
      description: description.trim() || "-",
      fileName: file?.name || "-",
      fileUrl: file ? URL.createObjectURL(file) : "",
    };

    const updated = [...tableData, newRow];
    setTableData(updated);
    notifyParent(updated);

    setSelectedField(""); setOldValue(""); setNewValue("");
    setDescription(""); setFile(null);
  };

  const handleDelete = (idx) => {
    const updated = tableData.filter((_, i) => i !== idx);
    setTableData(updated);
    notifyParent(updated);
  };

  return (
    <div style={S.wrap}>
      {/* Select Field */}
      <div style={{ marginBottom: "16px" }}>
        <FW label="Select Consultancy Field">
          <select style={S.select} value={selectedField}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedField(val);

              let oldV = "";
              if (previewData && previewData.consultancy_details) {
                const c = previewData.consultancy_details;
                if (val.includes("Consultancy")) oldV = c.consultancy_name || "";
                else if (val === "Name") oldV = c.consultant_name || "";
                else if (val.includes("Mobile")) oldV = c.mobile || "";
                else if (val.includes("Email")) oldV = c.email || "";
                else if (val.includes("Address")) oldV = c.address || "";
              }
              setOldValue(oldV); setNewValue("");
            }}>
            <option value="">-- Select --</option>
            {CONSULTANCY_FIELDS.map((f, i) => <option key={i} value={f}>{f}</option>)}
          </select>
        </FW>
      </div>

      {selectedField && (
        <>
          {/* Old + New */}
          <div style={S.grid2}>
            <FW label={`Old ${selectedField}`}>
              <input style={{ ...S.input, backgroundColor: "#f0f0f0" }} type="text" value={oldValue}
                readOnly
                placeholder={`Current data unavailable`} />
            </FW>
            <FW label={`New ${selectedField}`}>
              <input style={S.input} type="text" value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`Enter new ${selectedField}`} />
            </FW>
          </div>

          {/* Description + Upload */}
          <div style={S.grid2}>
            <FW label="Description">
              <textarea style={S.textarea} rows={2} value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter reason for this change..." />
            </FW>
            <FW label="Upload Document">
              <input style={S.input} type="file" onChange={(e) => setFile(e.target.files[0])} />
              {file && <div style={{ fontSize: "12px", marginTop: "4px", color: "#1a7a3c" }}>📄 {file.name}</div>}
            </FW>
          </div>
        </>
      )}

      <button style={S.btn} onClick={handleAdd}>+ Add</button>

      {/* TABLE */}
      {tableData.length > 0 && (
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Field</th>
              <th style={S.th}>Old Value</th>
              <th style={S.th}>New Value</th>
              <th style={S.th}>Description</th>
              <th style={S.th}>Document</th>
              <th style={{ ...S.th, width: "60px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafd" }}>
                <td style={{ ...S.td, fontWeight: "600", color: "#0f3460" }}>{r.field}</td>
                <td style={{ ...S.td, color: "#6b7c93" }}>{r.oldValue}</td>
                <td style={{ ...S.td, color: "#1a7a3c", fontWeight: "600" }}>{r.newValue}</td>
                <td style={S.td}>{r.description}</td>
                <td style={S.td}>
                  {r.fileUrl
                    ? <a href={r.fileUrl} target="_blank" rel="noopener noreferrer"
                      style={{ color: "#0f3460", fontWeight: "600" }}>{r.fileName}</a>
                    : "-"}
                </td>
                <td style={{ ...S.td, textAlign: "center" }}>
                  <button style={S.btnDel} onClick={() => handleDelete(i)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function UploadDocumentsForm({
  subSectionId,
  onChange = () => { },
  tableStore = {},
  setTableStore = () => { },
  previewData
}) {
  const tableData = tableStore[subSectionId] || [];
  const setTableData = (rows) => setTableStore((prev) => ({ ...prev, [subSectionId]: rows }));

  if (subSectionId === "consultancy_details") {
    return (
      <ConsultancySection
        onChange={onChange}
        tableData={tableData}
        setTableData={setTableData}
        previewData={previewData}
      />
    );
  }

  // default: "documents"
  return (
    <UploadDocSection
      onChange={onChange}
      tableData={tableData}
      setTableData={setTableData}
      previewData={previewData}
    />
  );
}