const ScrutinyHeader = ({ toggleSidebar }) => {
  return (
    <div className="scrutiny-header">

      <button 
        className="scrutiny-hamburger"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <h2 className="scrutiny-title">
        SCRUTINY ENGINEER PANEL
      </h2>

    </div>
  );
};

export default ScrutinyHeader;