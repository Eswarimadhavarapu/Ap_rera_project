import React from "react";

const OtherThanIndividualAuthorizedSignatory = ({
  formData,
  handleInputChange,
  handleFileChange,
}) => {
  return (
    <>
      <h2 className="page-title">Authorized Signatory Details</h2>

      <div className="form-section">
        <div className="row innerdivrow">

          {/* Name */}
          <div className="col-sm-3">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="authorizedSignatoryName"
                className="form-control"
                value={formData.authorizedSignatoryName || ""}
                onChange={handleInputChange}
                placeholder="Name"
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="col-sm-3">
            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                type="text"
                name="authorizedSignatoryMobile"
                className="form-control"
                value={formData.authorizedSignatoryMobile || ""}
                onChange={handleInputChange}
                placeholder="Mobile Number"
              />
            </div>
          </div>

          {/* Email */}
          <div className="col-sm-3">
            <div className="form-group">
              <label>Email Id *</label>
              <input
                type="email"
                name="authorizedSignatoryEmail"
                className="form-control"
                value={formData.authorizedSignatoryEmail || ""}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </div>
          </div>

          {/* Existing Director/Member */}
          <div className="col-sm-3">
            <div className="form-group">
              <label>
                Is the Authorized signatory among the existing director/member *
              </label>

              <div>
                <label style={{ marginRight: "10px" }}>
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

          {/* Passport Photo Upload */}
          <div className="col-sm-3">
            <div className="form-group">
              <label>Passport size photograph of Authorised Signatory</label>
              <input
                type="file"
                name="authorizedSignatoryPhoto"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Board Resolution Upload */}
          <div className="col-sm-3">
            <div className="form-group">
              <label>Copy of Board Resolution for Authorised signatory</label>
              <input
                type="file"
                name="boardResolutionCopy"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default OtherThanIndividualAuthorizedSignatory;