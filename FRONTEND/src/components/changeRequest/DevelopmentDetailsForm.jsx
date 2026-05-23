import React, { useState, useEffect } from "react";

// ─── SUB-SECTION CONFIGS ──────────────────────────────────────────────────────
export const DEVELOPMENT_DETAILS_SUBSECTIONS = [
  {
    id: "external_development",
    label: "Flat/Plot details upload",
    //  label: "External Development Work",
    fields: [],
  },
  // {
  //   id: "other_external_works",
  //   label: "Other External Development Works",
  //   fields: [
  //     { name: "otherWorkDescription", label: "Work Description", type: "text" },
  //     {
  //       name: "otherWorkType", label: "Work Type", type: "select",
  //       options: ["Local Authority", "Self Development", "Not Applicable"]
  //     },
  //   ],
  // },
];

const WORK_TYPE_KEY_MAP = {
  "Use of Renewable Energy":                        "Use_of_Renewable_Energy",
  "External Development Work Type":                 "External_Development_Work_Type",
 
  "Roads":                                          "Roads",
  "Water Supply":                                   "Water_Supply",
  "Sewage and Drainage System":                     "Sewage_and_Drainage_System",

  "Electricity Supply Transformation Station":      "Electricity_Supply_Transformation_Station",
  "Drinking Water Facility":                        "Drinking_Water_Facility",
  "Fire Fighting Facility":                         "Fire_Fighting_Facility",
  "Emergency Evacuation Service":                   "Emergency_Evacuation_Service",
  "Solid Waste Management And Disposal":            "Solid_Waste_Management_And_Disposal",
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  wrap:       { padding: "20px" },
  grid2:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" },
  label:      { display: "block", fontWeight: "600", marginBottom: "5px", fontSize: "13px", color: "#1a2535" },
input: {
  width: "100%",
  padding: "14px 16px",
border: "1px solid #cbd5e1",
  borderRadius: "14px",
  fontSize: "14px",
  boxSizing: "border-box",
  background: "#f8fbff",
  transition: "0.3s ease",
  cursor: "pointer",
  minHeight: "65px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
},
  inputRO:    { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", backgroundColor: "#f0f4f8", color: "#555", cursor: "not-allowed" },
  select:     { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", background: "#fff" },
  textarea:   { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", resize: "vertical" },
 btn: {
  padding: "12px 28px",
  background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
  boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
  transition: "0.3s ease"
},
  btnDel:     { background: "#c0200f", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" },
  table:      { width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "13px" },
  th:         { background: "#1f4e79", color: "#fff", padding: "10px 12px", border: "1px solid #ccd4e0", textAlign: "left", fontWeight: "600" },
  td:         { padding: "9px 12px", border: "1px solid #e2e8f2", verticalAlign: "top" },
  loader:     { padding: "10px 14px", fontSize: "13px", color: "#1f4e79", fontStyle: "italic" },
  errorBox:   { padding: "10px 14px", fontSize: "13px", color: "#c0200f", background: "#fff0f0", borderRadius: "6px", marginBottom: "12px" },
};

function FW({ label, children }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

// ─── EXTERNAL DEVELOPMENT WORK ────────────────────────────────────────────────
const WORK_OPTIONS = Object.keys(WORK_TYPE_KEY_MAP);


const DEVELOPMENT_REQUIRED_DOCUMENTS = [
  "Plan and Proceedings",
  "Development details excel sheet",
  "If any sale, 2/3rd of consent letters shall be submitted individually. In case there are no sales or allotments, the promoter shall submit a No-Sale Affidavit.",
  "Latest EC & Sale deed, if any sale exits."
];


function ExternalDevelopmentSection({
  onChange,
  tableData,
  setTableData,
  applicationNumber,
  panNumber,
}) {
  const [workType,        setWorkType]        = useState("");
  const [previousPercent, setPreviousPercent] = useState("");
  const [changePercent,   setChangePercent]   = useState("");
  const [remarks,     setRemarks]     = useState("");
  const [docFile,         setDocFile]         = useState(null);
  const [oldFile, setOldFile] = useState(null);
const [newFile, setNewFile] = useState(null);
const [developmentDocs, setDevelopmentDocs] = useState({});
  const [fileInputKey,    setFileInputKey]    = useState(0); // ← used to reset file input

  // API data state
  const [apiData,     setApiData]     = useState(null);   // raw object from backend
  const [loadingApi,  setLoadingApi]  = useState(false);
  const [apiError,    setApiError]    = useState("");

  // ── Fetch development details once we have both IDs ──────────────────────
  useEffect(() => {
    if (!applicationNumber || !panNumber) return;

    const fetchData = async () => {
      setLoadingApi(true);
      setApiError("");
      try {
       const url =
  `https://0jv8810n-8080.inc1.devtunnels.ms/api/development-details` +
  `?application_number=${encodeURIComponent(applicationNumber)}` +
  `&pan_number=${encodeURIComponent(panNumber)}`;
      

        const res  = await fetch(url);
        const json = await res.json();
         console.log("📦 Full API Response:", json); 
        if (json.status === "success") {
          // Flatten: data may be nested under external_development_work or at root
          const raw = json.data?.external_development_work ?? json.data ?? {};
          setApiData(raw);
        } else {
          setApiError(json.message || "Failed to load development details.");
        }
      } catch (err) {
        console.error("development-details API error:", err);
        setApiError("Could not reach the server. Previous % will be unavailable.");
      } finally {
        setLoadingApi(false);
      }
    };

    fetchData();
  }, [applicationNumber, panNumber]);

  // ── When work type changes, look up its previous % from API data ──────────
  const handleWorkTypeChange = (val) => {
    setWorkType(val);
    setPreviousPercent("");   // reset first

    if (!val || !apiData) return;

    const apiKey = WORK_TYPE_KEY_MAP[val];
    if (!apiKey) return;

    // Direct key lookup (most reliable)
    if (apiData[apiKey] !== undefined && apiData[apiKey] !== null) {
      setPreviousPercent(String(apiData[apiKey]));
      return;
    }

    // Fallback: case-insensitive search across all keys
    const normalised = apiKey.replace(/_/g, "").toLowerCase();
    for (const k of Object.keys(apiData)) {
      if (k.replace(/_/g, "").toLowerCase() === normalised) {
        setPreviousPercent(String(apiData[k]));
        return;
      }
    }
  };

  // ── Notify parent so Next button enablement works ─────────────────────────
const notifyParent = (rows) => {

  const formattedRows = rows.map((row) => ({
    ...row,
    subLabel:  "Flat/Plot details upload",
  }));

  onChange({
    target: {
      name: "external_development",
      value: formattedRows,
    },
  });
};

 const handleAdd = () => {
  
 
const newRow = {
  subLabel: "Flat/Plot details upload",

  oldFileName: oldFile ? oldFile.name : "-",

  newFileName: newFile ? newFile.name : "-",

  supportingdocumentsName: docFile
    ? docFile.name
    : "-",

  newFileUrl: newFile
    ? URL.createObjectURL(newFile)
    : "",

  supportingdocumentsUrl: docFile
    ? URL.createObjectURL(docFile)
    : "",

  _oldFile: oldFile || null,
  _newFile: newFile || null,
  _docFile: docFile || null,

  developmentDocuments:
  Object.entries(developmentDocs)
    .map(
      ([doc, file], index) =>
        `${index + 1}. ${doc}\n${file?.name || "No File"}`
    )
    .join("\n\n"),

};

    const updated = [...tableData, newRow];
    setTableData(updated);
    notifyParent(updated);

   setWorkType("");
setPreviousPercent("");
setChangePercent("");
setRemarks("");

setOldFile(null);
setNewFile(null);
setDocFile(null); // ← reset file input field
  };

  const handleDelete = (idx) => {
    const updated = tableData.filter((_, i) => i !== idx);
    setTableData(updated);
    notifyParent(updated);
  };

return (
  <div style={S.wrap}>

    {/* PAGE HEADING */}
    <div
      style={{
        fontSize: "20px",
        fontWeight: "500",
        color: "#000000",
        marginBottom: "30px",
        paddingBottom: "10px",
        // borderBottom: "2px solid #dbe4f0",
        letterSpacing: "0.5px"
      }}
    >
      Development Details
    </div>

      {/* Loading / error banners */}
      {loadingApi && (
        <div style={S.loader}>⏳ Loading previous development details…</div>
      )}
      {!loadingApi && apiError && (
        <div style={S.errorBox}>⚠️ {apiError}</div>
      )}

     {/* OLD & NEW EXCEL SECTION */}
<div
 style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "35px",
  marginBottom: "35px",
  alignItems: "stretch"
}}
>

  {/* OLD EXCEL */}
  <div
  style={{
    background: "#ffffff",
    padding: "22px",
    borderRadius: "18px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 4px 20px rgba(15,23,42,0.06)"
  }}
>
    <FW label="Existing Excel File">

      

      {/* OLD FILE */}
      <input
        type="file"
        accept=".xls,.xlsx"
        style={{
          ...S.input,
          height: "55px",
          cursor: "pointer"
        }}
       onChange={(e) => {
  const file = e.target.files[0];
  if (file) {
    setOldFile(file);
  }
}}
      />
    </FW>


    {/* DOWNLOAD BUTTON */}
     {/* DOWNLOAD BUTTON */}
{oldFile && (
  <a
    href={URL.createObjectURL(oldFile)}
    download={oldFile.name}
    style={{
      display: "inline-block",
      padding: "10px 16px",
      background: "#1e3a8a",
      color: "#fff",
      borderRadius: "6px",
      textDecoration: "none",
      fontWeight: "300",
      marginBottom: "12px"
    }}  
  >
    Download Old Excel
  </a>
)}
  </div>

  {/* NEW EXCEL */}
  <div>
    <FW label="Mention Excel File">

      <input
        type="file"
        accept=".xls,.xlsx"
        style={{
          ...S.input,
          height: "55px",
          cursor: "pointer"
        }}
        onChange={(e) => {
  const file = e.target.files[0];
  if (file) {
    setNewFile(file);
  }
}}
      />
    </FW>
  </div>


</div>


{/* REQUIRED DOCUMENTS */}
<div style={{ marginBottom: "20px" }}>

  <h4 style={{
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#1e3a5f"
  }}>
    Required Documents
  </h4>

  {DEVELOPMENT_REQUIRED_DOCUMENTS.map((doc, index) => (

    <div
      key={index}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        marginBottom: "10px",
        padding: "6px 10px",
        border: "1px solid #dbe3f0",
        borderRadius: "4px",
        background: "#f9fbff",
        width: "900px",
        minHeight: "45px"
      }}
    >

      {/* DOCUMENT NAME */}
      <div style={{
        width: "520px",
        fontSize: "13px",
        color: "#1a2535",
        fontWeight: "500",
        lineHeight: "20px"
      }}>
        {index + 1}. {doc}
      </div>

      {/* FILE UPLOAD */}
      <input
        type="file"
        accept=".pdf,application/pdf"
        style={{
          width: "220px",
          fontSize: "12px"
        }}
        onChange={(e) => {

          const file = e.target.files[0];

          if (!file) return;

          if (file.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            e.target.value = "";
            return;
          }

          setDevelopmentDocs((prev) => ({
            ...prev,
            [doc]: file,
          }));
        }}
      />
    </div>
  ))}
</div>

      {/* ADD BUTTON */}
    {/* Row 3: Document Upload */}
<div style={{ marginBottom: "16px" }}>
  <FW label="Supporting Documents">  
   <input
  key={fileInputKey}
  type="file"
   accept=".pdf,application/pdf"
  style={{
  ...S.input,
  width: "350px",
  height: "60px",
  padding: "6px 12px",
  cursor: "pointer"
}}
  onChange={(e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ── Allow ONLY PDF ──
if (file.type !== "application/pdf") {
  alert("❌ Only PDF files are allowed.");
  e.target.value = "";
  return;
}

    // ── Max size: 5MB ──
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`❌ File size exceeds ${maxSizeMB}MB limit.\nPlease upload a smaller file.`);
      e.target.value = "";
      return;
    }

    setDocFile(file);
  }}
/>
{docFile && (
  <div style={{ fontSize: "12px", color: "#1a7a3c", marginTop: "4px" }}>
    ✅ {docFile.name}
  </div>
)}
  </FW>
</div>

{/* ADD BUTTON */}
<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
        <button style={S.btn} onClick={handleAdd}>+ Add</button>
      </div>

  {/* TABLE */}
{tableData.length > 0 && (
  <div style={{ overflowX: "auto", marginTop: "25px" }}>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
      }}
    >

      {/* TABLE HEADER */}
      <thead>
        <tr>
          <th style={S.th}>Old File</th>
          <th style={S.th}>New File</th>
          <th style={S.th}>Supporting Documents</th>
          <th style={S.th}>Additional Documents</th>
          <th style={S.th}>Action</th>
        </tr>
      </thead>

      {/* TABLE BODY */}
      <tbody>
        {tableData.map((row, i) => (
          <tr
            key={i}
            style={{
              borderBottom: "1px solid #e5e7eb"
            }}
          >

            {/* OLD FILE */}
            <td
              style={{
                ...S.td,
                color: "#0f172a",
                fontWeight: "500"
              }}
            >
              {row.oldFileName || "-"}
            </td>

            {/* NEW FILE */}
            <td
              style={{
                ...S.td,
                color: "#15803d",
                fontWeight: "500"
              }}
            >
              {row.newFileName || "-"}
            </td>

            {/* SUPPORTING DOC */}
            <td
              style={{
                ...S.td,
                color: "#1d4ed8",
                fontWeight: "500"
              }}
            >
              {row.supportingdocumentsName || "-"}
            </td>

            <td style={S.td}>
  <div
    style={{
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      lineHeight: "22px"
    }}
  >
    {(row.developmentDocuments || "-")
      .split("\n")
      .map((line, index) => (
        <div
          key={index}
          style={{
            color: line.includes(".pdf") ? "#15803d" : "#000",
            fontWeight: line.includes(".pdf") ? "400" : "350"
          }}
        >
          {line}
        </div>
      ))}
  </div>
</td>


            {/* ACTION */}
            <td
              style={{
                ...S.td,
                textAlign: "center"
              }}
            >
              <button
                onClick={() => handleDelete(i)}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#163b6d",
                  color: "#fff",
                  fontSize: "22px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                ×
              </button>
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

// ─── OTHER EXTERNAL WORKS ─────────────────────────────────────────────────────
function OtherExternalWorksSection({ fields, formValues, onChange }) {
  return (
    <div style={S.wrap}>
      <div style={S.grid2}>
        {fields.map((f) => (
          <FW key={f.name} label={f.label}>
            {f.type === "select" ? (
              <select
                style={S.select}
                name={f.name}
                value={formValues[f.name] || ""}
                onChange={onChange}
              >
                <option value="">-- Select --</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                style={S.input}
                type={f.type}
                name={f.name}
                value={formValues[f.name] || ""}
                onChange={onChange}
                placeholder={`Enter ${f.label}`}
              />
            )}
          </FW>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function DevelopmentDetailsForm({
  subSectionId,
  formValues   = {},
  onChange     = () => {},
  tableStore   = {},
  setTableStore = () => {},
  // applicationNumber & panNumber passed down from ChangeRequest
  applicationNumber,
  panNumber,
  // previewData kept for backward-compat but no longer needed for % lookup
  previewData,
}) {
  const subSection = DEVELOPMENT_DETAILS_SUBSECTIONS.find((s) => s.id === subSectionId);
  if (!subSection) return null;

  
    
 const tableData = tableStore[subSectionId] || [];

const setTableData = (rows) => {
  setTableStore((prev) => ({
    ...prev,
    [subSectionId]: rows,
  }));
};

if (subSectionId === "external_development") {
  return (
    <ExternalDevelopmentSection
      onChange={onChange}
      tableData={tableData}
      setTableData={setTableData}
      applicationNumber={applicationNumber}
      panNumber={panNumber}
    />
  );
}   



  if (subSectionId === "other_external_works") {
    return (
      <OtherExternalWorksSection
        fields={subSection.fields}
        formValues={formValues}
        onChange={onChange}
      />
    );
  }

  return null;
}