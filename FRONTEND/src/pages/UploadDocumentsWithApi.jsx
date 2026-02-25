// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from "react-router-dom";
// import '../styles/UploadDocumentsWithApi.css';
// import ProjectWizard from "../components/ProjectWizard";

// const UploadDocumentsWithApi = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
// const APPLICATION_NUMBER = id;

// const API_BASE = "http://localhost:8080";
// const API_URL = `${API_BASE}/api/project/details/${APPLICATION_NUMBER}`;

// const [dataLoaded, setDataLoaded] = useState(false);

//   const [documents, setDocuments] = useState([
//     {
//       id: 1,
//       type: "Copies of the registered ownership documents / Copies of the Pattadhaar pass books issued by the Revenue department along with the link documents and authorization letter given by the Land Owner",
//       note: "* (refer Form P20 in forms download)",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 2,
//       type: "Copies of the combined field sketches showing the Survey Number boundaries, Subdivision boundaries, and Layout boundaries duly marking the Geo-Coordinates at every corner of the site.",
//       note: "",
//       isRequired: false,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 3,
//       type: "Detailed site plan showing the measurements as on ground including diagonals along with Geo-Coordinates (Latitude and Longitude) at end points of the project site along with incorporation of same on Satellite Imagery.",
//       note: "*",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 4,
//       type: "Copy of the registered development agreement between the Owner of the land and the Promoter / Authorisation letter given by the Land owner to undertake the construction of the building by the promoter.",
//       note: "*",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 5,
//       type: "Land Title search Report from an Advocate (include Advocate Enrolment Number) having experience of atleast ten years in land related matters.",
//       note: "*",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 6,
//       type: "Latest (by 30 days) Encumbrance certificate (for entire period of document) issued by the Registration and Stamps department.",
//       note: "*",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 7,
//       type: "Copy of the plan and proceedings issued by the competent Authority for approval of plans(TDR Bonds,if any).",
//       note: "*",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 8,
//       type: "Approved plan / list of amenities proposed in the site",
//       note: "*",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 9,
//       type: "NOC's issued by Authority (where applicable-viz., Airport Authority, Fire Department, Environmental Clearance, etc.)",
//       note: "",
//       isRequired: false,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 10,
//       type: "Detailed technical specifications of the construction if the buildings and facilities proposed in the project including brand details, specifications of infrastructure and details of fixtures and fittings",
//       note: "* (refer Form P18 in forms download)",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 11,
//       type: "Topo Plan drawn to a scale with nearby land marks of the site.",
//       note: "*",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 12,
//       type: "Licenses/Enrolment form of Civil Contractors, or turnkey contractor, or EPC Contractors of ther project (if any)",
//       note: "",
//       isRequired: false,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 13,
//       type: "Licenses/Enrolment form of Structural Engineer of the project (if there is any overhead tank or major structure proposed in the layout)",
//       note: "*",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 14,
//       type: "Licenses/Enrolment form of Architect or firm or company",
//       note: "*",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 15,
//       type: "Licenses/Enrolment form of Engineer or firm or company (If any)",
//       note: "",
//       isRequired: false,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 16,
//       type: "Licenses/Enrolment form of Chartered Accountant or firm or company",
//       note: "*",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 17,
//       type: "Detailed estimate of the expenditure for construction of the building",
//       note: "* (refer Form P16 in forms download)",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 18,
//       type: "Statement of source of funds for construction of building",
//       note: "* (refer Form P9 in forms download)",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 19,
//       type: "Details of financial agreement made with any bank or other financial institution recognised by the Reserve Bank of India and of legal safeguards taken, if any, for the construction of building, or transfer of building by sale, gift or mortgage or otherwise (wherever applicable)",
//       note: "",
//       isRequired: false,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 20,
//       type: "Copy of documents showing details of mortgage or any other legal encumbrance created on land in favour of any bank or financial institution recognised by the RBI (Where applicable)",
//       note: "",
//       isRequired: false,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 21,
//       type: "Proforma of the Allotment Letter proposed to be signed with the Allottee",
//       note: "* (refer Form P14 in forms download)",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 22,
//       type: "Proforma of the Agreement for Sale proposed to be signed with the Allottee",
//       note: "*",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 23,
//       type: "Proforma of the Conveyance Deed proposed to be signed with the Allottee",
//       note: "* (refer Form P15 in forms download)",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 24,
//       type: "Structural Stability Certificate duly issued by Certified Structural Consultant",
//       note: "* (refer Form P19 in forms download)",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 25,
//       type: "Copy of Insurance of title of the land",
//       note: "",
//       isRequired: false,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 26,
//       type: "FORM - B, Declaration, supported by an affidavit (on Rs.20 non judicial stamp paper), which shall be signed by the promoter or any person authorized by the promoter under Rule 3-B(2) (a) to  0f AP Real Estate Rules-2017",
//       note: "* (refer Form P11 in forms download)",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     },
//     {
//       id: 27,
//       type: "Details of the area mortgaged to the Competent Authority for approval of Plans/ Mortagage Deed.",
//       note: "*",
//       isRequired: true,
//       file: null,
//       uploadedFile: null,
//       progress: 0,
//       showDelete: false,
//       fileName: "No file chosen",
//       showProgressBar: false,
//       showLink: false
//     }
//   ]);

//   const [consultantDetails, setConsultantDetails] = useState({
//     submittedBy: "Consultancy",
//     consultancyName: "",
//     personName: "",
//     mobileNumber: "",
//     emailId: "",
//     address: ""
//   });

//   const [declaration, setDeclaration] = useState({
//     name: "",
//     checked: false,
//     note1: false,
//     note2: false
//   });

//   const fileInputRefs = useRef({});
// useEffect(() => {
//   if (!APPLICATION_NUMBER) return;

//   const fetchProjectDetails = async () => {
//     try {
//       const res = await fetch(API_URL);
//       const data = await res.json();

//       console.log("API RESPONSE >>>", data);

//       // ---------- DOCUMENTS ----------
//       const apiDocuments = data.documents || {};
//       setDocuments(prev =>
//         prev.map(doc => {
//           const filePath = apiDocuments[doc.id];
//           if (filePath) {
//             return {
//               ...doc,
//               uploadedFile: filePath.split("/").pop(),
//               showLink: true,
//               showDelete: !doc.isRequired,
//               progress: 100,
//               showProgressBar: false,
//               fileUrl: `${API_BASE}${filePath}`
//             };
//           }
//           return doc;
//         })
//       );

//       // ---------- CONSULTANT ----------
//       if (data?.consultant_declaration) {
//         const c = data.consultant_declaration;

//         setConsultantDetails({
//           submittedBy: "Consultancy",
//           consultancyName: c.consultancy_name || "",
//           personName: c.consultant_name || "",
//           mobileNumber: c.mobile_number || "",
//           emailId: c.email_id || "",
//           address: c.address || ""
//         });

//         setDeclaration({
//           name: c.declaration_name || "",
//           checked: c.declaration_accept === "Y",
//           note1: c.note1_accept === "Y",
//           note2: c.note2_accept === "Y"
//         });
//       }

//       // ✅ ALWAYS MARK LOADED (VERY IMPORTANT)
//       setDataLoaded(true);

//     } catch (err) {
//       console.error("API ERROR", err);
//       setDataLoaded(true); // still unblock UI
//     }
//   };

//   fetchProjectDetails();
// }, [APPLICATION_NUMBER]);



//   const handleFileChange = (id, event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setDocuments(prev => prev.map(doc =>
//       doc.id === id ? {
//         ...doc,
//         file,
//         fileName: file.name,
//         uploadedFile: null,
//         progress: 0,
//         showDelete: false,
//         showProgressBar: true,
//         showLink: false,
//         fileUrl: null
//       } : doc
//     ));

//     simulateUpload(id, file.name);
//   };

//   const simulateUpload = (id, fileName) => {
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 10;
//       setDocuments(prev => prev.map(doc =>
//         doc.id === id ? { ...doc, progress, showProgressBar: true } : doc
//       ));

//       if (progress >= 100) {
//         clearInterval(interval);
//         setTimeout(() => {
//           setDocuments(prev => prev.map(doc =>
//             doc.id === id ? {
//               ...doc,
//               uploadedFile: fileName,
//               showProgressBar: false,
//               showLink: true,
//               showDelete: !doc.isRequired,
//               fileName: "No file chosen"
//             } : doc
//           ));

//           if (fileInputRefs.current[id]) {
//             fileInputRefs.current[id].value = '';
//           }
//         }, 300);
//       }
//     }, 100);
//   };
//   const handleDelete = (id) => {
//     setDocuments(prev => prev.map(doc =>
//       doc.id === id ? {
//         ...doc,
//         file: null,
//         uploadedFile: null,
//         progress: 0,
//         showDelete: false,
//         showProgressBar: false,
//         showLink: false,
//         fileName: "No file chosen",
//         fileUrl: null
//       } : doc
//     ));

//     if (fileInputRefs.current[id]) {
//       fileInputRefs.current[id].value = '';
//     }
//   };

//   const handleDownload = (fileName, fileUrl) => {
//     console.log(`Downloading ${fileName}`);
    
//     if (fileUrl) {
//       // If we have a real URL from API, use it
//       const link = document.createElement('a');
//       link.href = fileUrl;
//       link.download = fileName;
//       link.target = '_blank'; // Open in new tab for external URLs
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else {
//       // Fallback to dummy download
//       const link = document.createElement('a');
//       link.href = '#';
//       link.download = fileName;
//       link.click();
//     }
//   };

//   const handleConsultantChange = (field, value) => {
//     setConsultantDetails(prev => ({ ...prev, [field]: value }));
//   };

//   const handleDeclarationChange = (field) => {
//     setDeclaration(prev => ({ ...prev, [field]: !prev[field] }));
//   };

//   const completeStep = (stepNo) => {
//     let completed = JSON.parse(localStorage.getItem("completedSteps") || "[]");
//     if (!completed.includes(stepNo)) {
//       completed.push(stepNo);
//       localStorage.setItem("completedSteps", JSON.stringify(completed));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const missing = documents.some(d => d.isRequired && !d.uploadedFile);
//     if (missing) {
//       alert("Please upload all mandatory documents");
//       return;
//     }

//     if (!declaration.checked || !declaration.note1 || !declaration.note2) {
//       alert("Please accept all declaration notes");
//       return;
//     }

//     completeStep(5);
//     navigate(`/project/${APPLICATION_NUMBER}/preview`);
//   };
// if (!dataLoaded) {
//   return <div style={{ padding: 20 }}>Loading project details...</div>;
// }

//   return (
//     <div className="upload-documents-container">
//       <div className="header-navigation">
//         <div className="breadcrumb">
//           You are here: <a href="#" >Home</a> / <a href="#">Registration</a> / <a href="#">Project Registration</a>
//         </div>
//       </div>

//       <h2 className="page-title">Project Registration</h2>

//       <ProjectWizard currentStep={5} />

//       <form onSubmit={handleSubmit} className="upload-form">
//         <div className="form-section">
//           <h3 className="subheading">Upload Documents</h3>

//           <div className="documents-table-container">
//             <table className="documents-table">
//               <thead>
//                 <tr className="table-header">
//                   <td style={{ color: 'white' ,backgroundColor:'#0b0b0b' , textAlign:'left'}}>
//                     <b>Document Type</b>
//                   </td>
//                   <td style={{ color: 'white' ,backgroundColor:'#0b0b0b' }}>
//                     <b>Upload (Max size 70 MB for each document)</b>
//                   </td>
//                   <td style={{ color: 'white',backgroundColor:'#0b0b0b' }}>
//                     <b>Uploaded Document</b>
//                   </td>
//                 </tr>
//               </thead>
//               <tbody>
//                 {documents.map((doc) => (
//                   <tr key={doc.id} className="document-row">
//                     <td className="document-type">
//                       {doc.type}
//                       {doc.note && <font color="red">{doc.note}</font>}
//                     </td>
//                     <td className="upload-column">
//                       <div className="file-upload-wrapper">
//                         <input
//                           ref={el => fileInputRefs.current[doc.id] = el}
//                           type="file"
//                           className="file-input"
//                           onChange={(e) => handleFileChange(doc.id, e)}
//                           id={`file-input-${doc.id}`}
//                         />
//                         <label htmlFor={`file-input-${doc.id}`} className="file-input-label">
//                           Choose File
//                         </label>
//                         <span className="file-name-display">{doc.fileName}</span>
//                       </div>
//                     </td>
//                     <td className="uploaded-column">
//                       {doc.showProgressBar && (
//                         <div className="progress-bar">
//                           <div className="progress-fill" style={{ width: `${doc.progress}%` }}>
//                             {doc.progress}%
//                           </div>
//                         </div>
//                       )}

//                       {doc.showLink && doc.uploadedFile && (
//                         <>
//                           <a
//                             href="#"
//                             className="lnk-link"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               handleDownload(doc.uploadedFile, doc.fileUrl);
//                             }}
//                             style={{ display: 'inline-block', marginRight: '10px' }}
//                           >
//                             {doc.uploadedFile}
//                           </a>
//                           {doc.showDelete && (
//                             <a
//                               href="#"
//                               className="delete-link"
//                               onClick={(e) => {
//                                 e.preventDefault();
//                                 handleDelete(doc.id);
//                               }}
//                             >
//                               <img src="../images/delete.png" title="Delete" alt="Delete" />
//                             </a>
//                           )}
//                         </>
//                       )}

//                       {!doc.showLink && !doc.showProgressBar && (
//                         <span style={{ color: '#666', fontStyle: 'italic' }}>
//                           No file uploaded
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {/* Submitted By */}
//           <div id="dvisconsultant" className="submitted-by-section">

//           <div className="submitted-by-label">
//             This Project Registration application is submitted by
//             <span className="required">*</span>
//           </div>

//           <div className="submitted-by-options">

//             <label className="radio-item">
//               <input
//                 type="radio"
//                 name="rblIsConsultant"
//                 checked={consultantDetails.submittedBy === "Consultancy"}
//                 onChange={() => handleConsultantChange('submittedBy', 'Consultancy')}
//               />
//               Consultancy
//             </label>

//           </div>

//         </div>

//                   {/* Consultancy Details */}
//         <div id="dvConsultntDtls" className="consultancy-details-section">
//           <div className="section-header">
//             <h3 className="subheading">Consultancy Details</h3>
//           </div>

//           <div className="consultancy-form">

//             {/* ===== FIRST ROW ===== */}
//             <div className="row innerdivrow">

//               <div className="col-sm-4">
//                 <div className="form-group">
//                   <label className="label">
//                     Name of Consultancy/Agency/Association/Individual<font color="red">*</font>
//                   </label>
//                   <input
//   type="text"
//   className="form-control inputbox"
//   value={consultantDetails.consultancyName}
//   onChange={(e) =>
//     handleConsultantChange("consultancyName", e.target.value)
//   }
//   placeholder="Name of Consultancy/Agency/Association"
// />

//                 </div>
//               </div>

//               <div className="col-sm-4">
//                 <div className="form-group">
//                   <label className="label">
//                     Name<font color="red">*</font>
//                   </label>
//                   <input
//   type="text"
//   className="form-control inputbox"
//   value={consultantDetails.personName}
//   onChange={(e) =>
//     handleConsultantChange("personName", e.target.value)
//   }
//   placeholder="Consultant Name"
// />

//                 </div>
//               </div>

//               <div className="col-sm-4">
//                 <div className="form-group">
//                   <label className="label">
//                     Mobile Number<font color="red">*</font>
//                   </label>
//                   <input
//   type="text"
//   className="form-control inputbox"
//   value={consultantDetails.mobileNumber}
//   onChange={(e) =>
//     handleConsultantChange("mobileNumber", e.target.value)
//   }
//   placeholder="Mobile Number"
// />

//                 </div>
//               </div>

//             </div>

//             {/* ===== SECOND ROW ===== */}
//             <div className="row innerdivrow">

//               <div className="col-sm-4">
//                 <div className="form-group">
//                   <label className="label">
//                     Email Id<font color="red">*</font>
//                   </label>
//                   <input
//   type="email"
//   className="form-control inputbox"
//   value={consultantDetails.emailId}
//   onChange={(e) =>
//     handleConsultantChange("emailId", e.target.value)
//   }
//   placeholder="Email"
// />

//                 </div>
//               </div>

//               <div className="col-sm-8">
//                 <div className="form-group">
//                   <label className="label">
//                     Full Address for communication<font color="red">*</font>
//                   </label>
//                   <textarea
//   rows="2"
//   className="form-control inputbox"
//   value={consultantDetails.address}
//   onChange={(e) =>
//     handleConsultantChange("address", e.target.value)
//   }
//   placeholder="Full Address for communication"
// />

//                 </div>
//               </div>

//             </div>

//           </div>
//         </div>

//           <div className="note-section">
//             <label className="note-label">
//               Note: If encountered any issue during upload of documents, please contact APRERA IT Support Team.
//             </label>
//           </div>

//             {/* Declaration */}
//           <div className="declaration-section">

//             <div className="section-header">
//               <h3 className="subheading">Declaration</h3>
//             </div>

//             <div className="declaration-content">

//               <div className="declaration-inline">

//                <input 
//   type="checkbox" 
//   className="declaration-checkbox"
//   checked={declaration.checked}
//   onChange={() => handleDeclarationChange('checked')}
// />


//                 <span className="declaration-prefix">I/We</span>

//                 <input 
//   type="text" 
//   className="declaration-name-input"
//   value={declaration.name}
//   onChange={(e) =>
//     setDeclaration(prev => ({ ...prev, name: e.target.value }))
//   }
// />


//                 <span className="declaration-text">
//                   solemnly affirm and declare that the particulars given above are correct to my/our knowledge and belief.
//                 </span>

//               </div>

//             </div>

//           </div>

//                     {/* Additional Notes */}
//           <div id="Div2" className="additional-notes-section">

//             <div className="section-header">
//               <h3 className="subheading">Note</h3>
//             </div>

//             <div className="notes-content">

//               <div className="note-item">
//                 <input
//                   type="checkbox"
//                   id="chkNote1"
//                   checked={declaration.note1}
//                   onChange={() => handleDeclarationChange('note1')}
//                   className="note-checkbox"
//                 />

//                 <label htmlFor="chkNote1" className="note-text1">
//                   1. The applicability of the Penalty/additional fee may be imposed, if any, provision of the act is violated, as determined by the Authority, as the case may be.
//                 </label>
//               </div>

//               <div className="note-item">
//                 <input
//                   type="checkbox"
//                   id="chkNote2"
//                   checked={declaration.note2}
//                   onChange={() => handleDeclarationChange('note2')}
//                   className="note-checkbox"
//                 />

//                 <label htmlFor="chkNote2" className="note-text1">
//                   2. As per section 4 of the RERA Act, 2016, you are hereby directed to address the shortfalls within 15 days as addressed by the Authority, failing which the application may be rejected as per Section 4 of the Act.
//                 </label>
//               </div>

//             </div>
//           </div>


//           <div className="form-actions">
//             <button type="submit" className="save-button">
//               Save
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UploadDocumentsWithApi;


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '../styles/UploadDocumentsWithApi.css';
import ProjectWizard from "../components/ProjectWizard";
import ExistingProjectWizard from '../components/ExistingProjectWizard';

const UploadDocumentsWithApi = () => {
  const navigate = useNavigate();
  const { id } = useParams();
const APPLICATION_NUMBER = id;

const location = useLocation();

const promoterType =
  location.state?.promoterType ||
  sessionStorage.getItem("promoterType") ||
  "Individual";

const panNumber =
  location.state?.panNumber ||
  sessionStorage.getItem("panNumber");

const API_BASE = "https://0jv8810n-8080.inc1.devtunnels.ms";
const API_URL = `${API_BASE}/api/project/details/${APPLICATION_NUMBER}`;

const [dataLoaded, setDataLoaded] = useState(false);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: "Copies of the registered ownership documents / Copies of the Pattadhaar pass books issued by the Revenue department along with the link documents and authorization letter given by the Land Owner",
      note: " (refer Form P20 in forms download)",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 2,
      type: "Copies of the combined field sketches showing the Survey Number boundaries, Subdivision boundaries, and Layout boundaries duly marking the Geo-Coordinates at every corner of the site.",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 3,
      type: "Detailed site plan showing the measurements as on ground including diagonals along with Geo-Coordinates (Latitude and Longitude) at end points of the project site along with incorporation of same on Satellite Imagery.",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 4,
      type: "Copy of the registered development agreement between the Owner of the land and the Promoter / Authorisation letter given by the Land owner to undertake the construction of the building by the promoter.",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 5,
      type: "Land Title search Report from an Advocate (include Advocate Enrolment Number) having experience of atleast ten years in land related matters.",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 6,
      type: "Latest (by 30 days) Encumbrance certificate (for entire period of document) issued by the Registration and Stamps department.",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 7,
      type: "Copy of the plan and proceedings issued by the competent Authority for approval of plans(TDR Bonds,if any).",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 8,
      type: "Approved plan / list of amenities proposed in the site",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 9,
      type: "NOC's issued by Authority (where applicable-viz., Airport Authority, Fire Department, Environmental Clearance, etc.)",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 10,
      type: "Detailed technical specifications of the construction if the buildings and facilities proposed in the project including brand details, specifications of infrastructure and details of fixtures and fittings",
      note: "(refer Form P18 in forms download)",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 11,
      type: "Topo Plan drawn to a scale with nearby land marks of the site.",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 12,
      type: "Licenses/Enrolment form of Civil Contractors, or turnkey contractor, or EPC Contractors of ther project (if any)",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 13,
      type: "Licenses/Enrolment form of Structural Engineer of the project (if there is any overhead tank or major structure proposed in the layout)",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 14,
      type: "Licenses/Enrolment form of Architect or firm or company",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 15,
      type: "Licenses/Enrolment form of Engineer or firm or company (If any)",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 16,
      type: "Licenses/Enrolment form of Chartered Accountant or firm or company",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 17,
      type: "Detailed estimate of the expenditure for construction of the building",
      note: "(refer Form P16 in forms download)",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 18,
      type: "Statement of source of funds for construction of building",
      note: "(refer Form P9 in forms download)",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 19,
      type: "Details of financial agreement made with any bank or other financial institution recognised by the Reserve Bank of India and of legal safeguards taken, if any, for the construction of building, or transfer of building by sale, gift or mortgage or otherwise (wherever applicable)",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 20,
      type: "Copy of documents showing details of mortgage or any other legal encumbrance created on land in favour of any bank or financial institution recognised by the RBI (Where applicable)",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 21,
      type: "Proforma of the Allotment Letter proposed to be signed with the Allottee",
      note: "(refer Form P14 in forms download)",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 22,
      type: "Proforma of the Agreement for Sale proposed to be signed with the Allottee",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 23,
      type: "Proforma of the Conveyance Deed proposed to be signed with the Allottee",
      note: " (refer Form P15 in forms download)",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 24,
      type: "Structural Stability Certificate duly issued by Certified Structural Consultant",
      note: " (refer Form P19 in forms download)",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 25,
      type: "Copy of Insurance of title of the land",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 26,
      type: "FORM - B, Declaration, supported by an affidavit (on Rs.20 non judicial stamp paper), which shall be signed by the promoter or any person authorized by the promoter under Rule 3-B(2) (a) to  0f AP Real Estate Rules-2017",
      note: " (refer Form P11 in forms download)",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    },
    {
      id: 27,
      type: "Details of the area mortgaged to the Competent Authority for approval of Plans/ Mortagage Deed.",
      note: "",
      isRequired: false,
      file: null,
      uploadedFile: null,
      progress: 0,
      showDelete: false,
      fileName: "No file chosen",
      showProgressBar: false,
      showLink: false
    }
  ]);

  const [consultantDetails, setConsultantDetails] = useState({
    submittedBy: "Consultancy",
    consultancyName: "",
    personName: "",
    mobileNumber: "",
    emailId: "",
    address: ""
  });

  const [declaration, setDeclaration] = useState({
    name: "",
    checked: false,
    note1: false,
    note2: false
  });

  const fileInputRefs = useRef({});
useEffect(() => {
  if (!APPLICATION_NUMBER) return;

  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      console.log("API RESPONSE >>>", data);

      // ---------- DOCUMENTS ----------
      const apiDocuments = data.documents || {};
      setDocuments(prev =>
        prev.map(doc => {
          const filePath = apiDocuments[doc.id];
          if (filePath) {
            return {
              ...doc,
              uploadedFile: filePath.split("/").pop(),
              showLink: true,
              showDelete: !doc.isRequired,
              progress: 100,
              showProgressBar: false,
              fileUrl: `${API_BASE}${filePath}`
            };
          }
          return doc;
        })
      );

      // ---------- CONSULTANT ----------
      if (data?.consultant_declaration) {
        const c = data.consultant_declaration;

        setConsultantDetails({
          submittedBy: "Consultancy",
          consultancyName: c.consultancy_name || "",
          personName: c.consultant_name || "",
          mobileNumber: c.mobile_number || "",
          emailId: c.email_id || "",
          address: c.address || ""
        });

        setDeclaration({
          name: c.declaration_name || "",
          checked: c.declaration_accept === "Y",
          note1: c.note1_accept === "Y",
          note2: c.note2_accept === "Y"
        });
      }

      // ✅ ALWAYS MARK LOADED (VERY IMPORTANT)
      setDataLoaded(true);

    } catch (err) {
      console.error("API ERROR", err);
      setDataLoaded(true); // still unblock UI
    }
  };

  fetchProjectDetails();
}, [APPLICATION_NUMBER]);



  const handleFileChange = (id, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setDocuments(prev => prev.map(doc =>
      doc.id === id ? {
        ...doc,
        file,
        fileName: file.name,
        uploadedFile: null,
        progress: 0,
        showDelete: false,
        showProgressBar: true,
        showLink: false,
        fileUrl: null
      } : doc
    ));

    simulateUpload(id, file.name);
  };

  const simulateUpload = (id, fileName) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDocuments(prev => prev.map(doc =>
        doc.id === id ? { ...doc, progress, showProgressBar: true } : doc
      ));

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDocuments(prev => prev.map(doc =>
            doc.id === id ? {
              ...doc,
              uploadedFile: fileName,
              showProgressBar: false,
              showLink: true,
              showDelete: !doc.isRequired,
              fileName: "No file chosen"
            } : doc
          ));

          if (fileInputRefs.current[id]) {
            fileInputRefs.current[id].value = '';
          }
        }, 300);
      }
    }, 100);
  };
  const handleDelete = (id) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === id ? {
        ...doc,
        file: null,
        uploadedFile: null,
        progress: 0,
        showDelete: false,
        showProgressBar: false,
        showLink: false,
        fileName: "No file chosen",
        fileUrl: null
      } : doc
    ));

    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id].value = '';
    }
  };

  const handleDownload = (fileName, fileUrl) => {
    console.log(`Downloading ${fileName}`);
    
    if (fileUrl) {
      // If we have a real URL from API, use it
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank'; // Open in new tab for external URLs
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback to dummy download
      const link = document.createElement('a');
      link.href = '#';
      link.download = fileName;
      link.click();
    }
  };

  const handleConsultantChange = (field, value) => {
    setConsultantDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleDeclarationChange = (field) => {
    setDeclaration(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const completeStep = (stepNo) => {
    let completed = JSON.parse(localStorage.getItem("completedSteps") || "[]");
    if (!completed.includes(stepNo)) {
      completed.push(stepNo);
      localStorage.setItem("completedSteps", JSON.stringify(completed));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const missing = documents.some(d => d.isRequired && !d.uploadedFile);
    if (missing) {
      alert("Please upload all mandatory documents");
      return;
    }

    if (!declaration.checked || !declaration.note1 || !declaration.note2) {
      alert("Please accept all declaration notes");
      return;
    }

    completeStep(5);
    if (promoterType === "other") {

  navigate(`/othertheninduvidual-preview`, {
    state: {
      panNumber,
      applicationNumber: APPLICATION_NUMBER
    }
  });

} else {

  // DO NOT TOUCH Individual flow
  navigate(`/preview`, {
    state: {
      panNumber,
      applicationNumber: APPLICATION_NUMBER
    }
  });

}
  };
if (!dataLoaded) {
  return <div style={{ padding: 20 }}>Loading project details...</div>;
}

  return (
    <div className="upload-documents-container">
      <div className="header-navigation">
        <div className="breadcrumb">
          You are here: <a href="#" >Home</a> / <a href="#">Registration</a> / <a href="#">Project Registration</a>
        </div>
      </div>

      <h2 className="page-title">Project Registration</h2>

      <ExistingProjectWizard currentStep={5} />

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-section">
          <h3 className="subheading">Upload Documents</h3>

          <div className="documents-table-container">
            <table className="documents-table">
              <thead>
                <tr className="table-header">
                  <td style={{ color: 'white' ,backgroundColor:'#0b0b0b' , textAlign:'left'}}>
                    <b>Document Type</b>
                  </td>
                  <td style={{ color: 'white' ,backgroundColor:'#0b0b0b' }}>
                    <b>Upload (Max size 70 MB for each document)</b>
                  </td>
                  <td style={{ color: 'white',backgroundColor:'#0b0b0b' }}>
                    <b>Uploaded Document</b>
                  </td>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="document-row">
                    <td className="document-type">
                      {doc.type}
                      {doc.note && <font color="red">{doc.note}</font>}
                    </td>
                    <td className="upload-column">
                      <div className="file-upload-wrapper">
                        <input
                          ref={el => fileInputRefs.current[doc.id] = el}
                          type="file"
                          className="file-input"
                          onChange={(e) => handleFileChange(doc.id, e)}
                          id={`file-input-${doc.id}`}
                        />
                        <label htmlFor={`file-input-${doc.id}`} className="file-input-label">
                          Choose File
                        </label>
                        <span className="file-name-display">{doc.fileName}</span>
                      </div>
                    </td>
                    <td className="uploaded-column">
                      {doc.showProgressBar && (
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${doc.progress}%` }}>
                            {doc.progress}%
                          </div>
                        </div>
                      )}

                      {doc.showLink && doc.uploadedFile && (
                        <>
                          <a
                            href="#"
                            className="lnk-link"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDownload(doc.uploadedFile, doc.fileUrl);
                            }}
                            style={{ display: 'inline-block', marginRight: '10px' }}
                          >
                            {doc.uploadedFile}
                          </a>
                          {doc.showDelete && (
                            <a
                              href="#"
                              className="delete-link"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(doc.id);
                              }}
                            >
                              <img src="../images/delete.png" title="Delete" alt="Delete" />
                            </a>
                          )}
                        </>
                      )}

                      {!doc.showLink && !doc.showProgressBar && (
                        <span style={{ color: '#666', fontStyle: 'italic' }}>
                          No file uploaded
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Submitted By */}
          <div id="dvisconsultant" className="submitted-by-section">

          <div className="submitted-by-label">
            This Project Registration application is submitted by
            <span className="required">*</span>
          </div>

          <div className="submitted-by-options">

            <label className="radio-item">
              <input
                type="radio"
                name="rblIsConsultant"
                checked={consultantDetails.submittedBy === "Consultancy"}
                onChange={() => handleConsultantChange('submittedBy', 'Consultancy')}
              />
              Consultancy
            </label>

          </div>

        </div>

                  {/* Consultancy Details */}
        <div id="dvConsultntDtls" className="consultancy-details-section">
          <div className="section-header">
            <h3 className="subheading">Consultancy Details</h3>
          </div>

          <div className="consultancy-form">

            {/* ===== FIRST ROW ===== */}
            <div className="row innerdivrow">

              <div className="col-sm-4">
                <div className="form-group">
                  <label className="label">
                    Name of Consultancy/Agency/Association/Individual<font color="red">*</font>
                  </label>
                  <input
  type="text"
  className="form-control inputbox"
  value={consultantDetails.consultancyName}
  onChange={(e) =>
    handleConsultantChange("consultancyName", e.target.value)
  }
  placeholder="Name of Consultancy/Agency/Association"
/>

                </div>
              </div>

              <div className="col-sm-4">
                <div className="form-group">
                  <label className="label">
                    Name<font color="red">*</font>
                  </label>
                  <input
  type="text"
  className="form-control inputbox"
  value={consultantDetails.personName}
  onChange={(e) =>
    handleConsultantChange("personName", e.target.value)
  }
  placeholder="Consultant Name"
/>

                </div>
              </div>

              <div className="col-sm-4">
                <div className="form-group">
                  <label className="label">
                    Mobile Number<font color="red">*</font>
                  </label>
                  <input
  type="text"
  className="form-control inputbox"
  value={consultantDetails.mobileNumber}
  onChange={(e) =>
    handleConsultantChange("mobileNumber", e.target.value)
  }
  placeholder="Mobile Number"
/>

                </div>
              </div>

            </div>

            {/* ===== SECOND ROW ===== */}
            <div className="row innerdivrow">

              <div className="col-sm-4">
                <div className="form-group">
                  <label className="label">
                    Email Id<font color="red">*</font>
                  </label>
                  <input
  type="email"
  className="form-control inputbox"
  value={consultantDetails.emailId}
  onChange={(e) =>
    handleConsultantChange("emailId", e.target.value)
  }
  placeholder="Email"
/>

                </div>
              </div>

              <div className="col-sm-8">
                <div className="form-group">
                  <label className="label">
                    Full Address for communication<font color="red">*</font>
                  </label>
                  <textarea
  rows="2"
  className="form-control inputbox"
  value={consultantDetails.address}
  onChange={(e) =>
    handleConsultantChange("address", e.target.value)
  }
  placeholder="Full Address for communication"
/>

                </div>
              </div>

            </div>

          </div>
        </div>

          <div className="note-section">
            <label className="note-label">
              Note: If encountered any issue during upload of documents, please contact APRERA IT Support Team.
            </label>
          </div>

            {/* Declaration */}
          <div className="declaration-section">

            <div className="section-header">
              <h3 className="subheading">Declaration</h3>
            </div>

            <div className="declaration-content">

              <div className="declaration-inline">

               <input 
  type="checkbox" 
  className="declaration-checkbox"
  checked={declaration.checked}
  onChange={() => handleDeclarationChange('checked')}
/>


                <span className="declaration-prefix">I/We</span>

                <input 
  type="text" 
  className="declaration-name-input"
  value={declaration.name}
  onChange={(e) =>
    setDeclaration(prev => ({ ...prev, name: e.target.value }))
  }
/>


                <span className="declaration-text">
                  solemnly affirm and declare that the particulars given above are correct to my/our knowledge and belief.
                </span>

              </div>

            </div>

          </div>

                    {/* Additional Notes */}
          <div id="Div2" className="additional-notes-section">

            <div className="section-header">
              <h3 className="subheading">Note</h3>
            </div>

            <div className="notes-content">

              <div className="note-item">
                <input
                  type="checkbox"
                  id="chkNote1"
                  checked={declaration.note1}
                  onChange={() => handleDeclarationChange('note1')}
                  className="note-checkbox"
                />

                <label htmlFor="chkNote1" className="note-text1">
                  1. The applicability of the Penalty/additional fee may be imposed, if any, provision of the act is violated, as determined by the Authority, as the case may be.
                </label>
              </div>

              <div className="note-item">
                <input
                  type="checkbox"
                  id="chkNote2"
                  checked={declaration.note2}
                  onChange={() => handleDeclarationChange('note2')}
                  className="note-checkbox"
                />

                <label htmlFor="chkNote2" className="note-text1">
                  2. As per section 4 of the RERA Act, 2016, you are hereby directed to address the shortfalls within 15 days as addressed by the Authority, failing which the application may be rejected as per Section 4 of the Act.
                </label>
              </div>

            </div>
          </div>


          <div className="form-actions">
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );  
};

export default UploadDocumentsWithApi;