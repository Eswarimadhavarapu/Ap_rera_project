import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../../api/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TopHeader from "../../components/admin/TopHeader";
import "../../styles/admin/adminChangeRequest.css";

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  SUBMITTED: { label: "Submitted",  color: "#1e6bbf", bg: "#e8f0fb" },
  APPROVED:  { label: "Approved",   color: "#1a7a3c", bg: "#e6f6ec" },
  REJECTED:  { label: "Rejected",   color: "#c0200f", bg: "#fdecea" },
  PENDING:   { label: "Pending",    color: "#b07800", bg: "#fff8e1" },
};

const TABS = [
  { key: "SUBMITTED", label: "Submitted" },
  { key: "APPROVED",  label: "Approved"  },
  { key: "REJECTED",  label: "Rejected"  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AdminChangeRequestList = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab,   setActiveTab]   = useState("SUBMITTED");
  const [requests,    setRequests]    = useState([]);
  const [stats,       setStats]       = useState({ SUBMITTED: 0, APPROVED: 0, REJECTED: 0 });
  const [loading,     setLoading]     = useState(false);
  const [search,      setSearch]      = useState("");

  useEffect(() => { loadRequests(activeTab); }, [activeTab]);
  useEffect(() => { loadStats(); },            []);

  const loadStats = async () => {
    try {
      // Load all statuses to get counts
      const [sub, app, rej] = await Promise.allSettled([
        apiGet("/api/change-request/status/SUBMITTED"),
        apiGet("/api/change-request/status/APPROVED"),
        apiGet("/api/change-request/status/REJECTED"),
      ]);
      setStats({
        SUBMITTED: sub.status === "fulfilled" ? (sub.value?.count || 0) : 0,
        APPROVED:  app.status === "fulfilled" ? (app.value?.count || 0) : 0,
        REJECTED:  rej.status === "fulfilled" ? (rej.value?.count || 0) : 0,
      });
    } catch (_) {}
  };

  const loadRequests = async (status) => {
    setLoading(true);
    try {
      const res = await apiGet(`/api/change-request/status/${status}`);
      setRequests(res?.data || []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = requests.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.request?.reference_no?.toLowerCase().includes(q)        ||
      item.request?.applicant_name?.toLowerCase().includes(q)      ||
      item.request?.application_number?.toLowerCase().includes(q)  ||
      item.request?.project_name?.toLowerCase().includes(q)
    );
  });

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    return (
      <span style={{
        background: cfg.bg, color: cfg.color,
        padding: "3px 12px", borderRadius: "20px",
        fontWeight: "700", fontSize: "11px", letterSpacing: "0.04em",
      }}>
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="admin-layout">
      <AdminSidebar sidebarOpen={sidebarOpen} />

      <div className={`admin-main ${sidebarOpen ? "" : "admin-main-full"}`}>
        <TopHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="admin-dashboard-content">

          {/* ── PAGE HEADER ── */}
          <div className="acr-page-header">
            <div>
              <h2 className="acr-page-title">Change Request Scrutiny</h2>
              <p className="acr-page-sub">Review and process project change requests submitted by promoters</p>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="acr-stat-cards">
            {TABS.map((t) => (
              <div
                key={t.key}
                className={`acr-stat-card ${activeTab === t.key ? "active" : ""}`}
                style={{ borderTop: `4px solid ${STATUS_CONFIG[t.key].color}` }}
                onClick={() => setActiveTab(t.key)}
              >
                <div className="acr-stat-num" style={{ color: STATUS_CONFIG[t.key].color }}>
                  {stats[t.key]}
                </div>
                <div className="acr-stat-label">{t.label} Requests</div>
              </div>
            ))}
          </div>

          {/* ── TABS ── */}
          <div className="acr-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`acr-tab ${activeTab === t.key ? "acr-tab-active" : ""}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
                <span className="acr-tab-badge" style={{
                  background: activeTab === t.key ? STATUS_CONFIG[t.key].color : "#ccd4e0",
                }}>
                  {stats[t.key]}
                </span>
              </button>
            ))}
          </div>

          {/* ── SEARCH ── */}
          <div className="acr-toolbar">
            <input
              className="acr-search"
              type="text"
              placeholder="🔍  Search by name, reference no, application no, project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="acr-refresh-btn" onClick={() => loadRequests(activeTab)}>
              ↻ Refresh
            </button>
          </div>

          {/* ── TABLE ── */}
          <div className="acr-table-wrap">
            {loading ? (
              <div className="acr-loading">Loading...</div>
            ) : (
              <table className="acr-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Reference No</th>
                    <th>Applicant</th>
                    <th>Application No</th>
                    <th>Project Name</th>
                    <th>Changes</th>
                    <th>Payment</th>
                    <th>Submitted On</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="acr-no-data">
                        No {activeTab.toLowerCase()} change requests found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item, idx) => (
                      <tr key={item.request.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <span className="acr-ref">{item.request.reference_no}</span>
                        </td>
                        <td>
                          <div className="acr-applicant">{item.request.applicant_name}</div>
                          <div className="acr-pan">{item.request.pan_number}</div>
                        </td>
                        <td>{item.request.application_number}</td>
                        <td>{item.request.project_name}</td>
                        <td>
                          <span className="acr-change-count">
                            {item.changes?.length || 0} change{item.changes?.length !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            color: item.request.payment_status === "SUCCESS" ? "#1a7a3c" : "#b07800",
                            fontWeight: "700", fontSize: "12px",
                          }}>
                            {item.request.payment_status}
                          </span>
                        </td>
                        <td>{formatDate(item.request.created_at)}</td>
                        <td><StatusBadge status={item.request.status} /></td>
                        <td>
                          <button
                            className="acr-view-btn"
                            onClick={() => navigate(`/admin/change-request/${item.request.id}`)}
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminChangeRequestList;