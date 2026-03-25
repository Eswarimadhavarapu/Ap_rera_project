import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import TopHeader from "../../components/admin/TopHeader";
import "../../styles/admin/adminDashboard.css";


const AdminDashboard = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">

      <AdminSidebar sidebarOpen={sidebarOpen} />

      <div className={`admin-main ${sidebarOpen ? "" : "admin-main-full"}`}>

        <TopHeader toggleSidebar={toggleSidebar} />

        <div className="admin-dashboard-content">

          <div className="admin-dashboard-cards">

            <div className="admin-card">
              <h3>120</h3>
              <p>Total Requests</p>
            </div>

            <div className="admin-card">
              <h3>40</h3>
              <p>Pending Requests</p>
            </div>

            <div className="admin-card">
              <h3>60</h3>
              <p>Approved</p>
            </div>

            <div className="admin-card">
              <h3>20</h3>
              <p>Rejected</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;