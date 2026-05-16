import { useNavigate } from "react-router-dom";
import { useEffect } from "react";   // ✅ ADD THIS
import buddha from "../assets/buddha.jpg";
import "../styles/Welcome.css";

const Welcome = () => {
 const navigate = useNavigate();

useEffect(() => {
  const timer = setTimeout(() => {
    navigate("/home");
  }, 10000);

  return () => clearTimeout(timer);
}, []);

  return (
    <div
      className="welcome-hero"
      style={{ backgroundImage: `url(${buddha})` }}
    >
      <div className="welcome-hero-overlay">
        <div className="welcome-hero-content">
          <h1>Welcome to AP-RERA</h1>
          <p>
            The official portal for real estate regulation in Andhra Pradesh.
          </p>

          <button onClick={() => navigate("/home")}>
            Discover More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;