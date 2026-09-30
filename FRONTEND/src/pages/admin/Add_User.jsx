import React, { useState } from "react";
import "../../styles/admin/Add_User.css";
import { apiPost } from "../../api/api";
import Swal from "sweetalert2";
const Add_User = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    full_name: "",
    department: "",
    role: "",
    email: "",
    phone: "",
    employee_id: "",
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const departments = [
    "Planning Department",
    "Engineering Department",
    "Legal Department",
    "Finance Department",
    "Administration Department",
    "verification",
    "audit",
  ];

  const roles = [
    "AD",
    "planning1",
    "planning2",
    "Audit",
    "DD",
    "chairman",
    "director",
    "STAFF",
    "Engineer",
    "LEGAL_L1",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Create User Button Clicked");

    try {
      setLoading(true);
      setMessage("");

      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      if (photo) {
        submitData.append("photo", photo);
      }

      console.log("Sending Data...");

      for (let pair of submitData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await apiPost(
        "/api/admin/create",
        submitData
      );

      console.log("API Response:", response);
Swal.fire({
  icon: "success",
  title: "Success",
  text: response.message || "User Created Successfully",
  confirmButtonColor: "#2563eb",
});
      setFormData({
        first_name: "",
        last_name: "",
        full_name: "",
        department: "",
        role: "",
        email: "",
        phone: "",
        employee_id: "",
      });

      setPhoto(null);

    } catch (error) {
      console.error("Create User Error:", error);

      setMessage(
        error?.message ||
        "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-container">
      <div className="add-user-card">

        <h2 className="add-user-title">
          Add New User
        </h2>

        <form
          className="add-user-form"
          onSubmit={handleSubmit}
        >
          <div className="add-user-grid">

            <div className="add-user-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-user-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-user-group">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-user-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-user-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-user-group">
              <label>Employee ID</label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
              />
            </div>

            <div className="add-user-group">
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Department
                </option>

                {departments.map((dept) => (
                  <option
                    key={dept}
                    value={dept}
                  >
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="add-user-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Role
                </option>

                {roles.map((role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="add-user-group add-user-full-width">
              <label>Upload Photo</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

          </div>

          <button
            type="submit"
            className="add-user-btn"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create User"}
          </button>

          {message && (
            <div className="add-user-message">
              {message}
            </div>
          )}

        </form>

      </div>
    </div>
  );
};

export default Add_User;