import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/adminLogin.css";
import TopHeader from "../../components/admin/TopHeader";
import { apiPost } from "../../api/api";


const AdminLogin = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // 👈 ADD THIS ABOVE

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const data = await apiPost("/api/admin/login", {
        username,
        password
      });

      localStorage.setItem("admin", JSON.stringify(data.admin));

      navigate("/admin-dashboard", { replace: true });
    } catch (error) {
      alert("Login Failed");
    } finally {
      setLoading(false);
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
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

            </div>

            <div className="admin-form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="admin-login-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

        </div>

      </div>

    </>

  );
};

export default AdminLogin;