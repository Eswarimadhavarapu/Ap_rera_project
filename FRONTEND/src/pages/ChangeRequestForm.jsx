import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { apiPost } from "../api/api";
import "../styles/ChangeRequestForm.css"

function ChangeRequestForm() {

    const location = useLocation();

const loginData =
  location.state?.loginData ||
  JSON.parse(sessionStorage.getItem("loginData"));

const projects = loginData?.projects || [];

  const [formData, setFormData] = useState({
    applicationNo: "",
    changeType: "",
    description: "",
    document: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      document: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();

  form.append("application_no", formData.applicationNo);
  form.append("change_type", formData.changeType);
  form.append("description", formData.description);

  if (formData.document) {
    form.append("document", formData.document);
  }

  try {
    const data = await apiPost("/api/change-request", form);

    console.log(data);

    alert("Change Request Submitted Successfully");

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  return (
    <div className="container">
      <h2>Apply for Change Request</h2>

      <form onSubmit={handleSubmit} className="form-box">

        <label>Application Number</label>

<select
  name="applicationNo"
  value={formData.applicationNo}
  onChange={handleChange}
  required
>
  <option value="">Select Application Number</option>

  {projects.map((project, index) => (
    <option key={index} value={project.application_number}>
      {project.application_number}
    </option>
  ))}

</select>

        <label>Change Type</label>
        <select
          name="changeType"
          value={formData.changeType}
          onChange={handleChange}
          required
        >
          <option value="">Select Change Type</option>
          <option value="Project Completion Date">Project Completion Date</option>
          <option value="Project Address">Project Address</option>
          <option value="Bank Details">Bank Details</option>
          <option value="Promoter Details">Promoter Details</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          placeholder="Explain the change request"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Upload Supporting Document</label>
        <input
          type="file"
          onChange={handleFileChange}
        />

        <button type="submit">Submit Request</button>

      </form>
    </div>
  );
}

export default ChangeRequestForm;