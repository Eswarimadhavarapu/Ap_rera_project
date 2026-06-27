import React from "react";
import { BASE_URL } from "../../api/api";

const scrutiny_OtherThanIndividualAuthorizedSignatory = ({ formData = {} }) => {

  /* ================= HELPERS ================= */

  const safe = (v) =>
    v !== undefined && v !== null && v !== "" ? v : "NA";
  
  const isExistingDirectorValue = String(formData.isExistingDirector || "").trim().toLowerCase();

  const getFileUrl = (path) => {
    if (!path) return "";
    if (path instanceof File) return URL.createObjectURL(path);

    const normalizedPath = String(path).trim().replace(/\\/g, "/");
    if (!normalizedPath) return "";
    if (/^https?:\/\//i.test(normalizedPath)) return encodeURI(normalizedPath);

    const uploadsIndex = normalizedPath.toLowerCase().indexOf("/uploads/");
    const relativeUploadsPath =
      uploadsIndex >= 0
        ? normalizedPath.slice(uploadsIndex + 1)
        : normalizedPath.toLowerCase().startsWith("uploads/")
          ? normalizedPath
          : normalizedPath.replace(/^\/+/, "");

    return encodeURI(`${BASE_URL}/${relativeUploadsPath}`);
  };

  const getFileName = (path) => {
    if (!path) return "NA";
    if (path instanceof File) return path.name;
    return String(path).replace(/\\/g, "/").split("/").pop() || "NA";
  };
  const openProtectedFile = async (filePath) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${BASE_URL}/${String(filePath).replace(/\\/g, "/")}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.log(data);
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
  return (
    <div className="form-section">

      <div className="subheading">
        Authorized Signatory Details
      </div>

      {/* ===== ROW 1 ===== */}
      <div className="innerdivrow">

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Name</span>
            <span className="display-field">
              {safe(formData.authorizedSignatoryName)}
            </span>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Mobile Number</span>
            <span className="display-field">
              {safe(formData.authorizedSignatoryMobile)}
            </span>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Email</span>
            <span className="display-field">
              {safe(formData.authorizedSignatoryEmail)}
            </span>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">
              Is Existing Director / Member
            </span>
            <span className="display-field">
              {isExistingDirectorValue === "yes" ? "Yes" : isExistingDirectorValue === "no" ? "No" : "NA"}
            </span>
          </div>
        </div>

      </div>

      {/* ===== ROW 2 (FILES) ===== */}
      <div className="innerdivrow">

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Passport Photo</span>
            {getFileUrl(
              formData.authorizedSignatoryPhoto ||
              formData.authorizedSignatoryPhotoPath
            ) ? (
            <span
  className="display-field"
  style={{
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline",
  }}
  onClick={() =>
    openProtectedFile(
      formData.authorizedSignatoryPhoto ||
      formData.authorizedSignatoryPhotoPath
    )
  }
>
  {getFileName(
    formData.authorizedSignatoryPhoto ||
    formData.authorizedSignatoryPhotoPath
  )}
</span>
            ) : (
              <span className="display-field">NA</span>
            )}
          </div>
        </div>

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Board Resolution Copy</span>
            {getFileUrl(
              formData.boardResolutionCopy ||
              formData.boardResolutionCopyPath
            ) ? (
              <span
  className="display-field"
  style={{
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline",
  }}
  onClick={() =>
    openProtectedFile(
      formData.boardResolutionCopy ||
      formData.boardResolutionCopyPath
    )
  }
>
  {getFileName(
    formData.boardResolutionCopy ||
    formData.boardResolutionCopyPath
  )}
</span>
            ) : (
              <span className="display-field">NA</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default scrutiny_OtherThanIndividualAuthorizedSignatory;