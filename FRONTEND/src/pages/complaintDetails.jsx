import React, { useState } from "react";

const ComplaintDetails = ({ setCurrentStep }) => {
  const [complaintAgainst, setComplaintAgainst] = useState("");
  const [isRegistered, setIsRegistered] = useState("");

  // Supporting documents state
  const [docDesc, setDocDesc] = useState("");
  const [docFile, setDocFile] = useState(null);
  const [documents, setDocuments] = useState([]);

  /* ================= ADD DOCUMENT ================= */
  const handleAddDocument = () => {
    if (!docDesc || !docFile) {
      alert("Please enter document description and upload file");
      return;
    }

    const newDoc = {
      id: Date.now(),
      description: docDesc,
      file: docFile,
    };

    setDocuments((prev) => [...prev, newDoc]);
    setDocDesc("");
    setDocFile(null);
  };

  /* ================= DELETE DOCUMENT ================= */
  const handleDelete = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <>
      <h3 className="subheading">Complaint Details</h3>

      {/* ================= COMPLAINT AGAINST ================= */}
      <div className="row">
        <div className="col">
          <label>
            Complaint Against <span className="required">*</span>
          </label>
          <select
            value={complaintAgainst}
            onChange={(e) => setComplaintAgainst(e.target.value)}
          >
            <option value="">Select</option>
            <option value="agent">Agent</option>
            <option value="allottee">Allottee</option>
            <option value="promoter">Promoter</option>
          </select>
        </div>

        <div className="col">
          <label>
            Complaint By <span className="required">*</span>
          </label>
          <select>
            <option value="">Select</option>
            <option>Complainant</option>
          </select>
        </div>
      </div>

      {/* ================= AGENT / PROMOTER ================= */}
      {(complaintAgainst === "agent" || complaintAgainst === "promoter") && (
        <>
          <h4 className="subheading">Details Of The Respondent</h4>

          <div className="row">
            <div className="col">
              <label>Is He/She Registered with AP RERA?</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="registered"
                    onChange={() => setIsRegistered("yes")}
                  />{" "}
                  Yes
                </label>
                &nbsp;&nbsp;
                <label>
                  <input
                    type="radio"
                    name="registered"
                    onChange={() => setIsRegistered("no")}
                  />{" "}
                  No
                </label>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= ALLOTTEE ================= */}
      {complaintAgainst === "allottee" && (
        <>
          <h4 className="subheading">Details Of The Respondent</h4>

          <div className="row">
            <div className="col">
              <label>Project Name *</label>
              <input type="text" />
            </div>

            <div className="col">
              <label>Name *</label>
              <input type="text" />
            </div>

            <div className="col">
              <label>Mobile No *</label>
              <input type="text" />
            </div>
          </div>
        </>
      )}

      {/* ================= DETAILS OF COMPLAINT ================= */}
      <h4 className="subheading">Details Of The Complaint</h4>

      <div className="row">
        <div className="col">
          <label>Subject of Complaint *</label>
          <input type="text" />
        </div>

        <div className="col">
          <label>Relief Sought from APRERA *</label>
          <input type="text" />
        </div>

        <div className="col">
          <label>Upload Agreement for Sale *</label>
          <input type="file" />
        </div>
      </div>

      {/* ================= SUPPORTING DOCUMENTS ================= */}
      <h4 className="subheading">Supporting Documents</h4>

      <div className="row">
        <div className="col">
          <label>Document Description</label>
          <input
            type="text"
            value={docDesc}
            onChange={(e) => setDocDesc(e.target.value)}
            placeholder="Document Description"
          />
        </div>

        <div className="col">
          <label>Upload Document</label>
          <input
            type="file"
            onChange={(e) => setDocFile(e.target.files[0])}
          />
        </div>

        <div className="col" style={{ alignSelf: "flex-end" }}>
          <button className="proceed-btn" onClick={handleAddDocument}>
            Add
          </button>
        </div>
      </div>

      {/* ================= DOCUMENT TABLE ================= */}
      {documents.length > 0 && (
        <table className="doc-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Document Description</th>
              <th>Uploaded Document</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={doc.id}>
                <td>{index + 1}</td>
                <td>{doc.description}</td>
                <td>
                  <a href={URL.createObjectURL(doc.file)} target="_blank" rel="noreferrer">
                    View
                  </a>
                </td>
                <td>
                  <button
                    className="proceed-btn"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= DECLARATION ================= */}
      <h4 className="subheading">Declaration</h4>

      <div className="declaration-box">
        <label>
          <input type="checkbox" /> I hereby declare that the complaint mentioned
          above is not pending before any court or tribunal.
        </label>
      </div>

      <div className="declaration-box">
        <label>
          <input type="checkbox" /> I declare that the above information is true
          to the best of my knowledge.
        </label>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="cr-footer">
        <button
          className="proceed-btn"
          onClick={() => setCurrentStep(4)}
        >
          Save And Continue
        </button>
      </div>
    </>
  );
};

export default ComplaintDetails;