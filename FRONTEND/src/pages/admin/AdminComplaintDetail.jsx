import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --rera-navy: #1B3A6B;
    --rera-gold: #E8873A;
    --rera-navy-light: #EEF2F8;
    --rera-gold-light: #FEF3E8;
  }

  .acd-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f0f2f5;
    padding: 32px;
    color: #1a1d23;
  }

  .acd-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--rera-navy);
    background: #fff;
    border: 1px solid rgba(27,58,107,0.2);
    padding: 7px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    margin-bottom: 24px;
    font-family: 'DM Sans', sans-serif;
  }

  .acd-back-btn:hover {
    background: var(--rera-navy-light);
    color: var(--rera-navy);
    border-color: var(--rera-navy);
  }

  .acd-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    background: linear-gradient(135deg, var(--rera-navy) 0%, #254d8f 100%);
    border-radius: 14px;
    padding: 22px 28px;
    box-shadow: 0 4px 18px rgba(27,58,107,0.18);
    flex-wrap: wrap;
    gap: 12px;
  }

  .acd-title {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .acd-title::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 28px;
    background: var(--rera-gold);
    border-radius: 3px;
    flex-shrink: 0;
  }

  .acd-id-tag {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    background: var(--rera-gold);
    color: #fff;
    padding: 5px 14px;
    border-radius: 20px;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(232,135,58,0.35);
    display: inline-block;
  }

  .acd-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 20px;
  }

  .acd-card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }

  .acd-card-header {
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 2px solid var(--rera-navy-light);
    background: var(--rera-navy-light);
  }

  .acd-card-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .acd-card-icon.blue  { background: rgba(27,58,107,0.12); color: var(--rera-navy); }
  .acd-card-icon.green { background: #f0fdf4; color: #16a34a; }
  .acd-card-icon.red   { background: var(--rera-gold-light); color: var(--rera-gold); }

  .acd-card-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--rera-navy);
    letter-spacing: 0.1px;
  }

  .acd-card-body {
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .acd-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    align-items: baseline;
    gap: 8px;
  }

  .acd-label {
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #9ca3af;
  }

  .acd-value {
    font-size: 14px;
    color: #374151;
    font-weight: 400;
    word-break: break-word;
  }

  .acd-value.mono {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
  }

  .acd-divider {
    height: 1px;
    background: #f3f4f6;
    margin: 2px 0;
  }

  .acd-rera-yes {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 500;
    color: #16a34a;
    background: #dcfce7;
    padding: 3px 10px;
    border-radius: 20px;
  }

  .acd-rera-no {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 500;
    color: #dc2626;
    background: #fee2e2;
    padding: 3px 10px;
    border-radius: 20px;
  }

  .acd-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    gap: 8px;
  }

  .acd-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--rera-navy);
    animation: acd-bounce 0.8s ease-in-out infinite;
  }
  .acd-dot:nth-child(2) { animation-delay: 0.15s; background: var(--rera-gold); }
  .acd-dot:nth-child(3) { animation-delay: 0.3s; background: var(--rera-navy); }

  @keyframes acd-bounce {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
`;

const Field = ({ label, value, mono }) => (
  <div className="acd-row">
    <span className="acd-label">{label}</span>
    <span className={`acd-value${mono ? " mono" : ""}`}>{value || "—"}</span>
  </div>
);

const AdminComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`https://0jv8810n-8080.inc1.devtunnels.ms/api/complint/${id}`)
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.log(err));
  }, [id]);

  if (!data) return (
    <>
      <style>{styles}</style>
      <div className="acd-root">
        <div className="acd-loading">
          <div className="acd-dot" /><div className="acd-dot" /><div className="acd-dot" />
        </div>
      </div>
    </>
  );

  const { complaint, complainant, respondent } = data;
  const addr = (a) => a
    ? [a.line1, a.district, a.state, a.pincode].filter(Boolean).join(", ")
    : "—";

  return (
    <>
      <style>{styles}</style>
      <div className="acd-root">

        <button className="acd-back-btn" onClick={() => navigate(-1)}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back to Complaints
        </button>

        <div className="acd-page-header">
          <div className="acd-title">Complaint Detail</div>
          <div className="acd-id-tag">ID #{complaint?.complaint_id}</div>
        </div>

        <div className="acd-grid">

          {/* Complaint Info */}
          <div className="acd-card">
            <div className="acd-card-header">
              <div className="acd-card-icon blue">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <span className="acd-card-title">Complaint Info</span>
            </div>
            <div className="acd-card-body">
              <Field label="Complaint ID" value={complaint?.complaint_id} mono />
              <div className="acd-divider" />
              <Field label="App. Type" value={complaint?.application_type} />
              <div className="acd-divider" />
              <Field label="Regarding" value={complaint?.complaint_regarding} />
            </div>
          </div>

          {/* Complainant */}
          <div className="acd-card">
            <div className="acd-card-header">
              <div className="acd-card-icon green">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <span className="acd-card-title">Complainant Details</span>
            </div>
            <div className="acd-card-body">
              <Field label="Name" value={complainant?.name} />
              <div className="acd-divider" />
              <Field label="Email" value={complainant?.email} />
              <div className="acd-divider" />
              <Field label="Mobile" value={complainant?.mobile} mono />
              <div className="acd-divider" />
              <Field label="Type" value={complainant?.type} />
              <div className="acd-divider" />
              <Field label="Address" value={addr(complainant?.address)} />
            </div>
          </div>

          {/* Respondent */}
          <div className="acd-card">
            <div className="acd-card-header">
              <div className="acd-card-icon red">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <span className="acd-card-title">Respondent Details</span>
            </div>
            <div className="acd-card-body">
              <Field label="Type" value={respondent?.type} />
              <div className="acd-divider" />
              <Field label="Registration ID" value={respondent?.registration_id} mono />
              <div className="acd-divider" />
              <div className="acd-row">
                <span className="acd-label">RERA Reg.</span>
                <span>
                  {respondent?.is_rera_registered
                    ? <span className="acd-rera-yes">✓ Yes</span>
                    : <span className="acd-rera-no">✗ No</span>
                  }
                </span>
              </div>
              <div className="acd-divider" />
              <Field label="Name" value={respondent?.name} />
              <div className="acd-divider" />
              <Field label="Email" value={respondent?.email} />
              <div className="acd-divider" />
              <Field label="Mobile" value={respondent?.mobile} mono />
              <div className="acd-divider" />
              <Field label="Address" value={addr(respondent?.address)} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminComplaintDetail;