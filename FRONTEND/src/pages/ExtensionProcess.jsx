import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ExtensionProcess.css";

const ExtensionProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const loginData = location.state?.loginData;
  const projects = loginData?.projects || [];

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB") : "—";

  return (
    <div className="extension-pa-page">
      <h2 className="extension-pa-title">Extension process</h2>

      {!loginData && (
        <p style={{ color: "red" }}>
          Login data not found. Please login again.
        </p>
      )}

      {loginData && (
        <table className="extension-pa-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Application No</th>
              <th>Promoter Name</th>
              <th>BA No</th>
              <th>Validity From</th>
              <th>Validity To</th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="6">No data found</td>
              </tr>
            ) : (
              projects.map((project, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  {/* 👇 SEND FULL ROW DATA */}
                 <td
  className="extension-pa-link"
  onClick={() => {
    console.log("Clicked Row Data:", project);
    

    navigate("/projectapplicationdetails", {
      state: {
        projectData: project,
        panNumber: loginData.pan_number,
      },
    });
  }}
>
  {project.application_number}
</td>

                  <td>{project.promoter_name}</td>
                  <td>{project.ba_no}</td>
                  <td>{formatDate(project.validity_from)}</td>
                  <td>{formatDate(project.validity_to)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExtensionProcess;