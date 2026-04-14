import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

import "../../styles/scrutiny/scrutinydashboard.css";
import ScrutinySidebar from "../../components/scrutiny/ScrutinitySidebar";
import TopHeader from "../../components/scrutiny/TopHeader";

const ScrutinyDashboard = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { admin } = useAdmin(); // ✅ get admin
  const dept = admin?.department?.toLowerCase(); // ✅ get department

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="scrutiny-layout">

      <ScrutinySidebar sidebarOpen={sidebarOpen} />

      <div className={`scrutiny-main ${sidebarOpen ? "" : "scrutiny-main-full"}`}>

        <TopHeader toggleSidebar={toggleSidebar} />

        <div style={{ padding: "20px" }}>
          <h2>
            {dept === "planning"
              ? "Planning Dashboard"
              : dept === "legal"
              ? "Legal Dashboard"
              : dept === "audit"
              ? "Audit Dashboard"
              : "Scrutiny Dashboard"}
          </h2>

          <p>This page is under development...</p>
        </div>

      </div>
    </div>
  );
};

export default ScrutinyDashboard;