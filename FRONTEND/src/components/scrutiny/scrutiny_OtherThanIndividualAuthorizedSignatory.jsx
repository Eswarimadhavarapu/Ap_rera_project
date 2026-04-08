import React from "react";
import { BASE_URL } from "../../api/api";

const scrutiny_OtherThanIndividualAuthorizedSignatory = ({ formData = {} }) => {

  /* ================= HELPERS ================= */

  const safe = (v) =>
    v !== undefined && v !== null && v !== "" ? v : "NA";

  const getFileUrl = (path) => {
    if (!path) return "";
    if (path instanceof File) return "";
    return `${BASE_URL}/${path.replace(/\\/g, "/")}`;
  };

  const getFileName = (path) => {
    if (!path) return "NA";
    if (path instanceof File) return path.name;
    return path.replace(/\\/g, "/").split("/").pop();
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
              {formData.isExistingDirector === "yes" ? "Yes" : "No"}
            </span>
          </div>
        </div>

      </div>

      {/* ===== ROW 2 (FILES) ===== */}
      <div className="innerdivrow">

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">
              Passport Photo
            </span>
            <span className="display-field">
              {getFileName(
                formData.authorizedSignatoryPhoto ||
                formData.authorizedSignatoryPhotoPath
              )}
            </span>

            {getFileUrl(
              formData.authorizedSignatoryPhoto ||
              formData.authorizedSignatoryPhotoPath
            ) && (
              <a
                href={getFileUrl(
                  formData.authorizedSignatoryPhoto ||
                  formData.authorizedSignatoryPhotoPath
                )}
                target="_blank"
                rel="noreferrer"
              >
                View
              </a>
            )}
          </div>
        </div>

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">
              Board Resolution Copy
            </span>
            <span className="display-field">
              {getFileName(
                formData.boardResolutionCopy ||
                formData.boardResolutionCopyPath
              )}
            </span>

            {getFileUrl(
              formData.boardResolutionCopy ||
              formData.boardResolutionCopyPath
            ) && (
              <a
                href={getFileUrl(
                  formData.boardResolutionCopy ||
                  formData.boardResolutionCopyPath
                )}
                target="_blank"
                rel="noreferrer"
              >
                View
              </a>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default scrutiny_OtherThanIndividualAuthorizedSignatory;