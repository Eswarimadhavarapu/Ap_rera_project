import React, { useState, useEffect } from "react";

import { apiPost, apiDelete } from "../api/api";

const StructuralEngineers = ({
  engineers = [],
  states = [],
  districts = [],
 applicationNumber,
 panNumber,
  onStateChange,
  onUpdate,
}) => {
const [engineerList, setEngineerList] = useState([]);

const appNo =
  applicationNumber || sessionStorage.getItem("applicationNumber");

const panNo =
  panNumber || sessionStorage.getItem("panNumber");

useEffect(() => {
  const loadEngineers = async () => {
    if (!appNo || !panNo) return;

    try {
      const res = await fetch(
        `https://0jv8810n-8080.inc1.devtunnels.ms/api/application/associates?application_number=${appNo}&pan_number=${panNo}`
      );
      const json = await res.json();

      if (json.success) {
        setEngineerList(json.data.engineers || []);
      }
    } catch (err) {
      console.error("Failed to load engineers", err);
    }
  };

  loadEngineers();
}, [appNo, panNo]);


  const [formData, setFormData] = useState({
    engineer_name: "",
    email_id: "",
    address_line1: "",
    address_line2: "",
    state_ut: "",
    district: "",
    pin_code: "",
    year_of_establishment: "",
    number_of_key_projects: "",
    licence_number: "",
    mobile_number: "",
  });

  // -----------------------------
  // INPUT CHANGE
  // -----------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "state_ut") {
      const stateId = value ? Number(value) : "";

      setFormData((prev) => ({
        ...prev,
        state_ut: stateId,
        district: "",
      }));

      if (stateId) {
        onStateChange(stateId);
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // ADD STRUCTURAL ENGINEER
  // -----------------------------
 const handleAdd = async () => {
  const requiredFields = [
    "engineer_name",
    "address_line1",
    "state_ut",
    "district",
    "pin_code",
    "licence_number",
    "mobile_number",
  ];

  for (const field of requiredFields) {
    if (!formData[field]) {
      alert("Please fill all required fields");
      return;
    }
  }

  try {
    const payload = {
      application_number: applicationNumber,
      pan_number: panNumber,
      ...formData,
      state_ut: Number(formData.state_ut),
      district: Number(formData.district),
      year_of_establishment:
        formData.year_of_establishment === ""
          ? null
          : Number(formData.year_of_establishment),
      number_of_key_projects:
        formData.number_of_key_projects === ""
          ? null
          : Number(formData.number_of_key_projects),
    };

   const response = await apiPost(
  "/api/associate/structural-engineer",
  payload
);

if (!response?.success) {
  throw new Error("Failed to add structural engineer");
}

const engineerId =
  response.data?.id || response.data?.data?.id;

if (!engineerId) {
  throw new Error("Engineer ID not returned");
}

await apiPost("/api/application/associate", {
  application_number: appNo,
  pan_number: panNo,
  associate_type: "engineer",
  associate_id: engineerId,
});


    alert("Structural Engineer added successfully");
const createdEngineer = {
  id: response.data?.id || response.data?.data?.id || Date.now(),
  engineer_name: formData.engineer_name,
  email_id: formData.email_id,
  address_line1: formData.address_line1,
  mobile_number: formData.mobile_number,
  licence_number: formData.licence_number,
};

setEngineerList((prev) => [...prev, createdEngineer]);

    setFormData({
      engineer_name: "",
      email_id: "",
      address_line1: "",
      address_line2: "",
      state_ut: "",
      district: "",
      pin_code: "",
      year_of_establishment: "",
      number_of_key_projects: "",
      licence_number: "",
      mobile_number: "",
    });

    // onUpdate();
  } catch (error) {
    console.error("Error adding structural engineer:", error);
    alert("Error adding structural engineer");
  }
};
const handleDelete = (engineerId) => {
  if (!window.confirm("Are you sure you want to delete this engineer?")) return;

  setEngineerList(prev => prev.filter(e => e.id !== engineerId));

  alert("Structural engineer deleted");
};


  return (
    <div className="form-section">
      <h3 className="section-title-ac">Structural Engineers</h3>

      <div className="form-grid">
       {/* Engineer Name */}
<div className="form-group">
  <label>
    Engineer Name<span className="required">*</span>
  </label>
  <input
    type="text"
    name="engineer_name"
    value={formData.engineer_name}
    onChange={handleInputChange}
    className="form-control"
  />
</div>

         {/* Year of establishment */}
<div className="form-group">
  <label>Year of establishment</label>
  <input
    type="number"
    name="year_of_establishment"
    placeholder="YYYY"
    value={formData.year_of_establishment}
    onChange={handleInputChange}
    className="form-control"
  />
</div>



        {/* Email */}
        <div className="form-group">
          <label>Email ID</label>
          <input
            type="email"
            name="email_id"
            value={formData.email_id}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        {/* Address Line 1 */}
        <div className="form-group">
          <label>
            Address Line 1<span className="required">*</span>
          </label>
          <input
            type="text"
            name="address_line1"
            value={formData.address_line1}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        {/* Address Line 2 */}
        <div className="form-group">
          <label>Address Line 2</label>
          <input
            type="text"
            name="address_line2"
            value={formData.address_line2}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        {/* STATE */}
        <div className="form-group">
          <label>
            State / UT<span className="required">*</span>
          </label>
          <select
            name="state_ut"
            value={formData.state_ut}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select</option>
            {states.map((state, index) => {
              const key = state.state_id || state.id || index;
              const value = state.state_id || state.id;
              const label = state.state_name || state.name;

              return (
                <option key={key} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        {/* DISTRICT */}
        <div className="form-group">
          <label>
            District<span className="required">*</span>
          </label>
          <select
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            className="form-control"
            disabled={!formData.state_ut}
          >
            <option value="">Select</option>
            {districts.map((district, index) => {
              const key = district.district_id || district.id || index;
              const value = district.district_id || district.id;
              const label = district.district_name || district.name;

              return (
                <option key={key} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        {/* PIN */}
        <div className="form-group">
          <label>
            PIN Code<span className="required">*</span>
          </label>
          <input
            type="text"
            name="pin_code"
            value={formData.pin_code}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        {/* Year */}
        <div className="form-group">
          <label>Year of establishment</label>
          <input
            type="text"
            name="year_of_establishment"
            value={formData.year_of_establishment}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        {/* Projects */}
        <div className="form-group">
          <label>Number of key projects completed</label>
          <input
            type="text"
            name="number_of_key_projects"
            value={formData.number_of_key_projects}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        {/* Licence */}
        <div className="form-group">
          <label>
            Licence Number<span className="required">*</span>
          </label>
          <input
            type="text"
            name="licence_number"
            value={formData.licence_number}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        {/* Mobile */}
        <div className="form-group">
          <label>
            Mobile Number<span className="required">*</span>
          </label>
          <input
            type="text"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
      </div>

      <div className="add-button-container">
        <button className="btn-add" onClick={handleAdd}>
          Add
        </button>
      </div>

      {/* LIST */}
      {engineerList.length  > 0 && (
        <div className="added-items-list">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Mobile</th>
                <th>Licence</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {engineerList.map((e) => (
                <tr key={e.id}>
                  <td>{e.engineer_name}</td>
                  <td>{e.email_id}</td>
                  <td>{e.address_line1}</td>
                  <td>{e.mobile_number}</td>
                  <td>{e.licence_number}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(e.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StructuralEngineers;