
import React from "react";
import { BASE_URL } from "../api/api";

const openProtectedFile = async (filePath) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${BASE_URL}/${filePath.replace(/\\/g, "/")}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      const data = await response.json();

      if (data.msg === "Token has expired") {
        localStorage.clear();
        alert("Session expired. Please login again.");
        window.location.href = "/login";
        return;
      }
    }

    if (!response.ok) {
      throw new Error("Unable to open file");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    window.open(url, "_blank");
  } catch (err) {
    console.error(err);
    alert("Unable to open document");
  }
};

const OtherThanIndividualAuthorizedSignatory = ({
  formData = {},
  handleInputChange,
  handleFileChange,
}) => {

  /* ================= FILE HELPERS ================= */

  const getFileUrl = (path) => {
    if (!path) return "";
    if (path instanceof File) return "";
    return `${BASE_URL}/${path.replace(/\\/g, "/")}`;
  };

  const getFileName = (path) => {
    if (!path) return "No file chosen";
    if (path instanceof File) return path.name;
    return path.replace(/\\/g, "/").split("/").pop();
  };

  const FileInputBox = ({ path, name }) => {
    const fileUrl = getFileUrl(path);
    const fileName = getFileName(path);

    return (
      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "6px 12px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fff",
            fontSize: "14px",
          }}
        >
          {/* File Name */}
          <div
            style={{
              maxWidth: "60%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {fileName}
          </div>

          {/* Actions */}
          <div>
           {path && (
  <span
    onClick={() => openProtectedFile(path)}
    style={{
      marginRight: "15px",
      fontSize: "14px",
      color: "#ffc107",
      cursor: "pointer",
      textDecoration: "underline",
    }}
  >
    View
  </span>
)}

            <label
              style={{
                cursor: "pointer",
                color: "#007bff",
                fontSize: "14px",
              }}
            >
              Choose
              <input
                type="file"
                hidden
                name={name}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="form-section">

      <div className="subheading">
        Authorized Signatory Details
      </div>

      {/* ===== ROW 1 ===== */}
      <div className="innerdivrow">

        <div className="col-sm-3 form-group">
          <label className="label">Name *</label>
          <input
            type="text"
            name="authorizedSignatoryName"
            className="inputbox"
            value={formData.authorizedSignatoryName || ""}
            onChange={handleInputChange}
            placeholder="Name"
          />
        </div>

        <div className="col-sm-3 form-group">
          <label className="label">Mobile Number *</label>
          <input
            type="text"
            name="authorizedSignatoryMobile"
            className="inputbox"
            value={formData.authorizedSignatoryMobile || ""}
            onChange={handleInputChange}
            placeholder="Mobile Number"
          />
        </div>

        <div className="col-sm-3 form-group">
          <label className="label">Email Id *</label>
          <input
            type="email"
            name="authorizedSignatoryEmail"
            className="inputbox"
            value={formData.authorizedSignatoryEmail || ""}
            onChange={handleInputChange}
            placeholder="Email"
          />
        </div>

        <div className="col-sm-3 form-group">
          <label className="label">
            Is the Authorized signatory among the existing director/member *
          </label>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="isExistingDirector"
                value="yes"
                checked={formData.isExistingDirector === "yes"}
                onChange={handleInputChange}
              />{" "}
              Yes
            </label>

            <label>
              <input
                type="radio"
                name="isExistingDirector"
                value="no"
                checked={formData.isExistingDirector === "no"}
                onChange={handleInputChange}
              />{" "}
              No
            </label>
          </div>
        </div>

      </div>

      {/* ===== ROW 2 (FILE UPLOADS) ===== */}
      <div className="innerdivrow">

        {/* Passport Photo */}
        <div className="col-sm-3 form-group">
          <label className="label">
            Passport size photograph of Authorised Signatory
          </label>

          <FileInputBox
  path={
    formData.authorizedSignatoryPhoto || 
    formData.authorizedSignatoryPhotoPath
  }
  name="authorizedSignatoryPhoto"
/>
        </div>

        {/* Board Resolution */}
        <div className="col-sm-3 form-group">
          <label className="label">
            Copy of Board Resolution for Authorised signatory
          </label>

          <FileInputBox
  path={
    formData.boardResolutionCopy || 
    formData.boardResolutionCopyPath
  }
  name="boardResolutionCopy"
/>
        </div>

      </div>

    </div>
  );
};

export default OtherThanIndividualAuthorizedSignatory;