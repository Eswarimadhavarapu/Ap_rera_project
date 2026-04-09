import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ScrutinySidebar = ({ sidebarOpen }) => {

  const navigate = useNavigate();
  const location = useLocation();
  

  // ✅ Dropdown state
  const isFpmsRoute = location.pathname.includes("/scrutiny");

const [fpmsOpen, setFpmsOpen] = useState(isFpmsRoute);


  // ✅ Toggle function
  const toggleFpms = () => {
    setFpmsOpen(!fpmsOpen);
  };

  return (
    <div
      className={`scrutiny-sidebar ${
        sidebarOpen ? "scrutiny-sidebar-open" : "scrutiny-sidebar-closed"
      }`}
    >

      <h2 className="scrutiny-sidebar-title">SCRUTINY PANEL</h2>

      {/* Project Registration */}
      <button onClick={() => navigate("/scrutiny/project-registration")}>
        Project Registration
      </button>

      {/* ✅ FPMS Dashboard (Dropdown Trigger) */}
      <button
  onClick={() => {
    navigate("/scrutiny/scrutiny-fpms");
    setFpmsOpen(true); // ✅ always open
  }}
>
  📊 FPMS Dashboard
</button>

      {/* ✅ Dropdown Items */}
      {fpmsOpen && (
        <div style={{ paddingLeft: "20px" }}>
          
          <button
   onClick={() => navigate("/scrutiny/create-files")}
          >
            📄 Create Files
          </button>

          <button
          onClick={() => {
  if (location.pathname === "/scrutiny/view-files") {
    navigate("/scrutiny/view-files", { replace: true });
  } else {
    navigate("/scrutiny/view-files");
  }
}}
          >
            📁 View Files
          </button>

        </div>
      )}

      {/* Logout */}
      <button onClick={() => navigate("/")}>
        Logout
      </button>

    </div>
  );
};

export default ScrutinySidebar;