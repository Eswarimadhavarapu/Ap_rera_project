// src/pages/scrutiny/project_extention_details.jsx

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import html2pdf from "html2pdf.js";
import "../../styles/scrutiny/project_extention_details.css";
import {
  BASE_URL,
  getProjectExtensionById,
  updateProjectExtension,
  sendProjectExtensionMail,
  apiGet
} from "../../api/api";

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────



const toDateStr = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d)
    ? iso
    : d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
};

const toDateStrLong = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d)
    ? iso
    : d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
};

const toDateTimeStr = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d)
    ? iso
    : d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
};

const pdfUrl = (path) => (path ? `${BASE_URL}${path}` : null);
const todayDate = () => new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────────────────
// District groups
// ─────────────────────────────────────────────────────────

const NORTH_DISTRICTS = [
  "Srikakulam", "Vizianagaram", "Visakhapatnam",
  "East Godavari", "West Godavari", "Krishna", "Guntur",
];
const SOUTH_DISTRICTS = [
  "Prakasam", "Sri Potti Sriramulu Nellore", "Y.S.R.",
  "Kurnool", "Anantapur", "Chittoor",
];

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const s = status ? status.trim().toUpperCase() : "UNKNOWN";
  const map = {
    PENDING: { cls: "ped-badge--pending", label: "Pending" },
    APPROVED: { cls: "ped-badge--approved", label: "Approved" },
    REJECTED: { cls: "ped-badge--rejected", label: "Rejected" },
    "UNDER-AD": { cls: "ped-badge--under-ad", label: "Under AD" },
    "UNDER-DD": { cls: "ped-badge--under-dd", label: "Under DD" },
    "UNDER-DIRECTOR": { cls: "ped-badge--under-director", label: "Under Director" },
    "UNDER-CHAIRMAN": { cls: "ped-badge--under-chairman", label: "Under Chairman" },
  };
  const cfg = map[s] || { cls: "ped-badge--unknown", label: s || "N/A" };
  return <span className={`ped-badge ${cfg.cls}`}>{cfg.label}</span>;
};

const DocLink = ({ label, path }) => {
  const url = pdfUrl(path);
  return (
    <div className="ped-doc-item">
      <span className="ped-doc-icon">📄</span>
      <span className="ped-doc-label">{label}</span>
      {url ? (
        <a className="ped-doc-btn" href={url} target="_blank" rel="noreferrer">
          View PDF
        </a>
      ) : (
        <span className="ped-doc-na">Not uploaded</span>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Generic Remarks Modal
// variant: "primary" | "danger"
// ─────────────────────────────────────────────────────────

const RemarksModal = ({
  title,
  placeholder,
  actionLabel,
  variant = "primary",
  onClose,
  onSubmit,
  submitting,
}) => {
  const [remarks, setRemarks] = useState("");
  return (
    <div className="ped-modal-overlay" onClick={onClose}>
      <div className="ped-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`ped-modal-header ped-modal-header--${variant}`}>
          <div className="ped-modal-title">
            <span className="ped-modal-icon">{variant === "danger" ? "🚫" : "📝"}</span>
            {title}
          </div>
          <button className="ped-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ped-modal-body">
          <label className="ped-modal-label">
            Remarks <span className="ped-required">*</span>
          </label>
          <textarea
            className="ped-modal-textarea"
            rows={5}
            placeholder={placeholder}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            autoFocus
          />
          {!remarks.trim() && (
            <p className="ped-modal-hint">Remarks cannot be empty.</p>
          )}
        </div>
        <div className="ped-modal-footer">
          <button className="ped-btn-cancel" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className={`ped-btn-submit ped-btn-submit--${variant}`}
            onClick={() => remarks.trim() && onSubmit(remarks.trim())}
            disabled={!remarks.trim() || submitting}
          >
            {submitting ? <><span className="ped-spinner-sm" /> Submitting…</> : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Certificate Preview Component (inline, for Chairman)
// ─────────────────────────────────────────────────────────

const CertificatePreview = ({ project }) => {
  if (!project) return null;
  return (
    <div className="ped-cert-paper" id="certificate-print">
      {/* HEADER */}
      <div className="ped-cert-header">
        <img src="/assets/images/logo.jpg" alt="AP RERA" className="ped-cert-logo" />
        <div className="ped-cert-title">
          CERTIFICATE FOR EXTENSION OF REGISTRATION OF PROJECT
        </div>
      </div>

      {/* DATE */}
      <div className="ped-cert-date-row">Dated: As per digital signature</div>

      <hr className="ped-cert-hr" />

      {/* REGISTRATION ROW */}
      <div className="ped-cert-reg-row">
        <p className="ped-cert-reg-text">
          This extension of registration is granted under section 6 of the Act,
          with project registration No.
        </p>
        <div className="ped-cert-reg-box">
          {(project.application_number || "").split("").map((v, i) => (
            <span key={i}>{v}</span>
          ))}
        </div>
      </div>

      <p className="ped-cert-para">
        The registration is granted under section 5 of the Act with registration
        period from <b>{toDateStrLong(project.validity_from)}</b> to{" "}
        <b>{toDateStrLong(project.validity_to)}</b>
      </p>

      <p className="ped-cert-para"><b>Project Name :</b> {project.project_name}</p>
      <p className="ped-cert-para"><b>Promoter Name :</b> {project.promoter_name}</p>
      <p className="ped-cert-para">
        <b>Project Address :</b> {project.project_address1}, {project.project_pincode}
      </p>

      {/* CONDITIONS */}
      <ol className="ped-cert-main-list">
        <li>
          <b>{project.promoter_name}</b>, having its registered office/principal
          place of business at H No. 6/254, 6<sup>th</sup> Block, 5<sup>th</sup> Floor,
          533342, Anaparthi(V), Anaparthi(M), East Godavari(D), has applied for
          extension of project registration.
        </li>
        <li>
          This renewal of registration is granted subject to the following
          conditions, namely:-
          <ol className="ped-cert-roman-list">
            <li>The promoter shall execute and register a conveyance deed in favour
              of the allottee or the association of the allottees, as the case may be,
              of the apartment or the common areas as per section 17.</li>
            <li>The promoter shall deposit seventy percent of the amounts realized
              by the promoter in a separate account to be maintained in a scheduled
              bank to cover the cost of construction and the land cost to be used
              only for that purpose as per sub-clause (D) of clause (1) of
              sub-section (2) of section 4.</li>
            <li>The registration shall be valid for a period of <b>one</b> year
              commencing from <b>{toDateStrLong(project.new_validity_from)}</b> and
              ending with <b>{toDateStrLong(project.new_validity_to)}</b> unless
              renewed by the Real Estate Regulatory Authority in accordance with
              section 6 read with rule 7 of the Act.</li>
            <li>The promoter shall comply with the provisions of the Act and the
              rules and regulations made thereunder.</li>
            <li>The promoter shall not contravene the provisions of any other law
              for the time being in force in the area where the project is being
              developed.</li>
            <li>If the above mentioned conditions are not fulfilled by the promoter,
              the regulatory authority may take necessary action against the promoter
              including revoking the registration granted herein, as per the Act and
              the rules and regulations made thereunder.</li>
          </ol>
        </li>
      </ol>

      {/* SIGNATURE */}
      <div className="ped-cert-sign">
        Signature of the Regulatory Authority<br />
        AP Real Estate Regulatory Authority
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Approve Modal — for Chairman
// Shows: remarks textarea + certificate preview + Generate/Send buttons
// ─────────────────────────────────────────────────────────

const ApproveModal = ({ data, onClose, onSubmit, submitting }) => {
  const [remarks, setRemarks] = useState("");
  const [certGenerated, setCertGenerated] = useState(false);
  const [certBlob, setCertBlob] = useState(null); // Blob of generated PDF

  const handleGenerate = async () => {
    const element = document.getElementById("certificate-print");
    if (!element) { alert("Certificate element not found"); return; }

    try {
      const pdfBlob = await html2pdf()
        .set({
          margin: 10,
          filename: "APRERA_Extension_Certificate.pdf",
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .outputPdf("blob");

      setCertBlob(pdfBlob);
      setCertGenerated(true);
    } catch (err) {
      console.error("Certificate generation error:", err);
      alert("Failed to generate certificate. Please try again.");
    }
  };

  const handleSend = () => {
    if (!remarks.trim()) { alert("Please enter remarks."); return; }
    if (!certGenerated) { alert("Please generate certificate first."); return; }
    onSubmit(remarks.trim(), certBlob);
  };

  return (
    <div className="ped-modal-overlay" onClick={onClose}>
      <div
        className="ped-modal ped-modal--wide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ped-modal-header ped-modal-header--approve">
          <div className="ped-modal-title">
            <span className="ped-modal-icon">✅</span>
            Approve Application &amp; Generate Certificate
          </div>
          <button className="ped-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="ped-modal-body ped-modal-body--scroll">

          {/* Remarks */}
          <label className="ped-modal-label">
            Remarks <span className="ped-required">*</span>
          </label>
          <textarea
            className="ped-modal-textarea"
            rows={3}
            placeholder="Enter approval remarks…"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            autoFocus
          />
          {!remarks.trim() && (
            <p className="ped-modal-hint">Remarks cannot be empty.</p>
          )}

          {/* Generate button */}
          <div className="ped-cert-generate-row">
            <button
              className="ped-btn-action ped-btn-action--generate"
              onClick={handleGenerate}
              disabled={submitting}
            >
              📜 Generate Certificate
            </button>
            {certGenerated && (
              <span className="ped-cert-generated-tag">✅ Certificate Ready</span>
            )}
          </div>

          {/* Certificate preview */}
          <div className="ped-cert-preview-wrap">
            <CertificatePreview project={data} />
          </div>
        </div>

        {/* Footer */}
        <div className="ped-modal-footer">
          <button className="ped-btn-cancel" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className="ped-btn-submit ped-btn-submit--approve"
            onClick={handleSend}
            disabled={!remarks.trim() || !certGenerated || submitting}
          >
            {submitting
              ? <><span className="ped-spinner-sm" /> Sending…</>
              : "📤 Send & Approve"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────

const ProjectExtentionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useAdmin();

  // ── State ──────────────────────────────────────────────
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [authorityMap, setAuthorityMap] = useState({});
  // modal values:
  //   "informAD"        → planning1 → Inform AD
  //   "informDD"        → planning2 → Inform DD
  //   "informDirector"  → AD / DD role → Inform Director
  //   "informChairman"  → director role → Inform Chairman
  //   "approve"         → chairman role → Approve (with certificate)
  //   "reject"          → AD / DD / director / chairman → Reject
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Log admin ──────────────────────────────────────────
  useEffect(() => {
    console.log(
      "%c[project_extention_details] 👤 Admin Context Loaded",
      "color: #6b804b; font-weight: bold;"
    );
    console.table({
      id: admin?.id ?? "N/A",
      name: admin?.name ?? "N/A",
      email: admin?.email ?? "N/A",
      role: admin?.role ?? "N/A",
    });
    console.log(
      `%c[project_extention_details] 🔑 Role: ${admin?.role ?? "N/A"}`,
      "color: #8b5cf6; font-weight: bold;"
    );
  }, [admin]);

  // ── Fetch detail ───────────────────────────────────────
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
      const json = await getProjectExtensionById(id);
      setData(json.data);
      } catch (err) {
        setError(err.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  useEffect(() => {

    const fetchAuthorities = async () => {

      if (!data) return;

      const ids = [
        data.planning_team_authority_id,
        data.ad_id,
        data.dd_id,
        data.director_id,
        data.chairman_id
      ].filter(Boolean);

      const uniqueIds = [...new Set(ids)];

      let map = {};

      for (let id of uniqueIds) {

        try {

        const json = await apiGet(`/api/userDetails/${id}`);

          if (json.success) {
            map[id] = json.admin;
          }

        } catch (err) {
          console.error(err);
        }

      }

      setAuthorityMap(map);

    };

    fetchAuthorities();

  }, [data]);

  // ── Role & button visibility ───────────────────────────
  const normalRole = (admin?.role ?? "").trim().toLowerCase();
  const appStatus = (data?.application_status || "").trim().toUpperCase();
  const district = (data?.project_district || "").trim();

  // planning1 → Inform AD
  const showInformAD = normalRole === "planning1";
  // planning2 → Inform DD
  const showInformDD = normalRole === "planning2";
  // AD role + under-AD + north district → Reject + Inform Director
  const showADButtons =
    normalRole === "ad" && appStatus === "UNDER-AD" && NORTH_DISTRICTS.includes(district);
  // DD role + under-DD + south district → Reject + Inform Director
  const showDDButtons =
    normalRole === "dd" && appStatus === "UNDER-DD" && SOUTH_DISTRICTS.includes(district);
  // director role + under-director → Reject + Inform Chairman
  const showDirectorButtons =
    normalRole === "director" && appStatus === "UNDER-DIRECTOR";
  // chairman role + under-chairman → Reject + Approve
  const showChairmanButtons =
    normalRole === "chairman" && appStatus === "UNDER-CHAIRMAN";

  console.log(
    `%c[project_extention_details] 🎛️ showInformAD:${showInformAD} | showInformDD:${showInformDD} | showADButtons:${showADButtons} | showDDButtons:${showDDButtons} | showDirectorButtons:${showDirectorButtons} | showChairmanButtons:${showChairmanButtons}`,
    "color: #f59e0b;"
  );

  // ── Toast helper ───────────────────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // ─────────────────────────────────────────────────────────
  // HANDLER 1 — planning1 → Inform AD
  // ─────────────────────────────────────────────────────────
  const handleInformAD = async (remarks) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("application_status", "under-AD");
    fd.append("planning_team", admin?.id ?? "");
    fd.append("planning_team_remarks", remarks);
    console.log("%c[ped] 🚀 Inform AD:", "color:#3b82f6;font-weight:bold;", { status: "under-AD", planning_team: admin?.id, remarks });
    try {
      const res = await fetch(`${BASE_URL}/api/project-extension/update/${id}`, { method: "PATCH", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      setModal(null);
      showToast("success", "Successfully informed AD");
      setData((prev) => ({ ...prev, application_status: "under-AD", planning_team: admin?.id, planning_team_remarks: remarks }));
    } catch (err) {
      showToast("error", err.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // HANDLER 2 — planning2 → Inform DD
  // ─────────────────────────────────────────────────────────
  const handleInformDD = async (remarks) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("application_status", "under-DD");
    fd.append("planning_team", admin?.id ?? "");
    fd.append("planning_team_remarks", remarks);
    console.log("%c[ped] 🚀 Inform DD:", "color:#1d4ed8;font-weight:bold;", { status: "under-DD", planning_team: admin?.id, remarks });
    try {
      const res = await fetch(`${BASE_URL}/api/project-extension/update/${id}`, { method: "PATCH", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      setModal(null);
      showToast("success", "Successfully informed DD");
      setData((prev) => ({ ...prev, application_status: "under-DD", planning_team: admin?.id, planning_team_remarks: remarks }));
    } catch (err) {
      showToast("error", err.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // HANDLER 3 — AD / DD role → Inform Director
  // ─────────────────────────────────────────────────────────
  const handleInformDirector = async (remarks) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("application_status", "under-director");
    fd.append("ad_or_dd_replay_date", todayDate());
    if (showADButtons) { fd.append("ad_id", admin?.id ?? ""); fd.append("ad_remarks", remarks); }
    else { fd.append("dd_id", admin?.id ?? ""); fd.append("dd_remarks", remarks); }
    console.log("%c[ped] 🚀 Inform Director:", "color:#3b82f6;font-weight:bold;", { status: "under-director", id: admin?.id, remarks, date: todayDate() });
    try {
      const res = await fetch(`${BASE_URL}/api/project-extension/update/${id}`, { method: "PATCH", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      setModal(null);
      showToast("success", "Successfully informed Director");
      setData((prev) => ({
        ...prev, application_status: "under-director", ad_or_dd_replay_date: todayDate(),
        ...(showADButtons ? { ad_id: admin?.id, ad_remarks: remarks } : { dd_id: admin?.id, dd_remarks: remarks }),
      }));
    } catch (err) {
      showToast("error", err.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // HANDLER 4 — AD / DD role → Reject
  // API1: update | API2: send-mail
  // ─────────────────────────────────────────────────────────
  const handleRejectADDD = async (remarks) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("application_status", "rejected");
    fd.append("shortfall_reason", remarks);
    fd.append("ad_or_dd_replay_date", todayDate());
    if (showADButtons) { fd.append("ad_id", admin?.id ?? ""); }
    else { fd.append("dd_id", admin?.id ?? ""); }
    console.log("%c[ped] 🚫 Reject (AD/DD):", "color:#ef4444;font-weight:bold;", { status: "rejected", id: admin?.id, remarks, date: todayDate() });
    try {
      const res1 = await fetch(`${BASE_URL}/api/project-extension/update/${id}`, { method: "PATCH", body: fd });
      const json1 = await res1.json();
      if (!res1.ok) throw new Error(json1.message || `HTTP ${res1.status}`);
      const mailPayload = {
        email: data?.promoter_email ?? "",
        subject: "Your Project Extension Application has been Rejected",
        body: `Dear Applicant,\n\nYour project extension application (ID: ${id}) for "${data?.project_name || ""}" has been rejected.\n\nReason: ${remarks}\n\nRegards,\nAP-RERA Team`,
      };
      const res2 = await fetch(`${BASE_URL}/api/project-extension/send-mail`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mailPayload) });
      const json2 = await res2.json();
      setModal(null);
      setData((prev) => ({
        ...prev, application_status: "rejected", shortfall_reason: remarks, ad_or_dd_replay_date: todayDate(),
        ...(showADButtons ? { ad_id: admin?.id } : { dd_id: admin?.id }),
      }));
      showToast(res2.ok ? "success" : "error", res2.ok ? "Application rejected and mail sent" : `Rejected but mail failed: ${json2.message}`);
    } catch (err) {
      showToast("error", err.message || "Reject failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // HANDLER 5 — director role → Inform Chairman
  // PATCH: application_status=under-chairman, director_id, director_remarks, director_replay_date
  // ─────────────────────────────────────────────────────────
  const handleInformChairman = async (remarks) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("application_status", "under-chairman");
    fd.append("director_id", admin?.id ?? "");
    fd.append("director_remarks", remarks);
    fd.append("director_replay_date", todayDate());
    console.log("%c[ped] 🚀 Inform Chairman:", "color:#0891b2;font-weight:bold;", { status: "under-chairman", director_id: admin?.id, remarks, date: todayDate() });
    try {
await updateProjectExtension(id, fd);
      setModal(null);
      showToast("success", "Successfully informed Chairman");
      setData((prev) => ({ ...prev, application_status: "under-chairman", director_id: admin?.id, director_remarks: remarks, director_replay_date: todayDate() }));
    } catch (err) {
      showToast("error", err.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // HANDLER 6 — director role → Reject
  // API1: update (director_id, shortfall_reason, director_replay_date)
  // API2: send-mail
  // ─────────────────────────────────────────────────────────
  const handleRejectDirector = async (remarks) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("application_status", "rejected");
    fd.append("director_id", admin?.id ?? "");
    fd.append("shortfall_reason", remarks);
    fd.append("director_replay_date", todayDate());
    console.log("%c[ped] 🚫 Reject (Director):", "color:#ef4444;font-weight:bold;", { status: "rejected", director_id: admin?.id, remarks, date: todayDate() });
    try {
      const res1 = await fetch(`${BASE_URL}/api/project-extension/update/${id}`, { method: "PATCH", body: fd });
      const json1 = await res1.json();
      if (!res1.ok) throw new Error(json1.message || `HTTP ${res1.status}`);
      const mailPayload = {
        email: data?.promoter_email ?? "",
        subject: "Your Project Extension Application has been Rejected",
        body: `Dear Applicant,\n\nYour project extension application (ID: ${id}) for "${data?.project_name || ""}" has been rejected.\n\nReason: ${remarks}\n\nRegards,\nAP-RERA Team`,
      };
      await sendProjectExtensionMail(mailPayload);
      setModal(null);
      setData((prev) => ({ ...prev, application_status: "rejected", director_id: admin?.id, shortfall_reason: remarks, director_replay_date: todayDate() }));
      showToast(res2.ok ? "success" : "error", res2.ok ? "Application rejected and mail sent" : `Rejected but mail failed: ${json2.message}`);
    } catch (err) {
      showToast("error", err.message || "Reject failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // HANDLER 7 — chairman role → Approve
  // API1: update (application_status=Approved, chairman_id, chairman_remarks,
  //               chairman_replay_date, certificate_path as file)
  // API2: send-mail with certificate
  // ─────────────────────────────────────────────────────────
  const handleApprove = async (remarks, certBlob) => {
    setSubmitting(true);
    console.log("%c[ped] ✅ Approve (Chairman):", "color:#16a34a;font-weight:bold;", { status: "Approved", chairman_id: admin?.id, remarks, date: todayDate() });
    try {
      // Convert blob to File for FormData
      const certFile = new File([certBlob], "APRERA_Extension_Certificate.pdf", { type: "application/pdf" });
      const fd = new FormData();
      fd.append("application_status", "Approved");
      fd.append("chairman_id", admin?.id ?? "");
      fd.append("chairman_remarks", remarks);
      fd.append("chairman_replay_date", todayDate());
      fd.append("certificate_path", certFile);

      const res1 = await fetch(`${BASE_URL}/api/project-extension/update/${id}`, { method: "PATCH", body: fd });
      const json1 = await res1.json();
      if (!res1.ok) throw new Error(json1.message || `HTTP ${res1.status}`);

      // API2: send mail with certificate as base64 attachment
      const base64Cert = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = () => reject(new Error("File read failed"));
        reader.readAsDataURL(certBlob);
      });

      const mailPayload = {
        email: data?.promoter_email ?? "",
        subject: "Your Project Extension Application has been Approved",
        body: `Dear Applicant,\n\nCongratulations! Your project extension application (ID: ${id}) for "${data?.project_name || ""}" has been approved.\n\nRemarks: ${remarks}\n\nPlease find the extension certificate attached.\n\nRegards,\nAP-RERA Team`,
        attachment: base64Cert,
        filename: "APRERA_Extension_Certificate.pdf",
      };

      const res2 = await fetch(`${BASE_URL}/api/project-extension/send-mail`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mailPayload) });
      const json2 = await res2.json();

      setModal(null);
      setData((prev) => ({ ...prev, application_status: "Approved", chairman_id: admin?.id, chairman_remarks: remarks, chairman_replay_date: todayDate() }));
      showToast(res2.ok ? "success" : "error", res2.ok ? "Application approved and certificate sent to promoter" : `Approved but mail failed: ${json2.message}`);
    } catch (err) {
      console.error("[ped] Approve Error:", err);
      showToast("error", err.message || "Approve failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // HANDLER 8 — chairman role → Reject
  // API1: update | API2: send-mail
  // ─────────────────────────────────────────────────────────
  const handleRejectChairman = async (remarks) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("application_status", "rejected");
    fd.append("chairman_id", admin?.id ?? "");
    fd.append("shortfall_reason", remarks);
    fd.append("chairman_remarks", remarks);
    fd.append("chairman_replay_date", todayDate());
    console.log("%c[ped] 🚫 Reject (Chairman):", "color:#ef4444;font-weight:bold;", { status: "rejected", chairman_id: admin?.id, remarks, date: todayDate() });
    try {
      const res1 = await fetch(`${BASE_URL}/api/project-extension/update/${id}`, { method: "PATCH", body: fd });
      const json1 = await res1.json();
      if (!res1.ok) throw new Error(json1.message || `HTTP ${res1.status}`);
      const mailPayload = {
        email: data?.promoter_email ?? "",
        subject: "Your Project Extension Application has been Rejected",
        body: `Dear Applicant,\n\nYour project extension application (ID: ${id}) for "${data?.project_name || ""}" has been rejected.\n\nReason: ${remarks}\n\nRegards,\nAP-RERA Team`,
      };
      const res2 = await fetch(`${BASE_URL}/api/project-extension/send-mail`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mailPayload) });
      const json2 = await res2.json();
      setModal(null);
      setData((prev) => ({ ...prev, application_status: "rejected", chairman_id: admin?.id, shortfall_reason: remarks, chairman_remarks: remarks, chairman_replay_date: todayDate() }));
      showToast(res2.ok ? "success" : "error", res2.ok ? "Application rejected and mail sent" : `Rejected but mail failed: ${json2.message}`);
    } catch (err) {
      showToast("error", err.message || "Reject failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reject dispatcher — calls the right handler based on active role ─────────
  const handleReject = (remarks) => {
    if (showADButtons || showDDButtons) return handleRejectADDD(remarks);
    if (showDirectorButtons) return handleRejectDirector(remarks);
    if (showChairmanButtons) return handleRejectChairman(remarks);
  };

  // ── Render States ──────────────────────────────────────
  if (loading) {
    return (
      <div className="ped-root">
        <div className="ped-loading-screen">
          <div className="ped-loading-ring" />
          <p>Loading application details…</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="ped-root">
        <div className="ped-error-screen">
          <span className="ped-error-icon">⚠️</span>
          <p>{error}</p>
          <button className="ped-btn-back" onClick={() => navigate(-1)}>← Back to List</button>
        </div>
      </div>
    );
  }
  if (!data) return null;

  // ── Main Render ────────────────────────────────────────
  return (
    <div className="ped-root">

      {/* ── Toast ── */}
      {toast && (
        <div className={`ped-toast ped-toast--${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="ped-page-header__left">
        <h1 className="ped-page-header__title">Project Details For Extension</h1>
      </div>

      {/* ── Content Grid ── */}
      <div className="ped-content-grid">

        {/* Main info table */}
        <div className="ped-single-table-card">
          <div className="ped-single-table-header">🏗️ Project Extension Details</div>
          <table className="ped-single-table">
            <tbody>
              <tr>
                <th>Project ID</th><td>{data.project_id || "—"}</td>
                <th>Payment Status</th><td>{data.payment_status || "—"}</td>
              </tr>
              <tr>
                <th>Project Name</th><td>{data.project_name || "—"}</td>
                <th>Payment Amount</th><td>{data.payment_amount ? `₹ ${data.payment_amount}` : "—"}</td>
              </tr>
              <tr>
                <th>Project District</th><td>{data.project_district || "—"}</td>
                <th>Payment Mode</th><td>{data.payment_mode || "—"}</td>
              </tr>
              <tr>
                <th>Promoter Email</th><td>{data.promoter_email || "—"}</td>
                <th>Payment Date</th><td>{toDateTimeStr(data.payment_date)}</td>
              </tr>
              <tr>
                <th>Promoter PAN</th><td>{data.promoter_pan_number || "—"}</td>
                <th>Transaction ID</th><td>{data.transaction_id || "—"}</td>
              </tr>
              <tr>
                <th>Current Validity From</th><td>{toDateStr(data.validity_from)}</td>
                <th>Payment Ref No</th><td>{data.payment_reference_no || "—"}</td>
              </tr>
              <tr>
                <th>Current Validity To</th><td>{toDateStr(data.validity_to)}</td>
                <th>Gateway Response</th><td>{data.gateway_response || "—"}</td>
              </tr>
              <tr>
                <th>New Validity From</th><td>{toDateStr(data.new_validity_from)}</td>
                <th>Bank Name</th><td>{data.bank_name || "—"}</td>
              </tr>
              <tr>
                <th>New Validity To</th><td>{toDateStr(data.new_validity_to)}</td>
                <th>Application Status</th><td><StatusBadge status={data.application_status} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Uploaded Documents */}
        <div className="ped-card ped-card--anim ped-card--full" style={{ animationDelay: "0.32s" }}>
          <div className="ped-card__header">
            <span className="ped-card__icon">📁</span> Uploaded Documents
          </div>
          <div className="ped-card__body ped-docs-grid">
            <DocLink label="Form 1" path={data.form_1} />
            <DocLink label="Form 2" path={data.form_2} />
            <DocLink label="Form 3" path={data.form_3} />
            <DocLink label="Form B" path={data.form_b} />
            <DocLink label="Form E" path={data.form_e} />
            <DocLink label="Form P4" path={data.form_p4} />
            <DocLink label="Consent Letter" path={data.consent_letter} />
            <DocLink label="Representation Letter" path={data.representation_letter} />
            <DocLink label="Extension Proceeding" path={data.extension_proceeding} />
            <DocLink label="Certificate" path={data.certificate_path} />
            <DocLink label="Receipt" path={data.receipt_path} />
          </div>
        </div>

      </div>
      {appStatus !== "PENDING" && (

        <div className="ped-card ped-card--full">

          <div className="ped-card__header">
            📋 Authority Remarks
          </div>

          <div className="ped-card__body">

            <table className="ped-single-table">

              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Authority Name</th>
                  <th>Remarks</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {/* Planning Team */}

                <tr>
                  <td>1</td>

                  <td>
                    {authorityMap[data.planning_team_authority_id]
                      ? `${authorityMap[data.planning_team_authority_id].full_name}
                 (${authorityMap[data.planning_team_authority_id].department})`
                      : data.planning_team_authority_id || "-"}
                  </td>

                  <td>{data.planning_team_remarks || "-"}</td>

                  <td>
                    {data.dd_id ? "under-DD" : "under-AD"}
                  </td>
                </tr>

                {/* AD/DD */}

                {(appStatus === "UNDER-DIRECTOR" ||
                  appStatus === "UNDER-CHAIRMAN" ||
                  appStatus === "APPROVED" ||
                  appStatus === "REJECTED") && (

                    <tr>
                      <td>2</td>

                      <td>

                        {data.ad_id
                          ? (
                            authorityMap[data.ad_id]
                              ? `${authorityMap[data.ad_id].full_name}
                       (${authorityMap[data.ad_id].department})`
                              : data.ad_id
                          )
                          : (
                            authorityMap[data.dd_id]
                              ? `${authorityMap[data.dd_id].full_name}
                       (${authorityMap[data.dd_id].department})`
                              : data.dd_id
                          )}

                      </td>

                      <td>
                        {data.ad_remarks ||
                          data.dd_remarks ||
                          "-"}
                      </td>

                      <td>under-director</td>

                    </tr>

                  )}

                {/* Director */}

                {(appStatus === "UNDER-CHAIRMAN" ||
                  appStatus === "APPROVED" ||
                  appStatus === "REJECTED") && (

                    <tr>

                      <td>3</td>

                      <td>

                        {authorityMap[data.director_id]
                          ? `${authorityMap[data.director_id].full_name}
                   (${authorityMap[data.director_id].department})`
                          : data.director_id || "-"}

                      </td>

                      <td>{data.director_remarks || "-"}</td>

                      <td>under-chairman</td>

                    </tr>

                  )}

                {/* Chairman */}

                {(appStatus === "APPROVED" ||
                  appStatus === "REJECTED") && (

                    <tr>

                      <td>4</td>

                      <td>

                        {authorityMap[data.chairman_id]
                          ? `${authorityMap[data.chairman_id].full_name}
                   (${authorityMap[data.chairman_id].department})`
                          : data.chairman_id || "-"}

                      </td>

                      <td>{data.chairman_remarks || "-"}</td>

                      <td>{appStatus}</td>

                    </tr>

                  )}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* ── Bottom Action Bar ── */}
      <div className="ped-action-bar">
        <div className="ped-action-bar__left">
          <button className="ped-btn-back" onClick={() => navigate(-1)}>← Back to List</button>
        </div>

        <div className="ped-action-bar__right">

          {/* planning1 → Inform AD */}
          {showInformAD && (
            <button className="ped-btn-action ped-btn-action--ad" onClick={() => setModal("informAD")}>
              🔔 Inform AD
            </button>
          )}

          {/* planning2 → Inform DD */}
          {showInformDD && (
            <button className="ped-btn-action ped-btn-action--dd" onClick={() => setModal("informDD")}>
              🔔 Inform DD
            </button>
          )}

          {/* AD / DD role → Reject + Inform Director */}
          {(showADButtons || showDDButtons) && (
            <>
              <button className="ped-btn-action ped-btn-action--reject" onClick={() => setModal("reject")}>
                🚫 Reject
              </button>
              <button className="ped-btn-action ped-btn-action--director" onClick={() => setModal("informDirector")}>
                🔔 Inform Director
              </button>
            </>
          )}

          {/* director role → Reject + Inform Chairman */}
          {showDirectorButtons && (
            <>
              <button className="ped-btn-action ped-btn-action--reject" onClick={() => setModal("reject")}>
                🚫 Reject
              </button>
              <button className="ped-btn-action ped-btn-action--chairman" onClick={() => setModal("informChairman")}>
                🔔 Inform Chairman
              </button>
            </>
          )}

          {/* chairman role → Reject + Approve */}
          {showChairmanButtons && (
            <>
              <button className="ped-btn-action ped-btn-action--reject" onClick={() => setModal("reject")}>
                🚫 Reject
              </button>
              <button className="ped-btn-action ped-btn-action--approve" onClick={() => setModal("approve")}>
                ✅ Approve
              </button>
            </>
          )}

        </div>
      </div>

      {/* ── Modals ── */}

      {modal === "informAD" && (
        <RemarksModal
          title="Inform AD" placeholder="Enter your remarks before informing AD…"
          actionLabel="Inform AD" variant="primary"
          onClose={() => setModal(null)} onSubmit={handleInformAD} submitting={submitting}
        />
      )}

      {modal === "informDD" && (
        <RemarksModal
          title="Inform DD" placeholder="Enter your remarks before informing DD…"
          actionLabel="Inform DD" variant="primary"
          onClose={() => setModal(null)} onSubmit={handleInformDD} submitting={submitting}
        />
      )}

      {modal === "informDirector" && (
        <RemarksModal
          title={`Inform Director (via ${showADButtons ? "AD" : "DD"})`}
          placeholder="Enter your remarks before informing the Director…"
          actionLabel="Inform Director" variant="primary"
          onClose={() => setModal(null)} onSubmit={handleInformDirector} submitting={submitting}
        />
      )}

      {modal === "informChairman" && (
        <RemarksModal
          title="Inform Chairman"
          placeholder="Enter your remarks before informing the Chairman…"
          actionLabel="Inform Chairman" variant="primary"
          onClose={() => setModal(null)} onSubmit={handleInformChairman} submitting={submitting}
        />
      )}

      {modal === "approve" && (
        <ApproveModal
          data={data}
          onClose={() => setModal(null)}
          onSubmit={handleApprove}
          submitting={submitting}
        />
      )}

      {modal === "reject" && (
        <RemarksModal
          title="Reject Application"
          placeholder="Enter reason for rejection. This will be mailed to the promoter…"
          actionLabel="Confirm Reject" variant="danger"
          onClose={() => setModal(null)} onSubmit={handleReject} submitting={submitting}
        />
      )}

    </div>
  );
};

export default ProjectExtentionDetails;