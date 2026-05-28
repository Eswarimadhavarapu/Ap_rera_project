// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAdmin } from "../../context/AdminContext";

// const ScrutinySidebar = ({ sidebarOpen }) => {

//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ FIX: inside component
//   const { admin } = useAdmin();
//   const dept = admin?.department?.toLowerCase();
//   const panelNames = {
//   planning: "PLANNING PANEL",
//   legal: "LEGAL PANEL",
//   audit: "AUDIT PANEL",
//   engineer: "SCRUTINY ENGINEER",
//   verification: "VERIFICATION PANEL",
//   ad: "ASSISTANT DIRECTOR",
//   dd: "DEPUTY DIRECTOR",
//   l1: "LEGAL 1 PANEL",
//   l2: "LEGAL 2 PANEL",
//   director: "DIRECTOR DASHBOARD",
//   chairman: "CHAIRMAN DASHBOARD",
// };

//   // ✅ Dropdown state
//   const isFpmsRoute =
//     dept === "engineer" && location.pathname.includes("/scrutiny");

//   const [fpmsOpen, setFpmsOpen] = useState(isFpmsRoute);

//   return (
//     <div
//       className={`scrutiny-sidebar ${
//         sidebarOpen ? "scrutiny-sidebar-open" : "scrutiny-sidebar-closed"
//       }`}
//     >

//       {/* ✅ Dynamic Panel */}
//       <h2 className="scrutiny-sidebar-title">
//   {panelNames[dept] || "SCRUTINY PANEL"}
// </h2>

//       {/* Project Registration */}
//       <button onClick={() => navigate("/scrutiny/project-registration")}>
//         Project Registration
//       </button>
//        {/* Agent Registration */}
//       <button onClick={() => navigate("/scrutiny/agent-scrutiny/registrations")}>
//         Agent Registration
//       </button>

//       {/* ✅ FPMS only for engineer */}
//         <>
//           <button
//             onClick={() => {
//   window.open(`${window.location.origin}/scrutiny/fpms/dashboard`, "_blank");
//          setFpmsOpen(false);
//             }}
//           >
//             📊 FPMS Dashboard
//           </button>

//           {fpmsOpen && (
//             <div style={{ paddingLeft: "20px" }}>
//               <button onClick={() => navigate("/scrutiny/fpms/create-files")}>
//                 📄 Create Files
//               </button>

//               <button onClick={() => navigate("/scrutiny/fpms/view-files")}>
//                 📁 View Files
//               </button>
//                   {/* ✅ ADD THIS */}
//     <button onClick={() => navigate("/scrutiny/exemption")}>
//       📑 Exemption
//     </button>
//             </div>
//           )}
//         </>
//       <button onClick={() => navigate("/scrutiny/UnregisterList")}>
//         Rera unregistration
//       </button>
//       <button onClick={() => navigate("/RTI_List")}>
//         RTI
//       </button>
//       {/* Logout */}
//       <button onClick={() => navigate("/")}>
//         Logout
//       </button>

//     </div>
//   );
// };

// export default ScrutinySidebar;

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

import {
  getDepartmentDashboardRoute,
  normalizeAdminDepartment,
} from "../../utils/adminRouting";

const ScrutinySidebar = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { admin, clearAdmin } = useAdmin();

  // ✅ Normalized department from utility
  const dept = normalizeAdminDepartment(admin);

  // ✅ Dynamic panel titles
  const panelNames = {
    planning: "PLANNING PANEL",
    legal: "LEGAL PANEL",
    audit: "AUDIT PANEL",
    engineer: "SCRUTINY ENGINEER PANEL",
    verification: "VERIFICATION PANEL",
    ad: "ASSISTANT DIRECTOR PANEL",
    dd: "DEPUTY DIRECTOR PANEL",
    director: "DIRECTOR DASHBOARD",
    chairman: "CHAIRMAN DASHBOARD",
    l1: "LEGAL 1 PANEL",
    l2: "LEGAL 2 PANEL",
  };

  // ✅ FPMS dropdown state
  const isFpmsRoute =
    dept === "engineer" &&
    location.pathname.includes("/scrutiny");

  const [fpmsOpen, setFpmsOpen] = useState(isFpmsRoute);

  // ✅ Director / Chairman controls
  const canManageProjects =
    dept === "director" ||
    dept === "chairman";

  // ✅ Dynamic dashboard route
  const ratingDashboardRoute =
    getDepartmentDashboardRoute(dept);

  return (
    <div
      className={`scrutiny-sidebar ${
        sidebarOpen
          ? "scrutiny-sidebar-open"
          : "scrutiny-sidebar-closed"
      }`}
    >

      {/* PANEL TITLE */}
      <h2 className="scrutiny-sidebar-title">
        {panelNames[dept] || "SCRUTINY PANEL"}
      </h2>

      {/* PROJECT REGISTRATION */}
      <button
        onClick={() =>
          navigate("/scrutiny/project-registration")
        }
      >
        Project Registration
      </button>

      {/* AGENT REGISTRATION */}
      <button
        onClick={() =>
          navigate("/scrutiny/agent-scrutiny/registrations")
        }
      >
        Agent Registration
      </button>

      {/* FPMS DASHBOARD */}
      <button
        onClick={() => {
          window.open(
            `${window.location.origin}/scrutiny/fpms/dashboard`,
            "_blank"
          );

          setFpmsOpen(false);
        }}
      >
        📊 FPMS Dashboard
      </button>

      {/* FPMS SUB MENU */}
      {fpmsOpen && (
        <div style={{ paddingLeft: "20px" }}>

          <button
            onClick={() =>
              navigate("/scrutiny/fpms/create-files")
            }
          >
            📄 Create Files
          </button>

          <button
            onClick={() =>
              navigate("/scrutiny/fpms/view-files")
            }
          >
            📁 View Files
          </button>

          <button
            onClick={() =>
              navigate("/scrutiny/exemption")
            }
          >
            📑 Exemption
          </button>

        </div>
      )}

      {/* UNREGISTERED PROJECTS */}
      <button
        onClick={() =>
          navigate("/scrutiny/UnregisterList")
        }
      >
        RERA Unregistration
      </button>

      {/* ✅ ADDED FROM SECOND FILE */}
      <button
        onClick={() => navigate("/RTI_List")}
      >
        RTI
      </button>

      {/* DIRECTOR / CHAIRMAN ONLY */}
      {canManageProjects && (
        <button
          onClick={() =>
            navigate(ratingDashboardRoute)
          }
        >
          Rate Completed Projects
        </button>
      )}

      {/* LOGOUT */}
      <button
        onClick={() => {
          clearAdmin();
          navigate("/home");
        }}
      >
        Logout
      </button>

    </div>
  );
};

export default ScrutinySidebar;