import React from "react";
import "../styles/formsdownload.css";

import application from "../assets/images/application.pdf";
import application1 from "../assets/images/application1.pdf";
import Withdraw from "../assets/images/Withdraw.pdf";
import ChangeForm from "../assets/images/ChangeForm.pdf";



const formsData = [
  { category: "Project", code: "P1", subject: "Web Application Format for Project Individual Registration", file: application },
  { category: "Project", code: "P2", subject: "Web Application for Project Other-than Individual Registration", file: application1 },
  { category: "Project", code: "P3", subject: "Withdrawal Form - Web Application format for Withdrawal of Application Form", file: Withdraw },
  { category: "Project", code: "P4", subject: "CR Form - Web Application format for Change Requests", file: ChangeForm },
  { category: "Project", code: "P5", subject: "Area Details of Appartments", file: "/excel/FlatDetails.xlsx" },
  { category: "Project", code: "P6", subject: "Area Details of Villas", file: "/excel/VillaDetailsTemplate.xlsx" },
  { category: "Project", code: "P7", subject: "Area Details of Plots", file: "/excel/PlotDetails.xlsx" },
  { category: "Project", code: "P8", subject: "Area Details of Commercial", file: "/excel/CommercialDetailsTemplate.xlsx" },
  { category: "Project", code: "P9", subject: "Statement of Source of funds for construction of buildings", file: "/documents/Source.docx" },
  { category: "Project", code: "P10", subject: "No Litigations Affidavit(on Rs.20 non judicial stamp paper) Cum Declaration", file: "/documents/AffidavitForCasePending.pdf" },
  { category: "Project", code: "P11", subject: "FORM-B (on Rs.20 non judicial stamp paper)", file: "/documents/FORM_B.docx" },
  { category: "Project", code: "P12", subject: "Sample Affidavit(on Rs.20 non judicial stamp paper) - To be submitted by the Promoter if the IT Returns are not applicable", file: "/documents/PromoterSample_AFFIDAVIT.pdf" },
  { category: "Project", code: "P13", subject: "Documents Checklist", file: "/documents/Checklist-Project.pdf" },
  { category: "Project", code: "P14", subject: "Allotment Letter for Flat / Unit / Apartment to be submitted", file: "/documents/Allotment_Letter.docx" },
  { category: "Project", code: "P15", subject: "Conveyance Deed to be submitted", file: "/documents/Conveyance_Deed.docx" },
  { category: "Project", code: "P16", subject: "Estimation of Construction - To be submitted for Building", file: "/documents/Estimate_of_the_Project_Buildings.docx" },
  { category: "Project", code: "P17", subject: "Estimation of Construction - To be submitted for Layout", file: "/documents/Estimate_of_the_Project_Buildings.docx" },
  { category: "Project", code: "P18", subject: "Specifications of Constructions to be submitted", file: "/documents/Specifications_of_the_Construction.docx" },
  { category: "Project", code: "P19", subject: "Structural stability certificate to be submitted", file: "/documents/Structural_Stability_Certificate.docx" },
  { category: "Project", code: "P20", subject: "Statement of Ownership to be submitted", file: "/documents/Statement_of_Ownership.docx" },
  { category: "Project", code: "P21", subject: "Agreement for sale to be submitted", file: "/documents/Agreement_for_Sale.docx" },
  

  { category: "Agent", code: "A1", subject: "Web Application for Agent Individual", file: "/documents/A1.pdf" },
  { category: "Agent",code: "A1",subject: "Web Application for Agent Individual",file: "/documents/A1.pdf",sampleFile: "/sampledocuments/print previw(individuals).pdf" },
  { category: "Agent", code: "A2", subject: "Web Application for Agent Other-than Individual Registration", file: "/documents/A2.pdf" },
  { category: "Agent", code: "A3", subject: "Sample Affidavit(on Rs.20 non judicial stamp paper) - To be submitted by the Agent if the IT Returns are not applicable", file: "/documents/A3.pdf" },
  { category: "Agent", code: "A4", subject: "No Litigations Affidavit(on Rs.20 non judicial stamp paper) Cum Declaration", file: "/documents/A4.pdf" },
  { category: "Agent", code: "A5", subject: "Documents Checklist", file: "/documents/A5.pdf" },

  { category: "Complaint", code: "C1", subject: "Web Application for Complaint Registration", file: "/documents/Complaint Registration Ver.pdf" },
  { category: "Complaint", code: "C1", subject: "FORM M", file: "/documents/FORM M.docx" },
  { category: "Complaint", code: "C1", subject: "FORM N", file: "/documents/FORM N .docx" },

 
  { category: "Architect Certificate", code: "F1B", subject: "For Buildings - To be submitted at the time of Registration of Ongoing Project and for withdrawal of Money from Designated Account", file: "/documents/Form1_B_Word.docx" },
  { category: "Architect Certificate", code: "F1L", subject: "For Layouts - To be submitted at the time of Registration of Ongoing Project and for withdrawal of Money from Designated Account", file: "/documents/Form2_L_Word.docx" },

  { category: "Engineer Certificate", code: "F2B", subject: "For Buildings - To be submitted at the time of Registration of Ongoing Project and for withdrawal of Money from Designated Account", file: "/excel/Form2B.docx" },
  { category: "Engineer Certificate", code: "F2L", subject: "For Layouts - To be submitted at the time of Registration of Ongoing Project and for withdrawal of Money from Designated Account", file: "/excel/Form2L.docx" },

  { category: "CA Certificate", code: "F3B", subject: "For Buildings - To be submitted at the time of Registration of Ongoing Project and for withdrawal of Money from Designated Account", file: "/documents/Form3_B_Word.docx" },
  { category: "CA Certificate", code: "F3L", subject: "For Layouts - To be submitted at the time of Registration of Ongoing Project and for withdrawal of Money from Designated Account", file: "/documents/Form3_L_Word.docx" },


  { category: "Architect's Certificate", code: "F4B	", subject: "For Buildings - To be submitted on completion of each of the Building/Wing", file: "/documents/Form4_B_Word.pdf" },
  { category: "Architect's Certificate", code: "F4L	", subject: "For Layouts - To be submitted on completion of each of the Layout", file: "/documents/Form3L.pdf" },




  { category: "Form 5", code: "F5", subject: "Annual Report on statement of accounts by CA/Auditor", file: "/documents/Form5_W.docx" },
  { category: "Form 6", code: "F6", subject: "Affidavit on structural Defects", file: "/excel/Form6.pdf" },
  { category: "Form 7", code: "F7", subject: "	Affidavit-Unsold flats", file: "/documents/Affidavit_on_structural_Defects.docx" },
  { category: "Form E", code: "FE", subject: "	Application For Extension Of Registration Of Project", file: "/documents/FormE.pdf" },

  { category: "Form 8 - Bank A/c's Forms", code: "8A", subject: "Application for Change in RERA Bank Account", file: "/documents/Form 8A.pdf" },
  { category: "Form 8 - Bank A/c's Forms", code: "8B", subject: "Certificate of Account Balance from Bank with existing RERA Bank Account", file: "/documents/Form 8B.pdf" },
  { category: "Form 8 - Bank A/c's Forms", code: "8C", subject: "	Confirmation Letter of change in RERA Account", file: "/documents/Form 8C.pdf" },
  { category: "Form 8 - Bank A/c's Forms", code: "8D", subject: "	Certificate of Fund Transfer by Bank having new RERA Bank Account", file: "/documents/Form 8D.pdf" },
];

const categoryCounts = formsData.reduce((acc, cur) => {
  acc[cur.category] = (acc[cur.category] || 0) + 1;
  return acc;
}, {});

const FormsDownload = () => {
  return (
    <div className="forms-wrapper">
      <div className="breadcrumb">
        You are here : <span>Home</span> / <span>Registration</span> / <b>Forms Download</b>
      </div>

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
            const isFirst =
              index === 0 || formsData[index - 1].category !== item.category;

            return (
              <tr key={index}>
                {isFirst && (
                  <td className="category" rowSpan={categoryCounts[item.category]}>
                    {item.category}
                  </td>
                )}

                <td className="code">{item.code}</td>
                <td>{item.subject}</td>

                {/* DIRECT OPEN */}
                <td className="icon">
                  {item.file && (
                    <a
                      href={item.file}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "20px" }}
                    >
                      <i className="fa fa-download" aria-hidden="true"></i>
                    </a>
                  )}
                </td>

                <td className="icon"></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FormsDownload;