import { useNavigate } from "react-router-dom";
import "../styles/ExtensionProcess.css";

const ExtensionProcess = () => {
  const navigate = useNavigate();
  return (
    <div className="extension-pa-page">

      {/* BREADCRUMB */}
      <div className="extension-pa-breadcrumb">
        You are here :
        <span className="extension-pa-home"> Home </span> /
        <span> Extension Form</span>
      </div>

      {/* CONTENT ONLY (NO LEFT MENU) */}
      <div className="extension-pa-content-full">

        <h2 className="extension-pa-title">Extension process</h2>

        <table className="extension-pa-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Application No</th>
              <th>Promoter Name</th>
              <th>BA No</th>
              <th>Validity From</th>
              <th>Validity To</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td className="extension-pa-link" onClick={() => navigate("/projectapplicationdetails")}>080126151211</td>
              <td>Narmada</td>
              <td>BA/2023/001</td>
              <td>01-04-2023</td>
              <td>31-03-2028</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default ExtensionProcess;