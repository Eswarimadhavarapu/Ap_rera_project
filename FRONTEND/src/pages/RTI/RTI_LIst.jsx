import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { getRTIList } from "../../api/api";
import "../../styles/RTI/RTI_List.css";

// ─── constants ───────────────────────────────────────────────────────────────

const PER_PAGE = 10;

const STATUS_STYLE = {
  SUBMITTED: { background: "#eff6ff", color: "#1d4ed8", borderColor: "#bfdbfe", dot: "#3b82f6" },
  REPLIED:   { background: "#f0fdf4", color: "#15803d", borderColor: "#86efac", dot: "#22c55e" },
  PENDING:   { background: "#fffbeb", color: "#b45309", borderColor: "#fcd34d", dot: "#f59e0b" },
  OVERDUE:   { background: "#fef2f2", color: "#b91c1c", borderColor: "#fca5a5", dot: "#ef4444" },
  DEFAULT:   { background: "#f8fafc", color: "#475569", borderColor: "#cbd5e1", dot: "#94a3b8" },
};

const getStatusStyle = (s) => STATUS_STYLE[(s || "").toUpperCase()] || STATUS_STYLE.DEFAULT;

// ─── filter helpers ───────────────────────────────────────────────────────────

const todayISO = () => new Date().toISOString().slice(0, 10);

const toISO = (dateStr) => {
  if (!dateStr) return null;
  try { return new Date(dateStr).toISOString().slice(0, 10); } catch { return null; }
};

const daysDiff = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return 0;
  return (Date.now() - d.getTime()) / 86400000;
};

const CLIENT_FILTERS = {
  today:   (r) => toISO(r.application_coming_from || r.application_submitted_date) === todayISO(),
  pending: (r) => (r.status || "").toUpperCase() !== "REPLIED",
  replied: (r) => (r.status || "").toUpperCase() === "REPLIED",
  overdue: (r) => daysDiff(r.application_coming_from || r.application_submitted_date) > 45,
  total:   ()  => true,
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return "—"; }
};

const initials = (name) => {
  return (name || "")
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("") || "?";
};
// ─── card config ─────────────────────────────────────────────────────────────

const CARDS = [
  { key: "today",   label: "Today RTI", accent: "#0ea5e9", light: "#e0f2fe", darkText: "#0c4a6e" },
  { key: "pending", label: "Pending",   accent: "#f59e0b", light: "#fef9c3", darkText: "#78350f" },
  { key: "replied", label: "Replied",   accent: "#22c55e", light: "#dcfce7", darkText: "#14532d" },
  { key: "overdue", label: "Overdue",   accent: "#ef4444", light: "#fee2e2", darkText: "#7f1d1d" },
  { key: "total",   label: "Total",     accent: "#6366f1", light: "#ede9fe", darkText: "#3730a3" },
];

// ─── SVG icon components ──────────────────────────────────────────────────────

const Icons = {
  // Calendar with clock — Today RTI
  Today: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2.5" ry="2.5"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
      <circle cx="15.5" cy="16.5" r="3.5"/>
      <path d="M15.5 14.5v2l1.5 1"/>
    </svg>
  ),
  // Hourglass — Pending
  Pending: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2h14"/>
      <path d="M5 22h14"/>
      <path d="M5 2c0 6 7 8 7 12S5 22 5 22"/>
      <path d="M19 2c0 6-7 8-7 12s7 8 7 8"/>
    </svg>
  ),
  // Chat bubble with checkmark — Replied
  Replied: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      <path d="M9 10l2 2 4-4"/>
    </svg>
  ),
  // Bell with exclamation — Overdue
  Overdue: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
      <line x1="12" y1="2" x2="12" y2="4"/>
      <circle cx="12" cy="11" r="1" fill="currentColor"/>
      <line x1="12" y1="13" x2="12" y2="16"/>
    </svg>
  ),
  // Stack of documents — Total
  Total: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h18M3 12h18M3 17h18"/>
      <rect x="2" y="4" width="20" height="16" rx="2"/>
    </svg>
  ),
  // Eye — View
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  // Search
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  // X (close)
  X: ({ size = 14 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={size} height={size}>
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  // Refresh
  Refresh: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
      <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
  ),
  // Filter
  Filter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  // Chevron left
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  ),
  // Chevron right
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  ),
  // Arrow left (back)
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  ),
  // Empty inbox
  EmptyBox: () => (
    <svg viewBox="0 0 64 64" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="64" height="64">
      <rect x="8" y="16" width="48" height="40" rx="4"/>
      <path d="M8 36h12l4 8h16l4-8h12"/>
      <path d="M24 8l8 8 8-8"/>
    </svg>
  ),
  // Checkmark in circle (active card)
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
};

const CARD_ICONS = {
  today:   Icons.Today,
  pending: Icons.Pending,
  replied: Icons.Replied,
  overdue: Icons.Overdue,
  total:   Icons.Total,
};

// ─── pagination helper ────────────────────────────────────────────────────────

const buildPageList = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "…", total);
  } else if (current >= total - 3) {
    pages.push(1, "…", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "…", current - 1, current, current + 1, "…", total);
  }
  return pages;
};
// ─── SLA Countdown Component ─────────────────────────────────────────────
const SLACountdown = ({ submittedDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, expired: false
  });

  useEffect(() => {
    if (!submittedDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
      return;
    }

    const endTime = new Date(submittedDate).getTime() + 30 * 24 * 60 * 60 * 1000; // +30 days

    const updateTimer = () => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    updateTimer(); // initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval); // cleanup
  }, [submittedDate]);

  if (timeLeft.expired) {
    return (
      <span className="RTI_List__slaExpired">
        SLA Expired
      </span>
    );
  }

  return (
    <div className="RTI_List__slaCountdown">
      <div className="sla-box"><strong>{String(timeLeft.days).padStart(2, '0')}</strong><small>DAYS</small></div>
      <div className="sla-box"><strong>{String(timeLeft.hours).padStart(2, '0')}</strong><small>HRS</small></div>
      <div className="sla-box"><strong>{String(timeLeft.minutes).padStart(2, '0')}</strong><small>MINS</small></div>
      <div className="sla-box"><strong>{String(timeLeft.seconds).padStart(2, '0')}</strong><small>SECS</small></div>
    </div>
  );
};

// ─── component ───────────────────────────────────────────────────────────────

export default function RTI_List() {
  const navigate  = useNavigate();
  const { admin } = useAdmin();
  const filterRef = useRef(null);

  // data state
  const [allData,    setAllData]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // card / filter
  const [activeCard, setActiveCard] = useState("total");

  // search (client-side on name/email)
  const [searchInput,  setSearchInput]  = useState("");
  const [searchActive, setSearchActive] = useState("");

  // date filter
  const [showFilter,  setShowFilter]  = useState(false);
  const [fromDate,    setFromDate]    = useState("");
  const [toDate,      setToDate]      = useState("");
  const [filterActive, setFilterActive] = useState(false);

  // server pagination
  const [serverPage,  setServerPage]  = useState(1);
  const [serverTotal, setServerTotal] = useState(0);

  // computed
  const cardFiltered = allData.filter(CLIENT_FILTERS[activeCard] || (() => true));

  const displayData = cardFiltered.filter((r) => {
    if (!searchActive) return true;
    const q = searchActive.toLowerCase();
    return (
      (r.applicant_name || "").toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q) ||
      (r.rti_number || "").toLowerCase().includes(q)
    );
  });

  // client-side page (for search results)
  const [clientPage, setClientPage] = useState(1);
  const isSearchMode = !!searchActive;
  const currentPage  = isSearchMode ? clientPage : serverPage;
  const totalRecords = isSearchMode ? displayData.length : serverTotal;
  const totalPages   = Math.ceil(totalRecords / PER_PAGE) || 1;

  const pagedData = isSearchMode
    ? displayData.slice((clientPage - 1) * PER_PAGE, clientPage * PER_PAGE)
    : displayData; // server already returns 10

  const counts = {
    today:   allData.filter(CLIENT_FILTERS.today).length,
    pending: allData.filter(CLIENT_FILTERS.pending).length,
    replied: allData.filter(CLIENT_FILTERS.replied).length,
    overdue: allData.filter(CLIENT_FILTERS.overdue).length,
    total:   allData.length,
  };

  // ── log admin ─────────────────────────────────────────────────────────────
  useEffect(() => {
    console.log("%c👤 RTI_List — Admin context loaded", "color:#4a90d9;font-weight:bold;");
    console.table(admin);
    console.log("🔑 Role :", admin?.role  ?? "N/A");
    console.log("🪪 ID   :", admin?.id    ?? "N/A");
    console.log("📧 Email:", admin?.email ?? "N/A");
  }, [admin]);

  // ── close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── fetch from server ─────────────────────────────────────────────────────
  const fetchData = useCallback(async (page = 1, fd = "", td = "") => {
    setLoading(true);
    setError(null);
    try {
      console.log(`%c📡 RTI_List — fetch page=${page} from=${fd} to=${td}`, "color:#888;");
      const res = await getRTIList(page, "", fd, td);
      console.log("%c✅ RTI_List — response", "color:green;", res);
      setAllData(res.data || []);
      setServerTotal(res.total || 0);
    } catch (err) {
      console.error("❌ RTI_List — error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(serverPage, filterActive ? fromDate : "", filterActive ? toDate : "");
  }, [serverPage, filterActive]);

  // ── card click ────────────────────────────────────────────────────────────
  const handleCard = (key) => {
    console.log(`%c🃏 RTI_List — card="${key}"`, "color:#b07b00;");
    setActiveCard(key);
    setSearchInput("");
    setSearchActive("");
    setClientPage(1);
  };

  // ── search ────────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const q = searchInput.trim();
    console.log(`%c🔍 RTI_List — search="${q}"`, "color:#6366f1;");
    setSearchActive(q);
    setClientPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchActive("");
    setClientPage(1);
  };

  // ── date filter apply ─────────────────────────────────────────────────────
  const applyFilter = () => {
    if (!fromDate && !toDate) return;
    console.log(`%c📅 RTI_List — date filter from=${fromDate} to=${toDate}`, "color:#16a34a;");
    setFilterActive(true);
    setServerPage(1);
    setShowFilter(false);
    fetchData(1, fromDate, toDate);
  };

  const clearFilter = () => {
    setFromDate("");
    setToDate("");
    setFilterActive(false);
    setShowFilter(false);
    setServerPage(1);
    fetchData(1, "", "");
  };

  // ── navigate ──────────────────────────────────────────────────────────────
  const handleView = (appId) => {
    console.log(`%c👁 RTI_List — view application_id=${appId}`, "color:#5a4fcf;");
    navigate("/scrutiny/RTI_Details_Page", { state: { application_id: appId } });
  };

  const handleBack = () => {
    console.log("%c⬅ RTI_List — back", "color:#475569;");
    navigate(-1);
  };

  // ── page nav ──────────────────────────────────────────────────────────────
  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    if (isSearchMode) {
      setClientPage(p);
    } else {
      setServerPage(p);
    }
  };

  const pageList = buildPageList(currentPage, totalPages);

  // ── active card meta ──────────────────────────────────────────────────────
  const activeCardMeta = CARDS.find((c) => c.key === activeCard);
  const startRow = (currentPage - 1) * PER_PAGE + 1;
  const endRow   = Math.min(currentPage * PER_PAGE, totalRecords);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="RTI_List__page">

      {/* ── Header ── */}
      <div className="RTI_List__header">
        <div className="RTI_List__headerLeft">
         
          <h1 className="RTI_List__title">RTI Applications</h1>
         
        </div>

        <div className="RTI_List__userBadge">
          
         
          <span className="RTI_List__userOnline" title="Online" />
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="RTI_List__cardRow">
        {CARDS.map((c) => {
          const isActive  = activeCard === c.key;
          const CardIcon  = CARD_ICONS[c.key];
          return (
            <button
              key={c.key}
              onClick={() => handleCard(c.key)}
              className={`RTI_List__card${isActive ? " RTI_List__card--active" : ""}`}
              style={{
                borderColor: isActive ? c.accent : "#e2e8f0",
                background:  isActive ? c.accent : "#fff",
                color:       isActive ? "#fff"   : c.darkText,
                boxShadow:   isActive
                  ? `0 8px 24px ${c.accent}40`
                  : "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="RTI_List__cardIconBox"
                style={{
                  background: isActive ? "rgba(255,255,255,0.2)" : c.light,
                  color:      isActive ? "#fff" : c.accent,
                }}
              >
                <CardIcon />
              </div>
              <div className="RTI_List__cardBody">
                <span className="RTI_List__cardCount">{counts[c.key]}</span>
                <span className="RTI_List__cardLabel"
                  style={{ opacity: isActive ? 0.9 : 0.75 }}>
                  {c.label}
                </span>
              </div>
              {isActive && (
                <div className="RTI_List__cardCheck">
                  <Icons.Check />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Toolbar ── */}
      <div className="RTI_List__toolbar">
        {/* Search */}
        <div className="RTI_List__searchWrap">
          <span className="RTI_List__searchIcon"><Icons.Search /></span>
          <input
            className="RTI_List__searchInput"
            type="text"
            placeholder="Search by name, email or RTI number…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {searchInput && (
            <button className="RTI_List__searchClear" onClick={clearSearch} title="Clear">
              <Icons.X />
            </button>
          )}
          <button className="RTI_List__searchBtn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Right controls */}
        <div className="RTI_List__toolbarRight">

          {/* Date filter */}
          <div className="RTI_List__filterWrap" ref={filterRef}>
            <button
              className={`RTI_List__filterBtn${showFilter ? " RTI_List__filterBtn--open" : ""}${filterActive ? " RTI_List__filterBtn--active" : ""}`}
              onClick={() => setShowFilter((v) => !v)}
            >
              <Icons.Filter />
              Date Filter
              {filterActive && <span className="RTI_List__filterDot" />}
            </button>

            {showFilter && (
              <div className="RTI_List__filterDropdown">
                <p className="RTI_List__filterHeading">Filter by Submitted Date</p>
                <div className="RTI_List__filterRow">
                  <div className="RTI_List__filterField">
                    <label className="RTI_List__filterLabel">From</label>
                    <input
                      type="date"
                      className="RTI_List__filterDate"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      max={toDate || undefined}
                    />
                  </div>
                  <div className="RTI_List__filterField">
                    <label className="RTI_List__filterLabel">To</label>
                    <input
                      type="date"
                      className="RTI_List__filterDate"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      min={fromDate || undefined}
                    />
                  </div>
                </div>
                <div className="RTI_List__filterActions">
                  <button className="RTI_List__filterClear" onClick={clearFilter}>Clear</button>
                  <button className="RTI_List__filterApply" onClick={applyFilter}>Apply</button>
                </div>
              </div>
            )}
          </div>

          {/* Refresh */}
          <button
            className="RTI_List__refreshBtn"
            onClick={() => fetchData(serverPage, filterActive ? fromDate : "", filterActive ? toDate : "")}
          >
            <Icons.Refresh /> Refresh
          </button>
        </div>
      </div>

      {/* ── Table section ── */}
      <div className="RTI_List__tableWrap">

        {/* Table top bar */}
        <div className="RTI_List__tableHeader">
          <div className="RTI_List__tableHeaderLeft">
            <span className="RTI_List__tableTitle">
              {activeCardMeta?.label} List
            </span>
            <span className="RTI_List__tableCount">
              {totalRecords} record{totalRecords !== 1 ? "s" : ""}
            </span>
            {searchActive && (
              <span className="RTI_List__activeTag">
                🔍 "{searchActive}"
                <button className="RTI_List__activeTagClose" onClick={clearSearch}>
                  <Icons.X size={12} />
                </button>
              </span>
            )}
            {filterActive && (
              <span className="RTI_List__activeTag">
                📅 {fromDate} → {toDate}
                <button className="RTI_List__activeTagClose" onClick={clearFilter}>
                  <Icons.X size={12} />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="RTI_List__center">
            <div className="RTI_List__spinner" />
            <span className="RTI_List__stateText">Loading applications…</span>
            <span className="RTI_List__stateSubText">Please wait</span>
          </div>

        ) : error ? (
          <div className="RTI_List__center">
            <div className="RTI_List__errorIcon">!</div>
            <span className="RTI_List__stateText">Failed to load data</span>
            <span className="RTI_List__stateSubText">{error}</span>
            <button
              className="RTI_List__retryBtn"
              onClick={() => fetchData(serverPage, filterActive ? fromDate : "", filterActive ? toDate : "")}
            >
              Try again
            </button>
          </div>

        ) : pagedData.length === 0 ? (
          <div className="RTI_List__center">
            <Icons.EmptyBox />
            <span className="RTI_List__stateText">No records found</span>
            <span className="RTI_List__stateSubText">
              {searchActive ? `No results for "${searchActive}"` : "No applications match this filter"}
            </span>
          </div>

        ) : (
          <div className="RTI_List__tableScroll">
            <table className="RTI_List__table">
              <thead>
  <tr>
    <th className="RTI_List__th RTI_List__th--sno">#</th>
    <th className="RTI_List__th">Applicant Name</th>
    <th className="RTI_List__th">Email</th>
    <th className="RTI_List__th">Status</th>
    <th className="RTI_List__th">Submitted Date</th>
    <th className="RTI_List__th RTI_List__th--sla">RTI Count Down</th>   {/* ← New Column */}
    <th className="RTI_List__th RTI_List__th--action">Action</th>
  </tr>
</thead>
              <tbody>
                {pagedData.map((row, i) => {
                  const sc  = getStatusStyle(row.status);
                  const idx = (currentPage - 1) * PER_PAGE + i + 1;
                  return (
                 <tr
  key={row.application_id}
  className={`RTI_List__tr ${i % 2 === 0 ? "RTI_List__tr--even" : "RTI_List__tr--odd"}`}
>
  <td className="RTI_List__td RTI_List__td--sno">{idx}</td>

  <td className="RTI_List__td">
    <div className="RTI_List__nameCell">
      <div className="RTI_List__nameInitial">
        {initials(row.applicant_name)}
      </div>
      <span className="RTI_List__nameText">
        {row.applicant_name || "—"}
      </span>
    </div>
  </td>

  <td className="RTI_List__td RTI_List__td--email">
    {row.email_id || "—"}
  </td>

  <td className="RTI_List__td">
    <span className="RTI_List__statusBadge" style={sc}>
      <span className="RTI_List__statusDot" style={{ background: sc.dot }} />
      {row.status || "—"}
    </span>
  </td>

  <td className="RTI_List__td RTI_List__td--date">
    {formatDate(row.submitted_date)}
  </td>

  {/* NEW SLA COUNTDOWN COLUMN */}
  <td className="RTI_List__td RTI_List__td--sla">
    <SLACountdown submittedDate={row.application_submitted_date || row.application_coming_from} />
  </td>

  <td className="RTI_List__td RTI_List__td--action">
    <button
      className="RTI_List__viewBtn"
      onClick={() => handleView(row.application_id)}
      title={`View application #${row.application_id}`}
    >
      <Icons.Eye /> View
    </button>
  </td>
</tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="RTI_List__pagination">
            <span className="RTI_List__paginationInfo">
              Showing <strong>{startRow}–{endRow}</strong> of <strong>{totalRecords}</strong> results
            </span>

            <div className="RTI_List__pageNums">
              {/* Prev */}
              <button
                className="RTI_List__pageNavBtn"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                title="Previous page"
              >
                <Icons.ChevronLeft />
              </button>

              {/* Page numbers */}
              {pageList.map((p, idx) =>
                p === "…" ? (
                  <span key={`ell-${idx}`} className="RTI_List__pageEllipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={`RTI_List__pageNumBtn${currentPage === p ? " RTI_List__pageNumBtn--active" : ""}`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next */}
              <button
                className="RTI_List__pageNavBtn"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                title="Next page"
              >
                <Icons.ChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer / Back ── */}
      <div className="RTI_List__footer">
        <button className="RTI_List__backBtn" onClick={handleBack}>
          <Icons.ArrowLeft />
          Back
        </button>
      </div>

    </div>
  );
}