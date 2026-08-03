
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../../styles/scrutiny/scrutiny_projectregistation_5.css";
import "../../styles/scrutiny/scrutiny_remarks_field.css";
import ScrutinyPageHeader from "../../components/scrutiny/ScrutinyPageHeader";
import ProjectWizard from "../../components/scrutiny/scrutiny_steper";
import ScrutinyLayout from "../../components/scrutiny/ScrutinyLayout";
import { apiDelete, apiGet, apiPost, BASE_URL } from "../../api/api";
import { useAdmin } from "../../context/AdminContext";
import ScrutinyDocumentRemarkModal from "../../components/ScrutinyDocumentRemarkModal";

const scrutinyUploadDocuments = [
  {
    id: 1,
    text: "Copies of the registered ownership documents / Pattadhar pass books issued by Revenue department along with link documents and authorization letter given by the Land Owner",
    text1: "(refer Form P20 in form download).",
  },
  {
    id: 2,
    text: "Copies of the combined field sketches showing the Survey Number boundaries, Subdivision boundaries, and Layout boundaries duly marking the Geo-Coordinates at every corner of the site.",
  },
  {
    id: 3,
    text: "Detailed site plan showing the measurements as on ground including diagonals along with Geo-Coordinates (Latitude and Longitude) at end points of the project site along with incorporation on Satellite Imagery.",
  },
  {
    id: 4,
    text: "Copy of the registered development agreement between the Owner of the land and the Promoter / Authorization letter given by the Land owner  to undertake the construction of the building by the promoter.",
  },
  {
    id: 5,
    text: "Land Title search Report from an Advocate (include Advocate Enrolment Number) having experience of atleast ten years in land related matters.",
  },
  {
    id: 6,
    text: "Latest (by 30 days) Encumbrance certificate (for entire period of document) issued by the Registration and Stamps department.",
  },
  {
    id: 7,
    text: "Copy of the plan and proceedings issued by the competent Authority for approval of plans (TDR Bonds, if any).",
  },
  {
    id: 8,
    text: "Approved plan / list of amenities proposed in the site.",
  },
  {
    id: 9,
    text: "NOC's issued by Authority (where applicable viz., Airport Authority, Fire Department, Environmental Clearance, etc.).",
  },
  {
    id: 10,
    text: "Detailed technical specifications of the construction if the buildings and facilities proposed in the project including brand details, specifications of infrastructure and details of fixtures and fittings",
    text1: "(refer Form P18 in forms download).",
  },
  {
    id: 11,
    text: "Topo Plan drawn to a scale with nearby land marks of the site.",
  },
  {
    id: 12,
    text: "Licenses/Enrolment form of Civil Contractors, or turnkey contractor, or EPC Contractors of the project (if any).",
  },
  {
    id: 13,
    text: "Licenses/Enrolment form of Structural Engineer of the project (if there is any overhead tank or major structure proposed in the layout).",
  },
  {
    id: 14,
    text: "Licenses/Enrolment form of Architect or firm or company.",
  },
  {
    id: 15,
    text: "Licenses/Enrolment form of Engineer or firm or company (if any).",
  },
  {
    id: 16,
    text: "Licenses/Enrolment form of Chartered Accountant or firm or company.",
  },
  {
    id: 17,
    text: "Detailed estimate of the expenditure for construction of the building",
    text1: "(refer Form P16 in forms download).",
  },
  {
    id: 18,
    text: "Statement of source of funds for construction of building",
    text1: "(refer Form P9 in forms download).",
  },
  {
    id: 19,
    text: "Details of financial agreement made with any bank or other financial institution recognised by the Reserve Bank of India and of legal safeguards taken, if any, for the construction of building, or transfer of building by sale, gift or mortgage or otherwise (wherever applicable).",
  },
  {
    id: 20,
    text: "Copy of documents showing details of mortgage or any other legal encumbrance created on land in favour of any bank or financial institution recognised by the RBI (where applicable).",
  },
  {
    id: 21,
    text: "Proforma of the Allotment Letter proposed to be signed with the Allottee",
    text1: "(refer Form P14 in forms download).",
  },
  {
    id: 22,
    text: "Proforma of the Agreement for Sale proposed to be signed with the Allottee",
    text1: "(refer Form P15 in forms download).",
  },
  {
    id: 23,
    text: "Proforma of the Conveyance Deed proposed to be signed with the Allottee",
  },
  {
    id: 24,
    text: "Structural Stability Certificate duly issued by Certified Structural Consultant",
    text1: "(refer Form P19 in forms download).",
  },
  {
    id: 25,
    text: "Copy of Insurance of title of the land.",
  },
  {
    id: 26,
    text: "FORM - B, Declaration, supported by an affidavit (on Rs.20 non judicial stamp paper), which shall be signed by the promoter or any person authorized by the promoter under Rule 3-B(2)(a) to of AP Real Estate Rules-2017",
    text1: "(refer Form P11 in forms download).",
  },
  {
    id: 27,
    text: "Details of the area mortgaged to the Competent Authority for approval of Plans / Mortgage Deed.",
  },
];

const safe = (value) =>
  value !== undefined && value !== null && String(value).trim() !== ""
    ? value
    : "NA";

const officeViewerExtensions = new Set([
  "csv",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
]);

const extractFileNameFromUrl = (url) => {
  if (!url) return null;

  try {
    const decodedUrl = decodeURIComponent(url);
    const urlParts = decodedUrl.split("/");
    let fileName = urlParts[urlParts.length - 1];
    fileName = fileName.split("?")[0].trim();
    return fileName && fileName !== "/" ? fileName : null;
  } catch (error) {
    console.error("Error extracting filename:", error);
    return null;
  }
};

const getFileExtension = (value) => {
  const fileName = extractFileNameFromUrl(value) || String(value || "").trim();
  const cleanFileName = fileName.split("?")[0].split("#")[0];
  const ext = cleanFileName.includes(".")
    ? cleanFileName.split(".").pop()
    : "";

  return ext.toLowerCase();
};

const normalizeDocumentUrl = (value) => {
  if (!value || typeof value !== "string") return "";

  const trimmedValue = value.trim();
  if (!trimmedValue) return "";

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("blob:")
  ) {
    return trimmedValue;
  }

  const normalizedPath = trimmedValue.replace(/\\/g, "/");
  const cleanBaseUrl = BASE_URL.replace(/\/$/, "");

  if (normalizedPath.startsWith("/")) {
    return `${cleanBaseUrl}${normalizedPath}`;
  }

  return `${cleanBaseUrl}/${normalizedPath.replace(/^\.?\//, "")}`;
};

const getDocumentDisplayName = (docId, docValue, fallbackUrl) => {
  if (typeof docValue === "object" && docValue !== null) {
    const explicitName =
      docValue.fileName ||
      docValue.file_name ||
      docValue.filename ||
      docValue.name ||
      docValue.original_name ||
      docValue.originalName ||
      docValue.document_name ||
      docValue.documentName ||
      docValue.label;

    if (explicitName) {
      return explicitName;
    }
  }

  return extractFileNameFromUrl(fallbackUrl) || `Document ${docId}`;
};

const normalizeDocumentId = (value, fallbackValue = "") => {
  const rawValue =
    value !== undefined && value !== null ? String(value).trim() : "";

  if (!rawValue) {
    return fallbackValue ? String(fallbackValue) : "";
  }

  const matchedNumber = rawValue.match(/\d+/);
  if (matchedNumber) {
    return matchedNumber[0];
  }

  return rawValue;
};

const normalizeDepartment = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "scrutiny" ? "verification" : normalized;
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
  return labels[normalizeDepartment(value)] || "Verification Team";
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatShortfall = (value) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  const normalized = String(value || "").trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(normalized)) return "Yes";
  if (["no", "n", "false", "0"].includes(normalized)) return "No";
  return "N/A";
};

const PROJECT_PAGE_5_REMARK_DOCUMENT = "Project Registration Page 5";
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

  return normalized || "";
};

const normalizeDocumentEntry = (docId, docValue) => {
  if (!docValue) return null;

  if (typeof docValue === "string") {
    const url = normalizeDocumentUrl(docValue);

    return url
      ? {
          url,
          fileName: getDocumentDisplayName(docId, docValue, url),
        }
      : null;
  }

  if (Array.isArray(docValue)) {
    const firstValidEntry = docValue.find(Boolean);
    return normalizeDocumentEntry(docId, firstValidEntry);
  }

  if (typeof docValue === "object") {
    const rawUrl =
      docValue.url ||
      docValue.file_url ||
      docValue.fileUrl ||
      docValue.path ||
      docValue.file_path ||
      docValue.filePath ||
      docValue.document_url ||
      docValue.documentUrl ||
      docValue.download_url ||
      docValue.downloadUrl ||
      docValue.href;

    const url = normalizeDocumentUrl(rawUrl);

    if (!url) {
      return null;
    }

    return {
      url,
      fileName: getDocumentDisplayName(docId, docValue, url),
    };
  }

  return null;
};

const normalizeDocumentsPayload = (documents) => {
  const normalizedDocs = {};

  if (!documents) return normalizedDocs;

  let parsedDocuments = documents;

  if (typeof parsedDocuments === "string") {
    try {
      parsedDocuments = JSON.parse(parsedDocuments);
    } catch (error) {
      console.error("Unable to parse documents payload:", error);
      return normalizedDocs;
    }
  }

  if (Array.isArray(parsedDocuments)) {
    parsedDocuments.forEach((docValue, index) => {
      const rawDocId =
        docValue?.doc_id ||
        docValue?.docId ||
        docValue?.document_id ||
        docValue?.documentId ||
        docValue?.document_name ||
        docValue?.documentName ||
        docValue?.id ||
        index + 1;

      const docId = normalizeDocumentId(rawDocId, index + 1);
      const normalizedDoc = normalizeDocumentEntry(docId, docValue);
      if (normalizedDoc) {
        normalizedDocs[String(docId)] = normalizedDoc;
      }
    });

    return normalizedDocs;
  }

  if (typeof parsedDocuments === "object") {
    Object.entries(parsedDocuments).forEach(([rawDocId, docValue], index) => {
      const docId = normalizeDocumentId(
        rawDocId || docValue?.document_name || docValue?.documentName,
        index + 1
      );
      const normalizedDoc = normalizeDocumentEntry(docId, docValue);
      if (normalizedDoc) {
        normalizedDocs[String(docId)] = normalizedDoc;
      }
    });
  }

  return normalizedDocs;
};

const ScrutinyProjectregistation5 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAdmin();
const dept = admin?.department?.toLowerCase();
const activeVerificationTeam = normalizeDepartment(dept || "verification");

// ✅ ADD THIS LINE
const isRestrictedDept = ["planning", "ad", "dd"].includes(activeVerificationTeam);
const allowedDocsByDept = {
  verification: "ALL",

  legal: [1,4,5,6,7,14,18,19,20,21,22,23,25,26,27],
  audit: [16,17,18,19,25],
  planning: [2,3,7,8,9,10,14,26],
  engineer: [8,10,12,13,14,15,16,24],
  l1: [1,4,5,6,7,14,18,19,20,21,22,23,25,26,27],
  l2: [1,4,5,6,7,14,18,19,20,21,22,23,25,26,27],
};

  const panNumber =
    location.state?.panNumber ||
    sessionStorage.getItem("panNumber") ||
    "ODZPS3189G";

  const applicationNumber =
    location.state?.applicationNumber ||
    sessionStorage.getItem("applicationNumber") ||
    "100126116502";

  const promoterType = normalizePromoterType(
    location.state?.promoterType || sessionStorage.getItem("promoterType")
  );

  const [isLoading, setIsLoading] = useState(false);
  const [fetchSuccessMsg, setFetchSuccessMsg] = useState("");
  const [consultantData, setConsultantData] = useState({
    consultancyName: "",
    consultantName: "",
    mobile: "",
    email: "",
    address: "",
    declarationChecked: false,
    note1Checked: false,
    note2Checked: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [remarks, setRemarks] = useState("");
  const [shortfall, setShortfall] = useState("");
  const [savedRemarks, setSavedRemarks] = useState([]);
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const [remarksSaving, setRemarksSaving] = useState(false);
  const [remarksMessage, setRemarksMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
const [selectedDoc, setSelectedDoc] = useState(null);

const handleOpenDocument = (url, fileName, doc) => {
  setSelectedDoc({
  url: url,
  fileName: fileName,
  title: doc.text,   
  docId: doc.id     
});
  setShowModal(true);
};

  useEffect(() => {
    sessionStorage.setItem("panNumber", panNumber);
    sessionStorage.setItem("applicationNumber", applicationNumber);

    if (promoterType) {
      sessionStorage.setItem("promoterType", promoterType);
    }
  }, [panNumber, applicationNumber, promoterType]);

  useEffect(() => {
    const fetchExistingData = async () => {
      setIsLoading(true);

      try {
        const res = await apiPost("/api/project/documents-consultant/get", {
          application_number: applicationNumber,
          pan_number: panNumber,
        });

        if (res.status === "success") {
          if (res.consultant && Object.keys(res.consultant).length > 0) {
            setConsultantData({
              consultancyName: res.consultant.consultancy_name || "",
              consultantName: res.consultant.consultant_name || "",
              mobile: res.consultant.mobile_number || "",
              email: res.consultant.email_id || "",
              address: res.consultant.address || "",
              declarationChecked: res.consultant.declaration_accept === "Y",
              note1Checked: res.consultant.note1_accept === "Y",
              note2Checked: res.consultant.note2_accept === "Y",
            });
          }

          const documentsPayload =
            res.documents ||
            res.data?.documents ||
            res.project_upload_documents ||
            res.data?.project_upload_documents ||
            {};
          console.log("DOCUMENTS PAYLOAD:", documentsPayload);
          setUploadedFiles(normalizeDocumentsPayload(documentsPayload));

          setFetchSuccessMsg(
            ""
          );
        } else {
          setFetchSuccessMsg("");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setFetchSuccessMsg("");
      } finally {
        setIsLoading(false);
      }
    };

    if (applicationNumber && panNumber) {
      fetchExistingData();
    }
  }, [applicationNumber, panNumber]);

const documentsWithStatus = useMemo(() => {
  let docs = scrutinyUploadDocuments;

  const allowed = isRestrictedDept
  ? allowedDocsByDept["planning"]
  : allowedDocsByDept[activeVerificationTeam];

  if (allowed && allowed !== "ALL") {
    docs = scrutinyUploadDocuments.filter((doc) =>
      allowed.includes(doc.id)
    );
  }

  return docs.map((doc) => {
    const uploaded = uploadedFiles[doc.id];

    return {
      ...doc,
      url: uploaded?.url || "",
      fileName: uploaded?.fileName || `Document ${doc.id}`,
    };
  });
}, [uploadedFiles, activeVerificationTeam]);

  const loadPageRemarks = async () => {
    if (!String(applicationNumber || "").trim()) return;

    try {
      const encodedApplicationNo = encodeURIComponent(String(applicationNumber).trim());
      const [remarksResponse, finalStatusResponse] = await Promise.all([
        apiGet(`/api/scrutiny/verification-remarks?application_no=${encodedApplicationNo}&document_name=${encodeURIComponent(PROJECT_PAGE_5_REMARK_DOCUMENT)}&verification_team=${activeVerificationTeam}`),
        apiGet(`/api/scrutiny/final-status?application_no=${encodedApplicationNo}`),
      ]);

      setSavedRemarks(Array.isArray(remarksResponse?.rows) ? remarksResponse.rows : []);
      setFinalSubmitted(
        Array.isArray(finalStatusResponse?.rows) &&
          finalStatusResponse.rows.some(
            (row) => normalizeDepartment(row.verified_by) === activeVerificationTeam
          )
      );
    } catch (loadRemarksError) {
      console.error("Project page 5 remarks fetch failed", loadRemarksError);
    }
  };

  useEffect(() => {
    loadPageRemarks();
  }, [applicationNumber, activeVerificationTeam]);

  const savedPageRemark = savedRemarks[0] || null;
  const remarksLocked = finalSubmitted || Boolean(savedPageRemark);

  const handleAddRemark = async () => {
    if (remarksLocked) return;

    const trimmedRemarks = remarks.trim();
    if (!String(applicationNumber || "").trim()) {
      alert("Application number is missing.");
      return;
    }

    if (!shortfall) {
      alert("Please select whether there is any shortfall.");
      return;
    }

    if (!trimmedRemarks) {
      alert("Please enter remarks before adding.");
      return;
    }

    try {
      setRemarksSaving(true);
      setRemarksMessage("");
      await apiPost("/api/scrutiny/verification-remarks", {
        application_no: String(applicationNumber).trim(),
        document_name: PROJECT_PAGE_5_REMARK_DOCUMENT,
        verification_team: activeVerificationTeam,
        is_shortfall: shortfall === "yes",
        status: "pending",
        remarks: trimmedRemarks,
        verified_by: getDepartmentLabel(activeVerificationTeam),
      });
      setRemarks("");
      setShortfall("");
      setRemarksMessage("Remark added successfully.");
      await loadPageRemarks();
    } catch (saveRemarkError) {
      alert(saveRemarkError.message || "Unable to save remarks.");
    } finally {
      setRemarksSaving(false);
    }
  };

  const handleRemoveRemark = async (remarkId) => {
    if (finalSubmitted || !remarkId) return;

    if (!window.confirm("Remove this remark?")) return;

    try {
      setRemarksSaving(true);
      await apiDelete(
        `/api/scrutiny/verification-remarks/${remarkId}?application_no=${encodeURIComponent(String(applicationNumber).trim())}`
      );
      setRemarksMessage("Remark removed successfully.");
      await loadPageRemarks();
    } catch (removeRemarkError) {
      alert(removeRemarkError.message || "Unable to remove remark.");
    } finally {
      setRemarksSaving(false);
    }
  };
  const handleSaveAndContinue = () => {
    navigate("/scrutiny/project-registration_action", {
      state: { panNumber, applicationNumber, promoterType },
    });
  };

  return (
    <>
    <ScrutinyLayout>
      <div className="scrutiny-upload-container">
        <ScrutinyPageHeader />

        <ProjectWizard currentStep={5} />

        {fetchSuccessMsg && (
          <div className="scrutiny-upload-alert scrutiny-upload-alert-success">
            {fetchSuccessMsg}
          </div>
        )}

        {isLoading && (
          <div className="scrutiny-upload-alert scrutiny-upload-alert-info">
            Loading existing upload details...
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveAndContinue();
          }}
          className="scrutiny-upload-form"
        >
          <h2 className="scrutiny-upload-title">Project Registration</h2>

          <section className="scrutiny-upload-section">
            <h3 className="scrutiny-upload-heading">Uploaded Documents</h3>

            <div className="scrutiny-upload-table-wrap">
              <table className="scrutiny-upload-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Document Type</th>
                    <th>Uploaded Document</th>
                  </tr>
                </thead>
                <tbody>
                  {documentsWithStatus.map((doc, index) => (
                    <tr key={doc.id}>
                      <td>{doc.id}</td>
                      <td>
                        {doc.text}
                        {doc.text1 && (
                          <span className="scrutiny-upload-doc-note">
                            {" "}
                            {doc.text1}
                          </span>
                        )}
                      </td>
                      <td>
                        {doc.url ? (
                          <span
  className="scrutiny-upload-link"
  style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
  onClick={() => handleOpenDocument(doc.url, doc.fileName, doc)}
>
  {doc.fileName}
</span>
                        ) : (
                          <span className="scrutiny-upload-muted">No file uploaded</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="scrutiny-upload-section">
            <h3 className="scrutiny-upload-heading">Submitted By</h3>

            <div className="scrutiny-upload-display-group">
              <span className="scrutiny-upload-label">
                This Project Registration application is submitted by
              </span>
              <span className="scrutiny-upload-value">Consultancy</span>
            </div>
          </section>

          <section className="scrutiny-upload-section">
            <h3 className="scrutiny-upload-heading">Consultancy Details</h3>

            <div className="scrutiny-upload-grid scrutiny-upload-grid-2">
              <div className="scrutiny-upload-display-group">
                <span className="scrutiny-upload-label">
                  Name of Consultancy/Agency/Association/Individual
                </span>
                <span className="scrutiny-upload-value">
                  {safe(consultantData.consultancyName)}
                </span>
              </div>

              <div className="scrutiny-upload-display-group">
                <span className="scrutiny-upload-label">Name</span>
                <span className="scrutiny-upload-value">
                  {safe(consultantData.consultantName)}
                </span>
              </div>

              <div className="scrutiny-upload-display-group">
                <span className="scrutiny-upload-label">Mobile Number</span>
                <span className="scrutiny-upload-value">
                  {safe(consultantData.mobile)}
                </span>
              </div>

              <div className="scrutiny-upload-display-group">
                <span className="scrutiny-upload-label">Email Id</span>
                <span className="scrutiny-upload-value">
                  {safe(consultantData.email)}
                </span>
              </div>

              <div className="scrutiny-upload-display-group scrutiny-upload-full">
                <span className="scrutiny-upload-label">
                  Full Address for communication
                </span>
                <span className="scrutiny-upload-value">
                  {safe(consultantData.address)}
                </span>
              </div>
            </div>

            <p className="scrutiny-upload-note">
              Note: If encountered any issue during upload of documents, please
              contact APRERA IT Support Team.
            </p>
          </section>

          <section className="scrutiny-upload-section">
            <h3 className="scrutiny-upload-heading">Declaration</h3>

            <label className="scrutiny-upload-checkline">
              <input
                type="checkbox"
                checked={consultantData.declarationChecked}
                readOnly
              />
              <span>
                I/We{" "}
                <strong>{safe(consultantData.consultantName)}</strong> solemnly
                affirm and declare that the particulars given above are correct to
                my/our knowledge and belief.
              </span>
            </label>
          </section>

          <section className="scrutiny-upload-section">
            <h3 className="scrutiny-upload-heading">Note</h3>

            <div className="scrutiny-upload-note-list">
              <label className="scrutiny-upload-checkline">
                <input
                  type="checkbox"
                  checked={consultantData.note1Checked}
                  readOnly
                />
                <span>
                  1. The applicability of the Penalty/additional fee may be
                  imposed, if any, provision of the act is violated, as
                  determined by the Authority, as the case may be.
                </span>
              </label>

              <label className="scrutiny-upload-checkline">
                <input
                  type="checkbox"
                  checked={consultantData.note2Checked}
                  readOnly
                />
                <span>
                  2. As per section 4 of the RERA Act, 2016, you are hereby
                  directed to address the shortfalls within 15 days as addressed
                  by the Authority, failing which the application may be rejected
                  as per Section 4 of the Act.
                </span>
              </label>
            </div>
          </section>

          <section className="scrutiny-remarks-card">
            <div className="scrutiny-remarks-head">
              <h3>Enter Remarks (Data Shortfall Remarks if any)*</h3>
              <span>{Math.max(0, 5000 - remarks.length)}</span>
            </div>

            <div className="spr-shortfall-row" style={{ display: "flex", gap: "20px", margin: "10px 0 14px" }}>
              <label className="spr-radio">
                <input
                  type="radio"
                  name="projectPage5Shortfall"
                  value="yes"
                  checked={shortfall === "yes"}
                  disabled={remarksLocked}
                  onChange={(event) => setShortfall(event.target.value)}
                />
                <span style={{ marginLeft: "5px" }}>Yes</span>
              </label>
              <label className="spr-radio">
                <input
                  type="radio"
                  name="projectPage5Shortfall"
                  value="no"
                  checked={shortfall === "no"}
                  disabled={remarksLocked}
                  onChange={(event) => setShortfall(event.target.value)}
                />
                <span style={{ marginLeft: "5px" }}>No</span>
              </label>
            </div>

            <textarea
              id="scrutiny-upload-remarks"
              className="scrutiny-remarks-box"
              maxLength={5000}
              value={remarks}
              disabled={remarksLocked}
              onChange={(event) => setRemarks(event.target.value.slice(0, 5000))}
              placeholder="Maximum of 5000 Characters"
            />

            <div className="spr-submit-row" style={{ marginTop: "15px", textAlign: "right" }}>
              {remarksMessage ? (
                <span style={{ marginRight: "12px", color: "#166534", fontWeight: 600 }}>{remarksMessage}</span>
              ) : null}
              <button
                type="button"
                className="scrutiny-upload-button"
                onClick={handleAddRemark}
                disabled={remarksSaving || remarksLocked}
              >
                {savedPageRemark ? "Remark Added" : "Add Remark"}
              </button>
            </div>

            {savedRemarks.length > 0 && (
              <div className="scrutiny-upload-table-wrap" style={{ marginTop: "15px" }}>
                <table className="scrutiny-upload-table">
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
                    {savedRemarks.map((item, index) => (
                      <tr key={item.id || index}>
                        <td>{index + 1}</td>
                        <td>{getDepartmentLabel(item.verified_by || item.verification_team)}</td>
                        <td>{formatShortfall(item.is_shortfall)}</td>
                        <td>{item.remarks || "N/A"}</td>
                        <td>{formatDateTime(item.created_at || item.updated_at)}</td>
                        <td>
                          {!finalSubmitted ? (
                            <button
                              type="button"
                              className="scrutiny-upload-button"
                              onClick={() => handleRemoveRemark(item.id)}
                              disabled={remarksSaving}
                            >
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

          <div className="scrutiny-upload-section scrutiny-upload-actions">
            <button
              type="submit"
              className="scrutiny-upload-button"
              disabled={isLoading}
            >
              Continue to Next Page
            </button>
          </div>
        </form>
      </div>
    </ScrutinyLayout>
    {showModal && selectedDoc && (
  <ScrutinyDocumentRemarkModal
    isOpen={showModal}
    documentItem={selectedDoc}
    onClose={() => setShowModal(false)}
    applicationNo={applicationNumber}
    verificationTeam={activeVerificationTeam}
    authorityLabel={getDepartmentLabel(activeVerificationTeam)}
    readOnly={finalSubmitted}
  />
)}
</>
  );
};


export default ScrutinyProjectregistation5;
