import React, { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import {
  getCompletedProjectsForDirector,
  submitDirectorRating,
} from "../services/ratingService";
import { uploadProjectImage } from "../services/galleryService";
import "../styles/DirectorProjectRatings.css";
import GalleryCarousel from "./GalleryCarousel";
import PublicProjectDetailsModal from "./PublicProjectDetailsModal";

const FILLED_STAR = "\u2605";
const EMPTY_STAR = "\u2606";

export default function DirectorProjectRatings() {
  const { admin } = useAdmin();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [admin?.id]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getCompletedProjectsForDirector(admin?.id || 0);
      if (res.success) {
        setProjects(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (appNo, rating, review) => {
    try {
      const res = await submitDirectorRating({
        project_application_number: appNo,
        director_user_id: admin?.id || 0,
        rating,
        review,
      });

      if (res.success) {
        fetchProjects();
      } else {
        alert(res.error || "Failed to submit rating");
      }
    } catch (err) {
      alert("Error submitting rating");
    }
  };

  if (loading) {
    return (
      <div className="director-ratings-container">
        <div className="sp-loading">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="director-ratings-container">
      <h3 className="dr-title">Completed Projects Reviews</h3>
      <p className="dr-subtitle">
        {projects.length} project{projects.length !== 1 ? "s" : ""} available
        for review
      </p>

      {projects.length === 0 ? (
        <div className="gc-empty">No projects found in the system.</div>
      ) : (
        <div className="dr-grid">
          {projects.map((project) => (
            <DirectorProjectCard
              key={project.application_no}
              project={project}
              onSubmit={handleRatingSubmit}
              onImageUploaded={fetchProjects}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DirectorProjectCard({ project, onSubmit, onImageUploaded }) {
  const [rating, setRating] = useState(project.my_rating?.rating || 0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState(project.my_rating?.review || "");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;

    setSubmitting(true);
    await onSubmit(project.application_no, rating, review);
    setSubmitting(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadProjectImage(
        project.application_no,
        file,
        file.name
      );

      if (res.success) {
        onImageUploaded();
      } else {
        alert(`Failed to upload image: ${res.error}`);
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
      e.target.value = null;
    }
  };

  const avg =
    Number(project.rating?.average) ||
    Number.parseFloat(project.all_ratings?.average || 0);
  const totalReviews =
    project.rating?.total_reviews || project.all_ratings?.total_reviews || 0;
  const filledStars = Math.max(0, Math.min(5, Math.round(avg)));

  return (
    <>
      <div
        className={`dr-card-wrapper ${
          isDetailsModalOpen ? "dr-card-wrapper-modal-open" : ""
        }`}
      >
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
                    {avg.toFixed(1)} / 5 &nbsp;&middot;&nbsp; {totalReviews}{" "}
                    review{totalReviews !== 1 ? "s" : ""}
                  </span>
                </div>
              ) : (
                <span className="sli-no-rating">No reviews yet</span>
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
                <span className="sli-meta-label dr-application-label">
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

        <div className="dr-actions-section">
          <div className="dr-actions-gallery">
            <h5>
              Project Gallery
              <div className="dr-upload-group">
                <input
                  type="file"
                  id={`upload-${project.application_no}`}
                  style={{ display: "none" }}
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                />
                <label
                  htmlFor={`upload-${project.application_no}`}
                  className="dr-upload-btn"
                  style={{ cursor: uploadingImage ? "not-allowed" : "pointer" }}
                >
                  {uploadingImage ? "Uploading..." : "+ Add Image"}
                </label>
              </div>
            </h5>

            <div className="dr-gallery-container">
              {project.gallery && project.gallery.length > 0 ? (
                <GalleryCarousel images={project.gallery} />
              ) : (
                <span className="sli-no-rating">No images uploaded yet.</span>
              )}
            </div>
          </div>

          <div className="dr-actions-review">
            <h5>{project.my_rating ? "Update Your Review" : "Rate This Project"}</h5>

            <div className="dr-stars-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`dr-star ${
                    (hovered || rating) >= star ? "selected" : ""
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                >
                  {FILLED_STAR}
                </span>
              ))}
            </div>

            <textarea
              className="dr-review-textarea"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your assessment of this project..."
            />

            <button
              className={`dr-submit-btn ${project.my_rating ? "update" : ""}`}
              onClick={handleSubmit}
              disabled={!rating || submitting}
            >
              {submitting
                ? "Saving..."
                : project.my_rating
                  ? "Update Review"
                  : "Submit Review"}
            </button>
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