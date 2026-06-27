// src/pages/RTI/RTI_Details_Page.jsx

import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { BASE_URL } from "../../api/api";

import {
  getRTIById,
  sendReturnApplication,
  createRTIAssignment,
  informAPIORTI,
  updateRTI,
  updateRTIAssignment,
} from "../../api/api";
import "../../styles/RTI/RTI_Details_Page.css";

// ─── constants ────────────────────────────────────────────────────────────────



const DEPARTMENTS = [
  "Audit", "Legal", "Planning", "IT",
  "Verification", "DD", "Engineer",
];

// Roles that can see the Reply button on their assigned rows
const DEPT_REPLY_ROLES = ["AUDIT", "IT", "LEGAL", "PLANNING", "VERIFICATION", "Engineer"];

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return "—"; }
};

const getDocUrl = (path) => {
  if (!path) return null;
  const filename = path.split("/").pop();
  const encoded = encodeURIComponent(filename);
  const url = `${BASE_URL}/api/rti/document/${encoded}`;
  console.log("DOC URL =>", url);
  return url;
};
const openDoc = async (path) => {
  const url = getDocUrl(path);

  const token = localStorage.getItem("token");

  console.log("TOKEN =>", token);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("STATUS =>", response.status);

  if (!response.ok) {
    alert(`Error : ${response.status}`);
    return;
  }

  const blob = await response.blob();
  const fileURL = URL.createObjectURL(blob);

  window.open(fileURL, "_blank");
};

const STATUS_BADGE = {
  SUBMITTED: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  REPLIED: { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
  PENDING: { bg: "#fffbeb", color: "#b45309", border: "#fcd34d" },
  RETURN: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  ASSIGNED: { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
  UNDER_PROCESS_APIO: { bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
  UNDER_PROCESS_PIO: { bg: "#ecfdf5", color: "#065f46", border: "#6ee7b7" },
  UNDER_PROCESS_DD: { bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
  DEFAULT: { bg: "#f8fafc", color: "#475569", border: "#cbd5e1" },
};

const getStatusStyle = (s) =>
  STATUS_BADGE[(s || "").toUpperCase()] || STATUS_BADGE.DEFAULT;

// ─── SVG icons ────────────────────────────────────────────────────────────────

const Ic = {
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  Info: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  Paperclip: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  ),
  Reply: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  RotateCCW: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
    </svg>
  ),
  UserCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M17 11l2 2 4-4" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  X: ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" width={size} height={size}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" width="15" height="15">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Upload: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  ),
  ExternalLink: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
};

// ─── Field Row ────────────────────────────────────────────────────────────────

const Field = ({ label, value }) => (
  <div className="RTI_Details_Page__fieldRow">
    <span className="RTI_Details_Page__fieldLabel">{label}</span>
    <span className={`RTI_Details_Page__fieldValue${!value ? " RTI_Details_Page__fieldValue--muted" : ""}`}>
      {value || "—"}
    </span>
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────

const Section = ({ icon: IconComp, title, iconBg, iconColor, children }) => (
  <div className="RTI_Details_Page__card">
    <div className="RTI_Details_Page__cardHeader">
      <div className="RTI_Details_Page__cardIcon" style={{ background: iconBg, color: iconColor }}>
        <IconComp />
      </div>
      <h3 className="RTI_Details_Page__cardTitle">{title}</h3>
    </div>
    {children}
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ msg }) =>
  msg ? (
    <div className={`RTI_Details_Page__toast RTI_Details_Page__toast--${msg.type}`}>
      {msg.type === "success" ? "✅" : "⚠"} {msg.text}
    </div>
  ) : null;

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export default function RTI_Details_Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin } = useAdmin();

  const applicationId = location.state?.application_id;

  // ── data state ───────────────────────────────────────────────────────────
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Return modal ─────────────────────────────────────────────────────────
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnComment, setReturnComment] = useState("");
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnMsg, setReturnMsg] = useState(null);

  // ── Assign modal ─────────────────────────────────────────────────────────
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignComment, setAssignComment] = useState("");
  const [assignDept, setAssignDept] = useState("");
  const [assignFile, setAssignFile] = useState(null);
  const [assignRows, setAssignRows] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignMsg, setAssignMsg] = useState(null);
  const assignFileRef = useRef(null);

  // ── APIO modal ───────────────────────────────────────────────────────────
  // Each doc row: { id, docName, file }
  const [showAPIORModal, setShowAPIORModal] = useState(false);
  const [apioComment, setApioComment] = useState("");
  const [apioDocRows, setApioDocRows] = useState([{ id: Date.now(), docName: "", file: null }]);
  const [apioLoading, setApioLoading] = useState(false);
  const [apioMsg, setApioMsg] = useState(null);

  // ── Reply modal (for dept roles: Audit/IT/Legal/Planning/Verification/Engineering) ──
  // replyTargetRow = the assignment row being replied to { id, assigned_department }
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyTargetRow, setReplyTargetRow] = useState(null);
  const [replyComment, setReplyComment] = useState("");
  const [replyDocRows, setReplyDocRows] = useState([{ id: Date.now(), docName: "", file: null }]);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyMsg, setReplyMsg] = useState(null);
  const [userMap, setUserMap] = useState({});
  // ── log admin ────────────────────────────────────────────────────────────
  useEffect(() => {
    console.log("%c👤 RTI_Details_Page — Admin context", "color:#4a90d9;font-weight:bold;");
    console.table(admin);
    console.log("🔑 Role :", admin?.role ?? "N/A");
    console.log("🪪 ID   :", admin?.id ?? "N/A");
    console.log("📧 Email:", admin?.email ?? "N/A");
  }, [admin]);

  // ── fetch data ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!applicationId) {
      setError("No application ID provided");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        console.log(`%c📡 RTI_Details_Page — fetch id=${applicationId}`, "color:#888;");

        const res = await getRTIById(applicationId);

        console.log("%c✅ RTI_Details_Page — response", "color:green;", res);

        const responseData = res.data || res;

        setData(responseData);

        // ===== fetch user names =====
        const map = {};

        const repliedIds = [
          ...new Set(
            (responseData.department_assignments || [])
              .map((a) => a.replied_by_id)
              .filter(Boolean)
          ),
        ];

        await Promise.all(
          repliedIds.map(async (id) => {
            try {
              const res = await fetch(`${BASE_URL}/api/userDetails/${id}`);
              const json = await res.json();

              if (json.success) {
                map[id] = json.admin;
              }
            } catch (err) {
              console.error("User fetch error:", err);
            }
          })
        );

        setUserMap(map);

      } catch (err) {
        console.error("❌ RTI_Details_Page — error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [applicationId]);
  // ── derived ──────────────────────────────────────────────────────────────
  const role = (admin?.role || "").toUpperCase();
  const status = (data?.status || "").toUpperCase();
  const showRTIActions = role === "RTI" && status === "SUBMITTED";
  const showDeptReplyBtn = DEPT_REPLY_ROLES.includes(role); // show Reply btn in assignment row
  const showReview = status !== "SUBMITTED";

  const usedDepts = assignRows.map((r) => r.dept);
  const availDepts = DEPARTMENTS.filter((d) => !usedDepts.includes(d));

  // ── helper: reset & close ─────────────────────────────────────────────────
  const closeReturn = () => { setShowReturnModal(false); setReturnComment(""); setReturnMsg(null); };
  const closeAssign = () => { setShowAssignModal(false); setAssignRows([]); setAssignDept(""); setAssignComment(""); setAssignFile(null); setAssignMsg(null); };
  const closeAPIO = () => {
    setShowAPIORModal(false);
    setApioComment("");
    setApioDocRows([{ id: Date.now(), docName: "", file: null }]);
    setApioMsg(null);
  };
  const closeReply = () => {
    setShowReplyModal(false);
    setReplyTargetRow(null);
    setReplyComment("");
    setReplyDocRows([{ id: Date.now(), docName: "", file: null }]);
    setReplyMsg(null);
  };

  // ═══════════════════════════════════════════════════════════════════════
  // HANDLER — RETURN
  // ═══════════════════════════════════════════════════════════════════════
  const handleReturn = async () => {
    if (!returnComment.trim()) {
      setReturnMsg({ type: "error", text: "Reply comment is required." });
      return;
    }
    setReturnLoading(true);
    setReturnMsg(null);
    try {
      console.log(`%c📤 RTI_Details_Page — RETURN id=${applicationId}`, "color:#c2410c;");
      const fd = new FormData();
      fd.append("email", data?.email_id || "");
      fd.append("rti_replaid_person_id", String(admin?.id || ""));
      fd.append("status", "RETURN");
      fd.append("reply_comment", returnComment);
      await sendReturnApplication(applicationId, fd);
      console.log("%c✅ Return submitted", "color:green;");
      setReturnMsg({ type: "success", text: "Application returned successfully." });
      setTimeout(() => { closeReturn(); navigate(-1); }, 1800);
    } catch (err) {
      console.error("❌ Return error:", err.message);
      setReturnMsg({ type: "error", text: err.message });
    } finally { setReturnLoading(false); }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // HANDLER — ASSIGN: add row
  // ═══════════════════════════════════════════════════════════════════════
  const handleAssignAdd = () => {
    if (!assignDept) {
      setAssignMsg({ type: "error", text: "Please select a department." });
      return;
    }
    if (!assignComment.trim()) {
      setAssignMsg({ type: "error", text: "Please enter comments." });
      return;
    }
    setAssignRows((prev) => [
      ...prev,
      { dept: assignDept, comment: assignComment, file: assignFile, fileName: assignFile?.name || null },
    ]);
    setAssignDept("");
    setAssignComment("");
    setAssignFile(null);
    if (assignFileRef.current) assignFileRef.current.value = "";
    setAssignMsg(null);
    console.log(`%c➕ RTI_Details_Page — assign row added dept=${assignDept}`, "color:#1d4ed8;");
  };

  // ═══════════════════════════════════════════════════════════════════════
  // HANDLER — ASSIGN: submit
  //   Step 1 → POST assignment rows  (createRTIAssignment)
  //   Step 2 → PATCH status = ASSIGNED  (updateRTI)
  // ═══════════════════════════════════════════════════════════════════════
  const handleAssignSubmit = async () => {
    if (assignRows.length === 0) {
      setAssignMsg({ type: "error", text: "Add at least one department before submitting." });
      return;
    }
    setAssignLoading(true);
    setAssignMsg(null);
    try {
      // ── Step 1: create assignment records ────────────────────────────
      console.log(`%c📤 RTI_Details_Page — ASSIGN rows=${assignRows.length}`, "color:#1d4ed8;");
      const fd = new FormData();
      assignRows.forEach((row, i) => {
        fd.append(`assignments[${i}][rti_application_id]`, String(applicationId));
        fd.append(`assignments[${i}][assigned_department]`, row.dept);
        fd.append(`assignments[${i}][assigned_by_id]`, String(admin?.id || ""));
        fd.append(`assignments[${i}][rti_comments]`, row.comment);
        if (row.file) fd.append(`assignments[${i}][rti_document]`, row.file);
      });
      await createRTIAssignment(fd);
      console.log("%c✅ Assignments created", "color:green;");

      // ── Step 2: update application status → ASSIGNED ─────────────────
      console.log(`%c📤 RTI_Details_Page — UPDATE status=ASSIGNED id=${applicationId}`, "color:#6d28d9;");
      const statusFd = new FormData();
      statusFd.append("status", "ASSIGNED");
      await updateRTI(applicationId, statusFd);
      console.log("%c✅ Status updated to ASSIGNED", "color:green;");

      setAssignMsg({ type: "success", text: "Departments assigned and status updated successfully." });
      setTimeout(() => { closeAssign(); navigate(0); }, 1800);
    } catch (err) {
      console.error("❌ Assign error:", err.message);
      setAssignMsg({ type: "error", text: err.message });
    } finally { setAssignLoading(false); }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // HANDLER — APIO: manage doc rows
  // ═══════════════════════════════════════════════════════════════════════
  const addApioRow = () => {
    setApioDocRows((prev) => [...prev, { id: Date.now(), docName: "", file: null }]);
    console.log("%c➕ RTI_Details_Page — APIO doc row added", "color:#7e22ce;");
  };

  const removeApioRow = (id) => {
    if (apioDocRows.length === 1) return; // keep at least one
    setApioDocRows((prev) => prev.filter((r) => r.id !== id));
    console.log(`%c🗑 RTI_Details_Page — APIO doc row removed id=${id}`, "color:#7e22ce;");
  };

  const updateApioRow = (id, field, value) => {
    setApioDocRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // HANDLER — APIO: submit
  //   Sends parallel arrays:
  //     reply_document_name[]  (text)
  //     reply_document[]       (file)
  // ═══════════════════════════════════════════════════════════════════════
  const handleApioSubmit = async () => {
    // validate comment
    if (!apioComment.trim()) {
      setApioMsg({ type: "error", text: "Comments field is required." });
      return;
    }
    // validate each doc row
    for (let i = 0; i < apioDocRows.length; i++) {
      const r = apioDocRows[i];
      if (!r.docName.trim()) {
        setApioMsg({ type: "error", text: `Document name is required for row ${i + 1}.` });
        return;
      }
      if (!r.file) {
        setApioMsg({ type: "error", text: `Please upload a file for row ${i + 1}.` });
        return;
      }
    }

    setApioLoading(true);
    setApioMsg(null);

    try {
      console.log(`%c📤 RTI_Details_Page — APIO inform id=${applicationId} docs=${apioDocRows.length}`, "color:#7e22ce;");

      const fd = new FormData();

      // ── basic fields ──────────────────────────────────────────────────
      fd.append("rti_replaid_person_id", String(admin?.id || ""));
      fd.append("status", "under_process_APIO");
      fd.append("reply_comment", apioComment.trim());
      fd.append("replied_rti_date", new Date().toISOString());
      fd.append("application_coming_to_apio_date", "true"); // triggers date on backend

      // ── parallel arrays for multiple docs ────────────────────────────
      // Backend reads:
      //   request.files.getlist("reply_document")
      //   request.form.getlist("reply_document_name")
      apioDocRows.forEach((row) => {
        fd.append("reply_document_name", row.docName.trim());
        fd.append("reply_document", row.file);
      });

      console.log("%c📋 RTI_Details_Page — APIO FormData keys:", "color:#7e22ce;");
      for (const [k, v] of fd.entries()) {
        console.log(`   ${k} →`, v instanceof File ? `FILE: ${v.name}` : v);
      }

      await informAPIORTI(applicationId, fd);
      console.log("%c✅ APIO informed", "color:green;");

      setApioMsg({ type: "success", text: "APIO informed successfully. Status updated." });
      setTimeout(() => { closeAPIO(); navigate(0); }, 1800);
    } catch (err) {
      console.error("❌ APIO error:", err.message);
      setApioMsg({ type: "error", text: err.message });
    } finally { setApioLoading(false); }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // HANDLER — DEPT REPLY: open modal for a specific assignment row
  // ═══════════════════════════════════════════════════════════════════════
  const openReplyModal = (assignmentRow) => {
    console.log(`%c🔔 RTI_Details_Page — openReply assignment_id=${assignmentRow.id} dept=${assignmentRow.assigned_department}`, "color:#15803d;");
    setReplyTargetRow(assignmentRow);
    setReplyComment("");
    setReplyDocRows([{ id: Date.now(), docName: "", file: null }]);
    setReplyMsg(null);
    setShowReplyModal(true);
  };

  // manage reply doc rows
  const addReplyDocRow = () => {
    setReplyDocRows((prev) => [...prev, { id: Date.now(), docName: "", file: null }]);
  };
  const removeReplyDocRow = (id) => {
    if (replyDocRows.length === 1) return;
    setReplyDocRows((prev) => prev.filter((r) => r.id !== id));
  };
  const updateReplyDocRow = (id, field, value) => {
    setReplyDocRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // HANDLER — DEPT REPLY: submit
  //   API: PATCH /api/rti/assignment/update/:assignment_id
  //   form-data:
  //     assignment_status  = "replaid"
  //     reply_comments     = (user text)
  //     replied_by_id      = admin.id
  //     reply_document     = file  (one per row — backend takes first or all)
  // ═══════════════════════════════════════════════════════════════════════
  const handleReplySubmit = async () => {
    if (!replyComment.trim()) {
      setReplyMsg({ type: "error", text: "Comments field is required." });
      return;
    }
    for (let i = 0; i < replyDocRows.length; i++) {
      const r = replyDocRows[i];
      if (!r.docName.trim()) {
        setReplyMsg({ type: "error", text: `Document name is required for row ${i + 1}.` });
        return;
      }
      if (!r.file) {
        setReplyMsg({ type: "error", text: `Please upload a file for row ${i + 1}.` });
        return;
      }
    }

    setReplyLoading(true);
    setReplyMsg(null);

    try {
      const assignmentId = replyTargetRow?.assignment_id;
      console.log(`%c📤 RTI_Details_Page — DEPT REPLY assignment_id=${assignmentId}`, "color:#15803d;");

      const fd = new FormData();
      fd.append("assignment_status", "replaid");
      fd.append("reply_comments", replyComment.trim());
      fd.append("replied_by_id", String(admin?.id || ""));

      // Send each file with its document name as parallel arrays
      // Backend reads reply_document (file) — send all files
      replyDocRows.forEach((row) => {
        fd.append("reply_document_name", row.docName.trim());
        fd.append("reply_document", row.file);
      });

      console.log("%c📋 RTI_Details_Page — Reply FormData:", "color:#15803d;");
      for (const [k, v] of fd.entries()) {
        console.log(`   ${k} →`, v instanceof File ? `FILE: ${v.name}` : v);
      }

      await updateRTIAssignment(assignmentId, fd);
      console.log("%c✅ Department reply submitted", "color:green;");

      setReplyMsg({ type: "success", text: "Reply submitted successfully." });
      setTimeout(() => { closeReply(); navigate(0); }, 1800);
    } catch (err) {
      console.error("❌ Reply error:", err.message);
      setReplyMsg({ type: "error", text: err.message });
    } finally { setReplyLoading(false); }
  };

  if (loading) return (
    <div className="RTI_Details_Page__page">
      <div className="RTI_Details_Page__center">
        <div className="RTI_Details_Page__spinner" />
        <span className="RTI_Details_Page__stateText">Loading application…</span>
        <span className="RTI_Details_Page__stateSubText">Please wait</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="RTI_Details_Page__page">
      <div className="RTI_Details_Page__center">
        <span className="RTI_Details_Page__stateText" style={{ color: "#dc2626" }}>⚠ {error}</span>
        <button className="RTI_Details_Page__btn RTI_Details_Page__btn--back" onClick={() => navigate(-1)}>
          <Ic.ArrowLeft /> Go Back
        </button>
      </div>
    </div>
  );

  if (!data) return (
    <div className="RTI_Details_Page__page">
      <div className="RTI_Details_Page__center">
        <span className="RTI_Details_Page__stateText">No data found.</span>
        <button className="RTI_Details_Page__btn RTI_Details_Page__btn--back" onClick={() => navigate(-1)}>
          <Ic.ArrowLeft /> Go Back
        </button>
      </div>
    </div>
  );

  // destructure response data
  const {
    rti_number, application_type, applicant_name, gender,
    address_line1, address_line2, pincode, locality_type,
    education_status, phone_number, alter_mobile_number,
    email_id, citizenship, mode_of_information, below_poverty_line,
    subject, rti_request_text,
    supporting_document_name = [],
    application_submitted_date, application_received_date,
    assigned_date, authority_replied_date,
    reply_document, reply_text, reply_comment,
    apio_comments, pio_comments, dd_comments,
    department_assignments = [],
    priority_level,
  } = data;

  const sc = getStatusStyle(data.status);

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className="RTI_Details_Page__page">

      {/* ── Breadcrumb + Title ── */}
      <div className="RTI_Details_Page__header">
        <div className="RTI_Details_Page__headerLeft">
          <div className="RTI_Details_Page__breadcrumb">



          </div>
          <h1 className="RTI_Details_Page__title">RTI Application Detail</h1>

        </div>
      </div>


      {/* ── Details Grid ── */}
      <div className="RTI_Details_Page__grid">

        {/* Application Info */}


        {/* Applicant Details */}
        <Section icon={Ic.User} title="Applicant Details" iconBg="#f0fdf4" iconColor="#15803d">
          <div className="RTI_Details_Page__twoColumnGrid">
            <Field label="Full Name" value={applicant_name} />
            <Field label="Gender" value={gender} />
            <Field label="Email" value={email_id} />
            <Field label="Phone" value={phone_number} />
            <Field label="Alternate Phone" value={alter_mobile_number} />
            <Field label="Citizenship" value={citizenship} />
            <Field label="Address Line 1" value={address_line1} />
            <Field label="Address Line 2" value={address_line2} />
            <Field label="Pincode" value={pincode} />
            <Field label="Locality Type" value={locality_type} />
            <Field label="Application Type" value={application_type} />
            <Field label="Subject" value={subject} />
            <Field label="Submitted On" value={formatDate(application_submitted_date)} />
            <Field label="Education Status" value={education_status} />
            <Field label="Mode of Info" value={mode_of_information} />
            <Field label="Below Poverty Line" value={below_poverty_line} />
          </div>
        </Section>




        {/* RTI Request Text — full width */}
        <div className="RTI_Details_Page__card RTI_Details_Page__gridFull">
          <div className="RTI_Details_Page__cardHeader">
            <div className="RTI_Details_Page__cardIcon" style={{ background: "#f8fafc", color: "#475569" }}>
              <Ic.FileText />
            </div>
            <h3 className="RTI_Details_Page__cardTitle">RTI Request Text</h3>
          </div>
          <div className="RTI_Details_Page__textBox">{rti_request_text || "—"}</div>
        </div>

        {/* Supporting Documents */}
        {supporting_document_name.length > 0 && (
          <div className="RTI_Details_Page__card RTI_Details_Page__gridFull">
            <div className="RTI_Details_Page__cardHeader">
              <div className="RTI_Details_Page__cardIcon" style={{ background: "#eff6ff", color: "#1d4ed8" }}>
                <Ic.Paperclip />
              </div>
              <h3 className="RTI_Details_Page__cardTitle">
                Supporting Documents ({supporting_document_name.length})
              </h3>
            </div>
            <ul className="RTI_Details_Page__docList">
              {supporting_document_name.map((doc, i) => {
                const url = getDocUrl(doc.document_path);

                console.log("DOC URL => ", url);

                return (
                  <li key={i} className="RTI_Details_Page__docItem">
                    <span className="RTI_Details_Page__docName">
                      <Ic.Paperclip /> {doc.document_name}
                    </span>

                    {doc.document_path && (
                      <button
                        className="RTI_Details_Page__docLink"
                        onClick={() => openDoc(doc.document_path)}
                        style={{ cursor: "pointer", border: "none" }}
                      >
                        <Ic.ExternalLink /> View
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Review Section — hidden when SUBMITTED */}
        {showReview && (
          <div className="RTI_Details_Page__card RTI_Details_Page__gridFull">




            {/* Reply docs (array) */}

            {/* APIO / PIO / DD comments */}
            {apio_comments && <Field label="APIO Comments" value={apio_comments} />}
            {pio_comments && <Field label="PIO Comments" value={pio_comments} />}
            {dd_comments && <Field label="DD Comments" value={dd_comments} />}

            {/* Assignments table — filtered to current user's dept role */}
            {department_assignments.length > 0 && (() => {
              // If dept role: show only rows assigned to their dept
              // If RTI/other admin: show all rows
              const visibleRows = showDeptReplyBtn
                ? department_assignments.filter(
                  (a) => (a.assigned_department || "").toUpperCase() === role
                )
                : department_assignments;

              if (visibleRows.length === 0) return null;

              return (
                <>
                  <div style={{ marginTop: 18, marginBottom: 10 }}>
                    <p className="RTI_Details_Page__assignSectionTitle">
                      Department Assignments
                    </p>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className="RTI_Details_Page__reviewTable">
                      <thead>
                        <tr>
                          {[
                            "S.No",

                            (
                              ["AUDIT", "IT", "LEGAL", "PLANNING", "VERIFICATION", "Engineer"].includes(role)
                                ? "Assiner Name"
                                : "Assigned Department"
                            ),

                            "Comments",
                            "Document",
                            "Status",
                            "Assigned On",
                            ...(showDeptReplyBtn ? ["Action"] : []),
                          ].map((h) => (
                            <th key={h} className="RTI_Details_Page__reviewTh">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRows.map((a, i) => {
                          const ds = getStatusStyle(a.assignment_status);
                          const alreadyReplied = (a.assignment_status || "").toLowerCase() === "replaid";
                          return (
                            <tr key={a.id || i} className="RTI_Details_Page__reviewTr">
                              <td className="RTI_Details_Page__reviewTd">{i + 1}</td>
                              <td
                                className="RTI_Details_Page__reviewTd"
                                style={{ fontWeight: 700, color: "#1e293b" }}
                              >
                                {(
                                  ["AUDIT", "IT", "LEGAL", "PLANNING", "VERIFICATION", "Engineer"].includes(role) &&
                                  (a.assignment_status || "").toUpperCase() === "ASSIGNED"
                                )
                                  ? (a.assigned_by_id || "—")
                                  : (a.assigned_department || "—")}
                              </td>
                              <td className="RTI_Details_Page__reviewTd" style={{ color: "#475569" }}>
                                {a.rti_comments || a.reply_comments || "—"}
                              </td>
                              <td className="RTI_Details_Page__reviewTd">
                                {a.rti_document ? (
                                  <button
                                    className="RTI_Details_Page__docLink"
                                    onClick={() => openDoc(a.rti_document)}
                                    style={{ cursor: "pointer", border: "none" }}
                                  >
                                    <Ic.ExternalLink /> View
                                  </button>
                                ) : "—"}
                              </td>
                              <td className="RTI_Details_Page__reviewTd">
                                <span
                                  className="RTI_Details_Page__tag"
                                  style={{ background: ds.bg, color: ds.color, borderColor: ds.border }}
                                >
                                  {a.assignment_status || "—"}
                                </span>
                              </td>
                              <td className="RTI_Details_Page__reviewTd"
                                style={{ color: "#64748b", fontSize: 12.5, whiteSpace: "nowrap" }}>
                                {formatDate(a.created_on || a.assigned_date)}
                              </td>
                              {/* Reply button — only for dept roles */}
                              {showDeptReplyBtn && (
                                <td className="RTI_Details_Page__reviewTd">
                                  {alreadyReplied ? (
                                    <span style={{ fontSize: 12, color: "#15803d", fontWeight: 600 }}>
                                      ✅ Replied
                                    </span>
                                  ) : (
                                    <button
                                      className="RTI_Details_Page__btn RTI_Details_Page__btn--reply"
                                      onClick={() => openReplyModal(a)}
                                    >
                                      <Ic.Reply /> Reply
                                    </button>
                                  )}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* Reply Details Table — show only replaid rows */}
                  {visibleRows.filter(
                    (a) => (a.assignment_status || "").toLowerCase() === "replaid"
                  ).length > 0 && (
                      <>
                        <div style={{ marginTop: 18, marginBottom: 10 }}>
                          <p className="RTI_Details_Page__assignSectionTitle">
                            replay details
                          </p>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                          <table className="RTI_Details_Page__reviewTable">
                            <thead>
                              <tr>
                                {[
                                  "S.No",
                                  "replaier name",
                                  "replay department",
                                  "Reply statement",
                                  "replay document",
                                  "Status",
                                  "replaid date",
                                ].map((h) => (
                                  <th key={h} className="RTI_Details_Page__reviewTh">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            <tbody>
                              {visibleRows
                                .filter(
                                  (a) =>
                                    (a.assignment_status || "").toLowerCase() === "replaid"
                                )
                                .map((a, i) => {
                                  const ds = getStatusStyle(a.assignment_status);

                                  return (
                                    <tr key={a.id || i} className="RTI_Details_Page__reviewTr">
                                      <td className="RTI_Details_Page__reviewTd">{i + 1}</td>

                                      <td
                                        className="RTI_Details_Page__reviewTd"
                                        style={{ fontWeight: 700, color: "#1e293b" }}
                                      >
                                        {userMap[a.replied_by_id]?.full_name || "—"}
                                      </td>
                                      <td
                                        className="RTI_Details_Page__reviewTd"
                                        style={{ fontWeight: 700, color: "#1e293b" }}
                                      >
                                        {userMap[a.replied_by_id]?.department || "—"}
                                      </td>

                                      <td
                                        className="RTI_Details_Page__reviewTd"
                                        style={{ color: "#475569" }}
                                      >
                                        {a.reply_comments || "—"}
                                      </td>

                                      <td className="RTI_Details_Page__reviewTd">
                                        {a.rti_document ? (
                                          <a
                                            href={getDocUrl(a.rti_document)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="RTI_Details_Page__docLink"
                                          >
                                            <Ic.ExternalLink /> View
                                          </a>
                                        ) : (
                                          "—"
                                        )}
                                      </td>

                                      <td className="RTI_Details_Page__reviewTd">
                                        <span
                                          className="RTI_Details_Page__tag"
                                          style={{
                                            background: ds.bg,
                                            color: ds.color,
                                            borderColor: ds.border,
                                          }}
                                        >
                                          {a.assignment_status || "—"}
                                        </span>
                                      </td>

                                      <td
                                        className="RTI_Details_Page__reviewTd"
                                        style={{ color: "#475569" }}
                                      >
                                        {a.replied_date || "—"}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                </>
              );
            })()}
          </div>
        )}
      </div>
      {/* ── Status Bar + Action Buttons ── */}
      <div className="RTI_Details_Page__statusBar">
        <div className="RTI_Details_Page__statusBarLeft">
          <button
            className="RTI_Details_Page__btn RTI_Details_Page__btn--back"
            onClick={() => navigate(-1)}
          >
            <Ic.ArrowLeft /> Back to List
          </button>


        </div>

        {/* Actions — only for RTI role + SUBMITTED status */}
        {showRTIActions && (
          <div className="RTI_Details_Page__actionRow">
            <button
              className="RTI_Details_Page__btn RTI_Details_Page__btn--return"
              onClick={() => setShowReturnModal(true)}
            >
              <Ic.RotateCCW /> Return
            </button>
            <button
              className="RTI_Details_Page__btn RTI_Details_Page__btn--assign"
              onClick={() => setShowAssignModal(true)}
            >
              <Ic.UserCheck /> Assign
            </button>
            <button
              className="RTI_Details_Page__btn RTI_Details_Page__btn--apio"
              onClick={() => setShowAPIORModal(true)}
            >
              <Ic.Bell /> Inform APIO
            </button>
          </div>
        )}
      </div>

      {/* ── Footer Back ── */}
      <div className="RTI_Details_Page__footer">

      </div>

      {/* ══════════════════════════════════════════════════════════════
          MODAL — RETURN APPLICATION
          ══════════════════════════════════════════════════════════════ */}
      {showReturnModal && (
        <div
          className="RTI_Details_Page__overlay"
          onClick={(e) => e.target === e.currentTarget && closeReturn()}
        >
          <div className="RTI_Details_Page__modal">
            <div className="RTI_Details_Page__modalHead">
              <div>
                <h2 className="RTI_Details_Page__modalTitle">Return Application</h2>
                <p className="RTI_Details_Page__modalSubtitle">
                  Provide a reason for returning this application
                </p>
              </div>
              <button className="RTI_Details_Page__modalClose" onClick={closeReturn}>
                <Ic.X />
              </button>
            </div>
            <div className="RTI_Details_Page__modalBody">
              <Toast msg={returnMsg} />
              <div className="RTI_Details_Page__formGroup">
                <label className="RTI_Details_Page__formLabel">
                  Reply Comment <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  className="RTI_Details_Page__formTextarea"
                  placeholder="Enter reason for returning this application…"
                  value={returnComment}
                  onChange={(e) => setReturnComment(e.target.value)}
                />
              </div>
              <div className="RTI_Details_Page__formGroup">
                <label className="RTI_Details_Page__formLabel">Applicant Email</label>
                <input
                  className="RTI_Details_Page__formInput"
                  value={email_id || ""}
                  readOnly
                  style={{ background: "#f8fafc", color: "#64748b" }}
                />
              </div>
            </div>
            <div className="RTI_Details_Page__modalFooter">
              <button
                className="RTI_Details_Page__btn RTI_Details_Page__btn--ghost"
                onClick={closeReturn}
              >
                Cancel
              </button>
              <button
                className="RTI_Details_Page__btn RTI_Details_Page__btn--submit"
                onClick={handleReturn}
                disabled={returnLoading || !returnComment.trim()}
              >
                {returnLoading ? "Submitting…" : "Submit Return"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL — ASSIGN DEPARTMENTS
          ══════════════════════════════════════════════════════════════ */}
      {showAssignModal && (
        <div
          className="RTI_Details_Page__overlay"
          onClick={(e) => e.target === e.currentTarget && closeAssign()}
        >
          <div className="RTI_Details_Page__modal RTI_Details_Page__modal--wide">
            <div className="RTI_Details_Page__modalHead">
              <div>
                <h2 className="RTI_Details_Page__modalTitle">Assign Departments</h2>
                <p className="RTI_Details_Page__modalSubtitle">
                  Add one or multiple departments, then submit all at once
                </p>
              </div>
              <button className="RTI_Details_Page__modalClose" onClick={closeAssign}>
                <Ic.X />
              </button>
            </div>

            <div className="RTI_Details_Page__modalBody">
              <Toast msg={assignMsg} />

              {/* Add row form */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="RTI_Details_Page__formGroup" style={{ gridColumn: "1/-1" }}>
                  <label className="RTI_Details_Page__formLabel">
                    Department <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    className="RTI_Details_Page__formSelect"
                    value={assignDept}
                    onChange={(e) => setAssignDept(e.target.value)}
                  >
                    <option value="">— Select Department —</option>
                    {availDepts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="RTI_Details_Page__formGroup" style={{ gridColumn: "1/-1" }}>
                  <label className="RTI_Details_Page__formLabel">
                    Comments <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea
                    className="RTI_Details_Page__formTextarea"
                    placeholder="Enter assignment remarks…"
                    value={assignComment}
                    onChange={(e) => setAssignComment(e.target.value)}
                  />
                </div>
                <div className="RTI_Details_Page__formGroup" style={{ gridColumn: "1/-1" }}>
                  <label className="RTI_Details_Page__formLabel">Upload Document (optional)</label>
                  <div className="RTI_Details_Page__fileWrap">
                    <input
                      type="file"
                      className="RTI_Details_Page__fileInput"
                      ref={assignFileRef}
                      onChange={(e) => setAssignFile(e.target.files[0] || null)}
                    />
                    <Ic.Upload />
                    <p className="RTI_Details_Page__fileHint">Click to upload (PDF, DOC, Image)</p>
                    {assignFile && (
                      <p className="RTI_Details_Page__fileChosen">📎 {assignFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", margin: "6px 0 4px" }}>
                <button
                  className="RTI_Details_Page__btn RTI_Details_Page__btn--assign"
                  onClick={handleAssignAdd}
                >
                  <Ic.Plus /> Add Department
                </button>
              </div>

              {/* Rows table */}
              {assignRows.length > 0 && (
                <>
                  <div className="RTI_Details_Page__assignDivider" />
                  <p className="RTI_Details_Page__assignSectionTitle">
                    Queued Assignments ({assignRows.length})
                  </p>
                  <div style={{ overflowX: "auto" }}>
                    <table className="RTI_Details_Page__assignTable">
                      <thead>
                        <tr>
                          {["S.No", "Department", "Comments", "Document", "Remove"].map((h) => (
                            <th key={h} className="RTI_Details_Page__assignTh">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {assignRows.map((r, i) => (
                          <tr key={i} className="RTI_Details_Page__assignTr">
                            <td className="RTI_Details_Page__assignTd">{i + 1}</td>
                            <td className="RTI_Details_Page__assignTd"
                              style={{ fontWeight: 700, color: "#1d4ed8" }}>
                              {r.dept}
                            </td>
                            <td className="RTI_Details_Page__assignTd"
                              style={{ color: "#475569", maxWidth: 180 }}>
                              {r.comment}
                            </td>
                            <td className="RTI_Details_Page__assignTd">
                              {r.fileName
                                ? <span style={{ color: "#6366f1", fontSize: 12 }}>📎 {r.fileName}</span>
                                : <span style={{ color: "#94a3b8" }}>—</span>
                              }
                            </td>
                            <td className="RTI_Details_Page__assignTd">
                              <button
                                className="RTI_Details_Page__btn RTI_Details_Page__btn--danger"
                                onClick={() =>
                                  setAssignRows((prev) => prev.filter((_, idx) => idx !== i))
                                }
                              >
                                <Ic.Trash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            <div className="RTI_Details_Page__modalFooter">
              <button
                className="RTI_Details_Page__btn RTI_Details_Page__btn--ghost"
                onClick={closeAssign}
              >
                Cancel
              </button>
              <button
                className="RTI_Details_Page__btn RTI_Details_Page__btn--submit"
                onClick={handleAssignSubmit}
                disabled={assignLoading || assignRows.length === 0}
              >
                {assignLoading
                  ? "Submitting…"
                  : `Submit & Assign (${assignRows.length} dept${assignRows.length !== 1 ? "s" : ""})`
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL — INFORM APIO
          Dynamic rows: each row has Document Name + File
          Sends parallel arrays to backend:
            reply_document_name[] (text)
            reply_document[]      (file)
          ══════════════════════════════════════════════════════════════ */}
      {showAPIORModal && (
        <div
          className="RTI_Details_Page__overlay"
          onClick={(e) => e.target === e.currentTarget && closeAPIO()}
        >
          <div className="RTI_Details_Page__modal RTI_Details_Page__modal--wide">
            <div className="RTI_Details_Page__modalHead">
              <div>
                <h2 className="RTI_Details_Page__modalTitle">Inform APIO</h2>
                <p className="RTI_Details_Page__modalSubtitle">
                  Send this application under APIO process with supporting documents
                </p>
              </div>
              <button className="RTI_Details_Page__modalClose" onClick={closeAPIO}>
                <Ic.X />
              </button>
            </div>

            <div className="RTI_Details_Page__modalBody">
              <Toast msg={apioMsg} />

              {/* Comments field */}
              <div className="RTI_Details_Page__formGroup">
                <label className="RTI_Details_Page__formLabel">
                  Comments <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  className="RTI_Details_Page__formTextarea"
                  placeholder="Enter comments for APIO…"
                  value={apioComment}
                  onChange={(e) => setApioComment(e.target.value)}
                />
              </div>

              {/* Document rows */}
              <div className="RTI_Details_Page__assignDivider" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p className="RTI_Details_Page__assignSectionTitle" style={{ margin: 0 }}>
                  Upload Documents <span style={{ color: "#ef4444" }}>*</span>
                  <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", marginLeft: 6 }}>
                    (minimum 1 required)
                  </span>
                </p>
                <button
                  className="RTI_Details_Page__btn RTI_Details_Page__btn--apio"
                  style={{ padding: "6px 12px", fontSize: 12 }}
                  onClick={addApioRow}
                >
                  <Ic.Plus /> Add Document
                </button>
              </div>

              {/* Dynamic doc rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {apioDocRows.map((row, idx) => (
                  <div
                    key={row.id}
                    className="RTI_Details_Page__apioDocRow"
                    style={{
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "14px 16px",
                      background: "#fafbff",
                      position: "relative",
                    }}
                  >
                    {/* Row header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                        Document {idx + 1}
                      </span>
                      {apioDocRows.length > 1 && (
                        <button
                          className="RTI_Details_Page__btn RTI_Details_Page__btn--danger"
                          style={{ padding: "4px 8px" }}
                          onClick={() => removeApioRow(row.id)}
                        >
                          <Ic.Trash />
                        </button>
                      )}
                    </div>

                    {/* Document Name */}
                    <div className="RTI_Details_Page__formGroup" style={{ marginBottom: 10 }}>
                      <label className="RTI_Details_Page__formLabel">
                        Document Name <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        className="RTI_Details_Page__formInput"
                        placeholder={`e.g. Aadhaar Copy, Verification Report`}
                        value={row.docName}
                        onChange={(e) => updateApioRow(row.id, "docName", e.target.value)}
                      />
                    </div>

                    {/* File Upload */}
                    <div className="RTI_Details_Page__formGroup" style={{ marginBottom: 0 }}>
                      <label className="RTI_Details_Page__formLabel">
                        File <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      {row.file ? (
                        /* file chosen — show name + change option */
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: "#f0fdf4",
                          border: "1.5px solid #86efac",
                          borderRadius: 10,
                          padding: "9px 14px",
                        }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#15803d" }}>
                            📎 {row.file.name}
                            <span style={{ marginLeft: 8, fontSize: 11, color: "#64748b", fontWeight: 400 }}>
                              ({(row.file.size / 1024).toFixed(1)} KB)
                            </span>
                          </span>
                          <label style={{ cursor: "pointer" }}>
                            <input
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                updateApioRow(row.id, "file", e.target.files[0] || null)
                              }
                            />
                            <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 700 }}>
                              Change
                            </span>
                          </label>
                        </div>
                      ) : (
                        /* no file yet — show upload box */
                        <label style={{ display: "block", cursor: "pointer" }}>
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              updateApioRow(row.id, "file", e.target.files[0] || null)
                            }
                          />
                          <div className="RTI_Details_Page__fileWrap" style={{ cursor: "pointer" }}>
                            <Ic.Upload />
                            <p className="RTI_Details_Page__fileHint">
                              Click to choose file (PDF, DOC, Image)
                            </p>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="RTI_Details_Page__modalFooter">
              <button
                className="RTI_Details_Page__btn RTI_Details_Page__btn--ghost"
                onClick={closeAPIO}
              >
                Cancel
              </button>
              <button
                className="RTI_Details_Page__btn RTI_Details_Page__btn--submit"
                onClick={handleApioSubmit}
                disabled={apioLoading || !apioComment.trim()}
              >
                {apioLoading ? "Submitting…" : "Inform APIO"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL — DEPARTMENT REPLY
          Visible when: role is Audit/IT/Legal/Planning/Verification/Engineering
          API: PATCH /api/rti/assignment/update/:assignment_id
          form-data: assignment_status, reply_comments, replied_by_id, reply_document (files)
          ══════════════════════════════════════════════════════════════ */}
      {showReplyModal && (
        <div
          className="RTI_Details_Page__overlay"
          onClick={(e) => e.target === e.currentTarget && closeReply()}
        >
          <div className="RTI_Details_Page__modal RTI_Details_Page__modal--wide">
            <div className="RTI_Details_Page__modalHead">
              <div>
                <h2 className="RTI_Details_Page__modalTitle">Submit Reply</h2>
                <p className="RTI_Details_Page__modalSubtitle">
                  {replyTargetRow?.assigned_department} — Assignment #{replyTargetRow?.id}
                </p>
              </div>
              <button className="RTI_Details_Page__modalClose" onClick={closeReply}>
                <Ic.X />
              </button>
            </div>

            <div className="RTI_Details_Page__modalBody">
              <Toast msg={replyMsg} />

              {/* Comments */}
              <div className="RTI_Details_Page__formGroup">
                <label className="RTI_Details_Page__formLabel">
                  Comments <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  className="RTI_Details_Page__formTextarea"
                  placeholder="Enter your reply comments…"
                  value={replyComment}
                  onChange={(e) => setReplyComment(e.target.value)}
                />
              </div>

              {/* Document rows header */}
              <div className="RTI_Details_Page__assignDivider" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p className="RTI_Details_Page__assignSectionTitle" style={{ margin: 0 }}>
                  Upload Documents <span style={{ color: "#ef4444" }}>*</span>
                  <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", marginLeft: 6 }}>
                    (minimum 1)
                  </span>
                </p>
                <button
                  className="RTI_Details_Page__btn RTI_Details_Page__btn--reply"
                  style={{ padding: "6px 12px", fontSize: 12 }}
                  onClick={addReplyDocRow}
                >
                  <Ic.Plus /> Add Document
                </button>
              </div>

              {/* Dynamic doc rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {replyDocRows.map((row, idx) => (
                  <div
                    key={row.id}
                    style={{
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "14px 16px",
                      background: "#fafbff",
                    }}
                  >
                    {/* Row header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#15803d", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                        Document {idx + 1}
                      </span>
                      {replyDocRows.length > 1 && (
                        <button
                          className="RTI_Details_Page__btn RTI_Details_Page__btn--danger"
                          style={{ padding: "4px 8px" }}
                          onClick={() => removeReplyDocRow(row.id)}
                        >
                          <Ic.Trash />
                        </button>
                      )}
                    </div>

                    {/* Document Name */}
                    <div className="RTI_Details_Page__formGroup" style={{ marginBottom: 10 }}>
                      <label className="RTI_Details_Page__formLabel">
                        Document Name <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        className="RTI_Details_Page__formInput"
                        placeholder="e.g. Verification Report, Approval Letter"
                        value={row.docName}
                        onChange={(e) => updateReplyDocRow(row.id, "docName", e.target.value)}
                      />
                    </div>

                    {/* File */}
                    <div className="RTI_Details_Page__formGroup" style={{ marginBottom: 0 }}>
                      <label className="RTI_Details_Page__formLabel">
                        File <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      {row.file ? (
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 10, padding: "9px 14px",
                        }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#15803d" }}>
                            📎 {row.file.name}
                            <span style={{ marginLeft: 8, fontSize: 11, color: "#64748b", fontWeight: 400 }}>
                              ({(row.file.size / 1024).toFixed(1)} KB)
                            </span>
                          </span>
                          <label style={{ cursor: "pointer" }}>
                            <input type="file" style={{ display: "none" }}
                              onChange={(e) => updateReplyDocRow(row.id, "file", e.target.files[0] || null)} />
                            <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 700 }}>Change</span>
                          </label>
                        </div>
                      ) : (
                        <label style={{ display: "block", cursor: "pointer" }}>
                          <input type="file" style={{ display: "none" }}
                            onChange={(e) => updateReplyDocRow(row.id, "file", e.target.files[0] || null)} />
                          <div className="RTI_Details_Page__fileWrap" style={{ cursor: "pointer" }}>
                            <Ic.Upload />
                            <p className="RTI_Details_Page__fileHint">Click to choose file (PDF, DOC, Image)</p>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="RTI_Details_Page__modalFooter">
              <button className="RTI_Details_Page__btn RTI_Details_Page__btn--ghost" onClick={closeReply}>
                Cancel
              </button>
              <button
                className="RTI_Details_Page__btn RTI_Details_Page__btn--submit"
                onClick={handleReplySubmit}
                disabled={replyLoading || !replyComment.trim()}
              >
                {replyLoading ? "Submitting…" : "Submit Reply"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}