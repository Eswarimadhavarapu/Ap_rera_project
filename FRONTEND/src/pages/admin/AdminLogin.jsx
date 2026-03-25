import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/adminLogin.css";
import TopHeader from "../../components/admin/TopHeader";
import { apiPost } from "../../api/api";
import Footer from "../../components/Footer";

const AdminLogin = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
const handleLogin = async (e) => {
  e.preventDefault();

  try {

    const data = await apiPost("/api/admin/login", {
      username,
      password
    });

    // save admin info
    localStorage.setItem("admin", JSON.stringify(data.admin));

    navigate("/admin-dashboard");

  } catch (error) {
    console.error(error);
    alert(error.message || "Login Failed");
  }
};

 return (

  <>
  <TopHeader showHamburger={false} />

    <div className="admin-login-page">

      <div className="admin-login-box">

        <h2 className="admin-login-title">Admin Login</h2>

        <form onSubmit={handleLogin}>

          <div className="admin-form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <button className="admin-login-btn" type="submit">
            Login
          </button>

        </form>

      </div>

    </div>

  </>

);
};

export default AdminLogin;