import React, { useState } from "react";
import { searchProjects } from "../services/searchService";
import ProjectCard from "./ProjectCard";
import "../styles/searchPanel.css";

export default function SearchPanel() {
  const [params, setParams] = useState({ project_name: "", area: "", application_number: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const handleSearch = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchProjects({ ...params, page, limit: pagination.limit });
      if (res.success) {
        setResults(res.data);
        setPagination(res.pagination);
      } else {
        setError("Failed to fetch results.");
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setParams({ project_name: "", area: "", application_number: "" });
    setResults([]);
    setPagination({ page: 1, limit: 10, total: 0 });
    setError(null);
  };

  const handleChange = (e) => setParams({ ...params, [e.target.name]: e.target.value });

  return (
    <div className="search-ecosystem-wrapper">
      <div className="search-panel-card">
        <h2>Project Search</h2>
        <div className="search-fields-grid">
          <input name="project_name" value={params.project_name} onChange={handleChange} placeholder="Project Name" className="sp-input" />
          <input name="area" value={params.area} onChange={handleChange} placeholder="Area / District" className="sp-input" />
          <input name="application_number" value={params.application_number} onChange={handleChange} placeholder="Application Number" className="sp-input" />
        </div>
        <div className="search-actions">
          <button onClick={() => handleSearch(1)} className="sp-btn search-btn">Search</button>
          <button onClick={handleReset} className="sp-btn reset-btn">Reset</button>
        </div>
      </div>

      {loading && <div className="sp-loading">Searching...</div>}
      {error && <div className="sp-error">{error}</div>}

      {results.length > 0 && !loading && (
        <div className="search-results-container">
          <h3>Results ({pagination.total})</h3>
          <div className="results-grid">
            {results.map(r => <ProjectCard key={r.application_no} project={r} />)}
          </div>
          
          <div className="sp-pagination">
             <button disabled={pagination.page <= 1} onClick={() => handleSearch(pagination.page - 1)}>Prev</button>
             <span>Page {pagination.page} of {pagination.pages}</span>
             <button disabled={pagination.page >= pagination.pages} onClick={() => handleSearch(pagination.page + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}