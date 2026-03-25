import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ sidebarOpen }) => {

  const navigate = useNavigate();

  return (
    <div className={`admin-sidebar ${sidebarOpen ? "admin-sidebar-open" : "admin-sidebar-closed"}`}>

      <h2 className="admin-sidebar-title">ADMIN DASHBOARD</h2>

      <button onClick={() => navigate("/admin-dashboard")}>
        Dashboard
      </button>

      <button onClick={() => navigate("/admin/change-requests")}>
        Change Requests
      </button>

      <button onClick={() => navigate("/admin/projects")}>
        Projects
      </button>

      <button onClick={() => navigate("/admin/agents")}>
        Agents
      </button>

      <button onClick={() => navigate("/admin/complaints")}>
        Complaints
      </button>

    
      <button onClick={() => navigate("/admin/renewal")}>
        Renewal
      </button>

      {/* <button onClick={() => navigate("/")}>
        Logout
      </button> */}

    </div>
  );
};

export default AdminSidebar;