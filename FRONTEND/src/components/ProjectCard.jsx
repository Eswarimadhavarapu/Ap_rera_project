import React, { useState } from "react";
import PublicProjectDetailsModal from "./PublicProjectDetailsModal";

const FILLED_STAR = "\u2605";
const EMPTY_STAR = "\u2606";

export default function ProjectCard({ project }) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const avg = Number(project.rating?.average || 0);
  const totalReviews = project.rating?.total_reviews || 0;
  const filledStars = Math.max(0, Math.min(5, Math.round(avg)));

  return (
    <>
      <div className="search-list-item">
        <div className="sli-left">
          <span className="sli-app-no"># {project.application_no}</span>
          <div className="sli-project-name">
            {project.project_name || "Unnamed Project"}
          </div>
          <div className="sli-promoter-name">{project.applicant_name}</div>
          <div className="sli-location">
            Location: {project.district || "Andhra Pradesh"}
          </div>

          <div className="sli-rating">
            {avg > 0 ? (
              <div className="sli-stars-row">
                <span className="sli-stars">
                  {FILLED_STAR.repeat(filledStars)}
                  {EMPTY_STAR.repeat(5 - filledStars)}
                </span>
                <span className="sli-rating-text">
                  {avg.toFixed(1)} / 5 &nbsp;&middot;&nbsp; {totalReviews} review
                  {totalReviews !== 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              <span className="sli-no-rating">No director reviews yet</span>
            )}
          </div>
        </div>

        <div className="sli-middle">
          <div className="sli-meta-item">
            <span className="sli-meta-label">State</span>
            <span className="sli-meta-value">Andhra Pradesh</span>
          </div>
          <div className="sli-meta-item">
            <span className="sli-meta-label">District</span>
            <span className="sli-meta-value">{project.district || "N/A"}</span>
          </div>
        </div>

        <div className="sli-middle">
          <div className="sli-meta-item">
            <span className="sli-meta-label">Certificate</span>
            <span className="sli-meta-value view-btn-icon">View</span>
          </div>
          <div className="sli-meta-item">
            <span className="sli-meta-label">Extension Certificate</span>
            <span className="sli-meta-value btn-na">N/A</span>
          </div>
        </div>

        <div className="sli-right">
          <div className="sli-app-links-wrapper">
            <div className="sli-app-links">
              <span className="sli-meta-label" style={{ marginBottom: 4 }}>
                Application
              </span>
              <a
                href="#"
                className="sli-link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDetailsModalOpen(true);
                }}
              >
                View Details
              </a>
              <a href="#" className="sli-link">
                View Application
              </a>
            </div>
            <div
              className="sli-circle-arrow"
              onClick={() => setIsDetailsModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsDetailsModalOpen(true);
                }
              }}
            >
              -&gt;
            </div>
          </div>
        </div>
      </div>

      {isDetailsModalOpen && (
        <PublicProjectDetailsModal
          applicationNumber={project.application_no}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </>
  );
}