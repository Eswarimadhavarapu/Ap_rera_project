import "../../styles/scrutiny/scrutiny_page_header.css";

export default function ScrutinyPageHeader() {
  return (
    <div className="scrutiny-page-header">
      <div className="scrutiny-page-breadcrumb">
        <span>You are here :</span>
        <span>DashBoard</span>
        <span>/</span>
        <span>Project Registration</span>
        <span>/</span>
        <span>Scrutiny Engineer Requests</span>
        <span>/</span>
        <span>Project Registration Form</span>
      </div>

      <div className="scrutiny-page-brand">
        <span>RERA-SE</span>
        <button
          type="button"
          className="scrutiny-page-print"
          onClick={() => window.print()}
          title="Print"
        >
          <i className="fa-solid fa-print" />
        </button>
      </div>
    </div>
  );
}