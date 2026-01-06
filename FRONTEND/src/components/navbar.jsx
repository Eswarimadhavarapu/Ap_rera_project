import "../styles/navbar.css";

const Navbar = () => {
  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <div className="logo">
          <h2>AP RERA</h2>
          <p>ANDHRA PRADESH REAL ESTATE REGULATORY AUTHORITY</p>
        </div>

        <button className="search-btn">SEARCH RERA PROJECTS</button>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <ul>
          <li>HOME</li>
          <li>ABOUT US</li>
          <li>APREAT</li>
          <li>NOTIFICATIONS</li>
          <li>REGISTRATION</li>
          <li>REPORTS</li>
          <li>REGISTERED</li>
          <li className="highlight">JUDGEMENTS / ORDERS</li>
          <li>KNOWLEDGE HUB</li>
          <li>LOGIN</li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;