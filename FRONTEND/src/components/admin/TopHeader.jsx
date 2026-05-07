import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.jpg";
// import "../../styles/admin/adminsidebar.css"

const TopHeader = ({ toggleSidebar, sidebarOpen, showHamburger = true }) => {

  const [showProfile, setShowProfile] = useState(false);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  // ✅ Load admin from localStorage
  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));

    if (storedAdmin) {
      setAdmin(storedAdmin);
      console.log("Admin Data:", storedAdmin); // ✅ correct log
    }
  }, []);

  return (
    <div className={`admin-top-header ${!sidebarOpen ? "full" : ""}`}>

      <div className="admin-header-left">
  <button className="admin-hamburger" onClick={toggleSidebar}>
    ☰
  </button>

  <div className="admin-logo-box">
    <img src={logo} alt="AP RERA" />
  </div>

 <div className="admin-header-text">
    <h2>ANDHRA PRADESH</h2>
    <h3>REAL ESTATE REGULATORY AUTHORITY</h3>
  </div>
</div>

      <div className="admin-header-right">

        <div className="admin-profile-wrapper">

          {/* ✅ Profile Image with fallback */}
          <img
            src={
              admin?.photo
                ? admin.photo
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="profile"
            className="admin-profile-img"
            onClick={() => setShowProfile(!showProfile)}
          />

          {/* ✅ Profile Card */}
          {showProfile && admin && (
            <div className="admin-profile-card">

              <div className="admin-profile-top">

                <img
                  src={
                    admin?.photo
                      ? admin.photo
                      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="profile"
                  className="admin-profile-large"
                />

                <h3>{admin.username}</h3>
                <p>{admin.email}</p>

              </div>

              <button
                className="admin-logout-btn"
                onClick={() => {
                  localStorage.removeItem("admin"); // ✅ clear storage
                  navigate("/admin-login"); // go to login
                }}
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default TopHeader;