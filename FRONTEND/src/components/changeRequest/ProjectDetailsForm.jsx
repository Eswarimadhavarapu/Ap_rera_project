import React, { useState } from "react";

// ─── SUB-SECTION CONFIGS ─────────────────────────────────────────────────────
export const PROJECT_DETAILS_SUBSECTIONS = [
  {
    id: "project_registration",
    label: "Project Details",
    fields: [
      {
        name: "projectType",
        label: "CHANGE TYPE",
        type: "select",
        options: [
          "Project Name",
          "Project Description",
          "Project Type",
          "Project Status",
          "Building Plan No",
          "Building Permission Validity From",
          "Building Permission Validity Upto",
          "Date of Commencement of the Project",
          "Proposed Date of Completion of the Project",
          "Total Area Of Land (Sq.m)",
          "Total Plinth Area (Sq.m)",
          "Total Open Area (Sq.m)",
          "Total Built-up Area (Sq.m)",
        ],
      },
    ],
  },
  {
    id: "project_material_facts",
    label: "Project Material Facts",
    fields: [],
  },
];

const PROJECT_TYPE_OPTIONS = [
  "Residential",
  "Commercial",
  "Mixed Development",
  "Layout for Plots",
  "Layouts for Plots & Buildings",
];

// ─── VALIDATION CONFIG ───────────────────────────────────────────────────────
// Maps each change type to its validation rule
const FIELD_VALIDATIONS = {
  // Text only (no numbers, no special chars)
  "Project Name":                              { type: "text",     maxLen: 100,  msg: "Project Name should contain only letters and spaces." },
  "Project Description":                       { type: "textarea", maxLen: 500,  msg: "Description should not exceed 500 characters." },
  "Project Status":                            { type: "text",     maxLen: 100,  msg: "Project Status should contain only letters." },
  "Building Plan No":                          { type: "alphanumeric", maxLen: 50, msg: "Building Plan No should contain only letters and numbers." },

  // Date fields
  "Building Permission Validity From":         { type: "date",     msg: "Please enter a valid date." },
  "Building Permission Validity Upto":         { type: "date",     msg: "Please enter a valid date." },
  "Date of Commencement of the Project":       { type: "date",     msg: "Please enter a valid date." },
  "Proposed Date of Completion of the Project":{ type: "date",     msg: "Please enter a valid date." },

  // Numeric only (no letters)
  "Total Area Of Land (Sq.m)":                 { type: "decimal",  msg: "Area must be a positive number (e.g. 1200.50)." },
  "Total Plinth Area (Sq.m)":                  { type: "decimal",  msg: "Area must be a positive number (e.g. 1200.50)." },
  "Total Open Area (Sq.m)":                    { type: "decimal",  msg: "Area must be a positive number (e.g. 1200.50)." },
  "Total Built-up Area (Sq.m)":                { type: "decimal",  msg: "Area must be a positive number (e.g. 1200.50)." },

  // Dropdown — no text validation needed
  "Project Type":                              { type: "select",   msg: "" },
};
// 🔥 Prevent invalid typing (characters/digits control)
function filterInputValue(type, value) {
  switch (type) {
    case "text":
      return value.replace(/[^a-zA-Z\s]/g, ""); // only letters
    case "alphanumeric":
      return value.replace(/[^a-zA-Z0-9\s\-\/]/g, "");
    case "decimal":
      return value.replace(/[^0-9.]/g, "");
    default:
      return value;
  }
}

// Returns error message or "" if valid
function validateFieldValue(fieldName, value) {
  if (!value || value.trim() === "") return "";

  const rule = FIELD_VALIDATIONS[fieldName];
  if (!rule) return "";

  switch (rule.type) {
    case "text":
      if (!/^[a-zA-Z\s]+$/.test(value))
        return "Only letters are allowed.";
      break;

    case "alphanumeric":
      if (!/^[a-zA-Z0-9\s\-\/]+$/.test(value))
        return "Only letters and numbers allowed.";
      break;

    case "decimal":
      if (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) <= 0)
        return "Only numeric values allowed (e.g. 1200.50)";
      break;

    case "date":
      if (!value)
        return "Please select a valid date.";
      break;

    case "textarea":
      if (value.length > 500)
        return `Max 500 characters allowed (${value.length}/500)`;
      break;

    default:
      break;
  }

  if (rule.maxLen && value.length > rule.maxLen)
    return `Maximum ${rule.maxLen} characters allowed.`;

  return "";
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const selectStyle = {
  width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0",
  borderRadius: "6px", fontSize: "13px", boxSizing: "border-box",
  background: "#fff", cursor: "pointer",
};
const inputStyle = {
  width: "100%", padding: "9px 12px", border: "1px solid #ccd4e0",
  borderRadius: "6px", fontSize: "13px", boxSizing: "border-box",
};
const labelStyle = {
  display: "block", fontWeight: "600", marginBottom: "5px",
  fontSize: "13px", color: "#1a2535",
};
const thStyle = {
  padding: "10px 12px", border: "1px solid #ccd4e0",
  background: "#2f5d9f", color: "#fff", textAlign: "left", fontWeight: "600",
};
const tdStyle = {
  padding: "9px 12px", border: "1px solid #e2e8f2",
  verticalAlign: "top", fontSize: "13px",
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ProjectDetailsForm({
  subSectionId,
  formValues    = {},
  onChange      = () => {},
  tableStore    = {},
  setTableStore = () => {},
}) {
  const subSection = PROJECT_DETAILS_SUBSECTIONS.find((s) => s.id === subSectionId);

  const [changeSelected, setChangeSelected] = useState(false);
  const [selectedField,  setSelectedField]  = useState("");
  const [oldValue,       setOldValue]       = useState("");
  const [newValue,       setNewValue]       = useState("");
  const [description,    setDescription]    = useState("");
  const [documentFile,   setDocumentFile]   = useState(null);
  const [totalUnits,     setTotalUnits]     = useState("");
  const [unitFile,       setUnitFile]       = useState(null);
  const [hideFields,     setHideFields]     = useState(false);
  const [oldValueError,  setOldValueError]  = useState("");
  const [newValueError,  setNewValueError]  = useState("");
  const [descError,      setDescError]      = useState("");
  const [totalUnitsErr,  setTotalUnitsErr]  = useState("");

  // tableData lives in parent — survives Back navigation
  const tableData    = tableStore[subSectionId] || [];
  const setTableData = (rows) => setTableStore((prev) => ({ ...prev, [subSectionId]: rows }));

  if (!subSection) return null;

  // ── Does ANY row in the table have Project-Type extra data? ──
  // Only show extra columns when at least one row has totalUnits or unitFileName
  const hasExtraColumns = tableData.some(
    (r) => r.totalUnits || r.unitFileName
  );

  const notifyParent = (rows) => {
    onChange({
      target: {
        name:  `__project_rows_${subSectionId}`,
        value: rows.length ? JSON.stringify(rows) : "",
      },
    });
  };

  const handleChangeType = (e) => {
    const val = e.target.value;
    onChange(e);
    setSelectedField(val);
    setChangeSelected(val !== "");
    setHideFields(false);
    setOldValue(""); setNewValue(""); setDescription("");
    setDocumentFile(null); setTotalUnits(""); setUnitFile(null);
    setOldValueError(""); setNewValueError(""); setDescError(""); setTotalUnitsErr("");
  };

  const handleAdd = () => {
    if (!selectedField)    { alert("Please select a change type."); return; }
    if (!newValue.trim())  { alert("Please enter the new value."); return; }

    // ── Run validations ──
    const oldErr  = validateFieldValue(selectedField, oldValue);
    const newErr  = validateFieldValue(selectedField, newValue);
    const descErr = descError; // already set live

    // totalUnits — only positive integers
    let unitErr = "";
    if (selectedField === "Project Type" && newValue && totalUnits) {
      if (!/^\d+$/.test(totalUnits.trim()) || parseInt(totalUnits) <= 0)
        unitErr = "Total units must be a positive whole number.";
    }

    setOldValueError(oldErr);
    setNewValueError(newErr);
    setTotalUnitsErr(unitErr);

    if (oldErr || newErr || unitErr) return;

    const newRow = {
      field:        selectedField,
      oldValue:     oldValue    || "-",
      newValue:     newValue,
      description:  description || "-",
      document:     documentFile?.name || "-",
      documentUrl:  documentFile ? URL.createObjectURL(documentFile) : "",
      // Extra fields — only present when selectedField === "Project Type"
      totalUnits:   selectedField === "Project Type" ? (totalUnits || "-") : "",
      unitFileName: selectedField === "Project Type" ? (unitFile?.name || "-") : "",
      unitFileUrl:  selectedField === "Project Type" && unitFile ? URL.createObjectURL(unitFile) : "",
    };

    const updated = [...tableData, newRow];
    setTableData(updated);
    notifyParent(updated);

    setOldValue(""); setNewValue(""); setDescription("");
    setDocumentFile(null); setTotalUnits(""); setUnitFile(null);
    setHideFields(true);
  };

  const handleDelete = (idx) => {
    const updated = tableData.filter((_, i) => i !== idx);
    setTableData(updated);
    notifyParent(updated);
  };

  const isProjectTypeSelected = selectedField === "Project Type";

  return (
    <div style={{ padding: "20px" }}>

      {/* ── CHANGE TYPE DROPDOWN ── */}
      <div style={{ marginBottom: "20px", maxWidth: "400px" }}>
        <label style={labelStyle}>CHANGE TYPE</label>
        <select
          style={selectStyle}
          name="projectType"
          value={formValues["projectType"] || ""}
          onChange={handleChangeType}
        >
          <option value="">-- Select --</option>
          {PROJECT_DETAILS_SUBSECTIONS[0].fields[0].options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      {/* ── FORM FIELDS (visible after selection, before Add) ── */}
      {changeSelected && !hideFields && (
        <div>

          {/* OLD + NEW */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={labelStyle}>EXISTING {selectedField}</label>
              {isProjectTypeSelected ? (
                <select style={selectStyle} value={oldValue} onChange={(e) => { setOldValue(e.target.value); setOldValueError(""); }}>
                  <option value="">-- Select --</option>
                  {PROJECT_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : FIELD_VALIDATIONS[selectedField]?.type === "date" ? (
                <input style={{ ...inputStyle, borderColor: oldValueError ? "#c0200f" : "#ccd4e0" }}
                  type="date" value={oldValue}
                  onChange={(e) => { setOldValue(e.target.value); setOldValueError(""); }} />
              ) : (
                <input style={{ ...inputStyle, borderColor: oldValueError ? "#c0200f" : "#ccd4e0" }}
                  value={oldValue}
                 onChange={(e) => {
  const raw = e.target.value;
  const type = FIELD_VALIDATIONS[selectedField]?.type;
  const filtered = filterInputValue(type, raw);

  setOldValue(filtered);
  setOldValueError(validateFieldValue(selectedField, filtered));
}}
                  placeholder={`Enter current ${selectedField}`} />
              )}
              {oldValueError && <div style={{ color: "#c0200f", fontSize: "11px", marginTop: "4px" }}>⚠ {oldValueError}</div>}
            </div>

            <div>
              <label style={labelStyle}>NEW {selectedField}</label>
              {isProjectTypeSelected ? (
                <select style={selectStyle} value={newValue} onChange={(e) => { setNewValue(e.target.value); setNewValueError(""); }}>
                  <option value="">-- Select --</option>
                  {PROJECT_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : FIELD_VALIDATIONS[selectedField]?.type === "date" ? (
                <input style={{ ...inputStyle, borderColor: newValueError ? "#c0200f" : "#ccd4e0" }}
                  type="date" value={newValue}
                  onChange={(e) => { setNewValue(e.target.value); setNewValueError(""); }} />
              ) : (
                <input style={{ ...inputStyle, borderColor: newValueError ? "#c0200f" : "#ccd4e0" }}
                  value={newValue}
                 onChange={(e) => {
  const raw = e.target.value;
  const type = FIELD_VALIDATIONS[selectedField]?.type;
  const filtered = filterInputValue(type, raw);

  setNewValue(filtered);
  setNewValueError(validateFieldValue(selectedField, filtered));
}}
                  placeholder={`Enter new ${selectedField}`} />
              )}
              {newValueError && <div style={{ color: "#c0200f", fontSize: "11px", marginTop: "4px" }}>⚠ {newValueError}</div>}
            </div>
          </div>

          {/* DESCRIPTION + UPLOAD */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, resize: "vertical", borderColor: descError ? "#c0200f" : "#ccd4e0" }} rows={3}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setDescError(e.target.value.length > 500 ? `Description must be under 500 characters. (${e.target.value.length}/500)` : "");
                }}
                placeholder="Enter reason for this change..." />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
                {descError
                  ? <span style={{ color: "#c0200f", fontSize: "11px" }}>⚠ {descError}</span>
                  : <span />}
                <span style={{ fontSize: "11px", color: description.length > 450 ? "#c0200f" : "#999" }}>
                  {description.length}/500
                </span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Upload Document</label>
             <input
  type="file"
  accept=".pdf,application/pdf"
  style={inputStyle}
  onChange={(e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file type
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        e.target.value = null; // reset input
        setDocumentFile(null);
        return;
      }

      setDocumentFile(file);
    }
  }}
/>
              {documentFile && (
                <div style={{ fontSize: "12px", marginTop: "4px", color: "#1a7a3c" }}>
                  📄 {documentFile.name}
                </div>
              )}
            </div>
          </div>

          {/* ── EXTRA FIELDS — only when "Project Type" is selected AND new value picked ── */}
          {isProjectTypeSelected && newValue && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px", padding: "14px", background: "#f5f7fc", borderRadius: "6px", border: "1px solid #e2e8f2" }}>
              <div>
                <label style={labelStyle}>
                  {newValue === "Layout for Plots" ? "Total No of Plots" : "Total No of Villas"}
                </label>
                <input
                  style={{ ...inputStyle, borderColor: totalUnitsErr ? "#c0200f" : "#ccd4e0" }}
                  value={totalUnits}
                  inputMode="numeric"
                  onChange={(e) => {
                    // Allow only digits
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setTotalUnits(val);
                    setTotalUnitsErr(val && parseInt(val) <= 0 ? "Must be greater than 0." : "");
                  }}
                  placeholder="Enter count (numbers only)" />
                {totalUnitsErr && <div style={{ color: "#c0200f", fontSize: "11px", marginTop: "4px" }}>⚠ {totalUnitsErr}</div>}
              </div>
              <div>
                <label style={labelStyle}>
                  {newValue === "Layout for Plots" ? "Upload Plot Details (.xls)" : "Upload Villa Details (.xls)"}
                </label>
              <input
  type="file"
  accept=".pdf,application/pdf"
  style={inputStyle}
  onChange={(e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file type
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        e.target.value = null; // reset input
        setDocumentFile(null);
        return;
      }

      setDocumentFile(file);
    }
  }}
/>
                {unitFile && (
                  <div style={{ fontSize: "12px", marginTop: "4px", color: "#1a7a3c" }}>
                    📄 {unitFile.name}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ADD BUTTON */}
          <button
            style={{ padding: "10px 24px", background: "#0f3460", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", marginTop: "4px" }}
            onClick={handleAdd}
          >
            + Add
          </button>
        </div>
      )}

      {/* ADD ANOTHER button (shown after a row is added) */}
      {changeSelected && hideFields && (
        <button
          style={{ padding: "8px 20px", background: "#eef3fb", color: "#0f3460", border: "1px solid #ccd4e0", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", marginBottom: "12px" }}
          onClick={() => {
            setHideFields(false);
            setOldValue(""); setNewValue(""); setDescription("");
            setDocumentFile(null); setTotalUnits(""); setUnitFile(null);
          setOldValueError(""); setNewValueError(""); setDescError(""); setTotalUnitsErr("");
          }}
        >
          + Add Another Change
        </button>
      )}

      {/* ── TABLE ──
          Columns are DYNAMIC:
          - Base columns always: Field | Old Value | New Value | Description | Document | Action
          - Extra columns ONLY when at least one row has Project Type extra data:
            + Total Units | Unit File
      */}
      {tableData.length > 0 && (
        <table style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Field</th>
              <th style={thStyle}>Old Value</th>
              <th style={thStyle}>New Value</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Document</th>
              {/* Extra columns appear ONLY if any row has Project Type data */}
              {hasExtraColumns && (
                <>
                  <th style={thStyle}>Total Units</th>
                  <th style={thStyle}>Unit File</th>
                </>
              )}
              <th style={{ ...thStyle, width: "60px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafd" }}>
                <td style={{ ...tdStyle, fontWeight: "600", color: "#0f3460" }}>{row.field}</td>
                <td style={{ ...tdStyle, color: "#6b7c93" }}>{row.oldValue}</td>
                <td style={{ ...tdStyle, color: "#1a7a3c", fontWeight: "600" }}>{row.newValue}</td>
                <td style={tdStyle}>{row.description}</td>
                <td style={tdStyle}>
                  {row.documentUrl
                    ? <a href={row.documentUrl} target="_blank" rel="noopener noreferrer"
                        style={{ color: "#0f3460", fontWeight: "600" }}>{row.document}</a>
                    : "-"}
                </td>
                {/* Extra cells — shown only when hasExtraColumns */}
                {hasExtraColumns && (
                  <>
                    <td style={tdStyle}>{row.totalUnits || "-"}</td>
                    <td style={tdStyle}>
                      {row.unitFileUrl
                        ? <a href={row.unitFileUrl} target="_blank" rel="noopener noreferrer"
                            style={{ color: "#0f3460", fontWeight: "600" }}>{row.unitFileName}</a>
                        : "-"}
                    </td>
                  </>
                )}
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <button
                    onClick={() => handleDelete(i)}
                    style={{ background: "#c0200f", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" }}
                  >✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}