import { useState } from "react";
import logo from "../../assets/images/logo.jpg";

const TopHeader = ({ toggleSidebar, showHamburger = true }) => {

  const [showProfile, setShowProfile] = useState(false);

  const admin = {
    name: "Anil",
    email: "akannadevara@gmail.com",
    photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  };

  return (
    <div className="admin-top-header">

      <div className="admin-header-left">
        {showHamburger && (
  <button className="admin-hamburger" onClick={toggleSidebar}>
    ☰
  </button>
)}

        <img src={logo} alt="AP RERA" className="admin-header-logo" />

        <h2>ANDHRA PRADESH REAL ESTATE REGULATORY AUTHORITY</h2>
      </div>

      <div className="admin-header-right">

        <select>
          <option>Select Language</option>
          <option>English</option>
          <option>Telugu</option>
        </select>

        {/* Profile Icon */}
        <div className="admin-profile-wrapper">

          <img
            src={admin.photo}
            alt="profile"
            className="admin-profile-img"
            onClick={() => setShowProfile(!showProfile)}
          />

          {showProfile && (
            <div className="admin-profile-card">

              <div className="admin-profile-top">
                <img
                  src={admin.photo}
                  alt="profile"
                  className="admin-profile-large"
                />

                <h3>{admin.name}</h3>
                <p>{admin.email}</p>
              </div>

              <button className="admin-logout-btn">
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