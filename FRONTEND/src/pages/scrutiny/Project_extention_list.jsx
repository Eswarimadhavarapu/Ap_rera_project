import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectExtensionList } from "../../api/api";
import { useAdmin } from "../../context/AdminContext";
import "../../styles/scrutiny/project_extention_List.css";

const toDateStr = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });
};

const isToday = (iso) => {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

const normalizeStatus = (s) =>
  s ? s.trim().toUpperCase() : "UNKNOWN";

// ─── District groups ───────────────────────────────────────────────────────────
const NORTH_DISTRICTS = [
  "Srikakulam",
  "Vizianagaram",
  "Visakhapatnam",
  "East Godavari",
  "West Godavari",
  "Krishna",
  "Guntur",
];

const SOUTH_DISTRICTS = [
  "Prakasam",
  "Sri Potti Sriramulu Nellore",
  "Y.S.R.",
  "Kurnool",
  "Anantapur",
  "Chittoor",
];

// ─── Role → Today card config ──────────────────────────────────────────────────
// { status: string, districts: string[] | null }
const ROLE_TODAY_CONFIG = {
  planning1: { status: "PENDING", districts: NORTH_DISTRICTS },
  planning2: { status: "PENDING", districts: SOUTH_DISTRICTS },
  AD: { status: "UNDER-AD", districts: NORTH_DISTRICTS },
  DD: { status: "UNDER-DD", districts: SOUTH_DISTRICTS },
  director: { status: "UNDER-DIRECTOR", districts: null },
  chairman: { status: "UNDER-CHAIRMAN", districts: null },
};

// ─── Role → Pending card config ───────────────────────────────────────────────
// { status: string, districts: string[] | null }
const ROLE_PENDING_CONFIG = {
  planning1: { status: "PENDING", districts: NORTH_DISTRICTS },
  planning2: { status: "PENDING", districts: SOUTH_DISTRICTS },
  AD: { status: "UNDER-AD", districts: NORTH_DISTRICTS },
  DD: { status: "UNDER-DD", districts: SOUTH_DISTRICTS },
  director: { status: "UNDER-DIRECTOR", districts: null },
  chairman: { status: "UNDER-CHAIRMAN", districts: null },
};

// ─── Helper: match a row against a { status, districts } config ───────────────
const matchesConfig = (row, cfg) => {
  if (!cfg) return true; // unknown role → no restriction

  const rowStatus = normalizeStatus(row.application_status);
  if (rowStatus !== cfg.status) return false;

  if (cfg.districts) {
    const district = (row.project_district || "").trim();
    if (!cfg.districts.includes(district)) return false;
  }

  return true;
};

/**
 * Today card: must be created today AND match the role's status + district rule.
 */
const isTodayRow = (row, role) => {
  if (!isToday(row.created_on)) return false;
  const cfg = ROLE_TODAY_CONFIG[role];
  return matchesConfig(row, cfg ?? null);
};

/**
 * Pending card: matches the role's status + district rule (no date restriction).
 */
const isPendingRow = (row, role) => {
  const cfg = ROLE_PENDING_CONFIG[role];
  return matchesConfig(row, cfg ?? null);
};

// ─── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = normalizeStatus(status);
  const map = {
    PENDING: { cls: "pel-status-badge--pending", dot: "🟡", label: "Pending" },
    APPROVED: { cls: "pel-status-badge--approved", dot: "🟢", label: "Approved" },
    REJECTED: { cls: "pel-status-badge--rejected", dot: "🔴", label: "Rejected" },
    "UNDER-AD": { cls: "pel-status-badge--pending", dot: "🟡", label: "Under AD" },
    "UNDER-DD": { cls: "pel-status-badge--pending", dot: "🟡", label: "Under DD" },
    "UNDER-DIRECTOR": { cls: "pel-status-badge--pending", dot: "🟡", label: "Under Director" },
    "UNDER-CHAIRMAN": { cls: "pel-status-badge--pending", dot: "🟡", label: "Under Chairman" },
  };
  const cfg = map[s] || { cls: "pel-status-badge--unknown", dot: "⚪", label: s || "N/A" };
  return (
    <span className={`pel-status-badge ${cfg.cls}`}>
      {cfg.dot} {cfg.label}
    </span>
  );
};

// ─── Card configs — built per role so closures capture the right role ──────────
const buildCardConfigs = (role) => [
  {
    key: "today",
    label: "Today",
    icon: "📅",
    colorClass: "pel-card--today",
    filter: (rows) => rows.filter((r) => isTodayRow(r, role)),
  },
  {
    key: "pending",
    label: "Pending",
    icon: "⏳",
    colorClass: "pel-card--pending",
    filter: (rows) => rows.filter((r) => isPendingRow(r, role)),
  },
  {
    key: "approved",
    label: "Approved",
    icon: "✅",
    colorClass: "pel-card--approved",
    filter: (rows) => rows.filter((r) => normalizeStatus(r.application_status) === "APPROVED"),
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: "❌",
    colorClass: "pel-card--rejected",
    filter: (rows) => rows.filter((r) => normalizeStatus(r.application_status) === "REJECTED"),
  },
  {
    key: "total",
    label: "Total",
    icon: "📋",
    colorClass: "pel-card--total",
    filter: (rows) => rows,
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
const ProjectExtentionList = () => {
  const navigate = useNavigate();
  const { admin } = useAdmin();

  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCard, setActiveCard] = useState("total");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const PER_PAGE = 10;

  // Rebuild configs only when the role changes
  const CARD_CONFIGS = useMemo(
    () => buildCardConfigs(admin?.role ?? ""),
    [admin?.role]
  );

  useEffect(() => {
    console.log(
      "%c[project_extention_List] 👤 Admin Context Loaded",
      "color: #6b804b; font-weight: bold;"
    );
    console.table({
      id: admin?.id ?? "N/A",
      name: admin?.name ?? "N/A",
      email: admin?.email ?? "N/A",
      role: admin?.role ?? "N/A",
    });
  }, [admin]);

  const fetchData = async (pg = 1) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`%c[project_extention_List] 🔄 Fetching page ${pg}...`, "color: #0ea5e9;");
      const res = await getProjectExtensionList(pg, PER_PAGE);
      console.log("%c[project_extention_List] ✅ API Response:", "color: #10b981;", res);

      setAllData(res.data || []);
      setTotalPages(res.total_pages || 1);
      setTotalRecords(res.total_records || 0);
    } catch (err) {
      console.error("[project_extention_List] ❌ Fetch Error:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  // ── Card counts (total overridden with server value to cover all pages) ───────
  const cardCounts = useMemo(() => {
    const counts = {};
    CARD_CONFIGS.forEach((cfg) => {
      counts[cfg.key] = cfg.filter(allData).length;
    });
    counts.total = totalRecords;
    return counts;
  }, [allData, totalRecords, CARD_CONFIGS]);

  // ── Filtered rows for the table ──────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    const cfg = CARD_CONFIGS.find((c) => c.key === activeCard);
    let rows = cfg ? cfg.filter(allData) : allData;

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      rows = rows.filter(
        (r) =>
          (r.project_name || "").toLowerCase().includes(q) ||
          (r.promoter_email || "").toLowerCase().includes(q) ||
          String(r.id).includes(q)
      );
    }

    return rows;
  }, [allData, activeCard, searchText, CARD_CONFIGS]);

  const handleCardClick = (key) => {
    console.log(`%c[project_extention_List] 🃏 Card clicked: ${key}`, "color: #8b5cf6;");
    setActiveCard(key);
    setSearchText("");
  };

  const handleView = (id) => {
    console.log(`%c[project_extention_List] 👁️ Navigating to detail id: ${id}`, "color: #f59e0b;");
    navigate(`/scrutiny/project-extension-details/${id}`);
  };

  const activeLabel = CARD_CONFIGS.find((c) => c.key === activeCard)?.label || "All";

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="pel-root">

      <div className="pel-header">
        <h1>Project Extension Applications</h1>
      </div>

      {/* ── Summary cards ── */}
      <div className="pel-cards-grid">
        {CARD_CONFIGS.map((cfg) => (
          <div
            key={cfg.key}
            className={`pel-card ${cfg.colorClass} ${activeCard === cfg.key ? "pel-card--active" : ""}`}
            onClick={() => handleCardClick(cfg.key)}
            title={`Filter by ${cfg.label}`}
          >
            <div className="pel-card__icon">{cfg.icon}</div>
            <div className="pel-card__label">{cfg.label}</div>
            <div className="pel-card__count">
              {loading ? "—" : cardCounts[cfg.key] ?? 0}
            </div>
          </div>
        ))}
      </div>

      {/* ── Table section ── */}
      <div className="pel-table-section">

        <div className="pel-table-header">
          <div className="pel-table-title">
            {activeLabel} Applications
            <span className="pel-table-badge">{filteredRows.length}</span>
          </div>
          <div className="pel-search-bar">
            🔍
            <input
              type="text"
              placeholder="Search by name, email or ID…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <div className="pel-table-wrap">
          <table className="pel-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>project Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="pel-state-row">
                  <td colSpan={6}>
                    <span className="pel-spinner" />
                    Loading records…
                  </td>
                </tr>
              ) : error ? (
                <tr className="pel-state-row">
                  <td colSpan={6}>⚠️ {error}</td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr className="pel-state-row">
                  <td colSpan={6}>No records found.</td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id}>
                    <td className="pel-td-id">#{row.id}</td>
                    <td className="pel-td-name">{row.project_name || "—"}</td>
                    <td className="pel-td-email">{row.promoter_email || "—"}</td>
                    <td>
                      <StatusBadge status={row.application_status} />
                    </td>
                    <td className="pel-td-date">{toDateStr(row.created_on)}</td>
                    <td>
                      <button
                        className="pel-btn-view"
                        onClick={() => handleView(row.id)}
                      >
                        👁 View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!loading && !error && (
          <div className="pel-pagination">
            <span>
              Page {page} of {totalPages} &nbsp;·&nbsp; {totalRecords} total records
            </span>
            <div className="pel-pagination-btns">
              <button
                className="pel-page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pel-page-btn ${p === page ? "pel-page-btn--active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="pel-page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectExtentionList;