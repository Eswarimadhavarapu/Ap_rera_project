import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getExemptionById,
  submitStage1,
  submitStage2,
  submitStage3,
  sendRejectionEmail,
  BASE_URL
} from "../api/api";
import { useAdmin } from "../context/AdminContext";
import "../styles/exemptionUserDetails.css";

/* ── Icon helpers ── */
const Icon = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  person: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  user: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  cert: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
};

/* ── Read role from AdminContext ── */
/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const s = (status || "");
  const map = {
    s1_accepted: { cls: "s1", label: "S1 Reviewed" },
    s2_approved: { cls: "approved", label: "Approved" },
    s2_rejected: { cls: "rejected", label: "Rejected" },
    completed: { cls: "completed", label: "Completed" },
  };
  const { cls, label } = map[s] || { cls: "pending", label: status || "Pending" };
  return (
    <span className={`status-badge ${cls}`}>
      <span className="status-dot" />
      {label}
    </span>
  );
};

/* ── Document link ── */
const DocLink = ({ href, label }) => (
  <a href={href} target="_blank" rel="noreferrer" className="doc-link">
    <Icon d={ICONS.eye} size={13} />
    {label}
  </a>
);

/* ── Info row ── */
const InfoRow = ({ label, children }) => (
  <div className="row">
    <label>{label}</label>
    <span>{children}</span>
  </div>
);

/* ── Remark history row (read-only) ── */
const RemarkRow = ({ level, remark, authorityId, checkedDate, decision }) => {
  if (!remark) return null;
  const labelMap = { s1: "S1 — Engineer Review", s2: "S2 — Planning Authority", s3: "S3 — Final Dispatch" };
  return (
    <div className={`remark-history-row remark-${level}`}>
      <div className="remark-history-header">
        <span className="remark-level-badge">{labelMap[level] || level.toUpperCase()}</span>
        {authorityId && <span className="remark-authority">Officer #{authorityId}</span>}
        {decision && (
          <span className={`remark-decision ${decision}`}>
            {decision === "approved" ? "✔ Approved" : "✖ Rejected"}
          </span>
        )}
        {checkedDate && (
          <span className="remark-date">
            {new Date(checkedDate).toLocaleString("en-IN", {
              day: "2-digit", month: "short", year: "numeric",
              
            })}
          </span>
        )}
      </div>
      <p className="remark-history-text">{remark}</p>
    </div>
  );
};

/* ── Stage indicator bar ── */
const StageBar = ({ status }) => {
  const getStage = (s) => {
    if (!s || s === "pending") return 0;
    if (s === "s1_accepted") return 1;
    if (s === "s2_approved" || s === "s2_rejected") return 2;
    if (s === "completed") return 3;
    return 0;
  };
  const current = getStage(status);
  const stages = ["Submitted", "S1 Review", "S2 Decision", "Completed"];
  return (
    <div className="stage-bar">
      {stages.map((label, i) => (
        <React.Fragment key={i}>
          <div className={`stage-step ${i <= current ? "done" : ""} ${i === current ? "active" : ""}`}>
            <div className="stage-circle">{i < current ? "✓" : i + 1}</div>
            <span>{label}</span>
          </div>
          {i < stages.length - 1 && (
            <div className={`stage-connector ${i < current ? "done" : ""}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const defaultId = Number(id) || 1;

  const { admin } = useAdmin();
  const role = admin?.role || "staff";
  const userId = admin?.id || 1;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Action state */
  const [decision, setDecision] = useState(""); // "approved" | "rejected"
  const [remarks, setRemarks] = useState("");
  const [remarks2, setRemarks2] = useState(""); // optional remarks
  const [rejectionReason, setRejectionReason] = useState(""); // rejection email reason
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState("");
  const [sendError, setSendError] = useState("");

  const fileUrl = (path) => {
    if (!path) return "#";
    if (/^https?:\/\//i.test(path)) return path;

    const normalizedPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
    const uploadsIndex = normalizedPath.indexOf("uploads/");
    const relativePath = uploadsIndex >= 0
      ? normalizedPath.slice(uploadsIndex)
      : normalizedPath;

    return `${BASE_URL}/${relativePath}`;
  };

  // 🔥 REMOVE 'backend/' from path
  /* ── Fetch record ── */
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await getExemptionById(defaultId);
      setUser(res);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, [defaultId]);

  /* ── Refresh helper ── */
  const refreshUser = async () => {
    const res = await fetch(`${BASE_URL}/api/project_exemption/${defaultId}`);
    if (res.ok) setUser(await res.json());
  };

  /* ══════════════════════════════════
     STAGE 1  —  S1 Engineer submits remarks
  ══════════════════════════════════ */
  const handleStage1 = async () => {
    setSendError("");
    if (!remarks.trim()) { setSendError("Please enter your remarks before submitting."); return; }

    try {
      setSending(true);
      await submitStage1(defaultId, {
        remark_s1: remarks.trim(),
        remark_s1_optional: remarks2.trim(),
        authority_id: userId
      });
      await refreshUser();
      setSendSuccess("✔ Remarks submitted. Application moved to S2 review.");
      setRemarks("");
      setRemarks2("");
    } catch (err) {
      console.error(err);
      setSendError("Failed to submit. Please try again.");
    } finally {
      setSending(false);
    }
  };

  /* ══════════════════════════════════
     STAGE 2  —  S2 Planning approves/rejects
  ══════════════════════════════════ */
  const handleStage2 = async () => {
    setSendError("");
    if (!decision) { setSendError("Please select Approve or Reject."); return; }
    if (!remarks.trim()) { setSendError("Remarks are required."); return; }

    try {
      setSending(true);
      await submitStage2(defaultId, {
        decision,
        remark_s2: remarks.trim(),
        remark_s2_optional: remarks2.trim(),
        authority_id: userId,
      });
      await fetchUser();
      setSendSuccess(decision === "approved"
        ? "✔ Application approved. Certificate generated and forwarded to S1 for dispatch."
        : "✖ Application rejected. Applicant will be notified.");
      setRemarks("");
      setDecision("");
    } catch (err) {
      console.error(err);
      setSendError("Failed to submit decision. Please try again.");
    } finally {
      setSending(false);
    }
  };

  /* ══════════════════════════════════
     STAGE 3  —  S3 sends certificate mail
  ══════════════════════════════════ */
  const handleStage3 = async () => {
    setSendError("");
    try {
      setSending(true);
      await submitStage3(defaultId, {
        authority_id: userId
      });
      await refreshUser();
      setSendSuccess("✔ Certificate email sent to applicant successfully.");
    } catch (err) {
      console.error(err);
      setSendError("Failed to send mail. Please try again.");
    } finally {
      setSending(false);
    }
  };

  /* ══════════════════════════════════
     SEND REJECTION EMAIL — S1 sends rejection to applicant
  ══════════════════════════════════ */
  const handleSendRejectionEmail = async () => {
    setSendError("");
    if (!rejectionReason.trim()) { setSendError("Please enter rejection reason."); return; }

    try {
      setSending(true);
      await sendRejectionEmail(defaultId, {
        email: user.email,
        reason: rejectionReason,
        authority_id: userId,
      });

      await refreshUser();
      setSendSuccess("✔ Rejection email sent to applicant successfully.");
      setRejectionReason("");
    } catch (err) {
      console.error(err);
      setSendError("Failed to send rejection email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  /* ── Loading / Error states ── */
  if (loading)
    return (
      <div className="state-center">
        <div className="spinner" />
        <p>Fetching application details…</p>
      </div>
    );

  if (error) return <div className="state-center"><p>⚠ {error}</p></div>;
  if (!user) return <div className="state-center"><p>No record found.</p></div>;

  /* ══════════════════════════════════
   ROLE VISIBILITY GUARDS
══════════════════════════════════ */

  // STAFF handles S1 & S3
  const isStaff = role === "Engineer";
  const isSuperAdmin = role === "seniarAdit" || role === "admin";

  // S1 → STAFF
  const canActS1 = isStaff && !user.remark_s1;

  // S2 → seniarAdit
  const canActS2 =
    (role === "seniarAdit" || role === "admin") &&
    user.approver_status === "s1_accepted";

  // S3 → STAFF only after approval
  const canActS3 = isStaff && user.approver_status === "s2_approved";

  /* ── Render ── */
  return (
    <div className="details-container">

      {/* ── Role indicator chip ── */}
      <div className="role-chip-wrapper">
        <div className={`role-chip role-${role}`}>
          <Icon d={ICONS.shield} size={12} />
          {isStaff
            ? (user.approver_status === "s2_approved"
              ? "S3 — Final Dispatch (STAFF)"
              : "S1 — Engineer Review (STAFF)")
            : (user.approver_status === "s2_approved"
              ? "S3 — Final Dispatch (seniarAdit)"
              : "S2 — Planning Authority (seniarAdit)")}
        </div>
      </div>

      {/* ── Header ── */}
      <div className="page-header">
        <div className="header-badge">Exemption Portal</div>
        <h2 className="title">Registration Details</h2>
        <div className="title-underline" />
      </div>

      {/* ── Stage Progress Bar ── */}
      <div className="card stage-card">
        <StageBar status={user.approver_status} />
      </div>

      {/* ── Applicant Info ── */}
      <div className="card">
        <div className="section-header">
          <div className="section-icon"><Icon d={ICONS.person} size={15} /></div>
          <h3>Applicant Information</h3>
        </div>
        <div className="card-body">
          <InfoRow label="Full Name">{user.name}</InfoRow>
          <InfoRow label="Mobile">{user.mobile_no}</InfoRow>
          <InfoRow label="Email">{user.email}</InfoRow>
          <InfoRow label="Address">{user.address}</InfoRow>
          <InfoRow label="BA Number">{user.ba_number}</InfoRow>
          <InfoRow label="Status"><StatusBadge status={user.approver_status} /></InfoRow>
          {user.created_at && (
            <InfoRow label="Submitted On">
              {new Date(user.created_at).toLocaleString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
                
              })}
            </InfoRow>
          )}
        </div>
      </div>

      {/* ── Documents ── */}
      <div className="card">
        <div className="section-header">
          <div className="section-icon"><Icon d={ICONS.doc} size={15} /></div>
          <h3>Submitted Documents</h3>
        </div>
        <div className="card-body">
          <InfoRow label="Plan & Proceedings">
            <DocLink href={fileUrl(user.plan_proceedings_path)} label="View File" />
          </InfoRow>
          <InfoRow label="Request Letter">
            <DocLink href={fileUrl(user.request_letter_path)} label="View File" />
          </InfoRow>
          <InfoRow label="Land Document">
            <DocLink href={fileUrl(user.land_document_path)} label="View File" />
          </InfoRow>
          <InfoRow label="Advocate Stamp Paper">
            <DocLink href={fileUrl(user.advocate_document_path)} label="View File" />
          </InfoRow>
          {user.certificate_path && (
            <InfoRow label="Certificate">
              <DocLink href={fileUrl(user.certificate_path)} label="Download Certificate" />
            </InfoRow>
          )}
        </div>
      </div>

      {/* ── Review History (visible to S2 and S3) ── */}
      {(isSuperAdmin || isStaff) &&
        (user.remark_s1 || user.remark_s2 || user.approver_status.includes("s2")) && (
          <div className="card">
            <div className="section-header">
              <div className="section-icon"><Icon d={ICONS.user} size={15} /></div>
              <h3>Review History</h3>
            </div>
            <div className="card-body">
              <RemarkRow
                level="s1"
                remark={
                  user.remark_s1 +
                  (user.remark_s1_optional ? `\n\nAdditional: ${user.remark_s1_optional}` : "")
                }
                authorityId={user.s1_authority_id}
                checkedDate={user.s1_authority_checked_date}
              />

              <RemarkRow
                level="s2"
                remark={
                  user.remark_s2 +
                  (user.remark_s2_optional ? `\n\nAdditional: ${user.remark_s2_optional}` : "")
                }
                authorityId={user.s2_authority_id}
                checkedDate={user.s2_authority_checked_date}
                decision={
                  user.approver_status === "s2_approved"
                    ? "approved"
                    : user.approver_status === "s2_rejected"
                      ? "rejected"
                      : null
                }
              />
            </div>
          </div>
        )}

      {/* ════════════════════════════
          S1 ACTION — Engineer Remarks
      ════════════════════════════ */}
      {canActS1 && (
        <div className="card action-card action-s1">
          <div className="section-header">
            <div className="section-icon"><Icon d={ICONS.edit} size={15} /></div>
            <h3>S1 Review — Enter Remarks</h3>
          </div>
          <div className="card-body action-body">
            <p className="action-hint">
              Review the documents above, then enter your remarks. The application will move to S2 after submission.
            </p>
            <textarea
              className="remarks-textarea"
              placeholder="Enter your technical remarks and observations…"
              value={remarks}
              rows={5}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <textarea
              className="remarks-textarea"
              placeholder="Additional Remarks (Optional)"
              value={remarks2}
              rows={3}
              onChange={(e) => setRemarks2(e.target.value)}
            />
            <div className="char-count">{remarks.length} characters</div>

            {sendError && <p className="send-error">⚠ {sendError}</p>}
            {sendSuccess && <p className="send-success">{sendSuccess}</p>}

            <button className="send-btn" onClick={handleStage1} disabled={sending}>
              <Icon d={ICONS.send} size={13} />
              {sending ? "Submitting…" : "Submit Remarks & Forward to S2"}
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════
          S2 ACTION — Approve / Reject
      ════════════════════════════ */}
      {canActS2 && (
        <div className="card action-card action-s2">
          <div className="section-header">
            <div className="section-icon"><Icon d={ICONS.cert} size={15} /></div>
            <h3>S2 Decision — Approve or Reject</h3>
          </div>
          <div className="card-body action-body">
            <p className="action-hint">
              Review the S1 remarks and all documents, then make your final decision.
            </p>

            {/* Decision buttons */}
            <div className="decision-btn-group">
              <button
                className={`decision-btn approve-btn ${decision === "approved" ? "selected" : ""}`}
                onClick={() => setDecision("approved")}
              >
                <Icon d={ICONS.check} size={14} />
                Approve
              </button>
              <button
                className={`decision-btn reject-btn ${decision === "rejected" ? "selected" : ""}`}
                onClick={() => setDecision("rejected")}
              >
                <Icon d={ICONS.x} size={14} />
                Reject
              </button>
            </div>

            {decision && (
              <div className={`decision-indicator ${decision}`}>
                {decision === "approved"
                  ? "✔ You are approving this application. A certificate will be generated."
                  : "✖ You are rejecting this application. The applicant will be notified."}
              </div>
            )}

            <textarea
              className="remarks-textarea"
              placeholder="Enter your decision remarks…"
              value={remarks}
              rows={5}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <textarea
              className="remarks-textarea"
              placeholder="Additional Remarks (Optional)"
              value={remarks2}
              rows={3}
              onChange={(e) => setRemarks2(e.target.value)}
            />
            <div className="char-count">{remarks.length} characters</div>

            {sendError && <p className="send-error">⚠ {sendError}</p>}
            {sendSuccess && <p className="send-success">{sendSuccess}</p>}

            <button className="send-btn" onClick={handleStage2} disabled={sending}>
              <Icon d={ICONS.send} size={13} />
              {sending ? "Processing…" : "Submit Final Decision"}
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════
          S3 ACTION — Send Mail
      ════════════════════════════ */}
      {canActS3 && (
        <div className="card action-card action-s3">
          <div className="section-header">
            <div className="section-icon"><Icon d={ICONS.mail} size={15} /></div>
            <h3>S1 Dispatch — Send Certificate</h3>
          </div>
          <div className="card-body action-body">
            <p className="action-hint">
              This application has been <strong>approved by S2</strong>. The certificate is ready.
              Click below to email it to the applicant at <strong>{user.email}</strong>.
            </p>

            {user.certificate_path && (
              <div className="cert-preview">
                <Icon d={ICONS.cert} size={16} />
                Certificate ready — <a href={fileUrl(user.certificate_path)} target="_blank" rel="noreferrer">Preview PDF</a>
              </div>
            )}

            {sendError && <p className="send-error">⚠ {sendError}</p>}
            {sendSuccess && <p className="send-success">{sendSuccess}</p>}

            <button className="send-btn mail-btn" onClick={handleStage3} disabled={sending}>
              <Icon d={ICONS.mail} size={13} />
              {sending ? "Sending…" : "Send Certificate to Applicant"}
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════
          S1 REJECTION — Send rejection email
      ════════════════════════════ */}
      {isStaff && user.approver_status === "s2_rejected" && (
        <div className="card action-card action-rejection">
          <div className="section-header">
            <div className="section-icon"><Icon d={ICONS.mail} size={15} /></div>
            <h3>S1 Dispatch — Send Rejection Email</h3>
          </div>
          <div className="card-body action-body">
            <p className="action-hint">
              This application has been <strong>rejected by S2</strong>.
              Please inform the applicant at <strong>{user.email}</strong> with the rejection reason.
            </p>

            <textarea
              className="remarks-textarea"
              placeholder="Enter rejection reason (e.g., Documents are incomplete, Application does not meet criteria...)"
              value={rejectionReason}
              rows={5}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="char-count">{rejectionReason.length} characters</div>

            {sendError && <p className="send-error">⚠ {sendError}</p>}
            {sendSuccess && <p className="send-success">{sendSuccess}</p>}

            <button className="send-btn mail-btn reject" onClick={handleSendRejectionEmail} disabled={sending}>
              <Icon d={ICONS.mail} size={13} />
              {sending ? "Sending…" : "Send Rejection Email"}
            </button>
          </div>
        </div>
      )}

      {/* ── Already completed notice ── */}
      {user.approver_status === "completed" && (
        <div className="card completed-card">
          <div className="completed-body">
            <div className="completed-icon">✓</div>
            <h3>Process Completed</h3>
            <p>This application has been fully processed and the certificate has been dispatched to the applicant.</p>
          </div>
        </div>
      )}

      {!canActS1 && !canActS2 && !canActS3 && user.approver_status !== "completed" && (
        <div className="card waiting-card">
          <div className="waiting-body">

            {isStaff && user.remark_s1 && user.approver_status !== "s2_approved" && (
              <p>✔ You have submitted S1 remarks. Waiting for seniarAdit decision.</p>
            )}

            {isSuperAdmin && !user.remark_s1 && (
              <p>⏳ Waiting for ENGINEER to complete S1 review.</p>
            )}

            {isSuperAdmin && user.remark_s2 && (
              <p>✔ You have already submitted the decision.</p>
            )}

            {isStaff && user.approver_status !== "s2_approved" && user.remark_s1 && (
              <p>⏳ Waiting for seniarAdit approval before dispatch.</p>
            )}

          </div>
        </div>
      )}

      {/* ── Back button ── */}
      <div style={{ maxWidth: 680, margin: "16px auto 0", display: "flex", justifyContent: "flex-start" }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <Icon d={ICONS.arrowLeft} size={14} />
          Back to List
        </button>
      </div>

    </div>
  );
};

export default UserDetails;