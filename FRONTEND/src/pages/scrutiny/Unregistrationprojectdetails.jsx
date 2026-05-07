import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import '../../styles/scrutiny/unregisterDetails.css';
import { useAdmin } from "../../context/AdminContext";
import { BASE_URL } from "../../api/api";



const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : null;

const fmtToday = () =>
  new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });

const Val = ({ v, mono = false }) => {
  if (v === null || v === undefined || v === "" || v === "null")
    return <span className="unregDetails-field-value null-val">Not Available</span>;
  return <span className={`unregDetails-field-value${mono ? " mono" : ""}`}>{String(v)}</span>;
};

const BoolVal = ({ v }) => {
  if (v === null || v === undefined)
    return <span className="unregDetails-field-value null-val">Not Set</span>;
  return (
    <span className={`unregList-badge ${v ? "unregList-badge-registered" : "unregList-badge-unregistered"}`}>
      <span className="unregList-badge-dot" />
      {v ? "Yes" : "No"}
    </span>
  );
};

const Row = ({ label, children }) => (
  <div className="unregDetails-field-row">
    <span className="unregDetails-field-label">{label}</span>
    {children}
  </div>
);

const S1Modal = ({ data, onClose, onSuccess, user }) => {
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!remarks.trim()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("approval_status", "s2");
      fd.append("s1_remarks", remarks.trim());
      fd.append("s1_authority_id", user?.id);

      const res = await fetch(`${BASE_URL}/api/project-unregistered/${data.id}`, {
        method: "PATCH",
        body: fd,
      });
      
      if (!res.ok) throw new Error("Server error");
      onSuccess("Authority informed successfully.");
    } catch {
      onSuccess("Request submitted (server may be offline).", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unreg-modal-backdrop">
      <div className="unreg-modal">
        <div className="unreg-modal-head">
          <div className="unreg-modal-head-left">
            <span className="unreg-modal-icon">📨</span>
            <div>
              <div className="unreg-modal-title">Inform the Authority</div>
              <div className="unreg-modal-sub">Submit remarks to the authority for review.</div>
            </div>
          </div>
          <button className="unreg-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="unreg-modal-body">
          <div className="unreg-modal-field">
            <label className="unreg-modal-label">
              Remarks <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <textarea
              className="unreg-modal-textarea"
              rows={5}
              placeholder="Enter your remarks here..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <div className="unreg-modal-info-box">
            ℹ️ Approval status will be updated to <strong>S2</strong> and your remarks will be recorded.
          </div>
        </div>

        <div className="unreg-modal-footer">
          <button className="unreg-modal-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="unreg-modal-btn-primary"
            onClick={handleSubmit}
            disabled={loading || !remarks.trim()}
          >
            {loading ? "Submitting…" : "📨 Send to Authority"}
          </button>
        </div>
      </div>
    </div>
  );
};

const S2Modal = ({ data, onClose, onSuccess, user }) => {
  const [remarks, setRemarks] = useState("");
  const [signImg, setSignImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const noticeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Detect project type: LAYOUT or BUILDING
  const isLayout = (data.project_type || "").toUpperCase() === "LAYOUT";

  // Clean address: backend stores as "part1$part2"
  const ownerAddress = (data.owner_builder_address || "").replace(/\$/g, ", ");

  const pickSign = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSignImg(ev.target.result);
    reader.readAsDataURL(file);
  };


  
    
  const handleSubmit = async () => {
    if (!remarks.trim()) return;
    setLoading(true);
    try {
      let noticePdfBlob = null;
      try {
        const html2pdf = (await import("html2pdf.js")).default;
        noticePdfBlob = await html2pdf()
          .set({
            margin: 12,
            filename: `notice_${data.id}.pdf`,
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .from(noticeRef.current)
          .outputPdf("blob");
      } catch {
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body>${noticeRef.current?.innerHTML || ""}</body></html>`;
        noticePdfBlob = new Blob([html], { type: "text/html" });
      }

      const fd = new FormData();
      fd.append("approval_status", "s3");
      fd.append("s2_authority_id", user?.id);
      fd.append("s2_remarks", remarks.trim());
      if (noticePdfBlob) {
        fd.append("first_notice", noticePdfBlob, `notice_${data.id}.pdf`);
      }

      const res = await fetch(`${BASE_URL}/api/project-unregistered/${data.id}`, {
        method: "PATCH",
        body: fd,
      });
      if (res.ok) {
  const mailFd = new FormData();

  mailFd.append("email", data.owner_email);
  mailFd.append("remarks", remarks.trim());
  mailFd.append("subject", "AP RERA Notice");

  if (noticePdfBlob) {
    mailFd.append("notice1", noticePdfBlob, `notice_${data.id}.pdf`);
  }

  // await fetch(
  //   `${BASE_URL}/api/project-unregistered/send-notice-mail/${data.id}`,
  //   {
  //     method: "POST",
  //     body: mailFd,
  //   }
  // );
}
      if (!res.ok) throw new Error("Server error");
      onSuccess("Notice generated and sent successfully.");
    } catch {
      onSuccess("Request submitted (server may be offline).", "error");
    } finally {
      setLoading(false);
    }
  };



  

  return (
    <div className="unreg-modal-backdrop">
      <div className="unreg-modal unreg-modal-wide">
        <div className="unreg-modal-head">
          <div className="unreg-modal-head-left">
            <span className="unreg-modal-icon">📄</span>
            <div>
              <div className="unreg-modal-title">
                Generate Notice — {isLayout ? "Layout Project" : "Building Project"}
              </div>
              <div className="unreg-modal-sub">
                Auto-generated AP RERA notice with real project data • Upload digital signature • Submit
              </div>
            </div>
          </div>
          <button className="unreg-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="unreg-modal-body unreg-modal-body-scroll">

          {/* ──────────── NOTICE PREVIEW ──────────── */}
          <div className="unreg-notice-outer">
            <div className="unreg-notice-paper" ref={noticeRef}>

              {/* AP RERA Header */}
              <div className="unreg-notice-authority-header">
                <div className="unreg-notice-authority-name">
                  ANDHRA PRADESH REAL ESTATE REGULATORY AUTHORITY, VIJAYAWADA.
                </div>
                <div className="unreg-notice-authority-addr">
                  D.No: 60-5-1, Y Tower, Siddhartha Nagar 1st Lane,
                  Pinnamaneni Polyclinic Road, Vijayawada — 520010
                </div>
              </div>

              <div className="unreg-notice-meta-row">
                <div>
                  <strong>Notice No.: </strong>
                  {String(data.s_no || "01").padStart(2, "0")}/UR/
                  {(data.district || "AP").split(" ")[0]}/2026
                </div>
                <div><strong>Date: </strong>{fmtToday()}</div>
              </div>

              {/* Subject */}
              <div className="unreg-notice-subject">
                <strong>Sub:</strong> Notice under sec 35(1) of Real Estate (Regulation and
                Development) Act, 2016 — {data.owner_name || "Promoter"},{" "}
                {data.mandal_city || data.district || ""} — Orders requested — Reg.
              </div>

              {/* References */}
              <div className="unreg-notice-refs">
                <strong>Ref:</strong>
                <ol className="unreg-notice-ref-list">
                  <li>The Real Estate (Regulation and Development) Act, 2016.</li>
                  <li>
                    AP Real Estate (Regulation and Development) Rules approved in G.O.Ms.No.:115
                    MA &amp; UD Dept. Dt. 27-03-2017.
                  </li>
                  {data.ba_no && (
                    <li>Proceedings of DPMS BA.NO. {data.ba_no}.</li>
                  )}
                  {data.fileno && <li>File No. {data.fileno}.</li>}
                </ol>
              </div>

              <div className="unreg-notice-stars">* * * * * * * *</div>

              {/* Para 1 — Statutory requirement */}
              <p className="unreg-notice-para">
                As per the Section 3(1) of Real Estate (Regulation and Development) Act, 2016 and
                Rules made there under, every Real Estate project (both Proposed and Ongoing) has
                to be registered with the Real Estate Regulatory Authority which is mandatory. As
                per the above Section no promoter in a proposed project shall advertise, market,
                book, sell or offer for sale or invite persons to purchase in any manner any plot,
                apartment or building, as the case may be, in any real estate project or part of
                it, in any planning area, without registering the real estate project with the Real
                Estate Regulatory Authority and every promoter in an ongoing project, shall make an
                application to this Authority for registration of the said project within a period
                of three months from the date of commencement of the Act.
              </p>

              {/* Para 2 — Project-type specific */}
              {isLayout ? (
                <p className="unreg-notice-para">
                  As per the reference above, it is brought to the notice of this Authority
                  that <strong>{data.owner_name || "the promoter"}</strong> has obtained layout
                  permission for development of a layout consisting of{" "}
                  <strong>{data.no_of_plots || "—"} plots</strong> admeasuring{" "}
                  <strong>{data.site_area_acres || "—"} acres</strong> (Plot Area:{" "}
                  {data.plot_area
                    ? Number(data.plot_area).toLocaleString("en-IN") + " sq.m"
                    : "—"}
                  ) located at{" "}
                  <strong>
                    {[data.village_location, data.mandal_city, data.district]
                      .filter(Boolean)
                      .join(", ")}
                  </strong>
                  {data.ulb_uda_name ? `, under ${data.ulb_uda_name}` : ""}
                  {data.fileno ? ` vide File No. ${data.fileno}` : ""}
                  {data.lp_no ? `, LP No. ${data.lp_no}` : ""}.
                </p>
              ) : (
                <p className="unreg-notice-para">
                  As per the reference above, it is brought to the notice of this Authority
                  that <strong>{data.owner_name || "the promoter"}</strong> has obtained
                  permission for development of a Residential Building
                  {data.housing_units
                    ? ` consisting of ${data.housing_units} housing units`
                    : ""}
                  {data.approved_bua
                    ? ` with approved BUA of ${Number(data.approved_bua).toLocaleString("en-IN")} sq.m`
                    : ""}
                  {" "}located at{" "}
                  <strong>
                    {[data.village_location, data.mandal_city, data.district]
                      .filter(Boolean)
                      .join(", ")}
                  </strong>
                  {data.ulb_uda_name ? `, under ${data.ulb_uda_name}` : ""}
                  {data.fileno ? ` vide File No. ${data.fileno}` : ""}
                  {data.ba_no ? `, BA No. ${data.ba_no}` : ""}.
                </p>
              )}

              {/* Para 3 — Not registered */}
              <p className="unreg-notice-para">
                As per the records of this Authority, it is noticed that you have{" "}
                <strong>not applied for the Registration</strong> of your project before this
                Authority nor obtained a Project Registration Certificate from this Authority.
              </p>

              <p className="unreg-notice-para">
                <strong>Therefore, you are hereby called upon to show cause:</strong>
              </p>

              {/* Show cause paragraph */}
              <p className="unreg-notice-para unreg-notice-indent">
                To produce the information and explain the reasons for not registering your
                project with this Authority in writing together with all the necessary
                records/permission if any obtained within <strong>15 days</strong> from the date
                of receipt of this notice, failing which appropriate action will be initiated
                against you as per Section 59(1) of the Real Estate (Regulation and Development)
                Act, 2016 and you are liable to pay the penalty which may extend up to{" "}
                <strong>10 percent of the estimated cost of the project</strong> as determined by
                this Authority, treating the same as a contravention of the provision of Section
                3 of the Real Estate (Regulation and Development) Act, 2016.
              </p>

              {/* Signature block */}
              <div className="unreg-notice-sig-row">
                <div style={{ flex: 1 }} />
                <div className="unreg-notice-sig-block">
                  {signImg ? (
                    <img
                      src={signImg}
                      alt="Digital Signature"
                      className="unreg-notice-sig-img"
                    />
                  ) : (
                    <div className="unreg-notice-sig-placeholder">[Digital Signature]</div>
                  )}
                  <div className="unreg-notice-sig-label">
                    Authorised Officer<br />
                    AP Real Estate Regulatory Authority
                  </div>
                </div>
              </div>

              {/* To block */}
              <div className="unreg-notice-to-block">
                <div><strong>To,</strong></div>
                <div><strong>{data.owner_name || "—"}</strong></div>
                {data.owner_mobile_no && <div>Mobile: {data.owner_mobile_no}</div>}
                {data.owner_email && <div>Email: {data.owner_email}</div>}
                {ownerAddress && <div>{ownerAddress}</div>}
                {(data.mandal_city || data.district) && (
                  <div>{[data.mandal_city, data.district].filter(Boolean).join(", ")}</div>
                )}
              </div>

              <div className="unreg-notice-footnote">
                <strong>Note:</strong> In case if you/your firm have already applied for
                registration of project in AP RERA website{" "}
                <a href="https://rera.ap.gov.in" target="_blank" rel="noreferrer">
                  https://rera.ap.gov.in
                </a>
                , reply accordingly.
              </div>
            </div>
          </div>

          {/* ──────────── DIGITAL SIGNATURE UPLOAD ──────────── */}
          <div className="unreg-sign-upload-section">
            <div className="unreg-sign-upload-title">🖊️ Upload Digital Signature</div>
            <div className="unreg-sign-upload-row">
              <label className="unreg-sign-upload-btn">
                {signImg ? "✅ Signature Uploaded — Change" : "📁 Choose Signature Image"}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={pickSign}
                  style={{ display: "none" }}
                />
              </label>
              {signImg && (
                <div className="unreg-sign-preview-wrap">
                  <img src={signImg} alt="Signature Preview" className="unreg-sign-preview" />
                  <button
                    className="unreg-sign-remove"
                    onClick={() => setSignImg(null)}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ──────────── APPROVAL HISTORY TABLE ──────────── */}
          <div className="unreg-history-section">
            <div className="unreg-history-title">📋 Approval History</div>
            <table className="unreg-history-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Authority (S1 ID)</th>
                  <th>S1 Remarks</th>
                  <th>Approval Status</th>
                </tr>
              </thead>
              <tbody>
                {data.s1_authority_id || data.s1_remarks || data.approval_status ? (
                  <tr>
                    <td>1</td>
                    <td>{data.s1_authority_id || "—"}</td>
                    <td>{data.s1_remarks || "—"}</td>
                    <td>
                      <span className="unreg-status-chip">
                        {data.approval_status || "—"}
                      </span>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", color: "#8aa5be", padding: "16px" }}>
                      No approval history yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ──────────── REMARKS ──────────── */}
          <div className="unreg-modal-field">
            <label className="unreg-modal-label">
              Remarks <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <textarea
              className="unreg-modal-textarea"
              rows={4}
              placeholder="Enter your remarks / directives for this notice..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="unreg-modal-info-box unreg-modal-info-green">
            ✅ This will generate the official AP RERA notice PDF and attach it.
            Approval status will be updated to <strong>S3</strong>.
          </div>
        </div>

        <div className="unreg-modal-footer">
          <button className="unreg-modal-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="unreg-modal-btn-success"
            onClick={handleSubmit}
            disabled={loading || !remarks.trim()}
          >
            {loading ? "Generating & Sending…" : "✅ Send Notice to Authority"}
          </button>
        </div>
      </div>
    </div>
  );
};


// ✅ NEW S3Modal (CORRECT PLACE)
const S3Modal = ({ data, onClose, onSuccess }) => {
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  if (!remarks.trim()) return;

  setLoading(true);
  try {
    const fd = new FormData();
     fd.append("approval_status", "s4");
    fd.append("email", data.owner_email);
    fd.append("remarks", remarks.trim());
    fd.append("subject", "AP RERA Notice");

    // ✅ FIX HERE
    const fileResponse = await fetch(
      `${BASE_URL}/api/project-unregistered/view-file/${data.first_notice_doc_path}`
    );

    const blob = await fileResponse.blob();

    fd.append("notice1", blob, "notice.pdf");

    const res = await fetch(
      `${BASE_URL}/api/project-unregistered/send-notice-mail/${data.id}`,
      {
        method: "POST",
        body: fd,
      }
    );

    if (!res.ok) throw new Error("Mail failed");

    onSuccess("Mail sent successfully");
  } catch {
    onSuccess("Mail failed", "error");
  } finally {
    setLoading(false);
  }
};
  

  return (
    <div className="unreg-modal-backdrop">
      <div className="unreg-modal">
        <div className="unreg-modal-head">
          <div className="unreg-modal-title">Send Existing Notice</div>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="unreg-modal-body">
          {/* 🔥 FIXED LINK */}
         <a
  href={`${BASE_URL}/${data.first_notice_doc_path?.replace("backend/", "")}`}
  target="_blank"
  rel="noreferrer"
>
  📄 View Notice
</a>

          <textarea
            rows={4}
            placeholder="Enter remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <div className="unreg-modal-footer">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : "Send Mail"}
          </button>
        </div>
      </div>
    </div>
  );
};
const S4Modal = ({ data, onClose, onSuccess, user }) => {
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!remarks.trim()) return;

    setLoading(true);
    try {
      const fd = new FormData();

      // ✅ IMPORTANT CHANGE
      fd.append("approval_status", "s5");   
      fd.append("s4_remarks", remarks.trim());
      fd.append("s4_authority_id", user?.id);

      const res = await fetch(`${BASE_URL}/api/project-unregistered/${data.id}`, {
        method: "PATCH",
        body: fd,
      });

      if (!res.ok) throw new Error("Server error");

      onSuccess("Second time authority informed successfully.");
    } catch {
      onSuccess("Request failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unreg-modal-backdrop">
      <div className="unreg-modal">
        <div className="unreg-modal-head">
          <div className="unreg-modal-title">
            📨 Inform Authority (2nd Time)
          </div>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="unreg-modal-body">
          <textarea
            rows={5}
            placeholder="Enter remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <div className="unreg-modal-footer">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};


const S5Modal = ({ data, onClose, onSuccess, user }) => {
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState(null);
  const noticeRef = useRef(null);

  const handleSubmit = async () => {
    if (!remarks.trim()) return;

    setLoading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const noticePdfBlob = await html2pdf()
        .set({
          margin: 10,
          filename: `rera_notice_${data.id}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4" },
        })
        .from(noticeRef.current)
        .outputPdf("blob");

      const fd = new FormData();

      // ✅ IMPORTANT (YOUR REQUIREMENT)
      fd.append("approval_status", "s6");
      fd.append("s5_authority_id", user?.id);
      fd.append("s5_remarks", remarks.trim());
      fd.append("rera_notice", noticePdfBlob);

      const res = await fetch(`${BASE_URL}/api/project-unregistered/${data.id}`, {
        method: "PATCH",
        body: fd,
      });

      if (!res.ok) throw new Error("Server error");

      onSuccess("2nd Notice generated successfully");
    } catch {
      onSuccess("Failed to generate 2nd notice", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unreg-modal-backdrop">
      <div className="unreg-modal unreg-modal-wide">
        <div className="unreg-modal-head">
          <div className="unreg-modal-title">📄 Generate 2nd Notice (PH Notice)</div>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="unreg-modal-body">

          {/* ✅ DIFFERENT NOTICE FORMAT */}
          <div ref={noticeRef} style={{ padding: "20px", fontFamily: "serif" }}>

             <h3 style={{ textAlign: "center" }}>
    ANDHRA PRADESH REAL ESTATE REGULATORY AUTHORITY
  </h3>

  <p style={{ textAlign: "center" }}>
    6th & 7th Floors, APCRDA Project Office, Rayapudi Post, Tulluru Mandal,<br/>
    Amaravati, Guntur District - 522237
  </p>

  <p style={{ textAlign: "center" }}>
    Email: helpdesk-rera@ap.gov.in | Mobile: 6304906011
  </p>

  <p>
    <b>Notice No:</b> {data.s_no}/UR/{data.district}/2026 &nbsp;&nbsp;
    <b>Date:</b> {new Date().toLocaleDateString()}
  </p>

  <p>
    <b>Sub:</b> Notice under Section 35(1) of Real Estate (Regulation and Development) Act, 2016 – Direction for registration of the Real Estate Project - Reg.
  </p>

  <p>
    <b>Ref:</b> BP No: {data.ba_no} &nbsp; Dt: {data.proceeding_order_date}
  </p>

  <p>*****</p>

  <p>
    It is noticed that you have obtained building permission for developing 
    <b> {data.project_type || "Residential Project"} </b> at 
    <b> {data.building_address} </b>. Despite notices issued earlier, you have neither responded nor applied for registration of the project till date.
  </p>

  <p>
    As per Section 3 r/w 35(1) of the Act, 2016, you are directed to appear in person 
    or through an authorized representative before this Authority at 
    <b> 11:00 AM </b> on <b> {new Date().toLocaleDateString()} </b> at the office of APRERA 
    and to submit your written submissions along with the following documents:
  </p>

  <ol>
    <li>Approved Plan and proceeding copy / GST returns / Income tax returns</li>
    <li>Copy of Estimated Cost of the project certified by CA</li>
    <li>All Bank Statements pertaining to the project</li>
  </ol>

  <p>
    Failure to appear before the Authority and submit relevant documents shall result in 
    ex-parte action under Section 59(1) of the Act, 2016, with penalty up to 10% of project cost.
  </p>

  {/* SIGNATURE */}
  <div style={{ textAlign: "right", marginTop: "50px" }}>
    {signature && (
      <img
        src={URL.createObjectURL(signature)}
        alt="signature"
        style={{ width: "150px", height: "80px" }}
      />
    )}
    <p>Authorised Officer</p>
    <p>A.P Real Estate Regulatory Authority</p>
  </div>

  {/* OWNER DETAILS */}
  <p><b>To</b></p>

  <p>
    OWNER: {data.owner_name}
  </p>

  <p>
    Address: {data.owner_builder_address}
  </p>

  <p>
    Mobile No: {data.owner_mobile_no}
  </p>

  <p>
    <b>Note:</b> If already applied for registration, mention it in reply.
  </p>
            <div style={{ textAlign: "right", marginTop: "40px" }}>
              <p>Authorised Officer</p>
              <p>AP RERA</p>
            </div>

          </div>

          {/* Remarks */}
          <textarea
            rows={4}
            placeholder="Enter remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <input
  type="file"
  accept="image/*"
  onChange={(e) => setSignature(e.target.files[0])}
/>

        </div>

        <div className="unreg-modal-footer">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Generating..." : "Generate 2nd Notice"}
          </button>
        </div>
      </div>
    </div>
  );
};


const S6Modal = ({ data, onClose, onSuccess }) => {
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!remarks.trim()) return;

    setLoading(true);
    try {
      const fd = new FormData();

      fd.append("email", data.owner_email);
      fd.append("remarks", remarks.trim());
      fd.append("subject", "AP RERA 2nd Notice");

      // ✅ IMPORTANT: fetch 2nd notice (rera_notice)
      const fileResponse = await fetch(
        `${BASE_URL}/api/project-unregistered/view-file/${data.rera_personal_notice_doc_path}`
      );

      const blob = await fileResponse.blob();

      // ✅ send as notice2
      fd.append("notice2", blob, "rera_notice.pdf");
      fd.append("approval_status", "s7");
      // ✅ SEND MAIL
      const res = await fetch(
        `${BASE_URL}/api/project-unregistered/send-notice-mail/${data.id}`,
        {
          method: "POST",
          body: fd,
        }
      );

      if (!res.ok) throw new Error("Mail failed");

      // ✅ UPDATE STATUS → s7
      const statusFd = new FormData();
      statusFd.append("approval_status", "s7");

      await fetch(`${BASE_URL}/api/project-unregistered/${data.id}`, {
        method: "PATCH",
        body: statusFd,
      });

      onSuccess("2nd Notice sent successfully");
    } catch {
      onSuccess("2nd Notice mail failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unreg-modal-backdrop">
      <div className="unreg-modal">
        <div className="unreg-modal-head">
          <div className="unreg-modal-title">Send 2nd Notice</div>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="unreg-modal-body">
          <a
           href={`${BASE_URL}/${docPath.replace("backend/", "")}`}
            target="_blank"
            rel="noreferrer"
          >
            📄 View 2nd Notice
          </a>

          <textarea
            rows={4}
            placeholder="Enter remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
         
        </div>

        <div className="unreg-modal-footer">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : "Send 2nd Notice"}
          </button>
        </div>
      </div>
    </div>
  );
};
/* ─────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────── */
export default function UnregistrationProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const navigateToApplication = () => {
  navigate(`/project-registration/${d.rera_registration_no}`);
};
  const location = useLocation();
  const [data, setData] = useState(null);
  const [authorityMap, setAuthorityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/project-unregistered/${id}`);
      const json = await res.json();

      console.log("API RESPONSE:", json);

      if (json.success) {
        setData(json.data);
      } else {
        setError("No data found");
      }
    } catch (err) {
      console.error("API ERROR:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);
  const [modal, setModal] = useState(null); // "s1" | "s2" | null
  const [toast, setToast] = useState(null);
  const { admin } = useAdmin();
  const role = admin?.role; 
  const user = location.state?.user;
  const record = location.state?.record;

  useEffect(() => {
    if (user) { console.log("👤 Received User:", user); console.log("🔑 Role:", user?.role); }
    else { console.log("⚠️ No user data received"); }
    if (record) { console.log("📄 Received Record:", record); }
  }, [user, record]);

  useEffect(() => {
    if (admin) { console.log("🔑 Role:", admin?.role); }
  }, [admin]);

 useEffect(() => {
  const fetchAuthorities = async () => {
    if (!data) return;

    const ids = [
      data.s1_authority_id,
      data.s2_authority_id,
      data.s4_authority_id,
      data.s5_authority_id,
      data.s6_authority_id
    ].filter(Boolean);

    const uniqueIds = [...new Set(ids)];

    let map = {};

    for (let id of uniqueIds) {
      try {
        const res = await fetch(`${BASE_URL}/api/userDetails/${id}`);
        const json = await res.json();

        if (json.success) {
          map[id] = json.admin;
        }
      } catch (err) {
        console.error("Failed to fetch authority", id);
      }
    }

    setAuthorityMap(map);
  };

  fetchAuthorities();
}, [data]);
  const showToast = (msg, type = "success") => {
    setModal(null);
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
      window.location.reload();
    }, 3000);
  };

  if (loading)
    return (
      <div className="unregDetails-page">
        <div className="unregDetails-loading">
          <div className="unregDetails-spinner" />
          <span>Loading project details...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="unregDetails-page">
        <div className="unregDetails-error">
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <div>{error}</div>
          <button
            className="unregDetails-back-btn"
            style={{ margin: "20px auto", display: "inline-flex" }}
            onClick={() => navigate('/UnregisterList')}
          >
            ← Go Back
          </button>
        </div>
      </div>
    );

  const d = data;
  const isLessThan15Days = () => {
  if (!d.first_notice_sent_date) return false;

  const firstNoticeDate = new Date(d.first_notice_sent_date);
  const today = new Date();

  const diffTime = today - firstNoticeDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays < 15;
};
  const isLessThan45Days = () => {
  if (!d.approved_date) return false;

  const approvedDate = new Date(d.approved_date);
  const today = new Date();

  const diffTime = today - approvedDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays < 45;
};
  const approvalStatus = d.approval_status;
  const isRegistered = d.rera_registered === true;
const hasRegNo = d.rera_registration_no !== null && d.rera_registration_no !== "";
const hasExemption = d.exemption_id !== null;
  const documents = [
    { label: "First Notice", path: d.first_notice_doc_path },
    { label: "RERA Personal Notice", path: d.rera_personal_notice_doc_path },
    { label: "SH Document", path: d.sh_document_path },
  ];

  return (
    <div className="unregDetails-page">
      <div className="unregDetails-header-title">Project Details</div>

      <div className="unregDetails-main">

        {/* HERO CARD */}
        <div className="unregDetails-hero">
          <div className="unregDetails-hero-top">
            <div className="unregDetails-owner-name">
              {d.owner_name || "Owner Name Not Available"}
            </div>
            <div className="unregDetails-hero-badges">
              {d.project_type && (
                <span className="unregDetails-type-badge">{d.project_type}</span>
              )}
              {d.approval_status && (
                <span className="unregList-badge unregList-badge-pending">
                  <span className="unregList-badge-dot" />{d.approval_status}
                </span>
              )}
            </div>
          </div>
          <div className="unregDetails-hero-meta">
            {d.fileno && (
              <div className="unregDetails-meta-item">
                <span className="unregDetails-meta-label">File No.</span>
                <span className="unregDetails-meta-value">{d.fileno}</span>
              </div>
            )}
            {d.lp_no && (
              <div className="unregDetails-meta-item">
                <span className="unregDetails-meta-label">LP No.</span>
                <span className="unregDetails-meta-value">{d.lp_no}</span>
              </div>
            )}
            {d.district && (
              <div className="unregDetails-meta-item">
                <span className="unregDetails-meta-label">District</span>
                <span className="unregDetails-meta-value">{d.district}</span>
              </div>
            )}
            {d.approved_date && (
              <div className="unregDetails-meta-item">
                <span className="unregDetails-meta-label">Approved On</span>
                <span className="unregDetails-meta-value">{fmtDate(d.approved_date)}</span>
              </div>
            )}
          </div>
        </div>

        {/* GRID ROW 1 */}
        <div className="unregDetails-grid">
          <div className="unregDetails-section">
            <div className="unregDetails-section-header">
              <span className="unregDetails-section-icon">👤</span>
              <span className="unregDetails-section-title">Owner Information</span>
            </div>
            <div className="unregDetails-fields">
              <Row label="Owner Name"><Val v={d.owner_name} /></Row>
              <Row label="Mobile No.">
                {d.owner_mobile_no
                  ? <a href={`tel:${d.owner_mobile_no}`} className="unregDetails-field-value" style={{ color: "var(--unreg-accent3)", textDecoration: "none" }}>📞 {d.owner_mobile_no}</a>
                  : <Val v={null} />}
              </Row>
              <Row label="Email">
                {d.owner_email
                  ? <a href={`mailto:${d.owner_email}`} className="unregDetails-field-value" style={{ color: "var(--unreg-accent2)", textDecoration: "none", fontSize: 12 }}>{d.owner_email}</a>
                  : <Val v={null} />}
              </Row>
              <Row label="Owner Address"><Val v={d.owner_builder_address} /></Row>
              <Row label="Organisation"><Val v={d.organisation} /></Row>
            </div>
          </div>

          <div className="unregDetails-section">
            <div className="unregDetails-section-header">
              <span className="unregDetails-section-icon">📍</span>
              <span className="unregDetails-section-title">Location Details</span>
            </div>
            <div className="unregDetails-fields">
              <Row label="District"><Val v={d.district} /></Row>
              <Row label="Mandal / City"><Val v={d.mandal_city} /></Row>
              <Row label="Village / Location"><Val v={d.village_location} /></Row>
              <Row label="ULB / UDA Name"><Val v={d.ulb_uda_name} /></Row>
              <Row label="Building Address"><Val v={d.building_address} /></Row>
            </div>
          </div>
        </div>

        {/* GRID ROW 2 */}
        <div className="unregDetails-grid">
          <div className="unregDetails-section">
            <div className="unregDetails-section-header">
              <span className="unregDetails-section-icon">🏗️</span>
              <span className="unregDetails-section-title">Project Details</span>
            </div>
            <div className="unregDetails-fields">
              <Row label="File No."><Val v={d.fileno} mono /></Row>
              <Row label="LP No."><Val v={d.lp_no} mono /></Row>
              <Row label="BA No."><Val v={d.ba_no} mono /></Row>
              <Row label="Project Type">
                {d.project_type
                  ? <span className="unregDetails-type-badge" style={{ fontSize: 11 }}>{d.project_type}</span>
                  : <Val v={null} />}
              </Row>
              <Row label="File Status"><Val v={d.filestatus_vw} /></Row>
              <Row label="Landuse Sub-Cat."><Val v={d.landuse_sub_category} /></Row>
              <Row label="Sub Use"><Val v={d.sub_use} /></Row>
            </div>
          </div>

          <div className="unregDetails-section">
            <div className="unregDetails-section-header">
              <span className="unregDetails-section-icon">📐</span>
              <span className="unregDetails-section-title">Area & Units</span>
            </div>
            <div className="unregDetails-fields">
              <Row label="Plot Area (sq.m)">
                <Val v={d.plot_area != null ? `${Number(d.plot_area).toLocaleString("en-IN")} sq.m` : null} />
              </Row>
              <Row label="Site Area (acres)">
                <Val v={d.site_area_acres != null ? `${d.site_area_acres} acres` : null} />
              </Row>
              <Row label="Approved BUA">
                <Val v={d.approved_bua != null ? `${Number(d.approved_bua).toLocaleString("en-IN")} sq.m` : null} />
              </Row>
              <Row label="No. of Plots">
                <Val v={d.no_of_plots != null ? `${d.no_of_plots} plots` : null} />
              </Row>
              <Row label="Housing Units">
                <Val v={d.housing_units != null ? `${d.housing_units} units` : null} />
              </Row>
            </div>
          </div>
        </div>

        {/* DATES + LDCC + APPROVAL */}
        <div className="unregDetails-grid unregDetails-grid-3" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <div className="unregDetails-section">
            <div className="unregDetails-section-header">
              <span className="unregDetails-section-icon">📅</span>
              <span className="unregDetails-section-title">Key Dates</span>
            </div>
            <div className="unregDetails-fields">
              <Row label="Approved Date"><Val v={fmtDate(d.approved_date)} /></Row>
              <Row label="Proceeding Order"><Val v={fmtDate(d.proceeding_order_date)} /></Row>
              <Row label="Created At"><Val v={fmtDate(d.created_at)} /></Row>
            </div>
          </div>
          <div className="unregDetails-section">
            <div className="unregDetails-section-header">
              <span className="unregDetails-section-icon">✅</span>
              <span className="unregDetails-section-title">LDCC Details</span>
            </div>
            <div className="unregDetails-fields">
              <Row label="LDCC Applied"><BoolVal v={d.is_ldcc_applied} /></Row>
              <Row label="LDCC Approved On"><Val v={fmtDate(d.ldcc_approved_on)} /></Row>
            </div>
          </div>
         
        </div>

     {isRegistered && hasRegNo ? (

  // ✅ PROJECT REGISTRATION CASE
  <div className="unregDetails-rera-section">
    <div className="unregDetails-rera-title">🏛️ RERA Registration Details</div>

    <div className="unregDetails-rera-grid">

      <div className="unregDetails-rera-item">
        <div className="unregDetails-rera-item-label">RERA Registered</div>
        <div className="unregDetails-rera-item-value">
          <BoolVal v={d.rera_registered} />
        </div>
      </div>

      <div className="unregDetails-rera-item">
        <div className="unregDetails-rera-item-label">RERA Registration No.</div>
        <div className="unregDetails-rera-item-value">
          <Val v={d.rera_registration_no} mono />
        </div>
      </div>

    </div>

    <p
      style={{ color: "blue", cursor: "pointer", marginTop: "10px" }}
     onClick={() =>
  navigate("/preview", {
    state: {
      applicationNumber: d.rera_registration_no,
      panNumber: d.pan_Number,
    },
  })
}
    >
      👉 Click here to see the project RG application
    </p>

  </div>

) : hasExemption ? (

  // ✅ EXEMPTION CASE
  <div className="unregDetails-rera-section">
    <div className="unregDetails-rera-title">🏛️ RERA Registration Details</div>

    <div className="unregDetails-rera-grid">

      <div className="unregDetails-rera-item">
        <div className="unregDetails-rera-item-label">RERA Registered</div>
        <div className="unregDetails-rera-item-value">
          <BoolVal v={d.rera_registered} />
        </div>
      </div>

      {/* ❌ REMOVE RERA REG NO */}

      {/* ✅ SHOW EXEMPTION ID */}
      <div className="unregDetails-rera-item">
        <div className="unregDetails-rera-item-label">Exemption ID</div>
        <div className="unregDetails-rera-item-value">
          <Val v={d.exemption_id} mono />
        </div>
      </div>

    </div>

    <p
      style={{ color: "green", cursor: "pointer", marginTop: "10px" }}
      onClick={() => navigate(`/project-exemption/${d.exemption_id}`)}
    >
      👉 Click here to see the exemption application
    </p>

  </div>

) : (

  // ✅ DEFAULT CASE
  <div className="unregDetails-rera-section">
    <div className="unregDetails-rera-title">🏛️ RERA Registration Details</div>

    <div className="unregDetails-rera-grid">

      <div className="unregDetails-rera-item">
        <div className="unregDetails-rera-item-label">RERA Registered</div>
        <div className="unregDetails-rera-item-value"><BoolVal v={d.rera_registered} /></div>
      </div>

      <div className="unregDetails-rera-item">
        <div className="unregDetails-rera-item-label">RERA Registration No.</div>
        <div className="unregDetails-rera-item-value"><Val v={d.rera_registration_no} mono /></div>
      </div>

      <div className="unregDetails-rera-item">
        <div className="unregDetails-rera-item-label">RERA Register No.</div>
        <div className="unregDetails-rera-item-value"><Val v={d.rera_register_no} mono /></div>
      </div>

      <div className="unregDetails-rera-item">
        <div className="unregDetails-rera-item-label">Exemption ID</div>
        <div className="unregDetails-rera-item-value"><Val v={d.exemption_id} mono /></div>
      </div>

      <div className="unregDetails-rera-item">
        <div className="unregDetails-rera-item-label">S1 Authority ID</div>
        <div className="unregDetails-rera-item-value"><Val v={d.s1_authority_id} /></div>
      </div>

      <div className="unregDetails-rera-item">
        <div className="unregDetails-rera-item-label">S2 Authority ID</div>
        <div className="unregDetails-rera-item-value"><Val v={d.s2_authority_id} /></div>
      </div>

    </div>
  </div>

)}

        <div><div className="unregDetails-remarks-table" style={{ marginBottom: 24 }}> 
        {(approvalStatus === "s2" || approvalStatus === "s3" || approvalStatus === "s4" || approvalStatus === "s5" || approvalStatus === "s6" || approvalStatus === "s7") && (
  <div className="unreg-history-section">
    <div className="unreg-history-title">📋 Authority Remarks</div>
    <table className="unreg-history-table">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Authority ID</th>
          <th>Remarks</th>
          <th>Approval Status</th>
        </tr>
      </thead>
    <tbody>

  {/* ✅ Row 1 — Always show */}
  <tr>
    <td>1</td>
    <td>
  {authorityMap[d.s1_authority_id]
    ? `${authorityMap[d.s1_authority_id].full_name} (${authorityMap[d.s1_authority_id].department})`
    : d.s1_authority_id || "—"}
</td>
    <td>{d.s1_remarks || "—"}</td>
    <td>s1</td>
  </tr>

  {/* ✅ Row 2 — show from s3 onwards */}
  {(approvalStatus === "s3" || approvalStatus === "s4" || approvalStatus === "s5" || approvalStatus === "s6" || approvalStatus === "s7") && (
    <tr>
      <td>2</td>
      <td>
  {authorityMap[d.s2_authority_id]
    ? `${authorityMap[d.s2_authority_id].full_name} (${authorityMap[d.s2_authority_id].department})`
    : d.s2_authority_id || "—"}
</td>
      <td>{d.s2_remarks || "—"}</td>
      <td>s2</td>
    </tr>
  )}

  {/* ✅ Row 3 — show from s5 onwards */}
  {(approvalStatus === "s5" || approvalStatus === "s6" || approvalStatus === "s7") && (
    <tr>
      <td>3</td>
       <td>
  {authorityMap[d.s4_authority_id]
    ? `${authorityMap[d.s4_authority_id].full_name} (${authorityMap[d.s4_authority_id].department})`
    : d.s4_authority_id || "—"}
</td>
      <td>{d.s4_remarks || "—"}</td>
      <td>s4</td>
    </tr>
  )}

  {/* ✅ Row 4 — show from s6 onwards */}
  {(approvalStatus === "s6" || approvalStatus === "s7") && (
    <tr>
      <td>4</td>
       <td>
  {authorityMap[d.s5_authority_id]
    ? `${authorityMap[d.s5_authority_id].full_name} (${authorityMap[d.s5_authority_id].department})`
    : d.s5_authority_id || "—"}
</td>
      <td>{d.s5_remarks || "—"}</td>
      <td>s5</td>
    </tr>
  )}

  {/* ✅ Row 5 — show only at s7 */}
  {approvalStatus === "s7" && (
    <tr>
      <td>5</td>
      <td>
  {authorityMap[d.s6_authority_id]
    ? `${authorityMap[d.s6_authority_id].full_name} (${authorityMap[d.s6_authority_id].department})`
    : d.s6_authority_id || "—"}
</td>
      <td>{d.s6_remarks || "—"}</td>
      <td>s6</td>
    </tr>
  )}

</tbody>
    </table>
  </div>
)}</div>

        {/* DOCUMENTS — only shown when status is s2+ */}
      {approvalStatus && 
 approvalStatus !== "s1" && 
 approvalStatus !== "s2" && 
 documents.some(doc => doc.path) && (   // ✅ ADD THIS LINE

  <div className="unregDetails-doc-section">
    <div className="unregDetails-doc-title">📎 Notice Documents</div>
    <div className="unregDetails-doc-grid">
      {documents.map((doc) =>
        doc.path ? (
         <a
  key={doc.label}
  href={`${BASE_URL}/${doc.path.replace("backend/", "")}`} className="unregDetails-doc-pill available"
            target="_blank" rel="noreferrer">
            📄 {doc.label}
          </a>
        ) : null   // ❗ empty span remove చేయి
      )}
    </div>
  </div>
)}</div>
   
        {/* BOTTOM BUTTON ROW */}
        <div className="unregDetails-btn-row">
          <button className="unregDetails-back-btn" onClick={() => navigate(-1)}>
            ← Back to List
          </button>

       
    
          
{isRegistered && hasRegNo ? (

  <p style={{ color: "green", fontWeight: "bold" }}>
    Applicant is applied in Project Registration
  </p>

) : !hasRegNo && hasExemption ? (

  <p style={{ color: "blue", fontWeight: "bold" }}>
    Applicant is applied for Exemption
  </p>

) : (

  role === "seniarAdit" ? (

    <>
      {(approvalStatus === null || approvalStatus === "s1") && (
        <p style={{ color: "red" }}>
          This application is not checked by Audit team
        </p>
      )}

      {approvalStatus === "s2" && (
        <button
          className="unregDetails_Send_Notice_button"
          onClick={() => setModal("s2")}
        >
          📄 Generate & Generate Notice →
        </button>
      )}

      {(approvalStatus === "s3" ||
        approvalStatus === "s1" ||
        
        approvalStatus === "s4" ||
        approvalStatus === "s6" ||
        approvalStatus === "s7") && (
        <p style={{ color: "orange" }}>
          This application is under process of Audit team
        </p>
      )}

      {approvalStatus === "s5" && (
        <button
          className="unregDetails_Send_Notice_button"
          onClick={() => setModal("s5")}
        >
          📄 Generate & Generate 2nd Notice →
        </button>
      )}
    </>

  ) : (

    <>
      {(approvalStatus === "s2" || approvalStatus === "s5") && (
        <p style={{ color: "blue" }}>
          This application is under process of seniarAdit
        </p>
      )}

     {(!approvalStatus || approvalStatus === "s1") && (
  <button
    onClick={() => {
      if (isLessThan45Days()) {
        alert(
          "Application is within 45 days from approval. Authority action can be taken only after completion of 45 days."
        );
        return;
      }
      setModal("s1");
    }}
  >
    📨 Inform the Authority →
  </button>
)}
      {approvalStatus === "s3" && role !== "seniarAdit" && (
  <button onClick={() => setModal("s3")}>
    📩 Send Notice →
  </button>
)}

   {approvalStatus === "s4" && (
  <button
    onClick={() => {
      if (isLessThan15Days()) {
        alert(
          "First notice is within 15 days. Authority action can be taken only after completion of 15 days."
        );
        return;
      }
      setModal("s4");
    }}
  >
    📨 Inform Authority 2nd time →
  </button>
)}
      {approvalStatus === "s6" && (
        <button onClick={() => setModal("s6")}>
          📩 Send 2nd Notice →
        </button>
      )}

      {approvalStatus === "s7" && (
        <button disabled>
          ✅ Notice Sent
        </button>
      )}
    </>

  )

)}
        </div>

      </div>

      {/* MODALS */}
     {modal === "s1" && (
  <S1Modal 
    data={d} 
    user={user}  
    onClose={() => setModal(null)} 
    onSuccess={showToast} 
  />
)}
      {modal === "s2" && (
  <S2Modal 
    data={d} 
    user={user}   
    onClose={() => setModal(null)} 
    onSuccess={showToast} 
  />
)}
{modal === "s3" && (
  <S3Modal
    data={d}
    onClose={() => setModal(null)}
    onSuccess={showToast}
  />
)}
{modal === "s4" && (
  <S4Modal
    data={d}
    user={user}
    onClose={() => setModal(null)}
    onSuccess={showToast}
  />
)}
{modal === "s5" && (
  <S5Modal
    data={d}
    user={user}
    onClose={() => setModal(null)}
    onSuccess={showToast}
  />
)}
{modal === "s6" && (
  <S6Modal
    data={d}
    onClose={() => setModal(null)}
    onSuccess={showToast}
  />
)}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`unreg-toast ${toast.type === "error" ? "unreg-toast-error" : "unreg-toast-success"}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}