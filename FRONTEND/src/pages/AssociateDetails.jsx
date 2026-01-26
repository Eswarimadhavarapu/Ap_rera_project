import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiGet, apiPost } from "../api/api";

import ProjectAgent from "../components/ProjectAgent";
import Architects from "../components/Architects";
import StructuralEngineers from "../components/StructuralEngineers";
import ProjectContractors from "../components/ProjectContractors";
import CharteredAccountant from "../components/CharteredAccountant";
import ProjectEngineers from "../components/ProjectEngineers";
import "../styles/AssociateDetails.css";
import ProjectWizard from "../components/ProjectWizard";

const AssociateDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [applicationNumber, setApplicationNumber] = useState("");
const [panNumber, setPanNumber] = useState("");

  
  const [loading, setLoading] = useState(false);

  const [projectAgents, setProjectAgents] = useState([]);
  const [architects, setArchitects] = useState([]);
  const [structuralEngineers, setStructuralEngineers] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [accountants, setAccountants] = useState([]);
  const [projectEngineers, setProjectEngineers] = useState([]);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  

  useEffect(() => {
  const appNo =
    location.state?.applicationNumber ||
    sessionStorage.getItem("applicationNumber");

  const pan =
    location.state?.panNumber ||
    sessionStorage.getItem("panNumber");

  if (appNo && pan) {
    setApplicationNumber(appNo);
    setPanNumber(pan);

    sessionStorage.setItem("applicationNumber", appNo);
    sessionStorage.setItem("panNumber", pan);

    console.log("✅ AssociateDetails initialized:", appNo, pan);
  } else {
    console.warn("⚠️ Missing applicationNumber or panNumber in AssociateDetails");
  }
}, []); // 👈 IMPORTANT: run once on page load





  // -------------------------------
  // INITIAL LOAD
  // -------------------------------
  useEffect(() => {
    fetchAssociateDetails();
    fetchStates();
  }, []);

  // -------------------------------
  // FETCH ASSOCIATE DETAILS
  // -------------------------------
  const fetchAssociateDetails = async () => {
    try {
      setLoading(true);
      const response = await apiGet("/api/associate");

      if (response?.success && response.data) {
        const { data } = response;
        setProjectAgents(data.project_agents || []);
        setArchitects(data.architects || []);
        setStructuralEngineers(data.structural_engineers || []);
        setContractors(data.contractors || []);
        setAccountants(data.accountants || []);
        setProjectEngineers(data.project_engineers || []);
      }
    } catch (error) {
      console.error("Error fetching associate details:", error);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // FETCH STATES (✅ NORMALIZED)
  // -------------------------------
  const fetchStates = async () => {
    try {
      const response = await apiGet("/api/states");

      // 🔥 normalize backend → frontend shape
      const normalizedStates = (response || []).map((s) => ({
        state_id: s.state_id ?? s.id,
        state_name: s.state_name ?? s.name,
      }));

      setStates(normalizedStates);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  };

  // -------------------------------
  // FETCH DISTRICTS (✅ NORMALIZED)
  // -------------------------------
  const fetchDistricts = async (stateId) => {
    if (!stateId) {
      setDistricts([]);
      return;
    }

    try {
      const response = await apiGet(`/api/districts/${stateId}`);

      const normalizedDistricts = (response || []).map((d) => ({
        district_id: d.district_id ?? d.id,
        district_name: d.district_name ?? d.name,
      }));

      setDistricts(normalizedDistricts);
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistricts([]);
    }
  };

  // -------------------------------
  // SAVE & CONTINUE
  // -------------------------------
  
      const handleSaveAndContinue = async () => {
  try {
    setLoading(true);

    // 🔍 optional but VERY useful for debugging
    console.log("🚀 Sending to backend:", {
      application_number: applicationNumber,
      pan_number: panNumber
    });

    await apiPost("/api/associate/save-and-continue", {
      application_number: applicationNumber,
      pan_number: panNumber
    });

    navigate("/project-upload-documents1");
  } catch (error) {
    console.error("Error saving associate details:", error);
    alert("Error saving details");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="associate-details-container">
      
      <div className="associate-details-content">
         {/* Header Navigation */}
                  <div className="development-details-breadcrumb1">
                      <span>You are here : </span>
                      <a href="/">Home</a>
                      <span> / </span>
                      <span>Registration / Project Registration</span>
                  </div>
      
                 
                  
                  <ProjectWizard currentStep={4} />
        <ProjectAgent agents={projectAgents} onUpdate={fetchAssociateDetails} />

        <Architects
  architects={architects}
  states={states}
  districts={districts}
  applicationNumber={applicationNumber}
  panNumber={panNumber}
  onStateChange={fetchDistricts}
  onUpdate={fetchAssociateDetails}
/>


        <StructuralEngineers
          engineers={structuralEngineers}
          states={states}
          applicationNumber={applicationNumber}
          panNumber={panNumber}
          districts={districts}
          onStateChange={fetchDistricts}
          onUpdate={fetchAssociateDetails}
        />

        <ProjectContractors
  applicationNumber={applicationNumber}
  panNumber={panNumber}
  contractors={contractors}
  states={states}
  districts={districts}
  onStateChange={fetchDistricts}          // ✅ EXISTS
  onUpdate={fetchAssociateDetails}        // ✅ EXISTS
/>




        <CharteredAccountant
          accountants={accountants}
          states={states}
          districts={districts}
          applicationNumber={applicationNumber}   // ✅ ADD HERE
  panNumber={panNumber} 
          onStateChange={fetchDistricts}
          onUpdate={fetchAssociateDetails}
        />

        <ProjectEngineers
  engineers={projectEngineers}
  states={states}
  districts={districts}
  applicationNumber={applicationNumber}   // ✅ ADD HERE
  panNumber={panNumber}                   // ✅ ADD HERE
  onStateChange={fetchDistricts}
  onUpdate={fetchAssociateDetails}
/>


        <div className="form-actions">
          <button
            className="btn-save-continue"
            onClick={handleSaveAndContinue}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save and Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssociateDetails;