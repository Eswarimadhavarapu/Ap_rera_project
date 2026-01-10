import React from "react";

const LegalDeclaration = ({ formData, handleInputChange }) => {
  return (
    <div className="form-section">
      <div className="row innerdivrow">
        <div className="col-sm-12">
          <input
            type="checkbox"
            name="legalDeclarationAccepted"
            checked={formData.legalDeclarationAccepted}
            onChange={handleInputChange}
            required
          />
          <label className="label" style={{ marginLeft: "8px" }}>
            The Authority is at a liberty to initiate legal action on the said
            project, if the above stated facts in the table is false.
          </label>
        </div>
      </div>
    </div>
  );
};

export default LegalDeclaration;
