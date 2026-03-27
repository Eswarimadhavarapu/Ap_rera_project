import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* AP RERA Brand Colors
   Navy:  #1B3A6B
   Gold:  #E8873A
   Light navy bg: #EEF2F8
*/

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --rera-navy: #1B3A6B;
    --rera-gold: #E8873A;
    --rera-navy-light: #EEF2F8;
    --rera-gold-light: #FEF3E8;
  }

  .ac-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f0f2f5;
    padding: 32px;
    color: #1a1d23;
  }

  .ac-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    background: linear-gradient(135deg, var(--rera-navy) 0%, #254d8f 100%);
    border-radius: 14px;
    padding: 22px 28px;
    box-shadow: 0 4px 18px rgba(27,58,107,0.18);
  }

  .ac-title {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ac-title::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 28px;
    background: var(--rera-gold);
    border-radius: 3px;
    flex-shrink: 0;
  }

  .ac-subtitle {
    font-size: 13px;
    color: rgba(255,255,255,0.65);
    margin-top: 4px;
    padding-left: 15px;
  }

  .ac-badge {
    background: var(--rera-gold);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    padding: 5px 14px;
    border-radius: 20px;
    font-family: 'DM Mono', monospace;
    box-shadow: 0 2px 8px rgba(232,135,58,0.35);
  }

  .ac-card {
    background: #ffffff;
    border-radius: 14px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }

  .ac-search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 20px;
    border-bottom: 1px solid #f3f4f6;
    background: #fafafa;
  }

  .ac-search-icon {
    color: #9ca3af;
    flex-shrink: 0;
  }

  .ac-search-input {
    border: none;
    background: transparent;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #374151;
    width: 100%;
  }

  .ac-table-wrap {
    overflow-x: auto;
  }

  table.ac-table {
    width: 100%;
    border-collapse: collapse;
  }

  .ac-table thead tr {
    background: var(--rera-navy-light);
    border-bottom: 2px solid var(--rera-navy);
  }

  .ac-table th {
    padding: 12px 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: var(--rera-navy);
    text-align: left;
    white-space: nowrap;
  }

  .ac-table tbody tr {
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background 0.15s;
  }

  .ac-table tbody tr:last-child {
    border-bottom: none;
  }

  .ac-table tbody tr:hover {
    background: var(--rera-navy-light);
  }

  .ac-table td {
    padding: 14px 20px;
    font-size: 14px;
    color: #374151;
    vertical-align: middle;
  }

  .ac-id-pill {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    background: var(--rera-navy-light);
    color: var(--rera-navy);
    padding: 3px 10px;
    border-radius: 6px;
    display: inline-block;
    border: 1px solid rgba(27,58,107,0.12);
  }

  .ac-subject {
    font-weight: 500;
    color: #1a1d23;
    max-width: 320px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ac-date {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #9ca3af;
  }

  .ac-arrow {
    color: #d1d5db;
    transition: color 0.15s, transform 0.15s;
  }

  .ac-table tbody tr:hover .ac-arrow {
    color: var(--rera-gold);
    transform: translateX(3px);
  }

  .ac-empty {
    text-align: center;
    padding: 60px 20px;
    color: #9ca3af;
  }

  .ac-empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  .ac-empty p {
    font-size: 15px;
    font-weight: 500;
    color: #6b7280;
  }

  .ac-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    gap: 8px;
  }

  .ac-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--rera-navy);
    animation: ac-bounce 0.8s ease-in-out infinite;
  }
  .ac-dot:nth-child(2) { animation-delay: 0.15s; background: var(--rera-gold); }
  .ac-dot:nth-child(3) { animation-delay: 0.3s; background: var(--rera-navy); }

  @keyframes ac-bounce {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }

  .ac-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;
    background: #22c55e;
  }
`;

const formatDate = (str) => {
  if (!str) return "—";
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://0jv8810n-8080.inc1.devtunnels.ms/api/complint/list")
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const filtered = complaints.filter((c) =>
    !search ||
    c.complaint_id?.toString().includes(search) ||
    c.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="ac-root">
        <div className="ac-header">
          <div>
            <div className="ac-title">Complaints</div>
            <div className="ac-subtitle">Manage and review all submitted complaints</div>
          </div>
          {!loading && (
            <span className="ac-badge">{complaints.length} Total</span>
          )}
        </div>

        <div className="ac-card">
          <div className="ac-search-bar">
            <svg className="ac-search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="ac-search-input"
              placeholder="Search by ID or subject…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="ac-loading">
              <div className="ac-dot" /><div className="ac-dot" /><div className="ac-dot" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="ac-empty">
              <div className="ac-empty-icon">📭</div>
              <p>{search ? "No complaints match your search" : "No complaints found"}</p>
            </div>
          ) : (
            <div className="ac-table-wrap">
              <table className="ac-table">
                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Subject</th>
                    <th>Date Filed</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item.complaint_id}
                      onClick={() => navigate(`/admin/complaint/${item.complaint_id}`)}
                    >
                      <td>
                        <span className="ac-id-pill">#{item.complaint_id}</span>
                      </td>
                      <td>
                        <div className="ac-subject">{item.subject || "—"}</div>
                      </td>
                      <td>
                        <span className="ac-date">{formatDate(item.created_at)}</span>
                      </td>
                      <td>
                        <span className="ac-status-dot" />
                        <span style={{ fontSize: "13px", color: "#374151" }}>Open</span>
                      </td>
                      <td>
                        <svg className="ac-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminComplaints;