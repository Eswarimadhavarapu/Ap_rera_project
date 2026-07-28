import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGet, apiPost, BASE_URL } from "../../api/api.js";
import AgentWizard from "../../components/scrutiny/AgentWizard.jsx";
import ScrutinyLayout from "../../components/scrutiny/ScrutinyLayout.jsx";
import "../../styles/scrutiny/scrutiny_projectregistation_1.css";
import ScrutinyDocumentRemarkModal from "../../components/ScrutinyDocumentRemarkModal.jsx";
import { useAdmin } from "../../context/AdminContext.jsx";

const getFileUrl = (value) => {
  if (!value) return "";
  let parsed = value;
  try {
     parsed = JSON.parse(value);
  } catch(e) {}
  if (typeof parsed === "object" && parsed !== null) {
     const filePath = parsed.path || parsed.file;
     if (filePath) {
       const normalizedPath = filePath.replace(/\\/g, "/").replace(/^\/+/, "");
       if (!normalizedPath.startsWith("uploads/")) {
         return `${BASE_URL}/uploads/${normalizedPath}`;
       }
       return `${BASE_URL}/${normalizedPath}`;
     }
  }
  if (typeof parsed === "string") {
    if (parsed.startsWith("http")) return parsed;
    const normalizedPath = parsed.replace(/\\/g, "/").replace(/^\/+/, "");
    if (!normalizedPath.startsWith("uploads/")) {
      return `${BASE_URL}/uploads/${normalizedPath}`;
    }
    return `${BASE_URL}/${normalizedPath}`;
  }
  return "";
};

const getRemarkAuthority = (admin) => {
  const loginKey = `${String(admin?.department || "").toLowerCase()} ${String(admin?.role || "").toLowerCase()}`;

  if (loginKey.includes("assistant director") || loginKey.includes(" ad")) {
    return { verificationTeam: "ad", authorityLabel: "Assistant Director" };
  }
  if (loginKey.includes("deputy director") || loginKey.includes(" dd")) {
    return { verificationTeam: "dd", authorityLabel: "Deputy Director" };
  }
  if (loginKey.includes("planning")) return { verificationTeam: "planning", authorityLabel: "Planning Team" };
  if (loginKey.includes("legal")) return { verificationTeam: "legal", authorityLabel: "Legal Team" };
  if (loginKey.includes("audit")) return { verificationTeam: "audit", authorityLabel: "Audit Team" };
  if (loginKey.includes("engineer")) return { verificationTeam: "engineer", authorityLabel: "Scrutiny Engineer" };
  if (loginKey.includes("verification")) return { verificationTeam: "verification", authorityLabel: "Verification Team" };
  if (loginKey.includes("director") || loginKey.includes("directory")) return { verificationTeam: "directory", authorityLabel: "Director" };
  if (loginKey.includes("chairman")) return { verificationTeam: "chairman", authorityLabel: "Chairman" };

  return { verificationTeam: "verification", authorityLabel: admin?.department || "Verification Team" };
};
const normalizeLockDepartment = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return "";
  if (normalized.includes("assistant director") || normalized === "ad") return "ad";
  if (normalized.includes("deputy director") || normalized === "dd") return "dd";
  if (normalized.includes("director") || normalized.includes("directory")) return "director";
  if (normalized.includes("chairman")) return "chairman";
  if (normalized.includes("verification")) return "verification";
  if (normalized.includes("planning")) return "planning";
  if (normalized.includes("legal")) return "legal";
  if (normalized.includes("audit")) return "audit";
  if (normalized.includes("engineer")) return "engineer";
  return normalized;
};
function DocumentCell({ path, title, openModal, label = "View Document" }) {
  const href = getFileUrl(path);

  if (!href) {
    return <span className="spr-display-field">N/A</span>;
  }

  return (
    <button type="button" className="spr-file-link" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={() => openModal(href, title)}>
      {label}
    </button>
  );
}

export default function AgentScrutinyRegistration_2() {
  const navigate = useNavigate();
  const { admin } = useAdmin();
  const location = useLocation();

  const applicationNumber = location.state?.applicationNumber || sessionStorage.getItem("agentApplicationNumber") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadShortfall, setUploadShortfall] = useState("");
  const [uploadRemarks, setUploadRemarks] = useState("");
  const [submittingRemarks, setSubmittingRemarks] = useState(false);
  const [uploadDraftRemark, setUploadDraftRemark] = useState(null);
  const [uploadSavedRemarks, setUploadSavedRemarks] = useState([]);
  const [finalSubmitted, setFinalSubmitted] = useState(false);

  const openModal = (url, title) => {
    if (!url) return;
    setSelectedDoc({ url, title });
    setModalOpen(true);
  };

  const handleAddUploadRemark = () => {
    const trimmedRemarks = uploadRemarks.trim();
    if (finalSubmitted) {
      alert("Final submit is already completed. Remarks are locked.");
      return;
    }

    if (uploadDraftRemark) return;

    if (!uploadShortfall || !trimmedRemarks) {
      alert("Please select shortfall and enter remarks");
      return;
    }

    const authority = getRemarkAuthority(admin);
    setUploadDraftRemark({
      document_name: "Upload Documents",
      verification_team: authority.verificationTeam,
      is_shortfall: uploadShortfall === "yes",
      remarks: trimmedRemarks,
      verified_by: authority.authorityLabel,
      verified_at: new Date().toISOString(),
    });
  };

  const handleRemoveUploadRemark = () => {
    setUploadDraftRemark(null);
  };

  const saveUploadDraftRemark = async () => {
    if (finalSubmitted || !uploadDraftRemark) return true;

    try {
      setSubmittingRemarks(true);
      await apiPost("/api/agent-scrutiny/verification-remarks", {
        application_no: applicationNumber,
        document_name: uploadDraftRemark.document_name,
        verification_team: uploadDraftRemark.verification_team,
        is_shortfall: uploadDraftRemark.is_shortfall,
        status: "pending",
        remarks: uploadDraftRemark.remarks,
        verified_by: uploadDraftRemark.verified_by,
      });
      setUploadDraftRemark(null);
      setUploadShortfall("");
      setUploadRemarks("");
      return true;
    } catch (err) {
      console.error(err);
      alert("Error submitting remarks");
      return false;
    } finally {
      setSubmittingRemarks(false);
    }
  };

  const handleSaveAndContinue = async () => {
    const saved = await saveUploadDraftRemark();
    if (!saved) return;

    navigate("/agent-scrutiny/registration_action", {
      state: { applicationNumber, agentType: location.state?.agentType }
    });
  };

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


  useEffect(() => {
    const loadRemarkState = async () => {
      if (!applicationNumber) return;

      try {
        const encodedApplicationNo = encodeURIComponent(applicationNumber);
        const [finalResponse, uploadResponse] = await Promise.all([
          apiGet(`/api/agent-scrutiny/final-status?application_no=${encodedApplicationNo}`),
          apiGet(`/api/agent-scrutiny/verification-remarks?application_no=${encodedApplicationNo}&document_name=${encodeURIComponent("Upload Documents")}`),
        ]);

        const currentDept = normalizeLockDepartment(admin?.department);
        setFinalSubmitted(
          (finalResponse?.rows || []).some(
            (row) => normalizeLockDepartment(row.verified_by) === currentDept
          )
        );
        setUploadSavedRemarks(uploadResponse?.rows || []);
      } catch (err) {
        console.error("Error loading upload remarks:", err);
      }
    };

    loadRemarkState();
  }, [applicationNumber, admin?.department]);
  const uploadDisplayedRemarks = uploadDraftRemark
    ? [uploadDraftRemark, ...uploadSavedRemarks]
    : uploadSavedRemarks;
  const uploadLocked = finalSubmitted || Boolean(uploadDraftRemark);
  const fullData = summary?.full_data || {};
  const agentDetails = fullData.agent_details || {};

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
              <span>Upload Documents</span>
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
                <h1 className="spr-title">Upload Documents</h1>
                <p className="spr-subtitle">Read-only view for application {applicationNumber || "N/A"}.</p>
              </div>
              <button type="button" className="spr-secondary-btn" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>

            <AgentWizard currentStep={2} />

            {loading ? (
              <div className="spr-state-card">Loading documents...</div>
            ) : error ? (
              <div className="spr-state-card spr-error">{error}</div>
            ) : (
              <div className="spr-card">
                <div className="spr-table-wrap">
                  <table className="spr-table">
                    <thead>
                      <tr>
                        <th>Document Name</th>
                        <th>Uploaded Document</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Income Tax Return - Year 1</td>
                        <td><DocumentCell path={agentDetails.itr_year1} title="Income Tax Return - Year 1" openModal={openModal} /></td>
                      </tr>
                      <tr>
                        <td>Income Tax Return - Year 2</td>
                        <td><DocumentCell path={agentDetails.itr_year2} title="Income Tax Return - Year 2" openModal={openModal} /></td>
                      </tr>
                      <tr>
                        <td>Income Tax Return - Year 3</td>
                        <td><DocumentCell path={agentDetails.itr_year3} title="Income Tax Return - Year 3" openModal={openModal} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <input type="checkbox" checked readOnly style={{ cursor: "default" }} />
                  <span>I / We solemnly affirm that the above information is correct</span>
                </div>

                <section className="spr-panel" style={{ marginTop: "20px" }}>
                  <div className="spr-panel-head">
                    <h2>ACTION TO BE TAKEN</h2>
                  </div>

                  <div className="spr-shortfall-row" style={{ display: "flex", gap: "20px", margin: "20px 0" }}>
                    <label className="spr-label" style={{ fontWeight: "bold" }}>
                      Is there any shortfall in uploaded documents
                    </label>

                    <label className="spr-radio">
                      <input
                        type="radio"
                        name="uploadShortfall"
                        value="yes"
                        checked={uploadShortfall === "yes"}
                        disabled={uploadLocked}
                        onChange={(e) => setUploadShortfall(e.target.value)}
                      />
                      <span style={{ marginLeft: "5px" }}>Yes</span>
                    </label>

                    <label className="spr-radio">
                      <input
                        type="radio"
                        name="uploadShortfall"
                        value="no"
                        checked={uploadShortfall === "no"}
                        disabled={uploadLocked}
                        onChange={(e) => setUploadShortfall(e.target.value)}
                      />
                      <span style={{ marginLeft: "5px" }}>No</span>
                    </label>
                  </div>

                  <textarea
                    className="spr-textarea"
                    placeholder="Enter upload document remarks..."
                    rows={4}
                    value={uploadRemarks}
                    disabled={uploadLocked}
                    onChange={(e) => setUploadRemarks(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                  />

                  <div className="spr-submit-row" style={{ marginTop: "15px", textAlign: "right" }}>
                    <button
                      type="button"
                      className="spr-btn spr-btn-primary"
                      onClick={handleAddUploadRemark}
                      disabled={submittingRemarks || uploadLocked}
                    >
                      {uploadDraftRemark ? "Remark Added" : "Add Remark"}
                    </button>
                  </div>

                  {uploadDisplayedRemarks.length > 0 && (
                    <div className="spr-table-wrap" style={{ marginTop: "15px" }}>
                      <table className="spr-table">
                        <thead>
                          <tr>
                            <th>SNo</th>
                            <th>Description</th>
                            <th>Is Shortfall</th>
                            <th>Remarks</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadDisplayedRemarks.map((item, index) => (
                            <tr key={item.id || item.verified_at || index}>
                              <td>{index + 1}</td>
                              <td>{item.document_name} - {item.verified_by}</td>
                              <td>{item.is_shortfall ? "Yes" : "No"}</td>
                              <td>{item.remarks}</td>
                              <td>{new Date(item.verified_at || item.created_at || item.updated_at).toLocaleString()}</td>
                              <td>
                                {item === uploadDraftRemark && !finalSubmitted ? (
                                  <button type="button" className="spr-secondary-btn" onClick={handleRemoveUploadRemark}>
                                    Remove
                                  </button>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <div style={{ marginTop: "30px", textAlign: "right" }}>
                  <button className="spr-btn" onClick={handleSaveAndContinue} disabled={submittingRemarks}>
                    {submittingRemarks ? "Saving..." : "Save And Continue"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ScrutinyDocumentRemarkModal
        isOpen={modalOpen}
        documentItem={selectedDoc}
        onClose={() => setModalOpen(false)}
        applicationNo={applicationNumber}
        apiPrefix="/api/agent-scrutiny"
        readOnly={finalSubmitted}
      />
    </ScrutinyLayout>
  );
}