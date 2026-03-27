import React, { useState } from "react";

// ─── SUB-SECTION CONFIGS ─────────────────────────────────────────────────────
export const ASSOCIATE_DETAILS_SUBSECTIONS = [
  {
    id: "project_agent",
    label: "Project Agent",
    fields: [
      { name: "agentName", label: "Agent Name", type: "text" },
      { name: "agentMobile", label: "Agent Mobile", type: "text" },
      { name: "agentEmail", label: "Agent Email", type: "email" },
      { name: "agentReraRegNo", label: "Agent RERA Reg No", type: "text" },
    ],
  },
  {
    id: "architects",
    label: "Project Architects",
    fields: [
      { name: "architectName", label: "Architect Name", type: "text" },
      { name: "architectMobile", label: "Architect Mobile", type: "text" },
      { name: "architectEmail", label: "Architect Email", type: "email" },
      { name: "architectLicense", label: "Architect License No", type: "text" },
      { name: "architectAddress", label: "Architect Address", type: "textarea" },
    ],
  },
  {
    id: "structural_engineers",
    label: "Structural Engineers",
    fields: [
      { name: "structEngineerName", label: "Engineer Name", type: "text" },
      { name: "structEngineerMobile", label: "Engineer Mobile", type: "text" },
      { name: "structEngineerEmail", label: "Engineer Email", type: "email" },
      { name: "structEngineerLicense", label: "Engineer License No", type: "text" },
      { name: "structEngineerAddress", label: "Engineer Address", type: "textarea" },
    ],
  },
  {
    id: "contractors",
    label: "Project Contractors",
    fields: [
      { name: "contractorName", label: "Contractor Name", type: "text" },
      { name: "contractorMobile", label: "Contractor Mobile", type: "text" },
      { name: "contractorEmail", label: "Contractor Email", type: "email" },
      { name: "contractorLicense", label: "Contractor License No", type: "text" },
      { name: "contractorAddress", label: "Contractor Address", type: "textarea" },
    ],
  },
  {
    id: "chartered_accountant",
    label: "Chartered Accountant",
    fields: [
      { name: "caName", label: "CA Name", type: "text" },
      { name: "caMobile", label: "CA Mobile", type: "text" },
      { name: "caEmail", label: "CA Email", type: "email" },
      { name: "caMembership", label: "CA Membership No", type: "text" },
      { name: "caAddress", label: "CA Address", type: "textarea" },
    ],
  },
  {
    id: "project_engineers",
    label: "Project Engineers",
    fields: [
      { name: "projEngineerName", label: "Engineer Name", type: "text" },
      { name: "projEngineerMobile", label: "Engineer Mobile", type: "text" },
      { name: "projEngineerEmail", label: "Engineer Email", type: "email" },
      { name: "projEngineerLicense", label: "Engineer License No", type: "text" },
      { name: "projEngineerAddress", label: "Engineer Address", type: "textarea" },
    ],
  },
];

// ─── FIELD RENDERER with Inline Error ───────────────────────────────────────
function FormField({ field, value, onChange, error }) {
  const isFullWidth = field.type === "textarea";

  return (
    <div style={{ width: isFullWidth ? "100%" : "48%", marginBottom: "15px" }}>
      <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
        {field.label}
      </label>
      
      {field.type === "textarea" ? (
        <textarea
          name={field.name}
          value={value || ""}
          onChange={onChange}
          rows={3}
          placeholder={`Enter ${field.label.toLowerCase()}...`}
          style={{ 
            width: "100%", 
            padding: "8px", 
            border: error ? "1px solid #e74c3c" : "1px solid #ccc", 
            borderRadius: "6px", 
            boxSizing: "border-box" 
          }}
        />
      ) : (
        <input
          type={field.type}
          name={field.name}
          value={value || ""}
          onChange={onChange}
          placeholder={`Enter ${field.label.toLowerCase()}...`}
          style={{ 
            width: "100%", 
            padding: "8px", 
            border: error ? "1px solid #e74c3c" : "1px solid #ccc", 
            borderRadius: "6px", 
            boxSizing: "border-box" 
          }}
        />
      )}

      {error && (
        <div style={{ 
          color: "#e74c3c", 
          fontSize: "12px", 
          marginTop: "4px", 
          fontWeight: "500" 
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

// ─── INNER COMPONENT ────────────────────────────────────────────────────────
function AssociateSectionInner({ subSection, onChange, tableData, setTableData }) {
  const [mainMode, setMainMode] = useState("");
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});           
  const [selectedField, setSelectedField] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");     // ← NEW: File error state

  const selectedFieldLabel =
    subSection.fields.find((f) => f.name === selectedField)?.label || "";

  // Validation Function (మీ అసలు code)
  const validateField = (name, value) => {
    let error = "";

    if (name.toLowerCase().includes("name")) {
      const nameRegex = /^[A-Za-z\s]*$/;
      if (value && !nameRegex.test(value)) error = "Only alphabets and spaces allowed";
    }

    if (name.toLowerCase().includes("mobile")) {
      const mobileRegex = /^[0-9]*$/;
      if (value && !mobileRegex.test(value)) {
        error = "Mobile number must contain only numbers";
      } else if (value && value.length > 10) {
        error = "Mobile number must be maximum 10 digits";
      }
    }

    if (name.toLowerCase().includes("email")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) error = "Please enter a valid email address";
    }

    if (
      name.toLowerCase().includes("license") ||
      name.toLowerCase().includes("membership") ||
      name.toLowerCase().includes("reg") ||
      name.toLowerCase().includes("rera")
    ) {
      const alphaNumRegex = /^[A-Za-z0-9]*$/;
      if (value && !alphaNumRegex.test(value)) error = "Only letters and numbers allowed";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);

    setErrors((prev) => ({ ...prev, [name]: fieldError }));
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // notify parent
  const notifyParent = (rows) => {
    onChange({
      target: {
        name: `__associate_rows_${subSection.id}`,
        value: rows.length ? JSON.stringify(rows) : "",
      },
    });
  };

  // PDF Validation Function
  const isValidPDF = (file) => {
    if (!file) return false;
    return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  };

  // File Change Handler with Inline Error
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError("");   // Clear previous error

    if (selectedFile) {
      if (isValidPDF(selectedFile)) {
        setFile(selectedFile);
      } else {
        setFile(null);
        setFileError("This file should be in PDF format only");
        e.target.value = "";   // Clear input
      }
    }
  };

  const handleAdd = () => {
    let hasError = false;
    const newErrors = {};

    Object.keys(formValues).forEach((key) => {
      const error = validateField(key, formValues[key]);
      if (error) {
        newErrors[key] = error;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // File validation before adding
    if (file && !isValidPDF(file)) {
      setFileError("This file should be in PDF format only");
      return;
    }

    let newEntry = {};
    let hasValue = false;

    subSection.fields.forEach((field) => {
      if (formValues[field.name] && formValues[field.name].trim() !== "") {
        newEntry[field.name] = formValues[field.name];
        hasValue = true;
      }
    });

    if (mainMode === "old" && selectedField) {
      const oldKey = `old_${selectedField}`;
      if (formValues[oldKey]) {
        newEntry[oldKey] = formValues[oldKey];
        hasValue = true;
      }
      newEntry.__mode = "old";
      newEntry.__selField = selectedField;
    } else {
      newEntry.__mode = "new";
    }

    if (description && description.trim() !== "") {
      newEntry.description = description;
      hasValue = true;
    }

    if (file) {
      newEntry.fileName = file.name;
      newEntry.fileURL = URL.createObjectURL(file);
      hasValue = true;
    }

    if (!hasValue) {
      alert("Please enter at least one field");
      return;
    }

    const updated = [...tableData, newEntry];
    setTableData(updated);
    notifyParent(updated);

    // Reset form
    setFormValues({});
    setDescription("");
    setFile(null);
    setFileError("");
    setErrors({});
    setSelectedField("");
  };

  const handleDelete = (idx) => {
    const updated = tableData.filter((_, i) => i !== idx);
    setTableData(updated);
    notifyParent(updated);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* NEW / OLD RADIO */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "30px" }}>
        <label style={{ fontWeight: "600", cursor: "pointer" }}>
          <input type="radio" value="new" checked={mainMode === "new"} onChange={(e) => { setMainMode(e.target.value); setSelectedField(""); setFormValues({}); setDescription(""); setFile(null); setFileError(""); setErrors({}); }} style={{ marginRight: "6px" }} />
          New
        </label>
        <label style={{ fontWeight: "600", cursor: "pointer" }}>
          <input type="radio" value="old" checked={mainMode === "old"} onChange={(e) => { setMainMode(e.target.value); setSelectedField(""); setFormValues({}); setDescription(""); setFile(null); setFileError(""); setErrors({}); }} style={{ marginRight: "6px" }} />
          Existing
        </label>
      </div>

      {/* ── NEW MODE ── */}
      {mainMode === "new" && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
            {subSection.fields.map((field) => (
              <FormField key={field.name} field={field} value={formValues[field.name]} onChange={handleChange} error={errors[field.name]} />
            ))}
          </div>

          {/* Description + Upload */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "600" }}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "600" }}>Upload Document</label>
              <input 
                type="file" 
                onChange={handleFileChange} 
              />
              {file && <div style={{ fontSize: "12px", marginTop: "4px", color: "#1a7a3c" }}>📄 {file.name}</div>}
              
              {/* ← NEW: Red error message below file input */}
              {fileError && (
                <div style={{ 
                  color: "#e74c3c", 
                  fontSize: "12px", 
                  marginTop: "4px", 
                  fontWeight: "500" 
                }}>
                  {fileError}
                </div>
              )}
            </div>
          </div>

          <button onClick={handleAdd} style={{ padding: "8px 18px", background: "#1e4d8f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}>
            Add
          </button>
        </>
      )}

      {/* ── OLD MODE ── */}
      {mainMode === "old" && (
        <>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>Select Existing</label>
            <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)} style={{ width: "250px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginLeft: "12px" }}>
              <option value="">Select</option>
              {subSection.fields.map((field) => <option key={field.name} value={field.name}>{field.label}</option>)}
            </select>
          </div>

          {selectedField && (
            <>
              <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
                {/* Old & New value fields - unchanged */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "600" }}>EXISTING {selectedFieldLabel}</label>
                  <input type="text" name={`old_${selectedField}`} value={formValues[`old_${selectedField}`] || ""} onChange={handleChange} style={{ display: "block", padding: "8px", borderRadius: "6px", border: errors[`old_${selectedField}`] ? "1px solid #e74c3c" : "1px solid #ccc", width: "100%", marginTop: "4px" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "600" }}>NEW {selectedFieldLabel}</label>
                  <input type="text" name={selectedField} value={formValues[selectedField] || ""} onChange={handleChange} style={{ display: "block", padding: "8px", borderRadius: "6px", border: errors[selectedField] ? "1px solid #e74c3c" : "1px solid #ccc", width: "100%", marginTop: "4px" }} />
                </div>
              </div>

              {/* Description + Upload */}
              <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "600" }}>Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "600" }}>Upload Document</label>
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                  />
                  {file && <div style={{ fontSize: "12px", marginTop: "4px", color: "#1a7a3c" }}>📄 {file.name}</div>}
                  
                  {/* ← NEW: Red error message below file input */}
                  {fileError && (
                    <div style={{ 
                      color: "#e74c3c", 
                      fontSize: "12px", 
                      marginTop: "4px", 
                      fontWeight: "500" 
                    }}>
                      {fileError}
                    </div>
                  )}
                </div>
              </div>

              <button onClick={handleAdd} style={{ padding: "8px 18px", background: "#1e4d8f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}>
                Add
              </button>
            </>
          )}
        </>
      )}

      {/* TABLE - unchanged */}
      {tableData.length > 0 && (
        <table style={{ marginTop: "30px", width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#1e4d8f", color: "#fff" }}>
              {mainMode === "old" ? (
                <>
                  <th style={{ padding: "10px", border: "1px solid #ccc", textAlign: "left" }}>Field Changed</th>
                  <th style={{ padding: "10px", border: "1px solid #ccc", textAlign: "left" }}>Old Value</th>
                  <th style={{ padding: "10px", border: "1px solid #ccc", textAlign: "left" }}>New Value</th>
                  <th style={{ padding: "10px", border: "1px solid #ccc", textAlign: "left" }}>Description</th>
                  <th style={{ padding: "10px", border: "1px solid #ccc", textAlign: "left" }}>Document</th>
                  <th style={{ padding: "10px", border: "1px solid #ccc", width: "60px" }}>Action</th>
                </>
              ) : (
                <>
                  {subSection.fields.map((field) => (
                    <th key={field.name} style={{ padding: "10px", border: "1px solid #ccc", textAlign: "left" }}>{field.label}</th>
                  ))}
                  <th style={{ padding: "10px", border: "1px solid #ccc", textAlign: "left" }}>Description</th>
                  <th style={{ padding: "10px", border: "1px solid #ccc", textAlign: "left" }}>Document</th>
                  <th style={{ padding: "10px", border: "1px solid #ccc", width: "60px" }}>Action</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} style={{ background: index % 2 === 0 ? "#fff" : "#f8fafd" }}>
                {row.__mode === "old" ? (
                  <>
                    <td style={{ padding: "8px", border: "1px solid #ccc", fontWeight: "600", color: "#0f3460" }}>{subSection.fields.find(f => f.name === row.__selField)?.label || row.__selField}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc", color: "#6b7c93" }}>{row[`old_${row.__selField}`] || "-"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc", color: "#1a7a3c", fontWeight: "600" }}>{row[row.__selField] || "-"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{row.description || "-"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                      {row.fileURL ? <a href={row.fileURL} target="_blank" rel="noopener noreferrer" style={{ color: "#1e4d8f", fontWeight: "600" }}>{row.fileName}</a> : "-"}
                    </td>
                  </>
                ) : (
                  <>
                    {subSection.fields.map((field) => (
                      <td key={field.name} style={{ padding: "8px", border: "1px solid #ccc" }}>{row[field.name] || "-"}</td>
                    ))}
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{row.description || "-"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                      {row.fileURL ? <a href={row.fileURL} target="_blank" rel="noopener noreferrer" style={{ color: "#1e4d8f", fontWeight: "600" }}>{row.fileName}</a> : "-"}
                    </td>
                  </>
                )}
                <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "center" }}>
                  <button onClick={() => handleDelete(index)} style={{ background: "#c0200f", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" }}>✕</button>
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
export default function AssociateDetailsForm({
  subSectionId,
  onChange = () => {},
  tableStore = {},
  setTableStore = () => {},
}) {
  const subSection = ASSOCIATE_DETAILS_SUBSECTIONS.find((s) => s.id === subSectionId);
  if (!subSection) return null;

  const tableData = tableStore[subSectionId] || [];
  const setTableData = (rows) => setTableStore((prev) => ({ ...prev, [subSectionId]: rows }));

  return (
    <AssociateSectionInner
      subSection={subSection}
      onChange={onChange}
      tableData={tableData}
      setTableData={setTableData}
    />
  );
}