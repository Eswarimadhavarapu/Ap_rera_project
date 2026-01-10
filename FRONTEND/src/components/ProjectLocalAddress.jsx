import React from "react";

const ProjectLocalAddress = ({ formData, handleInputChange }) => {
  return (
    <div className="form-section">
      <h3 className="subheading">Project Local Address For Communication</h3>

      <div className="row innerdivrow">
        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Door No. / Flat No. &amp; Floor No.<font color="red">*</font>
            </label>
            <input
              type="text"
              name="localAddress1"
              maxLength="500"
              className="form-control inputbox"
              placeholder="Door No. / Flat No. & Floor No."
              value={formData.localAddress1}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Apartment / Tower / Building Name<font color="red">*</font>
            </label>
            <input
              type="text"
              name="localAddress2"
              maxLength="500"
              className="form-control inputbox"
              placeholder="Apartment / Tower / Building Name"
              value={formData.localAddress2}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Area / Street Name<font color="red">*</font>
            </label>
            <input
              type="text"
              name="localArea"
              maxLength="500"
              className="form-control inputbox"
              placeholder="Area / Street Name"
              value={formData.localArea}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">
              Land Mark<font color="red">*</font>
            </label>
            <input
              type="text"
              name="localLandmark"
              maxLength="500"
              className="form-control inputbox"
              placeholder="Land Mark"
              value={formData.localLandmark}
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
              name="localDistrict"
              className="form-control inputbox"
              value={formData.localDistrict}
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
              name="localMandal"
              className="form-control inputbox"
              value={formData.localMandal}
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
              name="localVillage"
              className="form-control inputbox"
              value={formData.localVillage}
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
              name="localPincode"
              maxLength="6"
              className="form-control inputbox allownumeric"
              placeholder="Postal PIN Code"
              value={formData.localPincode}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label className="label">Project Website URL</label>
            <input
              type="text"
              name="projectWebsiteURL"
              maxLength="500"
              className="form-control inputbox"
              placeholder="Project Website URL"
              value={formData.projectWebsiteURL}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectLocalAddress;
