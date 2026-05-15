import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../../api/api";
import FpmsSidebar from "../../pages/scrutiny/FpmsSidebar";
import TopHeader from "../../components/scrutiny/TopHeader";
import "../../styles/scrutiny/fpms.css";

const PAGE_SIZES = [15, 25, 50];

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-GB");
};

const safeText = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  return String(value);
};

const ScrutinyFpmsDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    total_files: 0,
    open_files: 0,
    closed_files: 0,
  });
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(1);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await apiGet("/api/scrutiny/fpms-dashboard");
        setSummary(response?.summary || { total_files: 0, open_files: 0, closed_files: 0 });
        setRows(Array.isArray(response?.rows) ? response.rows : []);
      } catch (loadError) {
        setError(loadError.message || "Unable to load FPMS dashboard data.");
        setSummary({ total_files: 0, open_files: 0, closed_files: 0 });
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [
        row.file_number,
        row.inward_no,
        row.file_description,
        row.received_through,
        row.from_where,
        row.to_whom,
        row.assign_to,
        row.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePageNumber = Math.min(page, totalPages);
  const startIndex = (safePageNumber - 1) * pageSize;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + pageSize);

  return (
    /*
     * scrutiny-layout = flex row container (full viewport)
     * FpmsSidebar     = fixed-position sidebar (position:fixed in its own CSS)
     * scrutiny-main   = takes remaining width via margin-left + width calc
     */
    <div className="scrutiny-layout">

      {/* Sidebar — renders with position:fixed in its own styles */}
      <FpmsSidebar isOpen={sidebarOpen} />

      {/*
       * KEY: use sidebar-open / sidebar-closed to shift the main area.
       * Do NOT use inline styles here — let the CSS classes handle it.
       */}
      <div className={`scrutiny-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

        <TopHeader toggleSidebar={toggleSidebar} />

        <div className="fpms-container">

          {/* Breadcrumb */}
          <div className="fpms-breadcrumb">
            You are here : <strong style={{ marginLeft: 4 }}>FPMS Dashboard</strong>
          </div>

          {/* ── Summary Cards ── */}
          <div className="fpms-cards">

            <div className="fpms-card blue">
              <div className="fpms-card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="fpms-card-body">
                <span className="fpms-card-label">Total Files</span>
                <span className="fpms-card-count">{summary.total_files ?? 0}</span>
                <span className="fpms-card-sub">Created</span>
              </div>
            </div>

            <div className="fpms-card orange">
              <div className="fpms-card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="fpms-card-body">
                <span className="fpms-card-label">Open</span>
                <span className="fpms-card-count">{summary.open_files ?? 0}</span>
                <span className="fpms-card-sub">Files</span>
              </div>
            </div>

            <div className="fpms-card green">
              <div className="fpms-card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="fpms-card-body">
                <span className="fpms-card-label">Closed</span>
                <span className="fpms-card-count">{summary.closed_files ?? 0}</span>
                <span className="fpms-card-sub">Files</span>
              </div>
            </div>

          </div>
          {/* ── End Summary Cards ── */}

          {/* ── Table Section ── */}
          <div className="fpms-table-section">

            <div className="fpms-table-header">
              <h3 className="fpms-table-title">Total Files</h3>

              <div className="fpms-table-controls">
                <div className="fpms-show-entries">
                  <span>Show</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    {PAGE_SIZES.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span>entries</span>
                </div>

                <div className="fpms-search-wrap">
                  <span className="fpms-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="fpms-error-alert">⚠️ {error}</div>
            )}

            {/* Horizontal scroll wrapper */}
            <div className="fpms-table-wrapper">
              <table className="fpms-data-table">
                <thead>
                  <tr>
                    {[
                      "S.No", "File Number", "Inward Number", "Filed Date",
                      "File Description", "Received Through", "From Where",
                      "To Whom", "File Assigned To", "File Assigned Date", "Status",
                    ].map((col) => (
                      <th key={col}>{col} <span className="sort-icon">↕</span></th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="fpms-table-msg">
                        <span className="fpms-spinner" />
                        Loading dashboard data…
                      </td>
                    </tr>
                  ) : paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="fpms-table-msg">No files found.</td>
                    </tr>
                  ) : (
                    paginatedRows.map((row, index) => (
                      <tr key={row.id ?? index}>
                        <td>{startIndex + index + 1}</td>
                        <td>{safeText(row.file_number)}</td>
                        <td>{safeText(row.inward_no)}</td>
                        <td>{formatDate(row.file_date)}</td>
                        <td>{safeText(row.file_description)}</td>
                        <td>{safeText(row.received_through)}</td>
                        <td>{safeText(row.from_where)}</td>
                        <td>{safeText(row.to_whom)}</td>
                        <td>{safeText(row.assign_to)}</td>
                        <td>{formatDate(row.file_assigned_date)}</td>
                        <td>
                          <span className={`fpms-status-badge ${safeText(row.status).toLowerCase()}`}>
                            {safeText(row.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* End scroll wrapper */}

            {/* Pagination */}
            <div className="fpms-pagination">
              <div className="fpms-pagination-info">
                {filteredRows.length > 0
                  ? `Showing ${startIndex + 1} to ${Math.min(startIndex + pageSize, filteredRows.length)} of ${filteredRows.length} entries`
                  : "Showing 0 entries"}
              </div>

              <div className="fpms-pagination-controls">
                <button
                  className="fpms-page-btn"
                  disabled={safePageNumber === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ← Prev
                </button>
                <span className="fpms-page-indicator">
                  Page {safePageNumber} of {totalPages}
                </span>
                <button
                  className="fpms-page-btn"
                  disabled={safePageNumber >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next →
                </button>
              </div>
            </div>

          </div>
          {/* ── End Table Section ── */}

        </div>
      </div>
    </div>
  );
};

export default ScrutinyFpmsDashboard;