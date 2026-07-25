import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGet, apiPost, BASE_URL } from "../../api/api.js";
import AgentWizard from "../../components/scrutiny/AgentWizard.jsx";
import ScrutinyLayout from "../../components/scrutiny/ScrutinyLayout.jsx";
import "../../styles/scrutiny/scrutiny_projectregistation_1.css";
import { useAdmin } from "../../context/AdminContext.jsx";
import ScrutinyDocumentRemarkModal from "../../components/ScrutinyDocumentRemarkModal.jsx";

const displayText = (value, fallback = "N/A") => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return String(value);
};

const firstFilled = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    return value;
  }
  return "";
};

const parseMaybeJson = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (_) {
    return value;
  }
};

const normalizeRows = (value) => {
  const parsed = parseMaybeJson(value);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed.projects)) return parsed.projects;
    if (Array.isArray(parsed.project_details)) return parsed.project_details;
    if (Array.isArray(parsed.last_five_years_projects_details)) {
      return parsed.last_five_years_projects_details;
    }
  }
  return [];
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

function DisplayItem({ label, value, fullWidth = false }) {
  return (
    <div className={`display-group ${fullWidth ? "spr-full-width" : ""}`}>
      <span className="display-label">{label}</span>
      <span className="spr-display-field">
        {React.isValidElement(value) ? value : displayText(value)}
      </span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="spr-section">
      <h2 className="spr-section-title">{title}</h2>
      {children}
    </section>
  );
}

const formatBoolean = (value) => {
  const parsed = parseMaybeJson(value);

  if (Array.isArray(parsed)) return parsed.length ? "Yes" : "No";
  if (parsed && typeof parsed === "object") {
    if (Object.prototype.hasOwnProperty.call(parsed, "value")) {
      return formatBoolean(parsed.value);
    }
    if (Object.prototype.hasOwnProperty.call(parsed, "has_projects")) {
      return formatBoolean(parsed.has_projects);
    }
    return Object.keys(parsed).length ? "Yes" : "No";
  }

  const normalized = String(parsed || "").trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(normalized)) return "Yes";
  if (["no", "n", "false", "0"].includes(normalized)) return "No";
  return displayText(parsed);
};

const getFileUrl = (value) => {
  if (!value) return "";
  let parsed = value;
  try {
    parsed = JSON.parse(value);
  } catch (e) { }
  if (typeof parsed === "object" && parsed !== null) {
    // Individual agents use 'path', Other Than Individual use 'file'
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
    // If path doesn't already include 'uploads/', prefix with it
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

export default function AgentScrutinyRegistrationDetail() {
  const navigate = useNavigate();
  const { admin } = useAdmin();

  const location = useLocation();

  const applicationNumber = location.state?.applicationNumber || sessionStorage.getItem("agentApplicationNumber") || "";
  const agentTypeFromState = location.state?.agentType || sessionStorage.getItem("agentType") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [profileShortfall, setProfileShortfall] = useState("");
  const [profileRemarks, setProfileRemarks] = useState("");
  const [profileDraftRemark, setProfileDraftRemark] = useState(null);
  const [profileSavedRemarks, setProfileSavedRemarks] = useState([]);
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const [savingProfileRemark, setSavingProfileRemark] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const openModal = (url, title) => {
    if (!url) return;
    setSelectedDoc({ url, title });
    setModalOpen(true);
  };

  useEffect(() => {
    if (applicationNumber) {
      sessionStorage.setItem("agentApplicationNumber", applicationNumber);
    }
    if (agentTypeFromState) {
      sessionStorage.setItem("agentType", agentTypeFromState);
    }
  }, [applicationNumber, agentTypeFromState]);

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
        const [finalResponse, profileResponse] = await Promise.all([
          apiGet(`/api/agent-scrutiny/final-status?application_no=${encodedApplicationNo}`),
          apiGet(`/api/agent-scrutiny/verification-remarks?application_no=${encodedApplicationNo}&document_name=${encodeURIComponent("Agent Profile")}`),
        ]);

        const currentDept = normalizeLockDepartment(admin?.department);
        setFinalSubmitted(
          (finalResponse?.rows || []).some(
            (row) => normalizeLockDepartment(row.verified_by) === currentDept
          )
        );
        setProfileSavedRemarks(profileResponse?.rows || []);
      } catch (err) {
        console.error("Error loading profile remarks:", err);
      }
    };

    loadRemarkState();
  }, [applicationNumber, admin?.department]);
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

  const handleAddProfileRemark = () => {
    const trimmedRemarks = profileRemarks.trim();
    if (finalSubmitted) {
      alert("Final submit is already completed. Remarks are locked.");
      return;
    }

    if (profileDraftRemark) return;

    if (!profileShortfall || !trimmedRemarks) {
      alert("Please select shortfall and enter remarks");
      return;
    }

    const authority = getRemarkAuthority(admin);
    setProfileDraftRemark({
      document_name: "Agent Profile",
      verification_team: authority.verificationTeam,
      is_shortfall: profileShortfall === "yes",
      remarks: trimmedRemarks,
      verified_by: authority.authorityLabel,
      verified_at: new Date().toISOString(),
    });
  };

  const handleRemoveProfileRemark = () => {
    setProfileDraftRemark(null);
  };

  const saveProfileDraftRemark = async () => {
    if (finalSubmitted || !profileDraftRemark) return true;

    try {
      setSavingProfileRemark(true);
      await apiPost("/api/agent-scrutiny/verification-remarks", {
        application_no: applicationNumber,
        document_name: profileDraftRemark.document_name,
        verification_team: profileDraftRemark.verification_team,
        is_shortfall: profileDraftRemark.is_shortfall,
        status: "pending",
        remarks: profileDraftRemark.remarks,
        verified_by: profileDraftRemark.verified_by,
      });
      setProfileDraftRemark(null);
      setProfileShortfall("");
      setProfileRemarks("");
      return true;
    } catch (err) {
      console.error(err);
      alert("Error submitting remarks");
      return false;
    } finally {
      setSavingProfileRemark(false);
    }
  };

  const handleProfileSaveAndContinue = async () => {
    const saved = await saveProfileDraftRemark();
    if (!saved) return;

    navigate("/agent-scrutiny/registration_2", {
      state: { applicationNumber, agentType: location.state?.agentType }
    });
  };

  const profileDisplayedRemarks = profileDraftRemark
    ? [profileDraftRemark, ...profileSavedRemarks]
    : profileSavedRemarks;
  const profileLocked = finalSubmitted || Boolean(profileDraftRemark);
  const fullData = summary?.full_data || {};
  const agentDetails = fullData.agent_details || {};
  const projects = fullData.projects || [];
  const litigations = fullData.litigations || [];
  const otherStateRera = fullData.other_state_rera || [];
  const entities = fullData.entities || [];
  const authorizedPersons = fullData.authorized_persons || [];
  const agentProjectRows = normalizeRows(agentDetails.last_five_years_projects_details);

  // Detect agent type
  const isOtherThanIndividual = (summary?.promoter_type || "").toLowerCase().includes("other") ||
    (agentDetails.agent_type || "").toLowerCase().includes("other");
  const individualHasProjectDetails = formatBoolean(agentDetails.last_five_years_project_details) === "Yes" || projects.length > 0;

  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? displayText(value) : date.toLocaleDateString("en-GB");
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
              <span>Agent Registration Form</span>
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
                <h1 className="spr-title">Agent Registration Form</h1>
                <p className="spr-subtitle">Read-only scrutiny view for application {displayText(applicationNumber)}.</p>
              </div>
              <button type="button" className="spr-secondary-btn" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>

            <AgentWizard currentStep={1} />

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

                  <Section title="Agent Basic Details">
                    <div className="spr-grid">
                      <DisplayItem label="Application Number" value={summary?.application_no} />
                      <DisplayItem label="Agent Type" value={summary?.promoter_display} />
                      <DisplayItem label="Name" value={summary?.applicant_name} />
                      <DisplayItem label="Mobile Number" value={summary?.mobile} />
                      <DisplayItem label="Email" value={summary?.email} />
                      <DisplayItem label="District" value={summary?.district} />
                    </div>
                  </Section>

                  {isOtherThanIndividual ? (
                    <>
                      {/* ===== OTHER THAN INDIVIDUAL SECTIONS ===== */}
                      <Section title="Organisation Details">
                        <div className="spr-grid">
                          <DisplayItem label="Organisation Type" value={agentDetails.organisation_type} />
                          <DisplayItem label="Organisation Name" value={agentDetails.agent_name} />
                          <DisplayItem label="Registration / CIN Number" value={agentDetails.registration_identifier} />
                          <DisplayItem label="Registration Date" value={formatDate(agentDetails.registration_date)} />
                          <DisplayItem label="GST Number" value={agentDetails.gst_number} />
                          <DisplayItem label="PAN Card Number" value={agentDetails.pan} />
                          <DisplayItem label="Email" value={agentDetails.email} />
                          <DisplayItem label="Mobile Number" value={agentDetails.mobile} />
                          <DisplayItem label="Land Line Number" value={agentDetails.landline} />
                        </div>
                      </Section>

                      <Section title="Address">
                        <div className="spr-grid">
                          <DisplayItem label="Address Line 1" value={agentDetails.address1} />
                          <DisplayItem label="Address Line 2" value={agentDetails.address2} />
                          <DisplayItem label="State" value={agentDetails.state_name || agentDetails.state_id} />
                          <DisplayItem label="District" value={agentDetails.district_name || agentDetails.district} />
                          <DisplayItem label="Mandal" value={agentDetails.mandal_name || agentDetails.mandal} />
                          <DisplayItem label="Village" value={agentDetails.village_name || agentDetails.village} />
                          <DisplayItem label="PIN Code" value={agentDetails.pincode} />
                        </div>
                      </Section>

                      <Section title="Uploaded Documents">
                        <div className="spr-grid">
                          <DisplayItem label="Registration Certificate" value={<DocumentCell path={agentDetails.registration_cert_doc} title="Registration Certificate" openModal={openModal} />} />
                          <DisplayItem label="PAN Card" value={<DocumentCell path={agentDetails.pan_proof} title="PAN Card" openModal={openModal} />} />
                          <DisplayItem label="Address Proof" value={<DocumentCell path={agentDetails.address_proof} title="Address Proof" openModal={openModal} />} />
                          <DisplayItem label="GST Document" value={<DocumentCell path={agentDetails.gst_doc} title="GST Document" openModal={openModal} />} />
                          <DisplayItem label="Legal Document (MoA/Partnership Deed)" value={<DocumentCell path={agentDetails.legal_document} title="Legal Document" openModal={openModal} />} />
                        </div>
                      </Section>

                      <Section title="Directors / Partners / Trustees">
                        <DataTable
                          className="spr-magenta-head"
                          columns={[
                            { key: "serial", label: "S.No.", render: (_, i) => i + 1 },
                            { key: "designation", label: "Designation" },
                            { key: "name", label: "Name" },
                            { key: "email_id", label: "Email" },
                            { key: "mobile_number", label: "Mobile" },
                            { key: "pan_card_number", label: "PAN" },
                            { key: "din_number", label: "DIN" },
                            { key: "state_ut", label: "State" },
                            { key: "district", label: "District" },
                          ]}
                          rows={entities}
                        />
                      </Section>

                      <Section title="Authorised Persons">
                        <DataTable
                          className="spr-blue-head"
                          columns={[
                            { key: "serial", label: "S.No.", render: (_, i) => i + 1 },
                            { key: "name", label: "Name" },
                            { key: "email_id", label: "Email" },
                            { key: "mobile_number", label: "Mobile" },
                          ]}
                          rows={authorizedPersons}
                        />
                      </Section>

                      <Section title="Projects Launched In The Past 5 Years">
                        {agentProjectRows.length > 0 ? (
                          <DataTable
                            className="spr-green-head"
                            columns={[
                              { key: "serial", label: "S.No.", render: (_, i) => i + 1 },
                              { key: "projectName", label: "Project Name", render: (row) => displayText(firstFilled(row.projectName, row.project_name, row.name)) },
                              { key: "projectType", label: "Project Type", render: (row) => displayText(firstFilled(row.projectType, row.project_type, row.type)) },
                              { key: "currentStatus", label: "Current Status", render: (row) => displayText(firstFilled(row.currentStatus, row.current_status, row.status)) },
                              { key: "projectAddress", label: "Address", render: (row) => displayText(firstFilled(row.projectAddress, row.project_address, row.address)) },
                            ]}
                            rows={agentProjectRows}
                          />
                        ) : (
                          <div className="spr-inline-summary"><DisplayItem label="Last five years project details" value="No" /></div>
                        )}
                      </Section>

                      <Section title="Other State/UT RERA Registration Details">
                        {(() => {
                          let reraList = [];
                          try {
                            reraList = typeof agentDetails.registration_other_states === "string"
                              ? JSON.parse(agentDetails.registration_other_states)
                              : (agentDetails.registration_other_states || []);
                          } catch (_) {}
                          return reraList.length > 0 ? (
                            <DataTable
                              className="spr-blue-head"
                              columns={[
                                { key: "serial", label: "S.No.", render: (_, i) => i + 1 },
                                { key: "rera_no", label: "RERA Number", render: (r) => r.rera_no || r.registration_number || "N/A" },
                                { key: "state", label: "State/UT", render: (r) => r.state || r.state_name || "N/A" },
                              ]}
                              rows={reraList}
                            />
                          ) : (
                            <div className="spr-inline-summary"><DisplayItem label="Registration in other State/UT" value="No" /></div>
                          );
                        })()}
                      </Section>
                    </>
                  ) : (
                    <>
                      {/* ===== INDIVIDUAL SECTIONS ===== */}
                      <Section title="Applicant Details">
                        <div className="spr-grid">
                          <DisplayItem label="Name" value={agentDetails.agent_name} />
                          <DisplayItem label="Father's Name" value={agentDetails.father_name} />
                          <DisplayItem label="Occupation" value={agentDetails.occupation_name} />
                          <DisplayItem label="Email Id" value={agentDetails.email} />
                          <DisplayItem label="Aadhaar Number" value={agentDetails.aadhaar} />
                          <DisplayItem label="PAN Card Number" value={agentDetails.pan} />
                          <DisplayItem label="Mobile Number" value={agentDetails.mobile} />
                          <DisplayItem label="Land Line Number" value={agentDetails.landline} />
                          <DisplayItem label="License Number by local bodies" value={agentDetails.license_number} />
                          <DisplayItem label="License Issued Date" value={formatDate(agentDetails.license_date)} />
                        </div>
                      </Section>

                      <Section title="Local Address For Communication">
                        <div className="spr-grid">
                          <DisplayItem label="Address Line 1" value={agentDetails.address1} />
                          <DisplayItem label="Address Line 2" value={agentDetails.address2} />
                          <DisplayItem label="State" value={agentDetails.state_name} />
                          <DisplayItem label="District" value={agentDetails.district_name} />
                          <DisplayItem label="Mandal" value={agentDetails.mandal_name} />
                          <DisplayItem label="Local Area / Village" value={agentDetails.village_name} />
                          <DisplayItem label="PIN Code" value={agentDetails.pincode} />
                        </div>
                      </Section>

                      <Section title="Uploaded Documents">
                        <div className="spr-grid">
                          <DisplayItem label="Photograph" value={<DocumentCell path={agentDetails.photograph} title="Photograph" openModal={openModal} />} />
                          <DisplayItem label="PAN Card" value={<DocumentCell path={agentDetails.pan_proof} title="PAN Card" openModal={openModal} />} />
                          <DisplayItem label="Address Proof" value={<DocumentCell path={agentDetails.address_proof} title="Address Proof" openModal={openModal} />} />
                          <DisplayItem label="Self Declared Affidavit" value={<DocumentCell path={agentDetails.self_declared_affidavit} title="Self Declared Affidavit" openModal={openModal} />} />
                        </div>
                      </Section>

                      <Section title="Projects Launched In The Past 5 Years">
                        <div className="spr-inline-summary">
                          <DisplayItem label="Last five years project details" value={individualHasProjectDetails ? "Yes" : "No"} />
                        </div>
                        {individualHasProjectDetails && (
                          <DataTable
                            className="spr-green-head"
                            columns={[
                              { key: "serial", label: "S.No.", render: (_, i) => i + 1 },
                              { key: "project_name", label: "Project Name", render: (row) => displayText(firstFilled(row.project_name, row.projectName, row.name)) }
                            ]}
                            rows={projects}
                          />
                        )}
                      </Section>

                      <Section title="Litigations">
                        <div className="spr-inline-summary">
                          <DisplayItem label="Any Civil/Criminal Cases" value={formatBoolean(agentDetails.any_civil_criminal_cases)} />
                        </div>
                        {formatBoolean(agentDetails.any_civil_criminal_cases) === "Yes" && (
                          <DataTable
                            className="spr-red-head"
                            columns={[
                              { key: "serial", label: "S.No.", render: (_, i) => i + 1 },
                              { key: "case_no", label: "Case No." },
                              { key: "tribunal_place", label: "Tribunal / Authority" },
                              { key: "petitioner_name", label: "Petitioner" },
                              { key: "respondent_name", label: "Respondent" },
                              { key: "present_status", label: "Present Status" },
                              { key: "interim_order", label: "Interim Order", render: (r) => formatBoolean(r.interim_order) },
                              { key: "final_order", label: "Final Order Details", render: (r) => formatBoolean(r.final_order) }
                            ]}
                            rows={litigations}
                          />
                        )}
                      </Section>

                      <Section title="Other State/UT RERA Registration Details">
                        <div className="spr-inline-summary">
                          <DisplayItem label="Do you have any registration in other State/UT" value={formatBoolean(agentDetails.registration_other_states)} />
                        </div>
                        {formatBoolean(agentDetails.registration_other_states) === "Yes" && (
                          <DataTable
                            className="spr-blue-head"
                            columns={[
                              { key: "serial", label: "S.No.", render: (_, i) => i + 1 },
                              { key: "registration_number", label: "Registration Number" },
                              { key: "state_name", label: "State/UT" },
                              { key: "district", label: "District" }
                            ]}
                            rows={otherStateRera}
                          />
                        )}
                      </Section>
                    </>
                  )}
                </div>
                <section className="spr-panel" style={{ marginTop: "20px" }}>
                  <div className="spr-panel-head">
                    <h2>ACTION TO BE TAKEN</h2>
                  </div>

                  <div className="spr-shortfall-row" style={{ display: "flex", gap: "20px", margin: "20px 0" }}>
                    <label className="spr-label" style={{ fontWeight: "bold" }}>
                      Is there any shortfall in agent profile
                    </label>

                    <label className="spr-radio">
                      <input
                        type="radio"
                        name="profileShortfall"
                        value="yes"
                        checked={profileShortfall === "yes"}
                        disabled={profileLocked}
                        onChange={(e) => setProfileShortfall(e.target.value)}
                      />
                      <span style={{ marginLeft: "5px" }}>Yes</span>
                    </label>

                    <label className="spr-radio">
                      <input
                        type="radio"
                        name="profileShortfall"
                        value="no"
                        checked={profileShortfall === "no"}
                        disabled={profileLocked}
                        onChange={(e) => setProfileShortfall(e.target.value)}
                      />
                      <span style={{ marginLeft: "5px" }}>No</span>
                    </label>
                  </div>

                  <textarea
                    className="spr-textarea"
                    placeholder="Enter agent profile remarks..."
                    rows={4}
                    value={profileRemarks}
                    disabled={profileLocked}
                    onChange={(e) => setProfileRemarks(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                  />

                  <div className="spr-submit-row" style={{ marginTop: "15px", textAlign: "right" }}>
                    <button
                      type="button"
                      className="spr-btn spr-btn-primary"
                      onClick={handleAddProfileRemark}
                      disabled={savingProfileRemark || profileLocked}
                    >
                      {finalSubmitted ? "Locked" : profileDraftRemark ? "Remark Added" : "Add Remark"}
                    </button>
                  </div>

                  {profileDisplayedRemarks.length > 0 && (
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
                          {profileDisplayedRemarks.map((item, index) => (
                            <tr key={item.id || item.verified_at || index}>
                              <td>{index + 1}</td>
                              <td>{item.document_name} - {item.verified_by}</td>
                              <td>{item.is_shortfall ? "Yes" : "No"}</td>
                              <td>{item.remarks}</td>
                              <td>{new Date(item.verified_at || item.created_at || item.updated_at).toLocaleString()}</td>
                              <td>
                                {item === profileDraftRemark && !finalSubmitted ? (
                                  <button type="button" className="spr-secondary-btn" onClick={handleRemoveProfileRemark}>
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
                  <button
                    className="spr-btn"
                    onClick={handleProfileSaveAndContinue}
                    disabled={savingProfileRemark}
                  >
                    {savingProfileRemark ? "Saving..." : "Save And Continue"}
                  </button>
                </div>
              </>
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