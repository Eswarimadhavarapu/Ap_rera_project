import React from "react";
import "../styles/formsdownload.css";
import application from"../assets/images/application.pdf";
import application1 from"../assets/images/application1.pdf";
import Withdraw from"../assets/images/Withdraw.pdf";
import ChangeForm from"../assets/images/ChangeForm.pdf";
// import FlatDetails from"../../public/excel/FlatDetails.xlsx";
// import VillaDetailsTemplate"../../public/excel/VillaDetailsTemplate.xlsx";
// import PlotDetails from"../../public/excel/ PlotDetails.xlsx";


const formsData = [
  { category: "Project", code: "P1", subject: "Web Application Format for Project Individual Registration",
    file: application,
   },
  { category: "Project", code: "P2", subject: "Web Application for Project Other-than Individual Registration", 
    file: application1,
   },
  { category: "Project", code: "P3", subject: "Withdrawal Form - Web Application format for Withdrawal",
    file: Withdraw,
   },
  {category:  "Project", code: "P4", subject: "CR Form - Web Application format for Change Requests",
    file: ChangeForm,
   },
  {category:  "Project", code: "P5", subject: "Area Details of Appartments",
    file: "../../public/excel/FlatDetails.xlsx",
   },
  {category:  "Project", code: "P6", subject: "Area Details of Villas",
    file: "../../public/excel/VillaDetailsTemplate.xlsx" ,
   },
   {category:  "Project", code: "P7", subject: "Area Details of Plots", },

		


  { category: "Agent", code: "A1", subject: "Web Application for Agent Individual" },
  { category: "Agent", code: "A2", subject: "Web Application for Agent Other-than Individual" },
  { category: "Agent", code: "A3", subject: "Sample Affidavit(on Rs.20 non judicial stamp paper) - To be submitted by the Agent if the IT Returns are not applicable" },		
  { category: "Agent", code: "A4", subject: "No Litigations Affidavit(on Rs.20 non judicial stamp paper) Cum Declaration" },
  { category: "Agent", code: "A5", subject: "Documents Checklist" },


  { category: "Complaint", code: "C1", subject: "Web Application for Complaint Registration" },

  { category: "Architect Certificate", code: "F1B", subject: "For Buildings – Registration of Ongoing Project" },
  { category: "Architect Certificate", code: "F1L", subject: "For Layouts – Registration of Ongoing Project" },
  { category: "Form 5", code: "F5", subject: "Annual Report on statement of accounts by CA/Auditor", Annual: "Report on statement of accounts by CA/Auditor" },
  { category: "Form 6", code: "F6", subject: "Affidavit on structural Defects" },
  { category: "Form 7", code: "F7", subject: "Affidavit-Unsold flats" },
  { category: "Form E", code: "F8", subject: "Application For Extension Of Registration Of Project" },


  { category: "Form 8 - Bank A/c's Forms", code: "8A", subject: "Application for Change in RERA Bank Account" },
  { category: "Form 8 - Bank A/c's Forms", code: "8B", subject: "Certificate of Account Balance from Bank with existing RERA Bank Account" },
  { category: "Form 8 - Bank A/c's Forms", code: "8C", subject: "Confirmation Letter of change in RERA Account" },
  { category: "Form 8 - Bank A/c's Forms", code: "8D", subject: "Certificate of Fund Transfer by Bank having new RERA Bank Account" },
];

const FormsDownload = () => {
  let lastCategory = "";

  return (
    <div className="forms-wrapper">
      <div className="breadcrumb">
        You are here : <span>Home</span> / <span>Registration</span> / <b>Forms Download</b>
      </div>
<div className="form">
      <h2>Forms Download</h2>

      <table className="forms-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Form Code</th>
            <th>Subject</th>
            <th>Download</th>
            <th>Sample</th>
          </tr>
        </thead>

        <tbody>
          {formsData.map((item, index) => {
            const showCategory = item.category !== lastCategory;
            lastCategory = item.category;

            return (
              <tr key={index}>
                <td className="category">{showCategory ? item.category : ""}</td>
                <td className="code">{item.code}</td>
                <td>{item.subject}</td>
                
                <td><a
                    href={item.file}
                    target="_blank"
                    
                  >
                    ⬇️
                  </a></td>
                <td className="icon"></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default FormsDownload;