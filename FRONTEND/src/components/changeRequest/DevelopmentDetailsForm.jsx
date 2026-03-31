import React, { useState } from "react";

// ─── SUB-SECTION CONFIGS ──────────────────────────────────────────────────────
// ✅ development_main REMOVED as requested
export const DEVELOPMENT_DETAILS_SUBSECTIONS = [
  {
    id: "external_development",
    label: "External Development Work",
    fields: [],
  },
  {
    id: "other_external_works",
    label: "Other External Development Works",
    fields: [
      { name: "otherWorkDescription", label: "Work Description", type: "text" },
      {
        name: "otherWorkType", label: "Work Type", type: "select",
        options: ["Local Authority", "Self Development", "Not Applicable"]
      },
    ],
  },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  wrap: { padding: "20px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" },
  label: { display: "block", fontWeight: "600", marginBottom: "5px", fontSize: "13px", color: "#1a2535" },
  input: { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" },
  select: { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", background: "#fff" },
  textarea: { width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", resize: "vertical" },
  btn: { padding: "10px 24px", background: "#1f4e79", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  btnDel: { background: "#c0200f", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "13px" },
  th: { background: "#1f4e79", color: "#fff", padding: "10px 12px", border: "1px solid #ccd4e0", textAlign: "left", fontWeight: "600" },
  td: { padding: "9px 12px", border: "1px solid #e2e8f2", verticalAlign: "top" },
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
const WORK_OPTIONS = [
  "Use of Renewable Energy",
  "External Development Work Type",
  "% of Work Completed",
  "Roads",
  "Water Supply",
  "Sewage and Drainage System",
  "Electricity Supply Transformer/Sub Station",
  "Electricity Supply Transformation Station",
  "Drinking Water Facility",
  "Fire Fighting Facility",
  "Emergency Evacuation Service",
  "Solid Waste Management And Disposal",
];

function ExternalDevelopmentSection({ onChange, tableData, setTableData, previewData }) {
  const [workType, setWorkType] = useState("");
  const [previousPercent, setPreviousPercent] = useState("");
  const [changePercent, setChangePercent] = useState("");
  const [description, setDescription] = useState("");

  const notifyParent = (rows) => {
    onChange({
      target: {
        name: "__development_rows",
        value: rows.length ? JSON.stringify(rows) : "",
      },
    });
  };

  const handleAdd = () => {
    if (!workType) { alert("Please select a work type."); return; }

    const newRow = {
      workType,
      previousPercent: previousPercent || "-",
      changePercent: changePercent || "-",
      description: description || "-",
    };

    const updated = [...tableData, newRow];
    setTableData(updated);   // ← saved in PARENT, survives Back
    notifyParent(updated);   // ← enables Next button

    setWorkType(""); setPreviousPercent(""); setChangePercent(""); setDescription("");
  };

  const handleDelete = (idx) => {
    const updated = tableData.filter((_, i) => i !== idx);
    setTableData(updated);
    notifyParent(updated);
  };

  return (
    <div style={S.wrap}>
      {/* Row 1: Work Type + Previous % */}
      <div style={S.grid2}>
        <FW label="Work Type">
          <select style={S.select} value={workType} onChange={(e) => {
            const val = e.target.value;
            setWorkType(val);

            let oldP = "";
            if (previewData && previewData.development_details_full && previewData.development_details_full.external_development_work) {
              const ext = previewData.development_details_full.external_development_work;
              const normalizedVal = val.toLowerCase().replace(/[^a-z]/g, "");
              for (const key in ext) {
                const normalizedKey = key.toLowerCase().replace(/[^a-z]/g, "");
                if (normalizedKey === normalizedVal || val.replace(/[^a-zA-Z]/g, "").includes(normalizedKey) || normalizedKey.includes(val.replace(/[^a-zA-Z]/g, ""))) {
                  oldP = ext[key];
                  break;
                }
              }
            }
            setPreviousPercent(oldP);
          }}>
            <option value="">-- Select Work --</option>
            {WORK_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </FW>
        <FW label="Previous Completion %">
          <input style={{ ...S.input, backgroundColor: "#f0f0f0" }} type="text"
            value={previousPercent}
            readOnly
            placeholder="Data unavailable" />
        </FW>
      </div>

      {/* Row 2: Change % + Description */}
      <div style={S.grid2}>
        <FW label="Change Completion %">
          <input style={S.input} type="number" min="0" max="100"
            value={changePercent}
            onChange={(e) => setChangePercent(e.target.value)}
            placeholder="Enter change %" />
        </FW>
        <FW label="Description">
          <textarea style={S.textarea} rows={3} value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..." />
        </FW>
      </div>

      {/* ADD BUTTON */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
        <button style={S.btn} onClick={handleAdd}>+ Add</button>
      </div>

      {/* TABLE — persists across Back navigation */}
      {tableData.length > 0 && (
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Work Type</th>
              <th style={S.th}>Previous %</th>
              <th style={S.th}>Change %</th>
              <th style={S.th}>Description</th>
              <th style={{ ...S.th, width: "60px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafd" }}>
                <td style={{ ...S.td, fontWeight: "600", color: "#0f3460" }}>{row.workType}</td>
                <td style={{ ...S.td, color: "#6b7c93" }}>{row.previousPercent}</td>
                <td style={{ ...S.td, color: "#1a7a3c", fontWeight: "600" }}>{row.changePercent}</td>
                <td style={S.td}>{row.description}</td>
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

// ─── OTHER EXTERNAL WORKS ─────────────────────────────────────────────────────
function OtherExternalWorksSection({ fields, formValues, onChange }) {
  return (
    <div style={S.wrap}>
      <div style={S.grid2}>
        {fields.map((f) => (
          <FW key={f.name} label={f.label}>
            {f.type === "select" ? (
              <select style={S.select} name={f.name}
                value={formValues[f.name] || ""} onChange={onChange}>
                <option value="">-- Select --</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input style={S.input} type={f.type} name={f.name}
                value={formValues[f.name] || ""} onChange={onChange}
                placeholder={`Enter ${f.label}`} />
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
  formValues = {},
  onChange = () => { },
  tableStore = {},
  setTableStore = () => { },
  previewData
}) {
  const subSection = DEVELOPMENT_DETAILS_SUBSECTIONS.find((s) => s.id === subSectionId);
  if (!subSection) return null;

  const tableData = tableStore[subSectionId] || [];
  const setTableData = (rows) => setTableStore((prev) => ({ ...prev, [subSectionId]: rows }));

  if (subSectionId === "external_development") {
    return (
      <ExternalDevelopmentSection
        onChange={onChange}
        tableData={tableData}
        setTableData={setTableData}
        previewData={previewData}
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