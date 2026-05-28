// import { useState } from "react";
// import { useAdmin } from "../../context/AdminContext";

// import "../../styles/scrutiny/scrutinydashboard.css";
// import ScrutinySidebar from "../../components/scrutiny/ScrutinitySidebar";
// import TopHeader from "../../components/scrutiny/TopHeader";

// const ScrutinyDashboard = () => {

//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const { admin } = useAdmin(); // ✅ get admin
//   const deptName = String(admin?.department || "").toLowerCase(); // ✅ get department
//   const dept = deptName.includes("assistant director")
//     ? "ad"
//     : deptName.includes("deputy director")
//       ? "dd"
//       : deptName.includes("director")
//         ? "director"
//         : deptName.includes("chairman")
//           ? "chairman"
//         : deptName;
//   const dashboardNames = {
//   planning: "Planning Dashboard",
//   legal: "Legal Dashboard",
//   audit: "Audit Dashboard",
//   engineer: "Engineer Dashboard",
//   verification: "Verification Dashboard",
//   ad: "Assistant Director Dashboard",
//   dd: "Deputy Director Dashboard",
//   director: "Director Dashboard",
//   chairman: "Chairman Dashboard",
//   l1: "Legal 1 Dashboard",
//   l2: "Legal 2 Dashboard",
// };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="scrutiny-layout">

//       <ScrutinySidebar sidebarOpen={sidebarOpen} />

//       <div className={`scrutiny-main ${sidebarOpen ? "" : "scrutiny-main-full"}`}>

//         <TopHeader toggleSidebar={toggleSidebar} />

//         <div style={{ padding: "20px" }}>
//           <h2>
//   {dashboardNames[dept] || "Scrutiny Dashboard"}
// </h2>

//           <p>This page is under development...</p>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ScrutinyDashboard;

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

import "../../styles/scrutiny/scrutinydashboard.css";
import ScrutinySidebar from "../../components/scrutiny/ScrutinitySidebar";
import TopHeader from "../../components/scrutiny/TopHeader";
import DirectorProjectRatings from "../../components/DirectorProjectRatings";
import {
  getDepartmentDashboardRoute,
  normalizeAdminDepartment,
} from "../../utils/adminRouting";

const ScrutinyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const dept = normalizeAdminDepartment(admin);

  useEffect(() => {
    if (dept !== "director" && dept !== "chairman") {
      return;
    }

    const expectedRoute = getDepartmentDashboardRoute(dept, admin);
    if (location.pathname !== expectedRoute) {
      navigate(expectedRoute, { replace: true });
    }
  }, [dept, location.pathname, navigate]);

  const dashboardNames = {
    planning: "Planning Dashboard",
    legal: "Legal Dashboard",
    audit: "Audit Dashboard",
    engineer: "Engineer Dashboard",
    verification: "Verification Dashboard",
    ad: "Assistant Director Dashboard",
    dd: "Deputy Director Dashboard",
    director: "Director Dashboard",
    chairman: "Chairman Dashboard",
    it: "IT Dashboard",
    l1: "Legal 1 Dashboard",
    l2: "Legal 2 Dashboard",
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="scrutiny-layout">
      <ScrutinySidebar sidebarOpen={sidebarOpen} />

      <div className={`scrutiny-main ${sidebarOpen ? "" : "scrutiny-main-full"}`}>
        <TopHeader toggleSidebar={toggleSidebar} />

        <div style={{ padding: "20px" }}>
          <h2>{dashboardNames[dept] || "Scrutiny Dashboard"}</h2>

          {dept === "director" || dept === "chairman" ? (
            <DirectorProjectRatings />
          ) : (
            <p>This page is under development...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrutinyDashboard;