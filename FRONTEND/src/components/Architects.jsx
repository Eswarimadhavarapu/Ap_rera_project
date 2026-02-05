import React, { useState, useEffect } from "react";
import { apiPost, apiDelete } from "../api/api";




const Architects = ({
  architects = [],
  states = [],
  districts = [],
  applicationNumber,
  panNumber,
  onStateChange,
  onUpdate,
}) => {
  const [architectList, setArchitectList] = useState([]);

// useEffect(() => {
//   setArchitectList(architects);
// }, [architects]);

const appNo =
  applicationNumber || sessionStorage.getItem("applicationNumber");

const panNo =
  panNumber || sessionStorage.getItem("panNumber");

useEffect(() => {
  const loadArchitects = async () => {
    if (!appNo || !panNo) return;

    try {
      const res = await fetch(
        `https://0jv8810n-8080.inc1.devtunnels.ms/api/application/associates?application_number=${appNo}&pan_number=${panNo}`
      );
      const json = await res.json();

      if (json.success) {
        setArchitectList(json.data.architects || []);
      }
    } catch (err) {
      console.error("Failed to load architects", err);
    }
  };

  loadArchitects();
}, [appNo, panNo]);



  const [formData, setFormData] = useState({
    architect_name: "",
    email_id: "",
    address_line1: "",
    address_line2: "",
    state_ut: "",
    district: "",
    pin_code: "",
    year_of_establishment: "",
    number_of_key_projects: "",
    coa_registration_number: "",
    mobile_number: "",
  });

  // -----------------------------
  // INPUT CHANGE HANDLER
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
  // ADD ARCHITECT (🔥 FIXED)
  // -----------------------------
  const handleAdd = async () => {
    const requiredFields = [
      "architect_name",
      "address_line1",
      "state_ut",
      "district",
      "pin_code",
      "coa_registration_number",
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

      // 1️⃣ CREATE ARCHITECT
      const response = await apiPost("/api/associate/architect", payload);

      if (!response?.success) {
        throw new Error("Failed to create architect");
      }

      const architectId =
        response.data?.id || response.data?.data?.id;

      if (!architectId) {
        throw new Error("Architect ID not returned from API");
      }

      // 2️⃣ LINK ARCHITECT TO APPLICATION (🔥 THIS WAS MISSING)
      await apiPost("/api/application/associate", {
  application_number: applicationNumber,
  pan_number: panNumber,
  associate_type: "architect",
  associate_id: architectId,
});

      

      alert("Architect added successfully");

      const createdArchitect = {
  id: architectId,
  architect_name: formData.architect_name,
  email_id: formData.email_id,
  address_line1: formData.address_line1,
  mobile_number: formData.mobile_number,
  coa_registration_number: formData.coa_registration_number,
};

setArchitectList((prev) => [...prev, createdArchitect]);

      // 3️⃣ RESET FORM
      setFormData({
        architect_name: "",
        email_id: "",
        address_line1: "",
        address_line2: "",
        state_ut: "",
        district: "",
        pin_code: "",
        year_of_establishment: "",
        number_of_key_projects: "",
        coa_registration_number: "",
        mobile_number: "",
      });

      // 4️⃣ REFRESH LIST
      // onUpdate();

    } catch (error) {
      console.error("Error adding architect:", error);
      alert("Error adding architect");
    }
  };

  // -----------------------------
  // DELETE ARCHITECT
  // -----------------------------
  // const handleDelete = async (architectId) => {
  //   if (!window.confirm("Are you sure you want to delete this architect?")) return;

  //   try {
  //     const response = await apiDelete(
  //       `/api/associate/architect/${architectId}`
  //     );

  //     if (response?.success) {
  //       alert("Architect deleted successfully");
  //       onUpdate();
  //     }
  //   } catch (error) {
  //     console.error("Error deleting architect:", error);
  //     alert("Error deleting architect");
  //   }
  // };


  const handleDelete = (architectId) => {
  if (!window.confirm("Are you sure you want to delete this architect?")) return;

  setArchitectList(prev => prev.filter(a => a.id !== architectId));

  alert("Architect deleted");
};

  return (
    <div className="form-section">
      <h3 className="section-title-ac">Project Architects</h3>

      <div className="form-grid">
        <div className="form-group">
          <label>
            Architect Name<span className="required">*</span>
          </label>
          <input
            type="text"
            name="architect_name"
            value={formData.architect_name}
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
            {states.map((state, index) => (
              <option
                key={state.state_id ?? state.id ?? index}
                value={state.state_id ?? state.id}
              >
                {state.state_name ?? state.name}
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
            {districts.map((district, index) => (
              <option
                key={district.district_id ?? district.id ?? index}
                value={district.district_id ?? district.id}
              >
                {district.district_name ?? district.name}
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
          <label>Year of establishment</label>
          <input
            type="number"
            name="year_of_establishment"
            value={formData.year_of_establishment}
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
            Reg. Number With COA<span className="required">*</span>
          </label>
          <input
            type="text"
            name="coa_registration_number"
            value={formData.coa_registration_number}
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
        <button className="btn-add" onClick={handleAdd}>
          Add
        </button>
      </div>

      {architectList.length > 0 && (
        <div className="added-items-list">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Mobile</th>
                <th>COA No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {architectList.map((a) => (
                <tr key={a.id}>
                  <td>{a.architect_name}</td>
                  <td>{a.email_id}</td>
                  <td>{a.address_line1}</td>
                  <td>{a.mobile_number}</td>
                  <td>{a.coa_registration_number}</td>
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

export default Architects;