const scrutiny_ExistingProjectRegistrationSection = ({
  formData,
}) => {
  return (
    <>
      <h2 className="page-title-scrutiny">Project Registration</h2>

      <div className="form-section-scrutiny">

        {/* ================= BASIC INFO ================= */}
        <div className="row-scrutiny innerdivrow-scrutiny">

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Project Name</span>
              <span className="display-field-scrutiny">
                {formData?.projectName || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Project Description</span>
              <span className="display-field-scrutiny">
                {formData?.projectDescription || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Project Type</span>
              <span className="display-field-scrutiny">
                {formData?.projectType === "1" && "Residential"}
                {formData?.projectType === "2" && "Commercial"}
                {formData?.projectType === "3" && "Mixed Development"}
                {formData?.projectType === "7" && "Layout for Plots"}
                {formData?.projectType === "8" && "Layouts for Plots & Buildings"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Project Status</span>
              <span className="display-field-scrutiny">
                {formData?.projectStatus === "3" && "Under Development"}
                {formData?.projectStatus === "4" && "New Project"}
              </span>
            </div>
          </div>

        </div>

        {/* ================= BUILDING DETAILS ================= */}
        <div className="row-scrutiny innerdivrow-scrutiny">

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Building Plan No</span>
              <span className="display-field-scrutiny">
                {formData?.buildingPlanNo || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Permission From</span>
              <span className="display-field-scrutiny">
                {formData?.buildingPermissionFrom || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Permission Upto</span>
              <span className="display-field-scrutiny">
                {formData?.buildingPermissionUpto || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Commencement Date</span>
              <span className="display-field-scrutiny">
                {formData?.dateOfCommencement || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Completion Date</span>
              <span className="display-field-scrutiny">
                {formData?.proposedCompletionDate || "NA"}
              </span>
            </div>
          </div>

        </div>

        {/* ================= AREA ================= */}
        <div className="row-scrutiny innerdivrow-scrutiny">

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Total Land Area</span>
              <span className="display-field-scrutiny">
                {formData?.totalAreaOfLand || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Plinth Area</span>
              <span className="display-field-scrutiny">
                {formData?.totalPlinthArea || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Open Area</span>
              <span className="display-field-scrutiny">
                {formData?.totalOpenArea || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Built-up Area</span>
              <span className="display-field-scrutiny">
                {formData?.totalBuiltUpArea || "NA"}
              </span>
            </div>
          </div>

        </div>

        {/* ================= PARKING ================= */}
        <div className="row-scrutiny innerdivrow-scrutiny">

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Garages</span>
              <span className="display-field-scrutiny">
                {formData?.garagesAvailableForSale || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Garage Area</span>
              <span className="display-field-scrutiny">
                {formData?.totalGarageArea || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Open Parking</span>
              <span className="display-field-scrutiny">
                {formData?.openParkingSpaces || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Open Parking Area</span>
              <span className="display-field-scrutiny">
                {formData?.totalOpenParkingArea || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Covered Parking</span>
              <span className="display-field-scrutiny">
                {formData?.coveredParkingSpaces || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Covered Parking Area</span>
              <span className="display-field-scrutiny">
                {formData?.totalCoveredParkingArea || "NA"}
              </span>
            </div>
          </div>

        </div>

        {/* ================= COST ================= */}
        <div className="row-scrutiny innerdivrow-scrutiny">

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Construction Cost</span>
              <span className="display-field-scrutiny">
                {formData?.estimatedConstructionCost || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Land Cost</span>
              <span className="display-field-scrutiny">
                {formData?.costOfLand || "NA"}
              </span>
            </div>
          </div>

          <div className="col-sm-3-scrutiny">
            <div className="display-group-scrutiny">
              <span className="display-label-scrutiny">Total Cost</span>
              <span className="display-field-scrutiny">
                {formData?.totalProjectCost || "NA"}
              </span>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default scrutiny_ExistingProjectRegistrationSection;