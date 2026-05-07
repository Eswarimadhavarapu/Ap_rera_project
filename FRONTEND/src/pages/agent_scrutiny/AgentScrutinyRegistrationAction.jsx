import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../api/api.js";
import AgentWizard from "../../components/scrutiny/AgentWizard.jsx";
import ScrutinyLayout from "../../components/scrutiny/ScrutinyLayout.jsx";
import "../../styles/scrutiny/scrutiny_projectregistation_1.css";
import { useAdmin } from "../../context/AdminContext.jsx";

const displayText = (value, fallback = "N/A") => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return String(value);
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? displayText(value)
    : date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
};

const getDaysFromDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
};

function DataTable({ className = "", columns, rows, emptyText = "No data available." }) {
  return (
    <div className="spr-table-wrap">
      <table className={`spr-table ${className}`.trim()}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(row, rowIndex) : displayText(row[column.key])}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="spr-empty-cell">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function AgentScrutinyRegistration_Action() {
  const navigate = useNavigate();
  const { admin } = useAdmin();
  const dept = admin?.department?.toLowerCase();

  const location = useLocation();
  const applicationNumber = location.state?.applicationNumber || sessionStorage.getItem("agentApplicationNumber") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [remarks, setRemarks] = useState("");
  
  const [remarksList, setRemarksList] = useState([]);
  const [shortfall, setShortfall] = useState("");
  const [finalRemarks, setFinalRemarks] = useState("");

  const loadRemarks = async () => {
    try {
      const response = await apiGet(
        `/api/agent-scrutiny/final-status?application_no=${applicationNumber}`
      );

      const rows = response?.rows || [];

      // 👇 current user department
      const currentDept = (admin?.department || "").toLowerCase();

      const filtered = rows.filter((item) => {
        const rowDept = (item.verified_by || "").toLowerCase();

        // ✅ Verification → ONLY own
        if (currentDept.includes("verification")) {
          return rowDept === "verification";
        }

        // ✅ Audit → verification + own
        if (currentDept === "audit") {
          return rowDept === "verification" || rowDept === "audit";
        }

        // ✅ Directory → verification + audit + own
        if (currentDept === "directory" || currentDept === "director") {
          return rowDept === "verification" || rowDept === "audit" || rowDept === "directory";
        }

        // ✅ Other departments → verification + own
        return (
          rowDept === "verification" ||
          rowDept.includes(currentDept)
        );
      });

      setRemarksList(filtered);
    } catch (error) {
      console.error("Error loading remarks:", error);
    }
  };

  useEffect(() => {
    if (applicationNumber) {
      loadRemarks();
    }
  }, [applicationNumber]);

  useEffect(() => {
    if (!applicationNumber) {
      setError("Application number is missing.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const resp = await apiGet(`/api/agent-scrutiny/registrations/details?application_no=${applicationNumber}`);
        if (resp && !resp.error) {
          setSummary(resp);
        } else {
          setError(resp?.error || "Agent not found");
        }
      } catch (loadError) {
        console.error(loadError);
        setError(loadError.message || "Unable to load agent details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [applicationNumber]);

  const summaryData = useMemo(() => {
    if (!summary) return {};

    return {
      agentName: displayText(summary.applicant_name),
      agentType: displayText(summary.promoter_display),
      district: displayText(summary.district),
      mobile: displayText(summary.mobile),
      email: displayText(summary.email),
      firstTransactionDate: formatDateTime(summary.created_at),
      noOfDays: displayText(getDaysFromDate(summary.created_at)),
      scrutinyCount: displayText(summary.scrutiny_label),
    };
  }, [summary]);

  const handleAddRemark = () => {
    if (!finalRemarks || shortfall === "") {
      alert("Please select shortfall and enter remarks");
      return;
    }

    const newRemark = {
      verified_by: admin?.department || "Verification",
      is_shortfall: shortfall,
      remarks: finalRemarks,
      verified_at: new Date().toISOString()
    };

    setRemarksList((prev) => [newRemark, ...prev]);
  };

  const handleFinalSubmit = async () => {
    if (!finalRemarks || shortfall === "") {
      alert("Please fill shortfall and remarks");
      return;
    }

    try {
      await apiPost("/api/agent-scrutiny/final-submit", {
        application_no: applicationNumber,
        department: dept,
        is_shortfall: shortfall,
        remarks: finalRemarks
      });

      await loadRemarks();

      setFinalRemarks("");
      setShortfall("");

      alert("Final Verification Completed");
      // navigate("/agent-scrutiny/registrations"); // Optional redirection
    } catch (err) {
      console.error(err);
      alert("Error submitting remarks");
    }
  };

  return (
    <ScrutinyLayout>
      <div className="spr-page">
        <div className="spr-shell">
          <div className="spr-topbar">
            <div className="spr-breadcrumb">
              <span>You are here :</span>
              <span>DashBoard</span>
              <span>/</span>
              <span>Agent Registration</span>
              <span>/</span>
              <span>Scrutiny Engineer Requests</span>
              <span>/</span>
              <span>Action</span>
            </div>
            <div className="spr-brand">
              <span>RERA-SE</span>
              <button type="button" className="spr-icon-btn" onClick={() => window.print()} title="Print">
                <i className="fa-solid fa-print" />
              </button>
            </div>
          </div>

          <div className="spr-body">
            <div className="spr-header-row">
              <div>
                <h1 className="spr-title">Action</h1>
                <p className="spr-subtitle">Submit scrutiny review for application {displayText(applicationNumber)}.</p>
              </div>
              <button type="button" className="spr-secondary-btn" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>

            <AgentWizard currentStep={3} />

            {loading ? (
              <div className="spr-state-card">Loading agent details...</div>
            ) : error ? (
              <div className="spr-state-card spr-error">{error}</div>
            ) : (
              <>
                <div className="spr-card">
                  <DataTable
                    columns={[
                      { key: "agentName", label: "Agent Name" },
                      { key: "agentType", label: "Agent Type" },
                      { key: "district", label: "District" },
                      { key: "firstTransactionDate", label: "Registration Date" },
                      { key: "noOfDays", label: "No.of Days" },
                      { key: "scrutinyCount", label: "Scrutiny Count" },
                    ]}
                    rows={[summaryData]}
                  />
                </div>

                <section className="spr-panel" style={{ marginTop: "20px" }}>
                  <div className="spr-panel-head">
                    <h2>ACTION TO BE TAKEN</h2>
                  </div>

                  <div className="spr-shortfall-row" style={{ display: "flex", gap: "20px", margin: "20px 0" }}>
                    <label className="spr-label" style={{ fontWeight: "bold" }}>
                      Is there any shortfall in data/payment
                    </label>

                    <label className="spr-radio">
                      <input
                        type="radio"
                        name="shortfall"
                        value="yes"
                        checked={shortfall === "yes"}
                        onChange={(e) => setShortfall(e.target.value)}
                      />
                      <span style={{ marginLeft: "5px" }}>Yes</span>
                    </label>

                    <label className="spr-radio">
                      <input
                        type="radio"
                        name="shortfall"
                        value="no"
                        checked={shortfall === "no"}
                        onChange={(e) => setShortfall(e.target.value)}
                      />
                      <span style={{ marginLeft: "5px" }}>No</span>
                    </label>
                  </div>

                  <div className="spr-remarks-box">
                    <textarea
                      className="spr-textarea"
                      placeholder="Enter remarks..."
                      rows={4}
                      value={finalRemarks}
                      onChange={(e) => setFinalRemarks(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                  </div>

                  <div className="spr-submit-row" style={{ marginTop: "15px", textAlign: "right" }}>
                    <button
                      type="button"
                      className="spr-btn spr-btn-primary"
                      onClick={handleAddRemark}
                    >
                      Add Remark
                    </button>
                  </div>
                </section>

                <section className="spr-panel" style={{ marginTop: "30px" }}>
                  <div className="spr-panel-head">
                    <h2>UPDATED REMARKS</h2>
                  </div>

                  <div className="spr-table-wrapper" style={{ marginTop: "15px" }}>
                    <table className="spr-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                          <th style={{ padding: "10px", border: "1px solid #ddd" }}>SNo</th>
                          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Description</th>
                          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Is there any Shortfall in data/Payment</th>
                          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Remarks</th>
                          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Upload Observations Document</th>
                          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {remarksList && remarksList.length > 0 ? (
                          remarksList.map((item, index) => (
                            <tr key={index}>
                              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
                              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.verified_by}</td>
                              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {item.is_shortfall === true || item.is_shortfall === "yes" ? "Yes" : "No"}
                              </td>
                              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.remarks}</td>
                              <td style={{ padding: "10px", border: "1px solid #ddd" }}>NA</td>
                              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {item.verified_at
                                  ? new Date(item.verified_at).toLocaleString()
                                  : "N/A"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" style={{ padding: "20px", textAlign: "center", border: "1px solid #ddd" }}>
                              No remarks available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                <div className="spr-footer" style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    className="spr-btn spr-btn-primary"
                    onClick={handleFinalSubmit}
                  >
                    Final Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ScrutinyLayout>
  );
}