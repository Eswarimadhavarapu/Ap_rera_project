import React, { useState, useEffect } from "react";
import { apiPost, apiDelete } from "../api/api";


const ProjectContractors = ({
  applicationNumber,   // ✅ ADD
  panNumber,           // ✅ ADD
  contractors = [],
  states = [],
  districts = [],
  onStateChange,
  onUpdate,

}) => {
  const initialFormState = {
    nature_of_work: "",
    contractor_name: "",
    email_id: "",
    address_line1: "",
    address_line2: "",
    state_ut: "",          // holds state_id
    district: "",          // holds district_name
    pin_code: "",
    year_of_establishment: "",
    number_of_key_projects: "",
    mobile_number: "",
  };
const [contractorList, setContractorList] = useState(contractors);
useEffect(() => {
  setContractorList(contractors);
}, [contractors]);

  const [formData, setFormData] = useState(initialFormState);

  // -----------------------------
  // INPUT CHANGE HANDLER
  // -----------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "state_ut") {
      setFormData((prev) => ({
        ...prev,
        state_ut: value,
        district: "",
      }));

      if (value) onStateChange(value); // state_id
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // ADD CONTRACTOR
  // -----------------------------
  const handleAdd = async () => {
  if (
    !formData.nature_of_work.trim() ||
    !formData.contractor_name.trim() ||
    !formData.address_line1.trim() ||
    !formData.state_ut ||
    !formData.district ||
    !formData.pin_code.trim() ||
    !formData.mobile_number.trim()
  ) {
    alert("Please fill all required fields");
    return;
  }

  try {
   const payload = {
  application_number: applicationNumber,
  pan_number: panNumber,

  nature_of_work: formData.nature_of_work.trim(),
  contractor_name: formData.contractor_name.trim(),
  email_id: formData.email_id || null,

  address_line1: formData.address_line1.trim(),
  address_line2: formData.address_line2 || null,

  state_ut: states.find(
    s => String(s.state_id) === String(formData.state_ut)
  )?.state_name || "",

  district: formData.district,   // 🔥 FIXED HERE

  pin_code: formData.pin_code.trim(),
  year_of_establishment: formData.year_of_establishment || null,
  number_of_key_projects: formData.number_of_key_projects || null,
  mobile_number: formData.mobile_number.trim(),
};




    const response = await apiPost("/api/associate/contractor", payload);

    if (!response?.success) {
      throw new Error("Failed to add contractor");
    }

    alert("Contractor added successfully");
    const createdContractor = {
  id: response.data?.id || response.data?.data?.id || Date.now(),
  nature_of_work: formData.nature_of_work,
  contractor_name: formData.contractor_name,
  state_ut: payload.state_ut,
  district: payload.district,
  mobile_number: formData.mobile_number,
};

setContractorList(prev => [...prev, createdContractor]);

    setFormData(initialFormState);
    // onUpdate();
  } catch (error) {
    console.error("Error adding contractor:", error);
    alert("Error adding contractor");
  }
};


  // -----------------------------
  // DELETE CONTRACTOR
  // -----------------------------
  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this contractor?"))
  //     return;

  //   try {
  //     await apiDelete(`/api/associate/contractor/${id}`);
  //     alert("Contractor deleted successfully");
  //     onUpdate();
  //   } catch (error) {
  //     console.error("Error deleting contractor:", error);
  //     alert("Error deleting contractor");
  //   }
  // };

  const handleDelete = (id) => {
  if (!window.confirm("Are you sure you want to delete this contractor?")) return;

  setContractorList(prev => prev.filter(c => c.id !== id));

  alert("Contractor deleted (frontend only)");
};


  return (
    <div className="form-section">
      <h3 className="section-title-ac">Project Contractors</h3>

      <div className="form-grid">
        <div className="form-group">
          <label>Contractor Nature Of Work<span className="required">*</span></label>
          <input
            type="text"
            name="nature_of_work"
            value={formData.nature_of_work}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Contractor Name<span className="required">*</span></label>
          <input
            type="text"
            name="contractor_name"
            value={formData.contractor_name}
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
          <label>Address Line 1<span className="required">*</span></label>
          <input
            type="text"
            name="address_line1"
            value={formData.address_line1}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

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

        <div className="form-group">
          <label>State / UT<span className="required">*</span></label>
          <select
            name="state_ut"
            value={formData.state_ut}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select</option>
            {states.map((s) => (
              <option key={s.state_id} value={s.state_id}>
                {s.state_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>District<span className="required">*</span></label>
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
          <label>PIN Code<span className="required">*</span></label>
          <input
            type="text"
            name="pin_code"
            value={formData.pin_code}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Year of Establishment</label>
          <input
            type="number"
            name="year_of_establishment"
            value={formData.year_of_establishment}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Number of Key Projects Completed</label>
          <input
            type="number"
            name="number_of_key_projects"
            value={formData.number_of_key_projects}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Mobile Number<span className="required">*</span></label>
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
        <button className="btn-add" onClick={handleAdd}>Add</button>
      </div>

     {contractorList.length > 0 && (
  <table className="data-table">
    <thead>
      <tr>
        <th>Nature of Work</th>
        <th>Contractor Name</th>
        <th>State / UT</th>
        <th>District</th>
        <th>Mobile Number</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {contractorList.map((c) => (
        <tr key={c.id}>
          <td>{c.nature_of_work}</td>
          <td>{c.contractor_name}</td>
          <td>{c.state_ut}</td>
          <td>{c.district}</td>
          <td>{c.mobile_number}</td>
          <td>
            <button
              className="btn-delete"
              onClick={() => handleDelete(c.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}

    </div>
  );
};

export default ProjectContractors;