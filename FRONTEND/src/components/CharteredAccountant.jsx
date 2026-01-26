import React, { useState, useEffect } from "react";

import { apiPost, apiDelete } from "../api/api";

const CharteredAccountant = ({
  accountants = [],
  states = [],
  districts = [],
  onStateChange,
  onUpdate,
}) => {
  const [accountantList, setAccountantList] = useState(accountants);
useEffect(() => {
  setAccountantList(accountants);
}, [accountants]);

  const [formData, setFormData] = useState({
    accountant_name: "",
    email_id: "",
    address_line1: "",
    address_line2: "",
    state_ut: "",        // holds state_id
    district: "",        // holds district_name
    pin_code: "",
    icai_member_id: "",
    number_of_key_projects: "",
    mobile_number: "",
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

      if (value) onStateChange(value); // state_id
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
      !formData.accountant_name.trim() ||
      !formData.address_line1.trim() ||
      !formData.state_ut ||
      !formData.district ||
      !formData.pin_code.trim() ||
      !formData.icai_member_id.trim() ||
      !formData.mobile_number.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    // 🔑 Convert state_id → state_name (same fix as Contractors)
    const selectedState = states.find(
      (s) => String(s.state_id) === String(formData.state_ut)
    );

    if (!selectedState) {
      alert("Invalid state selected");
      return;
    }

    try {
      const payload = {
        accountant_name: formData.accountant_name.trim(),
        email_id: formData.email_id.trim() || null,
        address_line1: formData.address_line1.trim(),
        address_line2: formData.address_line2.trim() || null,
        state_ut: selectedState.state_name, // ✅ STRING
        district: formData.district,        // ✅ STRING
        pin_code: formData.pin_code.trim(),
        icai_member_id: formData.icai_member_id.trim(),
        number_of_key_projects: formData.number_of_key_projects
          ? Number(formData.number_of_key_projects)
          : null,
        mobile_number: formData.mobile_number.trim(),
      };

      const response = await apiPost("/api/associate/accountant", payload);

      // ✅ apiPost returns data directly
      if (response && (response.success === true || response.id)) {
        alert("Chartered Accountant added successfully");
const createdAccountant = {
  id: response?.id || response?.data?.id || Date.now(),
  accountant_name: formData.accountant_name,
  email_id: formData.email_id,
  address_line1: formData.address_line1,
  icai_member_id: formData.icai_member_id,
  mobile_number: formData.mobile_number,
};

setAccountantList(prev => [...prev, createdAccountant]);

        setFormData({
          accountant_name: "",
          email_id: "",
          address_line1: "",
          address_line2: "",
          state_ut: "",
          district: "",
          pin_code: "",
          icai_member_id: "",
          number_of_key_projects: "",
          mobile_number: "",
        });

        // onUpdate();
      }
    } catch (error) {
      console.error("Error adding chartered accountant:", error);
      alert(error.message || "Error adding chartered accountant");
    }
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  // const handleDelete = async (accountantId) => {
  //   if (!window.confirm("Are you sure you want to delete this chartered accountant?"))
  //     return;

  //   try {
  //     await apiDelete(`/api/associate/accountant/${accountantId}`);
  //     alert("Chartered Accountant deleted successfully");
  //     onUpdate();
  //   } catch (error) {
  //     console.error("Error deleting chartered accountant:", error);
  //     alert("Error deleting chartered accountant");
  //   }
  // };

  const handleDelete = (id) => {
  if (!window.confirm("Are you sure you want to delete this chartered accountant?"))
    return;

  setAccountantList(prev => prev.filter(a => a.id !== id));

  alert("Chartered Accountant deleted (frontend only)");
};


  return (
    <div className="form-section">
      <h3 className="section-title-ac">Chartered Accountant</h3>

      <div className="form-grid">
        <div className="form-group">
          <label>
            Chartered Accountant Name<span className="required">*</span>
          </label>
          <input
            type="text"
            name="accountant_name"
            value={formData.accountant_name}
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
            ICAI Member Id<span className="required">*</span>
          </label>
          <input
            type="text"
            name="icai_member_id"
            value={formData.icai_member_id}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Number of key projects completed</label>
          <input
            type="number"
            name="number_of_key_projects"
            value={formData.number_of_key_projects}
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

      {accountantList.length > 0 && (

        <div className="added-items-list">
        <table className="data-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Address</th>
      <th>ICAI Member ID</th>
      <th>Mobile</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {accountantList.map((a) => (
      <tr key={`accountant-${a.id}`}>
        <td>{a.accountant_name}</td>
        <td>{a.email_id || "-"}</td>
        <td>{a.address_line1}</td>
        <td>{a.icai_member_id}</td>
        <td>{a.mobile_number}</td>
        <td>
          <button
            className="btn-delete"
            onClick={() => handleDelete(a.id)}
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

export default CharteredAccountant;