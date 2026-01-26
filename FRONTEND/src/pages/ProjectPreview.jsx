// ProjectPreview.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProjectWizard from "../components/ProjectWizard";
import "../styles/ProjectPreview.css";

// ✅ HELPERS (ADD HERE)
const formatDate = (value) => {
  if (!value) return "N/A";
  try {
    return new Date(value).toLocaleDateString("en-GB"); // DD-MM-YYYY
  } catch {
    return value;
  }
};


const ProjectPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(true);
    const [externalDevWork, setExternalDevWork] = useState({});

  const panNumber =
    location.state?.panNumber || sessionStorage.getItem("panNumber");
  const applicationNumber =
    location.state?.applicationNumber ||
    sessionStorage.getItem("applicationNumber");

  useEffect(() => {
  if (!applicationNumber || !panNumber) {
    console.warn("Missing applicationNumber or panNumber");
    setLoading(false);
    return;
  }

  const fetchPreviewData = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/project/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_number: applicationNumber,
          pan_number: panNumber
        })
      });

      if (!res.ok) {
        throw new Error(`Preview API failed: ${res.status}`);
      }

      const resData = await res.json();
setAllData(resData.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchPreviewData();
}, [applicationNumber, panNumber]);

// ✅ NEW: Continue button handler
  const handleContinue = () => {
    navigate("/payment", {
      state: {
        applicationNumber,
        panNumber,
      },
    });
  };
  

 useEffect(() => {
  if (!applicationNumber || !panNumber) return;

  const fetchDevelopmentDetails = async () => {
    try {
      const url =
        `http://localhost:8080/api/project-registration/${applicationNumber}/${panNumber}`;

      console.log("🔵 Calling URL:", url);

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to fetch project registration");
      }

      const response = await res.json();
      console.log("🟢 FULL API RESPONSE:", response);

      // ✅ CORRECT PLACE
      setExternalDevWork(
        response?.data?.external_development_work || {}
      );

    } catch (error) {
      console.error("❌ Development details API error:", error);
    }
  };

  fetchDevelopmentDetails();
}, [applicationNumber, panNumber]);




  // ✅ NEW: Download PDF handler
  const handleDownloadPDF = () => {
    window.print();
  };
 
  const EXTERNAL_WORK_LABELS = [
  { key: "Roads", label: "Roads" },
  { key: "Water_Supply", label: "Water Supply" },
  { key: "Fire_Fighting_Facility", label: "Fire Fighting Facility" },
  { key: "Drinking_Water_Facility", label: "Drinking Water Facility" },
  { key: "Use_of_Renewable_Energy", label: "Use of Renewable Energy" },
  { key: "Sewage_and_Drainage_System", label: "Sewage and Drainage System" },
  { key: "Emergency_Evacuation_Service", label: "Emergency Evacuation Service" },
  { key: "Solid_Waste_Management_And_Disposal", label: "Solid Waste Management And Disposal" },
  { key: "Electricity_Supply_Transformation_Station", label: "Electricity Supply Transformation Station" }
];

  const project = allData?.project_details || {};

  // ✅ NORMALIZE PROJECT DETAILS (BACKEND → UI)
// ✅ FIXED PROJECT DETAILS (MATCH BACKEND KEYS)
const fixedProject = {
  name: project["Project Name"] || "N/A",
  description: project["Project Description"] || "N/A",
  type: project["Project Type"] || "N/A",
  status: project["Project Status"] || "New Project",

  buildingPlanNo: project["Building Plan No"] || "N/A",
  surveyNo: project["Survey No"] || "N/A",

  permissionFrom: project["Building Permission Validity From"] || "N/A",
  permissionTo: project["Building Permission Validity To"] || "N/A",

  startDate: project["Project Starting Date"] || "N/A",
  completionDate: project["Proposed Completion Date"] || "N/A",

  landArea: project["Total Area of Land (Sq.m)"] || "N/A",
  height: project["Height of Building (m)"] || "0.00",
  plinthArea: project["Total Plinth Area (Sq.m)"] || "N/A",
  openArea: project["Total Open Area (Sq.m)"] || "N/A",
  builtUpArea: project["Total Built-up Area (Sq.m)"] || "N/A",

  estimatedCost: project["Estimated Cost of Construction"] || "N/A",
  landCost: project["Cost of Land"] || "N/A",
  totalCost: project["Total Project Cost (₹)"] || "N/A",

  address: project["Project Address"] || "N/A",
  district: project["District"] || "N/A",
  mandal: project["Mandal"] || "N/A",
  village: project["Village"] || "N/A",
  pincode: project["Pincode"] || "N/A",
};




const development = allData?.development_details || {};
// ✅ Apartments / Flats from Excel
// ✅ Correct path based on backend response
const developmentDetails =
  development?.["Development Details"] || {};

const apartmentDetails =
  developmentDetails?.Apartments_Flats || {};

const apartmentRows =
  apartmentDetails?.rows || [];

console.log("✅ Apartment rows length 👉", apartmentRows.length);

// ✅ ADD THIS EXACTLY HERE 👇
const groupedApartments = apartmentRows.reduce((acc, row) => {
  const block = row["Name of the Block"];
  if (!acc[block]) acc[block] = [];
  acc[block].push(row);
  return acc;
}, {});




const documents = allData?.project_upload_documents || [];

  console.log("Documents in preview:", documents);
// ✅ FIRST: raw data
const associatesRaw = allData?.associate_details || {};

// ✅ NOW it is safe to log
console.log("Associates raw 👉", associatesRaw);




 

// ✅ NORMALIZE DEVELOPMENT DETAILS (BACKEND → UI)


const externalWorks =
  development?.["External Development Works"] || [];


const associates = {
  architects: (associatesRaw.architects || []).map((a) => ({
    name: a.name,
    email: a.email,
    address: a.address,
    address2: a.address2,
    state: a.state,
    district: a.district,
    pincode: a.pin_code,
    mobile: a.mobile,
    regNumber: a.reg_number,
    yearOfEstablishment: a.year_of_establishment || 0,
    keyProjects: a.number_of_key_projects || 0,
  })),

  engineers: (associatesRaw.engineers || []).map((e) => ({
    name: e.name,
    email: e.email,
    address: e.address,
    address2: e.address2,
    state: e.state,
    district: e.district,
    pincode: e.pin_code,
    mobile: e.mobile,
    licenseNumber: e.licence_number,
    yearOfEstablishment: e.year_of_establishment || 0,
    keyProjects: e.number_of_key_projects || 0,
  })),

  charteredAccountants: (associatesRaw.accountants || []).map((c) => ({
    name: c.name,
    email: c.email,
    address: c.address,
    address2: c.address2,
    state: c.state,
    district: c.district,
    pincode: c.pin_code,
    mobile: c.mobile,
    icaiMemberId: c.icai_member_id,
    keyProjects: c.number_of_key_projects || 0,
  })),

  agents: (associatesRaw.agents || []).map((a) => ({
    name: a.name,
    address: a.address,
    mobile: a.mobile,
    reraNumber: a.registration_number || "—",
  })),
  
};
const projectEngineers = (associatesRaw.project_engineers || []).map((e) => ({
  name: e.engineer_name,
  email: e.email_id,
  address: e.address_line1,
  address2: e.address_line2,
  state: e.state_ut,
  district: e.district,
  pincode: e.pin_code,
  mobile: e.mobile_number,
  keyProjects: e.number_of_key_projects || 0,
}));






  

  if (loading || !allData) {
    return (
      <div className="preview-loading">
        <div className="loading-spinner">Loading preview...</div>
      </div>
    );
  }

  return (
    <div className="preview-container">
      {/* Header - No Print */}
      <div className="preview-header no-print">
        <div className="breadcrumb">
          <span>You are here : </span>
          <a href="/">Home</a>
          <span> / </span>
          <span>Registration / Project Registration / Preview</span>
        </div>

        <ProjectWizard currentStep={6} />

        <div className="preview-actions">
          <button onClick={handleDownloadPDF} className="btn btn-download">
            <span>📥</span> Download PDF
          </button>
          <button onClick={handleContinue} className="btn btn-continue">
            Continue to Payment →
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="pdf-content">
        {/* Header Section */}
        <div className="pdf-header">
          <h1 className="pdf-title">PROJECT REGISTRATION - PREVIEW</h1>
          <p className="pdf-subtitle">
            Andhra Pradesh Real Estate Regulatory Authority (APRERA)
          </p>
        </div>

        {/* Application Details */}
        <div className="section application-info">
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Application Number:</td>
                <td className="value">{applicationNumber || "N/A"}</td>
                <td className="label">PAN Number:</td>
                <td className="value">{panNumber || "N/A"}</td>
              </tr>
              <tr>
                <td className="label">Promoter Type:</td>
                <td className="value">
                  {fixedProject.type || "Individual"}              </td>
                <td className="label">Date:</td>
                <td className="value">{formatDate(new Date())}</td>

              </tr>
            </tbody>
          </table>
        </div>

        {/* Promoter Details */}
        <section className="section">
  <h2 className="section-title">Promoter Details</h2>

  <table className="data-table">
    <tbody>
      <tr>
        <td className="label-cell">Name</td>
        <td>{allData?.promoter_details?.["Promoter Name"] || "N/A"}</td>

        <td className="label-cell">Father Name</td>
        <td>{allData?.promoter_details?.["Father Name"] || "N/A"}</td>
      </tr>

      <tr>
        <td className="label-cell">PAN Card Number</td>
        <td>{allData?.promoter_details?.["PAN"] || "N/A"}</td>
        <td className="label-cell">Aadhaar Number</td>
        <td>{allData?.promoter_details?.["Aadhaar"] || "N/A"}</td>
      </tr>

      <tr>
        <td className="label-cell">Mobile Number</td>
        <td>{allData?.promoter_details?.["Mobile Number"] || "N/A"}</td>
        <td className="label-cell">Email ID</td>
        <td>{allData?.promoter_details?.["Email"] || "N/A"}</td>
      </tr>

      <tr>
        <td className="label-cell">State/UT</td>
        <td className="value-cell">
  {allData?.promoter_details?.["State"] || "N/A"}
</td>
        <td className="label-cell">District</td>
        <td className="value-cell">
  {allData?.promoter_details?.["District"] || "N/A"}
</td>
      </tr>

      <tr>
        <td className="label-cell">Landline Number</td>
        <td className="value-cell">
  {allData?.promoter_details?.["Landline"] || "N/A"}
</td>
        <td className="label-cell">Promoter Website</td>
        <td className="value-cell">
  {allData?.promoter_details?.["Promoter Website"] || "N/A"}
</td>
      </tr>
    </tbody>
  </table>

  <h3 className="subsection-title">Project Bank Details</h3>
  <table className="data-table">
    <tbody>
      <tr>
        <td className="label-cell">Bank State</td>
        <td className="value-cell">
  {allData?.promoter_details?.["Bank State"] || "N/A"}
</td>
        <td className="label-cell">Bank Name</td>
        <td className="value-cell">{allData?.promoter_details?.["Bank Name"] || "N/A"}</td>
      </tr>

      <tr>
        <td className="label-cell">Branch Name</td>
        <td className="value-cell">{allData?.promoter_details?.["Branch Name"] || "N/A"}</td>
        <td className="label-cell">Account Number</td>
        <td className="value-cell">{allData?.promoter_details?.["Account Number"] || "N/A"}</td>
      </tr>

      <tr>
        <td className="label-cell">IFSC Code</td>
        <td className="value-cell">{allData?.promoter_details?.["IFSC Code"] || "N/A"}</td>
        <td className="label-cell">Account Holder Name</td>
        <td className="value-cell">{allData?.promoter_details?.["Account Holder Name"] || "N/A"}</td>
      </tr>
    </tbody>
  </table>
</section>

        {/* Project Details */}
        <section className="section page-break">
          <h2 className="section-title">Project Details</h2>

          <table className="data-table">
            <tbody>
              <tr>
                <td className="value-cell" colSpan="3">
  {fixedProject.name }
</td>

              </tr>
              <tr>
                <td className="label-cell">Project Description</td>
                <td className="value-cell" colSpan="3">
                  {fixedProject.description || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Project Type</td>
                <td className="value-cell">
                  {fixedProject.type }
                </td>
                <td className="label-cell">Project Status</td>
                <td className="value-cell">
                  {fixedProject.status || "New Project"}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Building Plan No</td>
                <td className="value-cell">
                  {fixedProject.buildingPlanNo || "N/A"}
                </td>
                <td className="label-cell">Survey No</td>
                <td className="value-cell">
                  {fixedProject.surveyNo || "N/A"}
                </td>
              </tr>
              
                <tr>
  <td className="label-cell">Building Permission Validity From</td>
  <td className="value-cell">{fixedProject.permissionFrom}</td>

  <td className="label-cell">Building Permission Validity To</td>
  <td className="value-cell">{fixedProject.permissionTo}</td>
</tr>
    
<tr>
  <td className="label-cell">Project Starting Date</td>
  <td className="value-cell">{fixedProject.startDate}</td>

  <td className="label-cell">Proposed Completion Date</td>
  <td className="value-cell">{fixedProject.completionDate}</td>
</tr>

              <tr>
                <td className="label-cell">Total Area of Land (Sq.m)</td>
                <td className="value-cell">
                  {fixedProject.landArea || "N/A"}
                </td>
                <td className="label-cell">Height of Building (m)</td>
                <td className="value-cell">
                  {fixedProject.height || "0.00"}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Total Plinth Area (Sq.m)</td>
                <td className="value-cell">
                  {fixedProject.plinthArea || "N/A"}
                </td>
                <td className="label-cell">Total Open Area (Sq.m)</td>
                <td className="value-cell">
                  {fixedProject.openArea || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Total Built-up Area (Sq.m)</td>
                <td className="value-cell">
                  {fixedProject.builtUpArea || "N/A"}
                </td>
                <td className="label-cell">Estimated Cost of Construction</td>
                <td className="value-cell">
                  ₹ {fixedProject.estimatedCost || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Cost of Land</td>
                <td className="value-cell">₹ {fixedProject.landCost}</td>
                <td className="label-cell">Total Project Cost</td>
                <td className="value-cell">
                  ₹ {fixedProject.totalCost}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="subsection-title">Project Site Address</h3>
          <table className="data-table">
            <tbody>
              <tr>
                <td className="label-cell">Address Line 1</td>
                <td className="value-cell" colSpan="3">
                  {fixedProject.address} 
                </td>
              </tr>
              <tr>
                <td className="label-cell">Address Line 2</td>
                <td className="value-cell" colSpan="3">
                  { "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label-cell">District</td>
                <td className="value-cell">
                  {fixedProject.district}
                </td>
                <td className="label-cell">Mandal</td>
                <td className="value-cell">
                  {fixedProject.mandal }
                </td>
              </tr>
              <tr>
                <td className="label-cell">Local Area/Village</td>
                <td className="value-cell">
                  {fixedProject.village }
                </td>
                <td className="label-cell">Pincode</td>
                <td className="value-cell">
                  {fixedProject.pincode}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Latitude</td>
                <td className="value-cell">
                  {project.project_latitude || "N/A"}
                </td>
                <td className="label-cell">Longitude</td>
                <td className="value-cell">
                  {project.project_longitude || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="subsection-title">Plan Approving Authority</h3>
          <table className="data-table">
            <tbody>
              <tr>
                <td className="label-cell">Plan Approving Authority</td>
                <td className="value-cell">
                  {project.approvingAuthority || "N/A"}
                </td>
                <td className="label-cell">APCRDA Name</td>
                <td className="value-cell">
                  {project.apcrdaName || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Development Details */}
        <section className="section page-break">
          <h2 className="section-title">Development Details</h2>

          <h3 className="subsection-title">Building Type</h3>

          <div className="building-types">
            {Object.keys(developmentDetails).map((type) => (
  <span key={type} className="badge">
    ✓ {String(type.replaceAll("_", " "))}
  </span>
))}

          </div>

          {development?.Apartments_Flats && (
  <>
    <h4 className="detail-heading">Apartment Details</h4>
    <p>
      <strong>Total No of Blocks:</strong>{" "}
      {development.Apartments_Flats.no_blocks || "N/A"}
    </p>
  </>
)}

{apartmentRows.length > 0 && (
  <>
    <h4 className="detail-heading">Apartment / Flat Details</h4>

    <div style={{ overflowX: "auto" }}>
      <table className="data-table small-text">
        <thead>
  <tr>
    <th>Block Name</th>
    <th>Built-up Area of all floors of a block (Sq.m)</th>
    <th>Floor Number</th>
    <th>Flat Number</th>
    <th>Type of Flat</th>
    <th>Carpet Area of each unit (Sq.m)</th>
    <th>Outer Wall Area (Sq.m)</th>
    <th>Area of exclusive balcony/verandah (Sq.m)</th>
    <th>Area of exclusive open terrace if any (Sq.m)</th>
    <th>Share of common areas (Sq.m)</th>
    <th>Parking Area (if any) (Sq.m)</th>
    <th>Total area of each Flat/unit (Sq.m)</th>
  </tr>
</thead>


        
          <tbody>
  {Object.entries(groupedApartments).map(([blockName, flats]) =>
    flats.map((row, idx) => (
      <tr key={`${blockName}-${idx}`}>
        
        {/* Block Name (rowSpan) */}
        {idx === 0 && (
          <td rowSpan={flats.length}>{blockName}</td>
        )}

        {/* Built-up Area of all floors (rowSpan) */}
        {idx === 0 && (
          <td rowSpan={flats.length}>
            {row["Built-up area \nof all the floors of \na  Block (Sq.m)"]}
          </td>
        )}

        {/* Floor Number (rowSpan) */}
        {idx === 0 && (
          <td rowSpan={flats.length}>{row["Floor Number"]}</td>
        )}

        {/* Flat-specific columns */}
        <td>{row["Flat Number"]}</td>
        <td>{row["Type of Flat (1BHK/2BHK/3BHK/Others)"]}</td>
        <td>{row["Carpet Area of each unit (Sq.m)"]}</td>
        <td>{row["Outer Wall \nArea (Sq.m)"]}</td>
        <td>{row["Area of exclusive balcony/verandah (Sq.m)"]}</td>
        <td>{row["Area of exclusive open terrace if any (Sq.m)"]}</td>
        <td>{row["Share of \nCommon Areas (Sq.m)"]}</td>
        <td>{row["Parking Area \nif any (Sq.m)"]}</td>
        <td>{row["Total area of each Flat/unit (Sq.m)"]}</td>
      </tr>
    ))
  )}
</tbody>

      </table>
    </div>
  </>
)}


          {/* {allData.development.buildingTypes?.villas && (
            <>
              <h4 className="detail-heading">Villa Details</h4>
              <p>
                <strong>Total No of Blocks:</strong>{" "}
                {allData.development.villaDetails?.totalBlocks || "N/A"}
              </p>
            </>
          )} */}

          <h3 className="subsection-title" style={{ marginTop: "20px" }}>
            External Development Work
          </h3>
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-header">External Development Work Type</th>
                <th className="table-header center">% of Work Completed</th>
              </tr>
            </thead>
            <tbody>
  {EXTERNAL_WORK_LABELS.map((item, index) => {
    const percentage = externalDevWork[item.key];

    console.log(
      "➡️ Row check:",
      item.key,
      "=>",
      percentage
    );

    return (
      <tr key={index}>
        <td>{item.label}</td>
        <td className="center">
          {percentage !== undefined ? `${percentage}%` : "—"}
        </td>
      </tr>
    );
  })}
</tbody>


          </table>

          {/* {allData.development.otherWorksList?.length > 0 && (
            <>
              <h3 className="subsection-title">
                Other External Development Works
              </h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="table-header" style={{ width: "10%" }}>
                      S.No
                    </th>
                    <th className="table-header">Work Description</th>
                    <th className="table-header">Work Type</th>
                  </tr>
                </thead>
                <tbody>
                  {allData.development.otherWorksList.map((work, index) => (
                    <tr key={work.id}>
                      <td className="value-cell center">{index + 1}</td>
                      <td className="value-cell">{work.description}</td>
                      <td className="value-cell">{work.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )} */}

          <h3 className="subsection-title">Project Material Facts</h3>
          <table className="data-table">
            <tbody>
              <tr>
                <td className="label-cell">No of Units in the project</td>
                <td className="value-cell">
                  {project.noOfUnits || "1"}
                </td>
                <td className="label-cell">No of Units advances taken</td>
                <td className="value-cell">
                  {project.unitsAdvancesTaken || "0"}
                </td>
              </tr>
              <tr>
                <td className="label-cell">
                  No of units where agreement for sale entered
                </td>
                <td className="value-cell">
                  {project.unitsWithAgreement || "0"}
                </td>
                <td className="label-cell">No of units sold in the project</td>
                <td className="value-cell">
                  {project.unitsSold || "0"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Associate Details */}

  <section className="section page-break">
  <h2 className="section-title">Associate Details</h2>
  {/* Project Agent */}
<h3 className="associate-title">Project Agent</h3>
<div className="associate-underline"></div>

{associates.agents.length === 0 ? (
  <p className="not-added-text">Project Agent details not added</p>
) : (
  <table className="data-table small-text">
    <thead>
      <tr>
        <th>S.No</th>
        <th>RERA Registration No</th>
        <th>Agent Name</th>
        <th>Address</th>
        <th>Mobile Number</th>
      </tr>
    </thead>
    <tbody>
      {associates.agents.map((a, idx) => (
        <tr key={idx}>
          <td>{idx + 1}</td>
          <td>{a.reraNumber}</td>
          <td>{a.name}</td>
          <td>{a.address}</td>
          <td>{a.mobile}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}


  {/* Project Architects */}
<h3 className="associate-title">Project Architects</h3>
<div className="associate-underline"></div>

{associates.architects.length === 0 ? (
  <p className="not-added-text">Project Architects details not added</p>
) : (
  <table className="data-table small-text">
    <thead>
      <tr>
        <th>S.No</th>
        <th>Architect Name</th>
        <th>Email ID</th>
        <th>Address Line 1</th>
        <th>Address Line 2</th>
        <th>State/UT</th>
        <th>District</th>
        <th>PIN Code</th>
        <th>Year of establishment</th>
        <th>Number of Key projects completed</th>
        <th>Reg. Number With COA</th>
        <th>Mobile Number</th>
      </tr>
    </thead>
    <tbody>
      {associates.architects.map((a, idx) => (
        <tr key={idx}>
          <td>{idx + 1}</td>
          <td>{a.name}</td>
          <td>{a.email || "—"}</td>
          <td>{a.address}</td>
          <td>{a.address2 || "—"}</td>
          <td>{a.state}</td>
          <td>{a.district}</td>
          <td>{a.pincode}</td>
          <td>{a.yearOfEstablishment}</td>
          <td>{a.keyProjects}</td>
          <td>{a.regNumber}</td>
          <td>{a.mobile}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}


  {/* Engineers */}
  <h3 className="subsection-title">Structural Engineers</h3>
  {associates.engineers.length === 0 ? (
    <p className="not-added">Structural Engineers details not added</p>
  ) : (
    <table className="data-table small-text">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Engineer Name</th>
          <th>Email ID</th>
          <th>Address</th>
          <th>State/UT</th>
          <th>District</th>
          <th>Mobile</th>
          <th>License No</th>
        </tr>
      </thead>
      <tbody>
        {associates.engineers.map((eng, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{eng.name}</td>
            <td>{eng.email}</td>
            <td>{eng.address}</td>
            <td>{eng.state}</td>
            <td>{eng.district}</td>
            <td>{eng.mobile}</td>
            <td>{eng.licenseNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

  {/* Chartered Accountant */}
  <h3 className="subsection-title">Chartered Accountant</h3>
  {associates.charteredAccountants.length === 0 ? (
    <p className="not-added">Chartered Accountant details not added</p>
  ) : (
    <table className="data-table small-text">
      <thead>
        <tr>
          <th>S.No</th>
          <th>CA Name</th>
          <th>Email ID</th>
          <th>Address</th>
          <th>State/UT</th>
          <th>District</th>
          <th>Mobile</th>
          <th>ICAI Member ID</th>
        </tr>
      </thead>
      <tbody>
        {associates.charteredAccountants.map((ca, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{ca.name}</td>
            <td>{ca.email}</td>
            <td>{ca.address}</td>
            <td>{ca.state}</td>
            <td>{ca.district}</td>
            <td>{ca.mobile}</td>
            <td>{ca.icaiMemberId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

{/* Project Engineers */}
<h3 className="subsection-title">Project Engineers</h3>

{projectEngineers.length === 0 ? (
  <p className="not-added">Project Engineers details not added</p>
) : (
  <table className="data-table small-text">
    <thead>
      <tr>
        <th>S.No</th>
        <th>Engineer Name</th>
        <th>Email ID</th>
        <th>Address</th>
        <th>State/UT</th>
        <th>District</th>
        <th>PIN Code</th>
        <th>Mobile</th>
        <th>No. of Key Projects</th>
      </tr>
    </thead>
    <tbody>
      {projectEngineers.map((e, idx) => (
        <tr key={idx}>
          <td>{idx + 1}</td>
          <td>{e.name}</td>
          <td>{e.email || "—"}</td>
          <td>{e.address}</td>
          <td>{e.state}</td>
          <td>{e.district}</td>
          <td>{e.pincode}</td>
          <td>{e.mobile}</td>
          <td>{e.keyProjects}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}


{/* Project Contractors */}
<h3 className="subsection-title">Project Contractors</h3>

{(associatesRaw.contractors || []).length === 0 ? (
  <p className="not-added">Project Contractors details not added</p>
) : (
  <table className="data-table small-text">
    <thead>
      <tr>
        <th>S.No</th>
        <th>Nature of Work</th>
        <th>Contractor Name</th>
        <th>Email ID</th>
        <th>Address</th>
        <th>State/UT</th>
        <th>District</th>
        <th>PIN Code</th>
        <th>Year of Establishment</th>
        <th>No. of Key Projects</th>
        <th>Mobile Number</th>
      </tr>
    </thead>
    <tbody>
      {associatesRaw.contractors.map((c, idx) => (
        <tr key={idx}>
          <td>{idx + 1}</td>
          <td>{c.nature_of_work}</td>
          <td>{c.contractor_name}</td>
          <td>{c.email_id || "—"}</td>
          <td>{c.address_line1}</td>
          <td>{c.state_ut}</td>
          <td>{c.district}</td>
          <td>{c.pin_code}</td>
          <td>{c.year_of_establishment || "—"}</td>
          <td>{c.number_of_key_projects || "—"}</td>
          <td>{c.mobile_number}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

</section> 


{/* Uploaded Documents */}
<section className="section page-break">
  <h2 className="section-title">Attached Documents</h2>

  <table className="data-table">
    <thead>
      <tr>
        <th className="table-header">Document Type</th>
        <th className="table-header">Uploaded Document</th>
      </tr>
    </thead>

    <tbody>
      {documents.length === 0 ? (
        <tr>
          <td colSpan="2">No documents uploaded</td>
        </tr>
      ) : (
        documents.map((doc, idx) => (
          <tr key={idx}>
            <td>{doc.document_name || "—"}</td>
            <td>
              {doc.file_path ? (
                <a
                  href={`http://localhost:8080${doc.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Document
                </a>
              ) : (
                "NA"
              )}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</section>
        {/* Declaration */}
        <section className="section page-break">
          <h2 className="section-title">Declaration</h2>
          <div className="declaration-box">
            <p className="declaration-text">
              ☑ I/We <strong>
  {allData?.promoter_details?.["Promoter Name"] || "___________"}
</strong>


              solemnly affirm and declare that the particulars given above are
              correct to my/our knowledge and belief.
            </p>

            <h3 className="subsection-title">Note</h3>
            <ol className="declaration-notes">
              <li>
                The applicability of the Penalty/additional fee may be imposed,
                if any, provision of the act is violated, as determined by the
                Authority, as the case may be.
              </li>
              <li>
                As per section 4 of the RERA Act, 2016, you are hereby directed
                to address the shortfalls within 15 days as addressed by the
                Authority, failing which the application may be rejected as per
                Section 4 of the Act.
              </li>
            </ol>
          </div>
        </section>

        {/* Footer */}
        <div className="pdf-footer">
          <p>Generated on: {new Date().toLocaleString()}</p>
          <p>Andhra Pradesh Real Estate Regulatory Authority (APRERA)</p>
          <p>Application Number: {applicationNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectPreview;