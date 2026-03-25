const AdminHeader = ({ toggleSidebar }) => {

  return (
    <div className="admin-header">

      <button 
        className="admin-hamburger" 
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* 
      <h2 className="admin-logo-text">AP RERA</h2>

      <h1 className="admin-panel-title">
        ANDHRA PRADESH RERA ADMIN PANEL
      </h1> 
      */}

    </div>
  );
};

export default AdminHeader;