import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../api/api";
import ScrutinyPageHeader from "../../components/scrutiny/ScrutinyPageHeader";
import ProjectWizard from "../../components/scrutiny/scrutiny_steper";
import ScrutinyLayout from "../../components/scrutiny/ScrutinyLayout";
import "../../styles/scrutiny/scrutiny_projectregistation_action.css";
import { useAdmin } from "../../context/AdminContext";


// const ACTION_OPTIONS = [
//   {
//     value: "approve",
//     title: "Approve Application",
//     subtitle: "Use when the scrutiny review is complete and ready for final processing.",
//     nextDesk: "Director / Final Approval Desk",
//   },
//   {
//     value: "shortfall",
//     title: "Raise Shortfall",
//     subtitle: "Return the file with observations so the applicant can respond.",
//     nextDesk: "Applicant / Compliance Response",
//   },
//   {
//     value: "reject",
//     title: "Reject Application",
//     subtitle: "Use when the application cannot proceed under the current submission.",
//     nextDesk: "Closed With Rejection Order",
//   },
// ];

const REVIEW_SECTIONS = [
  ["promoter", "Promoter Profile", "Promoter identity, declarations and profile records.", "/scrutiny/project-registration_1"],
  ["project", "Project Details", "Project registration, address and construction details.", "/scrutiny/project-registration_2"],
  ["development", "Development Details", "Development sheet, unit matrix and external work.", "/scrutiny/project-registration_3"],
  ["associates", "Associate Details", "Architect, engineer, contractor, agent and CA review.", "/scrutiny/project-registration_4"],
  ["uploads", "Upload Documents", "Uploaded documents, consultancy details and notes.", "/scrutiny/project-registration_5"],
];

const normalizePromoterType = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "individual") return "individual";
  if (
    normalized === "other" ||
    normalized === "other than individual" ||
    normalized === "otherthanindividual" ||
    normalized === "other_then_individual"
  ) {
    return "other";
  }
  return normalized || "individual";
};

const normalizeObject = (value) => {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return typeof value === "object" ? value : {};
};

const firstFilled = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    return value;
  }
  return "";
};

const displayText = (value, fallback = "N/A") => {
  const resolved = firstFilled(value);
  return resolved === "" ? fallback : String(resolved);
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return displayText(value);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeDepartment = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized.includes("planning")) return "planning";
  if (normalized.includes("legal")) return "legal";
  if (normalized.includes("audit")) return "audit";
  if (normalized.includes("engineer")) return "engineer";
  if (normalized.includes("assistant director")) return "ad";
  if (normalized.includes("deputy director")) return "dd";
  if (normalized.includes("chairman")) return "chairman";
  if (normalized.includes("director")) return "director";
  if (normalized.includes("scrutiny")) return "verification";
  if (normalized.includes("verification")) return "verification";
  return normalized;
};

const getDepartmentLabel = (value) => {
  const labels = {
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
  return labels[normalizeDepartment(value)] || displayText(value, "Verification Team");
};

const formatShortfall = (value) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  const normalized = String(value || "").trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(normalized)) return "Yes";
  if (["no", "n", "false", "0"].includes(normalized)) return "No";
  return "N/A";
};

const getDaysFromDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
};

const countAssociateEntries = (associateDetails) =>
  Object.values(normalizeObject(associateDetails)).reduce(
    (total, items) => total + (Array.isArray(items) ? items.length : 0),
    0
  );

const countUploadedDocuments = (documents) => {
  if (!documents) return 0;
  let parsed = documents;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return 0;
    }
  }
  if (Array.isArray(parsed)) return parsed.filter(Boolean).length;
  if (typeof parsed === "object") return Object.values(parsed).filter(Boolean).length;
  return 0;
};

// const getActionOption = (value) =>
//   ACTION_OPTIONS.find((option) => option.value === value) || ACTION_OPTIONS[1];

export default function ScrutinyProjectRegistrationAction() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAdmin();
let dept = normalizeDepartment(admin?.department);

if (!dept) dept = "verification";
console.log("FINAL DEPT:", dept);

// ✅ ADD THIS
const isPlanning = dept === "planning";
const isLegal = dept === "legal";
const isAudit = dept === "audit";
const isEngineer = dept === "engineer";
const isAD = dept === "ad";
const isDD = dept === "dd";
const isChairman = dept === "chairman";
  const applicationNumber =
  String(
    location.state?.applicationNumber ||
    sessionStorage.getItem("applicationNumber") ||
    ""
  ).trim();

console.log("APPLICATION NUMBER:", applicationNumber);
  const panNumber =
    location.state?.panNumber || sessionStorage.getItem("panNumber") || "";
  const promoterType = normalizePromoterType(
    location.state?.promoterType || sessionStorage.getItem("promoterType")
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [summaryRow, setSummaryRow] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [developmentData, setDevelopmentData] = useState(null);
  const [uploadedDocumentCount, setUploadedDocumentCount] = useState(0);
  // const [decision, setDecision] = useState("shortfall");
  const [remarks, setRemarks] = useState("");
  const [finalRemarks, setFinalRemarks] = useState("");
  
  const [remarksList, setRemarksList] = useState([]);
  const [draftRemark, setDraftRemark] = useState(null);
  const [finalSubmitted, setFinalSubmitted] = useState(false);
const loadRemarks = async () => {
  try {
    if (!applicationNumber) return;

    const encodedApplicationNo = encodeURIComponent(applicationNumber);
    const [verificationResponse, finalStatusResponse] = await Promise.all([
      apiGet(`/api/scrutiny/verification-remarks?application_no=${encodedApplicationNo}`),
      apiGet(`/api/scrutiny/final-status?application_no=${encodedApplicationNo}`),
    ]);

    const verificationRows = Array.isArray(verificationResponse?.rows)
      ? verificationResponse.rows
      : [];
    const finalRows = Array.isArray(finalStatusResponse?.rows)
      ? finalStatusResponse.rows
      : [];

    const shouldShowDepartment = (value) => {
      const rowDept = normalizeDepartment(value);
      if (dept === "verification") return rowDept === "verification";
      if (dept === "director" || dept === "chairman") return true;
      return rowDept === "verification" || rowDept === dept;
    };

    const pageRemarks = verificationRows
      .filter((item) => shouldShowDepartment(item.verification_team || item.verified_by))
      .map((item) => ({
        ...item,
        source: "pageRemark",
        description: item.document_name || getDepartmentLabel(item.verification_team || item.verified_by),
        displayDate: item.created_at || item.updated_at,
      }));

    const finalRemarksRows = finalRows
      .filter((item) => shouldShowDepartment(item.verified_by))
      .map((item) => ({
        ...item,
        source: "finalStatus",
        description: getDepartmentLabel(item.verified_by),
        displayDate: item.verified_at,
      }));

    setFinalSubmitted(
      finalRows.some((item) => normalizeDepartment(item.verified_by) === dept)
    );

    setRemarksList(
      [...pageRemarks, ...finalRemarksRows].sort(
        (a, b) => new Date(b.displayDate || 0) - new Date(a.displayDate || 0)
      )
    );
  } catch (error) {
    console.error("Error loading remarks:", error);
  }
};
const [shortfall, setShortfall] = useState("");
  const [reviewChecklist, setReviewChecklist] = useState({
    reviewedSections: false,
    validatedDocuments: false,
    confirmedAction: false,
  });

  useEffect(() => {
    if (applicationNumber) sessionStorage.setItem("applicationNumber", applicationNumber);
    if (panNumber) sessionStorage.setItem("panNumber", panNumber);
    if (promoterType) sessionStorage.setItem("promoterType", promoterType);
  }, [applicationNumber, panNumber, promoterType, dept]);

  useEffect(() => {
    if (!applicationNumber) return;
    const savedDraft = sessionStorage.getItem(`scrutiny-action-draft:${applicationNumber}`);
    if (!savedDraft) return;
    try {
      const parsed = JSON.parse(savedDraft);
      // if (parsed.decision) setDecision(parsed.decision);
      if (typeof parsed.remarks === "string") setRemarks(parsed.remarks);
      if (parsed.reviewChecklist) {
        setReviewChecklist((prev) => ({ ...prev, ...parsed.reviewChecklist }));
      }
    } catch (draftError) {
      console.error("Unable to parse scrutiny action draft", draftError);
    }
  }, [applicationNumber, dept]);

  useEffect(() => {
    const loadContext = async () => {
      if (!applicationNumber) {
        setError("Application number is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const previewEndpoint =
          promoterType === "other"
            ? "/api/othertheninduvidual/project/preview"
            : "/api/project/preview";

        const [rowsResult, previewResult, developmentResult, documentsResult] =
          await Promise.allSettled([
            apiGet(`/api/scrutiny/project-registrations?dept=${dept}`),
            apiPost(previewEndpoint, { applicationNumber, panNumber }),
            panNumber
              ? apiGet(
                  `/api/development-details?application_number=${applicationNumber}&pan_number=${panNumber}`
                )
              : Promise.resolve(null),
            panNumber
              ? apiPost("/api/project/documents-consultant/get", {
                  application_number: applicationNumber,
                  pan_number: panNumber,
                })
              : Promise.resolve(null),
          ]);

        if (rowsResult.status === "fulfilled") {
          const rows = Array.isArray(rowsResult.value) ? rowsResult.value : [];
          setSummaryRow(
            rows.find((row) => String(row.application_no) === String(applicationNumber)) || null
          );
        }

        if (previewResult.status === "fulfilled") {
          setPreviewData(previewResult.value?.data || previewResult.value || null);
        }

        if (developmentResult.status === "fulfilled") {
          const apiData =
            developmentResult.value?.data?.data ||
            developmentResult.value?.data ||
            developmentResult.value;
          setDevelopmentData(apiData || null);
        }

        if (documentsResult.status === "fulfilled") {
          const response = documentsResult.value || {};
          const documentsPayload =
            response.documents ||
            response.data?.documents ||
            response.project_upload_documents ||
            response.data?.project_upload_documents ||
            {};
          setUploadedDocumentCount(countUploadedDocuments(documentsPayload));
        }
      } catch (loadError) {
        console.error("Unable to load scrutiny action context", loadError);
        setError(loadError.message || "Unable to load scrutiny action details.");
      } finally {
  if (applicationNumber) {
  }

  setLoading(false);
}
    };

    loadContext();
  }, [applicationNumber, panNumber, promoterType, dept]);
  // ✅ ADD THIS NEW BLOCK JUST BELOW
useEffect(() => {
  if (applicationNumber) {
    console.log("Calling loadRemarks for:", applicationNumber);
    loadRemarks();
  }
}, [applicationNumber, dept]);

  const promoterDetails = normalizeObject(previewData?.promoter_details);
  const projectDetails = normalizeObject(previewData?.project_details);
  const associateDetails = normalizeObject(previewData?.associate_details);

  const summaryMetrics = useMemo(() => {
    const createdAt = firstFilled(
      summaryRow?.created_at,
      projectDetails.created_at,
      projectDetails.first_transaction_date
    );

    return [
      ["Application Number", displayText(applicationNumber)],
      ["Promoter Type", promoterType === "other" ? "Other Than Individual" : "Individual"],
      [
        "Promoter Name",
        displayText(
          firstFilled(
            promoterDetails.promoter_name,
            promoterDetails.organization_name,
            promoterDetails.name,
            summaryRow?.applicant_name,
            summaryRow?.applicantName
          )
        ),
      ],
      [
        "Project Name",
        displayText(firstFilled(projectDetails.project_name, summaryRow?.project_name, summaryRow?.projectName)),
      ],
      [
        "Project Address",
        displayText(firstFilled(projectDetails.project_address, summaryRow?.project_address, summaryRow?.district)),
      ],
      [
        "Scrutiny Count",
        displayText(
          firstFilled(
            projectDetails.scrutiny_count,
            summaryRow?.scrutiny_count,
            summaryRow?.scrutinyLabel,
            "1"
          )
        ),
      ],
      ["Received On", formatDateTime(createdAt)],
      ["Days In Scrutiny", displayText(getDaysFromDate(createdAt))],
    ];
  }, [applicationNumber, promoterType, promoterDetails, projectDetails, summaryRow]);

  const reviewCards = useMemo(() => {
    const associateCount = countAssociateEntries(associateDetails);
    const hasPromoter = Object.keys(promoterDetails).length > 0;
    const hasProject = Object.keys(projectDetails).length > 0;
    const hasDevelopment =
      !!developmentData &&
      Object.keys(normalizeObject(developmentData.development_details)).length > 0;
    const hasAssociates = associateCount > 0;
    const hasUploads = uploadedDocumentCount > 0;

    const statuses = {
      promoter: hasPromoter ? ["Reviewed", "Promoter data available"] : ["Pending", "Promoter data missing"],
      project: hasProject ? ["Reviewed", "Project details available"] : ["Pending", "Project details missing"],
      development: hasDevelopment ? ["Reviewed", "Development details available"] : ["Pending", "Development details missing"],
      associates: hasAssociates ? ["Reviewed", `${associateCount} associate record(s) found`] : ["Pending", "No associate records found"],
      uploads: hasUploads ? ["Reviewed", `${uploadedDocumentCount} uploaded document(s) found`] : ["Pending", "No uploaded documents found"],
    };

    return REVIEW_SECTIONS.map(([key, title, description, path]) => ({
      key,
      title,
      description,
      path,
      status: statuses[key][0],
      meta: statuses[key][1],
    }));
  }, [associateDetails, promoterDetails, projectDetails, developmentData, uploadedDocumentCount]);

  const completionStats = useMemo(() => {
    const completed = reviewCards.filter((card) => card.status === "Reviewed").length;
    return {
      completed,
      total: reviewCards.length,
      percent: reviewCards.length ? Math.round((completed / reviewCards.length) * 100) : 0,
    };
  }, [reviewCards]);

  const checklistCompleted = Object.values(reviewChecklist).every(Boolean);
  const canSubmit = remarks.trim().length >= 10 && checklistCompleted && !submitting;
  const actionLocked = finalSubmitted;
  const draftLocked = actionLocked || Boolean(draftRemark);
  const displayedRemarksList = draftRemark ? [draftRemark, ...remarksList] : remarksList;
  // const selectedAction = getActionOption(decision);

  const persistDraft = (message) => {
    sessionStorage.setItem(
      `scrutiny-action-draft:${applicationNumber}`,
      JSON.stringify({
        applicationNumber,
        panNumber,
        promoterType,
        remarks,
        reviewChecklist,
        savedAt: new Date().toISOString(),
      })
    );
    if (message) setBanner(message);
  };

  const handleChecklistChange = (key) => {
    setReviewChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

const handleAddRemark = () => {
  if (draftLocked) return;

  if (!finalRemarks.trim() || shortfall === "") {
    alert("Please select shortfall and enter remarks");
    return;
  }

  setDraftRemark({
    source: "actionDraft",
    description: getDepartmentLabel(dept),
    verified_by: dept,
    is_shortfall: shortfall === "yes",
    remarks: finalRemarks.trim(),
    displayDate: new Date().toISOString(),
  });
};

const handleRemoveDraftRemark = () => {
  if (actionLocked) return;
  setDraftRemark(null);
  setShortfall("");
  setFinalRemarks("");
};

const handleFinalSubmit = async () => {
  if (actionLocked) return;

  if (!draftRemark) {
    alert("Please add remarks before final submit");
    return;
  }

  try {
    setSubmitting(true);
    const submitResult = await apiPost("/api/scrutiny/final-submit", {
      application_no: applicationNumber,
      department: dept,
      is_shortfall: draftRemark.is_shortfall ? "yes" : "no",
      remarks: draftRemark.remarks,
    });

    setDraftRemark(null);
    setFinalRemarks("");
    setShortfall("");
    await loadRemarks();

    alert(submitResult?.message || "Final Verification Completed");
  } catch (err) {
    console.error(err);
    alert(err.message || "Unable to complete final submit");
  } finally {
    setSubmitting(false);
  }
};

const handleChairmanDecision = async (decision) => {
  if (!finalRemarks.trim()) {
    alert("Please enter chairman remarks");
    return;
  }

  try {
    const result = await apiPost("/api/scrutiny/chairman-decision", {
      application_no: applicationNumber,
      decision,
      remarks: finalRemarks,
    });

    await loadRemarks();
    setFinalRemarks("");
    alert(result?.message || `Application ${decision}`);
    navigate("/scrutiny/project-registration");
  } catch (err) {
    console.error(err);
  }
};
  return (
    <ScrutinyLayout>
      <div className="sra-page">
        <div className="sra-shell">
          <ScrutinyPageHeader />

          <div className="sra-body">
            <div className="sra-head">
              <div>
                <h1 className="sra-title">Project Registration Action</h1>
                <p className="sra-subtitle">
                  Review the full application, select the final action, and record the scrutiny note.
                </p>
              </div>

              <div className="sra-head-actions">
                <button
                  type="button"
                  className="sra-btn sra-btn-secondary"
                  onClick={() => navigate("/scrutiny/project-registration")}
                >
                  Back to Requests
                </button>
              </div>
            </div>

            <ProjectWizard currentStep={6} />

            {banner && <div className="sra-banner sra-banner-info">{banner}</div>}
            {error && <div className="sra-banner sra-banner-error">{error}</div>}

            {loading ? (
              <div className="sra-state-card">Loading scrutiny action details...</div>
            ) : (
              <>
                <section className="sra-panel">
                  <div className="sra-panel-head">
                    <div>
                      <h2>Application Snapshot</h2>
                      <p>Live summary from the scrutiny application context.</p>
                    </div>
                  </div>

                  <div className="sra-summary-grid">
                    {summaryMetrics.map(([label, value]) => (
                      <div className="sra-metric-card" key={label}>
                        <span className="sra-metric-label">{label}</span>
                        <span className="sra-metric-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </section>
  
    
  <form className="sra-form">
    {!(isPlanning || isLegal || isAudit || isEngineer || isAD || isDD) && (
                <section className="sra-panel">
                  <div className="sra-panel-head">
                    <div>
                      <h2>Section Review Status</h2>
                      <p>Jump back to any scrutiny page before finalizing the action.</p>
                    </div>
                    <div className="sra-progress-text">
                      Overall completion {completionStats.percent}%
                    </div>
                  </div>

                  <div className="sra-review-grid">
                    {reviewCards.map((card) => (
                      <div className="sra-review-card" key={card.key}>
                        <div className="sra-review-top">
                          <span
                            className={`sra-status-chip ${
                              card.status === "Reviewed" ? "sra-status-reviewed" : "sra-status-pending"
                            }`}
                          >
                            {card.status}
                          </span>

                          <button
                            type="button"
                            className="sra-link-btn"
                            onClick={() =>
                              navigate(card.path, {
                                state: { applicationNumber, panNumber, promoterType },
                              })
                            }
                          >
                            Open Section
                          </button>
                        </div>

                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                        <div className="sra-review-meta">{card.meta}</div>
                      </div>
                    ))}
                  </div>
                </section>
)}
{!(isPlanning || isLegal || isAudit || isEngineer || isAD || isDD) && (
                <section className="sra-panel">
                  <div className="sra-panel-head">
                    <div>
                      {/* <h2>Recommended Action</h2> */}
                      <p>Select the action that should be recorded for this application.</p>
                    </div>
                  </div>

                  {/* <div className="sra-action-grid">
                    {ACTION_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`sra-action-card ${
                          decision === option.value ? "sra-action-card-active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="scrutiny-action"
                          value={option.value}
                          checked={decision === option.value}
                          onChange={() => setDecision(option.value)}
                        />

                        <div>
                          <div className="sra-action-title">{option.title}</div>
                          <div className="sra-action-subtitle">{option.subtitle}</div>
                          <div className="sra-action-route">
                            Next routing: {option.nextDesk}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div> */}
                </section>
)}
{!(isPlanning || isLegal || isAudit || isEngineer || isAD || isDD) && (
                <div className="sra-dual-grid">
                  <section className="sra-panel">
                    <div className="sra-panel-head">
                      <div>
                        <h2>Action Checklist</h2>
                        <p>Confirm these items before recording the final decision.</p>
                      </div>
                    </div>

                    <div className="sra-checklist">
                      <label className="sra-checkline">
                        <input
                          type="checkbox"
                          checked={reviewChecklist.reviewedSections}
                          onChange={() => handleChecklistChange("reviewedSections")}
                        />
                        <span>I have reviewed all scrutiny sections and summary details.</span>
                      </label>

                      <label className="sra-checkline">
                        <input
                          type="checkbox"
                          checked={reviewChecklist.validatedDocuments}
                          onChange={() => handleChecklistChange("validatedDocuments")}
                        />
                        <span>I have validated the uploaded documents and supporting records.</span>
                      </label>

                      <label className="sra-checkline">
                        <input
                          type="checkbox"
                          checked={reviewChecklist.confirmedAction}
                          onChange={() => handleChecklistChange("confirmedAction")}
                        />
                        <span>I confirm that the selected action is appropriate for this application.</span>
                      </label>
                    </div>
                  </section>

                  
                </div>
           )}     

                {!isChairman && (
                <section className="sra-panel">
  <div className="sra-panel-head">
    <h2>ACTION TO BE TAKEN</h2>
  </div>

  {/* Shortfall */}
 <div className="sra-shortfall-row">
  <label className="sra-label">
    Is there any shortfall in data/payment
  </label>

  <label className="sra-radio">
    <input
      type="radio"
      name="shortfall"
      value="yes"
      checked={shortfall === "yes"}
      disabled={draftLocked}
      onChange={(e) => setShortfall(e.target.value)}
    />
    <span>Yes</span>
  </label>

  <label className="sra-radio">
    <input
      type="radio"
      name="shortfall"
      value="no"
      checked={shortfall === "no"}
      disabled={draftLocked}
      onChange={(e) => setShortfall(e.target.value)}
    />
    <span>No</span>
  </label>
</div>

  {/* Remarks */}
  <div className="sra-remarks-box">
    <textarea
  className="sra-textarea"
  placeholder="Enter remarks..."
  rows={4}
  value={finalRemarks}
  disabled={draftLocked}
  onChange={(e) => setFinalRemarks(e.target.value)}
/>
  </div>

  {/* Submit */}
  <div className="sra-submit-row">
    <button
  type="button"
  className="sra-btn sra-btn-primary"
  onClick={handleAddRemark}
  disabled={draftLocked}
>
  {draftRemark ? "Remark Added" : "Add Remark"}
</button>
  </div>
</section>
)}

{isChairman && (
  <section className="sra-panel">
    <div className="sra-panel-head">
      <h2>CHAIRMAN DECISION</h2>
    </div>

    <div className="sra-remarks-box">
      <textarea
        className="sra-textarea"
        placeholder="Enter chairman remarks..."
        rows={4}
        value={finalRemarks}
        disabled={actionLocked}
        onChange={(e) => setFinalRemarks(e.target.value)}
      />
    </div>

    <div className="sra-submit-row">
      <button
        type="button"
        className="sra-btn sra-btn-primary"
        onClick={() => handleChairmanDecision("approved")}
        disabled={actionLocked}
      >
        Approve
      </button>

      <button
        type="button"
        className="sra-btn sra-btn-secondary"
        onClick={() => handleChairmanDecision("rejected")}
        disabled={actionLocked}
      >
        Reject
      </button>
    </div>
  </section>
)}

 <section className="sra-panel">
  <div className="sra-panel-head">
    <h2>UPDATED REMARKS</h2>
  </div>

  <div className="sra-table-wrapper">
    <table className="sra-table">
      <thead>
        <tr>
          <th>SNo</th>
          <th>Description</th>
          <th>Is there any Shortfall in data/Payment</th>
          <th>Remarks</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
  {displayedRemarksList && displayedRemarksList.length > 0 ? (
    displayedRemarksList.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.description || getDepartmentLabel(item.verified_by || item.verification_team)}</td>
        <td>{formatShortfall(item.is_shortfall)}</td>
        <td>{item.remarks}</td>
        <td>{formatDateTime(item.displayDate || item.verified_at || item.created_at || item.updated_at)}</td>
        <td>
          {item.source === "actionDraft" && !actionLocked ? (
            <button
              type="button"
              className="sra-btn sra-btn-secondary"
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
      <td colSpan="6" style={{ textAlign: "center" }}>
        No remarks available
      </td>
    </tr>
  )}
</tbody>
    </table>
  </div>
</section>

                <div className="sra-footer">
                  <button
                    type="button"
                    className="sra-btn sra-btn-secondary"
                    onClick={() =>
                      navigate("/scrutiny/project-registration_5", {
                        state: { applicationNumber, panNumber, promoterType },
                      })
                    }
                  >
                    Back to Upload Documents
                  </button>

                  <button
                    type="button"
                    className="sra-btn sra-btn-secondary"
                    onClick={() =>
                      persistDraft(`Draft saved locally for application ${applicationNumber}.`)
                    }
                  >
                    Save Draft
                  </button>

                  
  {!isChairman && (
  <button
    type="button"
    className="sra-btn sra-btn-primary"
    onClick={handleFinalSubmit}
    disabled={actionLocked || submitting}
  >
    Final Submit
  </button>
  )}

                </div>
              </form>
 </>
 )}
          </div>
        </div>
      </div>
    </ScrutinyLayout>
  );
}
