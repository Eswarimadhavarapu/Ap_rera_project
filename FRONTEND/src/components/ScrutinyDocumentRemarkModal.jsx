import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "../api/api";
import { useAdmin } from "../context/AdminContext";
import "../styles/ScrutinyDocumentRemarkModal.css";

const officeViewerExtensions = new Set([
  "csv",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
]);

const imageExtensions = new Set([
  "avif",
  "bmp",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "webp",
]);

const getFileExtension = (value) => {
  const normalizedValue = String(value || "").trim().split("?")[0].split("#")[0];
  if (!normalizedValue.includes(".")) return "";
  return normalizedValue.split(".").pop().toLowerCase();
};

const formatRemarkDate = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getViewerSrc = (url, fileName) => {
  const ext = getFileExtension(fileName || url);
  return officeViewerExtensions.has(ext)
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
    : url;
};

const remarkAuthorityByDepartment = {
  planning: {
    verificationTeam: "planning",
    authorityLabel: "Planning Office",
  },
  legal: {
    verificationTeam: "legal",
    authorityLabel: "Legal Office",
  },
  audit: {
    verificationTeam: "audit",
    authorityLabel: "Audit Office",
  },
  engineer: {
    verificationTeam: "engineer",
    authorityLabel: "Engineer Office",
  },
  verification: {
    verificationTeam: "verification",
    authorityLabel: "Verification Team",
  },
  ad: {
  verificationTeam: "ad",
  authorityLabel: "Assistant Director",
  },
  dd: {
  verificationTeam: "dd",
  authorityLabel: "Deputy Director",
  },
};

const normalizeDepartment = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");

const getRemarkAuthority = (admin) => {
  const department = normalizeDepartment(admin?.department);
  const role = normalizeDepartment(admin?.role);
  const loginKey = `${department} ${role}`;

  if (loginKey.includes("planning")) return remarkAuthorityByDepartment.planning;
  if (loginKey.includes("legal")) return remarkAuthorityByDepartment.legal;
  if (loginKey.includes("audit")) return remarkAuthorityByDepartment.audit;
  if (loginKey.includes("engineer")) return remarkAuthorityByDepartment.engineer;
  if (loginKey.includes("verification")) return remarkAuthorityByDepartment.verification;
  if (loginKey.includes("ad")) return { verificationTeam: "ad", authorityLabel: "Assistant Director" };
  if (loginKey.includes("dd")) return { verificationTeam: "dd", authorityLabel: "Deputy Director" };

  return remarkAuthorityByDepartment.verification;
};

export default function ScrutinyDocumentRemarkModal({
  isOpen,
  documentItem,
  onClose,
  applicationNo,
  verificationTeam,
  authorityLabel,
}) {
  const { admin } = useAdmin();
  const [shortfall, setShortfall] = useState("");
  const [remarkText, setRemarkText] = useState("");
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const documentKey = useMemo(
    () =>
      String(
        documentItem?.storageId ||
          documentItem?.id ||
          documentItem?.fileName ||
          documentItem?.title ||
          "document"
      ),
    [documentItem]
  );

  const loginRemarkAuthority = useMemo(() => getRemarkAuthority(admin), [admin]);
  const activeVerificationTeam =
    verificationTeam || loginRemarkAuthority.verificationTeam;
  const activeAuthorityLabel = authorityLabel || loginRemarkAuthority.authorityLabel;

  const viewerSrc = useMemo(
    () =>
      documentItem?.url
        ? getViewerSrc(documentItem?.url, documentItem.fileName)
        : "",
    [documentItem]
  );

  const isImageDocument = useMemo(() => {
    const ext = getFileExtension(documentItem?.fileName || documentItem?.url);
    return imageExtensions.has(ext);
  }, [documentItem]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !documentItem) return;

    setShortfall("");
    setRemarkText("");
    setHistory([]);
    setFeedback({ type: "", text: "" });
  }, [documentItem, isOpen]);

  const documentName =
    documentItem?.title || documentItem?.fileName || "Document";
    const authorityMap = {
  verification: "Verification Team",
  planning: "Planning Team",
  legal: "Legal Team",
  audit: "Audit Team",
  engineer: "Scrutiny Engineer",
  ad: "Assistant Director",
  dd: "Deputy Director",
};
  const mapRemarkRow = useCallback(
    (row) => ({
      id: row.id,
      authority: authorityMap[row.verification_team] || activeAuthorityLabel,
      isShortfall: row.is_shortfall ? "Yes" : "No",
      remarks: row.remarks || "",
      remarksDate: formatRemarkDate(row.created_at || row.updated_at || Date.now()),
      documentName:
  documentItem?.title ||   // ✅ THIS IS IMPORTANT
  row.document_name ||
  documentName,
      documentUrl: row.document_path || documentItem?.url || "",
    }),
    [activeAuthorityLabel, documentItem?.url, documentName]
  );

  const loadHistory = useCallback(async ({ showLoader = true } = {}) => {
    if (!String(applicationNo || "").trim()) {
      setHistory([]);
      return;
    }

    try {
      if (showLoader) {
        setHistoryLoading(true);
      }

      const getAllowedTeams = (team) => {
  if (team === "verification") return ["verification"];

  // ✅ AD & DD special case
  if (team === "ad" || team === "dd") {
    return ["verification", "planning", team];
  }

  // ✅ others
  return ["verification", team];
};

const teams = getAllowedTeams(activeVerificationTeam);

const responses = await Promise.all(
  teams.map((t) =>
    apiGet(
      `/api/scrutiny/verification-remarks?application_no=${encodeURIComponent(
        String(applicationNo).trim()
      )}&document_name=${encodeURIComponent(
        documentName
      )}&verification_team=${t}`
    )
  )
);

let combined = [];

responses.forEach((res) => {
  if (Array.isArray(res?.rows)) {
    combined = [...combined, ...res.rows];
  }
});

// latest first
combined.sort(
  (a, b) => new Date(b.created_at) - new Date(a.created_at)
);

setHistory(combined.map(mapRemarkRow));
    } catch (error) {
      setHistory([]);
      setFeedback({
        type: "error",
        text: error.message || "Unable to load remarks.",
      });
    } finally {
      if (showLoader) {
        setHistoryLoading(false);
      }
    }
  }, [activeVerificationTeam, applicationNo, documentName, mapRemarkRow]);

  useEffect(() => {
    if (!isOpen || !documentItem) return;
    loadHistory();
  }, [documentItem, isOpen, loadHistory]);

  if (!isOpen || !documentItem) {
    return null;
  }

  const handleSubmit = async () => {
    const trimmedRemark = remarkText.trim();

    if (!String(applicationNo || "").trim()) {
      setFeedback({
        type: "error",
        text: "Application number is missing.",
      });
      return;
    }

    if (!shortfall) {
      setFeedback({
        type: "error",
        text: "Please select whether the document has shortfall.",
      });
      return;
    }

    if (!trimmedRemark) {
      setFeedback({
        type: "error",
        text: "Please enter remarks before submitting.",
      });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback({ type: "", text: "" });

      const response = await apiPost("/api/scrutiny/verification-remarks", {
        application_no: String(applicationNo).trim(),
        document_name: documentName,
        verification_team: activeVerificationTeam,
        is_shortfall: shortfall === "yes",
        status: "pending",
        remarks: trimmedRemark,
        document_path: documentItem?.url || "",
        verified_by: activeAuthorityLabel,
      });
      setShortfall("");
      setRemarkText("");
      setFeedback({
        type: "success",
        text: response?.message || "Remark submitted successfully.",
      });
      await loadHistory({ showLoader: false });
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.message || "Unable to save remark.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="sdrm-overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="sdrm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sdrm-title"
      >
        <div className="sdrm-header">
          <div>
            <h2 id="sdrm-title">ACTION TO BE TAKEN</h2>
            <p className="sdrm-subtitle">
              {documentItem.title || documentItem.fileName || "Document"}
            </p>
          </div>
          <button type="button" className="sdrm-close-icon" onClick={onClose}>
            x
          </button>
        </div>

        <div className="sdrm-viewer-wrap">
          {documentItem?.url ? (
            <>
              <div className="sdrm-viewer-toolbar">
                <span>{documentItem.fileName || "Preview"}</span>
                <a
                  href={documentItem?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="sdrm-open-tab"
                >
                  Open in new tab
                </a>
              </div>

              {isImageDocument ? (
                <div className="sdrm-image-stage">
                  <img
                    src={documentItem?.url}
                    alt={documentItem.title || documentItem.fileName || "Document preview"}
                    className="sdrm-image-preview"
                  />
                </div>
              ) : (
                <iframe
                  title={documentItem.title || documentItem.fileName || "Document preview"}
                  src={viewerSrc}
                  className="sdrm-viewer"
                />
              )}
            </>
          ) : (
            <div className="sdrm-empty-viewer">Document preview is not available.</div>
          )}
        </div>

        <div className="sdrm-body">
          <div className="sdrm-question">
            <span>Does the document have shortfall?</span>
            <div className="sdrm-radio-group">
              <label>
                <input
                  type="radio"
                  name={`shortfall-${documentKey}`}
                  value="yes"
                  checked={shortfall === "yes"}
                  onChange={(event) => {
                    setShortfall(event.target.value);
                    if (feedback.text) {
                      setFeedback({ type: "", text: "" });
                    }
                  }}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={`shortfall-${documentKey}`}
                  value="no"
                  checked={shortfall === "no"}
                  onChange={(event) => {
                    setShortfall(event.target.value);
                    if (feedback.text) {
                      setFeedback({ type: "", text: "" });
                    }
                  }}
                />
                No
              </label>
            </div>
          </div>

          <textarea
            className="sdrm-remarks-box"
            maxLength={3000}
            value={remarkText}
            onChange={(event) => {
              setRemarkText(event.target.value);
              if (feedback.text) {
                setFeedback({ type: "", text: "" });
              }
            }}
            placeholder="Remarks (Maximum of 3000 Characters)"
          />

          <div className="sdrm-actions">
            {feedback.text ? (
              <span className={`sdrm-feedback sdrm-feedback-${feedback.type}`}>
                {feedback.text}
              </span>
            ) : (
              <span />
            )}
            <button
              type="button"
              className="sdrm-submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          <div className="sdrm-history">
            <h3>UPDATED REMARKS</h3>

            <div className="sdrm-history-table-wrap">
              <table className="sdrm-history-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Authority</th>
                    <th>Is Shortfall</th>
                    <th>Remarks</th>
                    <th>Remarks Date</th>
                    <th>Document</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length ? (
                    history.map((row, index) => (
                      <tr key={row.id}>
                        <td>{index + 1}</td>
                        <td>{row.authority}</td>
                        <td>{row.isShortfall}</td>
                        <td>{row.remarks}</td>
                        <td>{row.remarksDate}</td>
                        <td>
  {row.documentUrl ? (
    <span
      style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
      onClick={() => window.open(row.documentUrl, "_blank")}
    >
      View
    </span>
  ) : (
    "NA"
  )}
</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="sdrm-empty-history">
                        {historyLoading ? "Loading remarks..." : "No remarks yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="sdrm-footer">
          <button type="button" className="sdrm-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}