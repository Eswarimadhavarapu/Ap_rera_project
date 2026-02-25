import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/QuarterlyUpdate.css";

const QuarterlyUpdate = () => {
  const { applicationNumber } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    quarter: "",
    construction_status: "",
    units_sold: "",
    amount_collected: "",
    amount_utilized: "",
    approvals_received: "",
  });

  const [documents, setDocuments] = useState({
    site_photo: null,
    ca_certificate: null,
    engineer_certificate: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Handle Text Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, JPG, PNG allowed");
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }

    setDocuments({
      ...documents,
      [name]: file,
    });

    // Image preview for site photo
    if (name === "site_photo" && file.type.startsWith("image/")) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Validation
  const validateForm = () => {
    let newErrors = {};

    if (!formData.quarter)
      newErrors.quarter = "Quarter is required";

    if (!formData.construction_status)
      newErrors.construction_status =
        "Construction status required";

    if (!documents.site_photo)
      newErrors.site_photo = "Site photo required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (type) => {
    if (!validateForm()) return;

    const finalData = {
      ...formData,
      application_number: applicationNumber,
      status: type,
      documents,
    };

    console.log("Frontend Data:", finalData);

    alert(
      type === "SUBMITTED"
        ? "Submitted Successfully (Frontend Only)"
        : "Draft Saved (Frontend Only)"
    );

    navigate("/project-dashboard");
  };

  return (
    <div className="quarterly-container">
      <h3 className="quarterly-title">Quarterly Update</h3>

      <p className="application-number">
        Application No: <strong>{applicationNumber}</strong>
      </p>

      <div className="quarterly-card">

        {/* Quarter */}
        <div className="form-group">
          <label className="form-label">Quarter *</label>
          <select
            className="form-control"
            name="quarter"
            onChange={handleChange}
          >
            <option value="">Select Quarter</option>
            <option value="Q1">Q1 (Apr - Jun)</option>
            <option value="Q2">Q2 (Jul - Sep)</option>
            <option value="Q3">Q3 (Oct - Dec)</option>
            <option value="Q4">Q4 (Jan - Mar)</option>
          </select>
          {errors.quarter && (
            <small className="error-text">
              {errors.quarter}
            </small>
          )}
        </div>

        {/* Construction Status */}
        <div className="form-group">
          <label className="form-label">
            Construction Status *
          </label>
          <input
            type="text"
            className="form-control"
            name="construction_status"
            onChange={handleChange}
          />
          {errors.construction_status && (
            <small className="error-text">
              {errors.construction_status}
            </small>
          )}
        </div>

        {/* Site Photo */}
        <div className="form-group">
          <label className="form-label">
            Upload Site Photo *
          </label>
          <input
            type="file"
            className="form-control"
            name="site_photo"
            onChange={handleFileChange}
          />
          {documents.site_photo && (
            <small>
              Selected: {documents.site_photo.name}
            </small>
          )}
          {errors.site_photo && (
            <small className="error-text">
              {errors.site_photo}
            </small>
          )}

          {/* Image Preview */}
          {previewImage && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: "150px",
                  borderRadius: "6px",
                }}
              />
            </div>
          )}
        </div>

        {/* CA Certificate */}
        <div className="form-group">
          <label className="form-label">
            Upload CA Certificate (PDF/Image)
          </label>
          <input
            type="file"
            className="form-control"
            name="ca_certificate"
            onChange={handleFileChange}
          />
          {documents.ca_certificate && (
            <small>
              Selected: {documents.ca_certificate.name}
            </small>
          )}
        </div>

        {/* Engineer Certificate */}
        <div className="form-group">
          <label className="form-label">
            Upload Engineer Certificate (PDF/Image)
          </label>
          <input
            type="file"
            className="form-control"
            name="engineer_certificate"
            onChange={handleFileChange}
          />
          {documents.engineer_certificate && (
            <small>
              Selected: {documents.engineer_certificate.name}
            </small>
          )}
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button
            className="btn-draft"
            onClick={() => handleSubmit("DRAFT")}
          >
            Save Draft
          </button>

          <button
            className="btn-submit"
            onClick={() => handleSubmit("SUBMITTED")}
          >
            Final Submit
          </button>
        </div>

      </div>
    </div>
  );
};

export default QuarterlyUpdate;