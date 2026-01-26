import React, { useState, useEffect } from "react";

import { apiPost, apiDelete } from "../api/api";

const ProjectEngineers = ({
  engineers = [],
  states = [],
  districts = [],
  applicationNumber,   // ✅ ADD
  panNumber,           // ✅ ADD
  onStateChange,
  onUpdate,
}) => {
  const [engineerList, setEngineerList] = useState(engineers);
useEffect(() => {
  setEngineerList(engineers);
}, [engineers]);

  const [formData, setFormData] = useState({
    engineer_name: "",
    email_id: "",
    address_line1: "",
    address_line2: "",
    state_ut: "",          // holds state_id
    district: "",          // holds district_name
    pin_code: "",
    mobile_number: "",
    number_of_key_projects: "",
  });

  // -----------------------------
  // INPUT CHANGE
  // -----------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "state_ut") {
      setFormData((prev) => ({
        ...prev,
        state_ut: value,
        district: "",
      }));

      if (value) onStateChange(value);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // ADD
  // -----------------------------
  const handleAdd = async () => {
    if (
      !formData.engineer_name.trim() ||
      !formData.address_line1.trim() ||
      !formData.state_ut ||
      !formData.district ||
      !formData.pin_code.trim() ||
      !formData.mobile_number.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    // 🔑 Convert state_id → state_name
    const selectedState = states.find(
      (s) => String(s.state_id) === String(formData.state_ut)
    );

    if (!selectedState) {
      alert("Invalid state selected");
      return;
    }

    try {
      const payload = {
        application_number: applicationNumber, // ✅ ADD
        pan_number: panNumber,                 // ✅ ADD
        engineer_name: formData.engineer_name.trim(),
        email_id: formData.email_id.trim() || null,
        address_line1: formData.address_line1.trim(),
        address_line2: formData.address_line2.trim() || null,
        state_ut: selectedState.state_name, // ✅ STRING
        district: formData.district,        // ✅ STRING
        pin_code: formData.pin_code.trim(),
        mobile_number: formData.mobile_number.trim(),
        number_of_key_projects: formData.number_of_key_projects
          ? Number(formData.number_of_key_projects)
          : null,
      };

      const response = await apiPost(
        "/api/associate/project-engineer",
        payload
      );

      // ✅ apiPost returns data directly
      if (response && (response.success === true || response.id)) {
        alert("Project Engineer added successfully");
const createdEngineer = {
  id: response?.id || response?.data?.id || Date.now(),
  engineer_name: formData.engineer_name,
  email_id: formData.email_id,
  address_line1: formData.address_line1,
  mobile_number: formData.mobile_number,
};

setEngineerList(prev => [...prev, createdEngineer]);

        setFormData({
          engineer_name: "",
          email_id: "",
          address_line1: "",
          address_line2: "",
          state_ut: "",
          district: "",
          pin_code: "",
          mobile_number: "",
          number_of_key_projects: "",
        });

        // onUpdate();
      }
    } catch (error) {
      console.error("Error adding project engineer:", error);
      alert(error.message || "Error adding project engineer");
    }
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  // const handleDelete = async (engineerId) => {
  //   if (!window.confirm("Are you sure you want to delete this project engineer?"))
  //     return;

  //   try {
  //     await apiDelete(`/api/associate/project-engineer/${engineerId}`);
  //     alert("Project Engineer deleted successfully");
  //     onUpdate();
  //   } catch (error) {
  //     console.error("Error deleting project engineer:", error);
  //     alert("Error deleting project engineer");
  //   }
  // };

  const handleDelete = (id) => {
  if (!window.confirm("Are you sure you want to delete this project engineer?"))
    return;

  setEngineerList(prev => prev.filter(e => e.id !== id));

  alert("Project Engineer deleted");
};

  return (
    <div className="form-section">
      <h3 className="section-title-ac">Project Engineers</h3>

      <div className="form-grid">
        <div className="form-group">
          <label>
            Project Engineer Name<span className="required">*</span>
          </label>
          <input
            type="text"
            name="engineer_name"
            value={formData.engineer_name}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

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

        <div className="form-group">
          <label>
            State/UT<span className="required">*</span>
          </label>
          <select
            name="state_ut"
            value={formData.state_ut}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select</option>
            {states.map((state) => (
              <option key={state.state_id} value={state.state_id}>
                {state.state_name}
              </option>
            ))}
          </select>
        </div>

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
            {districts.map((d) => (
              <option key={d.district_id} value={d.district_name}>
                {d.district_name}
              </option>
            ))}
          </select>
        </div>

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

        <div className="form-group">
          <label>Number of Key projects completed</label>
          <input
            type="number"
            name="number_of_key_projects"
            value={formData.number_of_key_projects}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
      </div>

      <div className="add-button-container">
        <button
          type="button"
          className="btn-add"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
{engineerList.length > 0 && (

        <div className="added-items-list">
         <table className="data-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Address</th>
      <th>Mobile</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {engineerList.map((e) => (
      <tr key={e.id}>
        <td>{e.engineer_name}</td>
        <td>{e.email_id || "-"}</td>
        <td>{e.address_line1}</td>
        <td>{e.mobile_number}</td>
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

export default ProjectEngineers;