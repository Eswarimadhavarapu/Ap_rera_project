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

const normalizeDepartmentValue = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return "";
  if (normalized.includes("assistant director") || normalized === "ad") return "ad";
  if (normalized.includes("deputy director") || normalized === "dd") return "dd";
  if (normalized.includes("chairman")) return "chairman";
  if (normalized.includes("director") || normalized.includes("directory")) return "director";
  if (normalized.includes("verification")) return "verification";
  if (normalized.includes("planning")) return "planning";
  if (normalized.includes("legal")) return "legal";
  if (normalized.includes("audit")) return "audit";
  if (normalized.includes("engineer")) return "engineer";
  return normalized;
};

const departmentLabelMap = {
  verification: "Verification Team",
  planning: "Planning Team",
  legal: "Legal Team",
  audit: "Audit Team",
  engineer: "Scrutiny Engineer",
  ad: "Assistant Director",
  dd: "Deputy Director",
  director: "Director",
  chairman: "Chairman",
};

const getDepartmentLabel = (value) => {
  const key = normalizeDepartmentValue(value);
  return departmentLabelMap[key] || displayText(value, "Department");
};

const formatShortfall = (value) =>
  value === true || String(value || "").toLowerCase() === "yes" ? "Yes" : "No";

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
  const deptName = String(admin?.department || "").toLowerCase();
  const dept = deptName.includes("assistant director")
    ? "ad"
    : deptName.includes("deputy director")
      ? "dd"
      : deptName.includes("director") || deptName.includes("directory")
        ? "director"
        : deptName.includes("chairman")
          ? "chairman"
          : deptName;
  const isChairman = dept === "chairman";

  const location = useLocation();
  const applicationNumber = location.state?.applicationNumber || sessionStorage.getItem("agentApplicationNumber") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [remarksList, setRemarksList] = useState([]);
  const [draftRemark, setDraftRemark] = useState(null);
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const [shortfall, setShortfall] = useState("");
  const [finalRemarks, setFinalRemarks] = useState("");

  const loadRemarks = async () => {
    try {
      const encodedApplicationNo = encodeURIComponent(applicationNumber);
      const [finalResponse, documentResponse] = await Promise.all([
        apiGet(`/api/agent-scrutiny/final-status?application_no=${encodedApplicationNo}`),
        apiGet(`/api/agent-scrutiny/verification-remarks?application_no=${encodedApplicationNo}`),
      ]);

      const finalStatusRows = finalResponse?.rows || [];
      setFinalSubmitted(
        finalStatusRows.some((item) => normalizeDepartmentValue(item.verified_by) === dept)
      );

      const finalRows = finalStatusRows.map((item) => ({
        ...item,
        source: "final",
        description: getDepartmentLabel(item.verified_by),
        sortDate: item.verified_at,
      }));

      const documentRows = (documentResponse?.rows || []).map((item) => ({
        ...item,
        source: "document",
        description: `${displayText(item.document_name, "Document")} - ${getDepartmentLabel(
          item.verified_by || item.verification_team
        )}`,
        verified_at: item.created_at || item.updated_at,
        sortDate: item.created_at || item.updated_at,
      }));

      const combinedRows = [...finalRows, ...documentRows]
        .sort(
          (a, b) =>
            new Date(b.sortDate || b.verified_at || 0).getTime() -
            new Date(a.sortDate || a.verified_at || 0).getTime()
        );

      setRemarksList(combinedRows);
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

  const actionLocked = finalSubmitted;
  const draftLocked = actionLocked || Boolean(draftRemark);

  const displayedRemarksList = useMemo(
    () => (draftRemark ? [draftRemark, ...remarksList] : remarksList),
    [draftRemark, remarksList]
  );

  const handleAddRemark = () => {
    if (actionLocked) {
      alert("Final submit is already completed. Remarks are locked.");
      return;
    }

    if (draftRemark) return;

    if (!finalRemarks.trim() || shortfall === "") {
      alert("Please select shortfall and enter remarks");
      return;
    }

    const newRemark = {
      id: "draft-action-remark",
      source: "actionDraft",
      verified_by: admin?.department || dept || "Verification",
      description: getDepartmentLabel(admin?.department || dept || "Verification"),
      is_shortfall: shortfall,
      remarks: finalRemarks.trim(),
      verified_at: new Date().toISOString(),
    };

    setDraftRemark(newRemark);
  };

  const handleRemoveDraftRemark = () => {
    setDraftRemark(null);
  };

  const handleFinalSubmit = async () => {
    if (actionLocked) {
      alert("Final submit is already completed.");
      return;
    }

    if (!draftRemark) {
      alert("Please add remarks before final submit");
      return;
    }

    try {
      const submitResult = await apiPost("/api/agent-scrutiny/final-submit", {
        application_no: applicationNumber,
        department: dept,
        is_shortfall: draftRemark.is_shortfall,
        remarks: draftRemark.remarks
      });

      await loadRemarks();

      setDraftRemark(null);
      setFinalRemarks("");
      setShortfall("");

      alert(submitResult?.message || "Final Verification Completed");
      // navigate("/agent-scrutiny/registrations"); // Optional redirection
    } catch (err) {
      console.error(err);
      alert("Error submitting remarks");
    }
  };

  const handleChairmanDecision = async (decision) => {
    if (!finalRemarks.trim()) {
      alert("Please enter chairman remarks");
      return;
    }

    try {
      const result = await apiPost("/api/agent-scrutiny/chairman-decision", {
        application_no: applicationNumber,
        decision,
        remarks: finalRemarks.trim(),
      });

      await loadRemarks();
      setFinalRemarks("");
      alert(result?.message || `Application ${decision}`);
      navigate("/scrutiny/agent-scrutiny/registrations");
    } catch (err) {
      console.error(err);
      alert("Error submitting chairman decision");
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

                {!isChairman && (
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
                        disabled={draftLocked}
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
                        disabled={draftLocked}
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
                      disabled={draftLocked}
                      onChange={(e) => setFinalRemarks(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                  </div>

                  <div className="spr-submit-row" style={{ marginTop: "15px", textAlign: "right" }}>
                    <button
                      type="button"
                      className="spr-btn spr-btn-primary"
                      onClick={handleAddRemark}
                      disabled={draftLocked}
                    >
                      {draftRemark ? "Remark Added" : "Add Remark"}
                    </button>
                  </div>
                </section>
                )}

                {isChairman && (
                  <section className="spr-panel" style={{ marginTop: "20px" }}>
                    <div className="spr-panel-head">
                      <h2>CHAIRMAN DECISION</h2>
                    </div>

                    <div className="spr-remarks-box">
                      <textarea
                        className="spr-textarea"
                        placeholder="Enter chairman remarks..."
                        rows={4}
                        value={finalRemarks}
                        disabled={actionLocked}
                        onChange={(e) => setFinalRemarks(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                      />
                    </div>

                    <div className="spr-submit-row" style={{ marginTop: "15px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      <button
                        type="button"
                        className="spr-btn spr-btn-primary"
                        disabled={actionLocked}
                        onClick={() => handleChairmanDecision("approved")}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="spr-btn spr-btn-secondary"
                        disabled={actionLocked}
                        onClick={() => handleChairmanDecision("rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </section>
                )}

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

                          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Date</th>
                          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {displayedRemarksList && displayedRemarksList.length > 0 ? (
                          displayedRemarksList.map((item, index) => (
                            <tr key={index}>
                              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
                              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.description || getDepartmentLabel(item.verified_by || item.verification_team)}</td>
                              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {formatShortfall(item.is_shortfall)}
                              </td>
                              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.remarks}</td>

                              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {item.verified_at
                                  ? new Date(item.verified_at).toLocaleString()
                                  : "N/A"}
                              </td>
                              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {item.source === "actionDraft" && !actionLocked ? (
                                  <button
                                    type="button"
                                    className="spr-secondary-btn"
                                    onClick={handleRemoveDraftRemark}
                                  >
                                    Remove
                                  </button>
                                ) : (
                                  "-"
                                )}
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

                {!isChairman && (
                <div className="spr-footer" style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    className="spr-btn spr-btn-primary"
                    onClick={handleFinalSubmit}
                    disabled={actionLocked}
                  >
                    Final Submit
                  </button>
                </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ScrutinyLayout>
  );
}