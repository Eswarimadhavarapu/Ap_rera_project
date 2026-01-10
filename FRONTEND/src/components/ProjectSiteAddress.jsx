import React from "react";

const ProjectSiteAddress = ({
  formData,
  handleInputChange,
  handleFileChange
}) => {
  return (
    <div className="form-section">
      <h3 className="subheading">Project Site Address</h3>

      <div className="row innerdivrow">
        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Near by Door No. &amp; Street Name<font color="red">*</font>
            </label>
            <input
              type="text"
              name="projectAddress1"
              maxLength="500"
              className="form-control inputbox"
              placeholder="Near by Door No. & Street Name"
              value={formData.projectAddress1}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Area &amp; Land Mark<font color="red">*</font>
            </label>
            <input
              type="text"
              name="projectAddress2"
              maxLength="500"
              className="form-control inputbox"
              placeholder="Area & Land Mark"
              value={formData.projectAddress2}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              District<font color="red">*</font>
            </label>
            <select
              name="projectDistrict"
              className="form-control inputbox"
              value={formData.projectDistrict}
              onChange={handleInputChange}
              required
            >
              <option value="0">Select</option>
              <option value="1">Srikakulam</option>
              <option value="2">Vizianagaram</option>
              <option value="3">Visakhapatnam</option>
              <option value="4">East Godavari</option>
              <option value="5">West Godavari</option>
              <option value="6">Krishna</option>
              <option value="7">Guntur</option>
              <option value="8">Prakasam</option>
              <option value="9">SPR Nellore</option>
              <option value="10">Chittoor</option>
              <option value="11">Y.S.R Kadapa</option>
              <option value="12">Ananthapuramu</option>
              <option value="13">Kurnool</option>
            </select>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Mandal<font color="red">*</font>
            </label>
            <select
              name="projectMandal"
              className="form-control inputbox"
              value={formData.projectMandal}
              onChange={handleInputChange}
              required
            >
              <option value="0">Select</option>
            </select>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Village<font color="red">*</font>
            </label>
            <select
              name="projectVillage"
              className="form-control inputbox"
              value={formData.projectVillage}
              onChange={handleInputChange}
              required
            >
              <option value="0">Select</option>
            </select>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Postal PIN Code<font color="red">*</font>
            </label>
            <input
              type="text"
              name="projectPincode"
              maxLength="6"
              className="form-control inputbox allownumeric"
              placeholder="Postal PIN Code"
              value={formData.projectPincode}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Latitude<font color="red">*</font>
            </label>
            <input
              type="text"
              name="projectLatitude"
              maxLength="12"
              className="form-control inputbox"
              placeholder="Latitude"
              value={formData.projectLatitude}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Longitude<font color="red">*</font>
            </label>
            <input
              type="text"
              name="projectLongitude"
              maxLength="12"
              className="form-control inputbox"
              placeholder="Longitude"
              value={formData.projectLongitude}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="row innerdivrow">
        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Plan Approving Authority<font color="red">*</font>
            </label>
            <select
              name="planApprovingAuthority"
              className="form-control inputbox"
              value={formData.planApprovingAuthority}
              onChange={handleInputChange}
              required
            >
              <option value="0">Select</option>
              <option value="4">Vice Chairman, UDA</option>
              <option value="5">Commissioner, APCRDA</option>
              <option value="6">Commissioner, ULB</option>
              <option value="7">Director, Town and Country Planning</option>
              <option value="9">Commissioner, VMRDA</option>
            </select>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Upload Address Proof<font color="red">*</font>
            </label>
            <input
              type="file"
              name="addressProof"
              className="form-control inputbox"
              onChange={handleFileChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Site Survey No.<font color="red">*</font>
            </label>
            <input
              type="text"
              name="surveyNo"
              maxLength="1000"
              className="form-control inputbox"
              placeholder="Survey No."
              value={formData.surveyNo}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSiteAddress;
