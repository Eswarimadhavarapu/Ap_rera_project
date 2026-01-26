import React, { useState, useEffect } from "react";
import { apiPost, apiDelete } from "../api/api";

const ProjectAgent = ({ projectId, agents = [], onUpdate }) => {
  const [agentList, setAgentList] = useState(agents);
  const [formData, setFormData] = useState({
    rera_registration_no: "",
    agent_name: "",
    agent_address: "",
    mobile_number: "",
  });





  // -------------------------------
  // Handle Input Change
  // -------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------------------------------
  // Add Project Agent
  // -------------------------------
  const handleAdd = async () => {
    const { rera_registration_no, agent_name, agent_address, mobile_number } =
      formData;

    if (!rera_registration_no || !agent_name || !agent_address || !mobile_number) {
      alert("Please fill all required fields");
      return;
    }

    // ✅ READ SESSION VALUES AT RUNTIME
    const application_number = sessionStorage.getItem("applicationNumber");
    const pan_number = sessionStorage.getItem("panNumber");

    if (!application_number || !pan_number) {
      alert("Application number or PAN number missing. Please restart registration.");
      return;
    }

    try {
      // 1️⃣ CREATE AGENT
      const res = await apiPost("/api/associate/project-agent", {
        project_id: projectId,
        rera_registration_no,
        agent_name,
        agent_address,
        mobile_number,
      });

      const createdAgentId = res?.id || res?.data?.id;

      if (!createdAgentId) {
        throw new Error("Agent created but ID not returned");
      }

      // 🔍 Debug (remove later if you want)
      console.log("Linking agent to application:", {
        application_number,
        pan_number,
        associate_type: "agent",
        associate_id: createdAgentId,
      });

      // 2️⃣ LINK AGENT TO APPLICATION
      await apiPost("/api/application/associate", {
        application_number,
        pan_number,
        associate_type: "agent",
        associate_id: createdAgentId,
      });

      alert("Project agent added successfully");

   const createdAgent = {
  id: createdAgentId,
  rera_registration_no: formData.rera_registration_no,
  agent_name: formData.agent_name,
  agent_address: formData.agent_address,
  mobile_number: formData.mobile_number,
};

console.log("CREATED AGENT 👉", createdAgent);

setAgentList((prev) => [...prev, createdAgent]);


      // 3️⃣ RESET FORM
      setFormData({
        rera_registration_no: "",
        agent_name: "",
        agent_address: "",
        mobile_number: "",
      });

     
    } catch (error) {
      console.error("Error adding project agent:", error);
      alert(error.response?.data?.message || error.message || "Error adding project agent");
    }
  };

  // -------------------------------
  // Delete Project Agent
  // -------------------------------

  // const handleDelete = async (agentId) => {
  //   if (!window.confirm("Are you sure you want to delete this project agent?")) return;

  //   try {
  //     console.log("DELETE URL 👉", `/api/associate/project-agent/${agentId}`);
  //     await apiDelete(`/api/associate/project-agent/${agentId}`);
  //     alert("Project agent deleted successfully");
  //     onUpdate?.();
  //   } catch (error) {
  //     console.error("Error deleting project agent:", error);
  //     alert(error.response?.data?.message || error.message || "Error deleting project agent");
  //   }
  // };
  const handleDelete = (agentId) => {
  if (!window.confirm("Are you sure you want to delete this project agent?")) return;

  // FRONTEND-ONLY DELETE
  setAgentList(prev => prev.filter(agent => agent.id !== agentId));

  alert("Project agent deleted");
};


  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="form-section">
      <h3 className="section-title-ac">Project Agent</h3>

      <div className="form-grid">
        <div className="form-group">
          <label>Agent RERA Registration No.<span className="required">*</span></label>
          <input
            type="text"
            name="rera_registration_no"
            value={formData.rera_registration_no}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Agent Name<span className="required">*</span></label>
          <input
            type="text"
            name="agent_name"
            value={formData.agent_name}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Agent Address<span className="required">*</span></label>
          <input
            type="text"
            name="agent_address"
            value={formData.agent_address}
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
            maxLength="15"
            className="form-control"
          />
        </div>
      </div>

      <div className="add-button-container">
        <button className="btn-add" onClick={handleAdd}>Add</button>
      </div>

      {agentList.length > 0 &&(
        <table className="data-table">
          <thead>
            <tr>
              <th>RERA No</th>
              <th>Name</th>
              <th>Address</th>
              <th>Mobile</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {agentList.map((agent) => (
              <tr key={agent.id}>
                <td>{agent.rera_registration_no}</td>
                <td>{agent.agent_name}</td>
                <td>{agent.agent_address}</td>
                <td>{agent.mobile_number}</td>
                <td>
                  <button className="btn-delete" onClick={() => handleDelete(agent.id)}>
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

export default ProjectAgent;
