import { useState } from "react";
import "../styles/ComplaintStatusForm.css"

const ComplaintStatusForm = () => {
  const [formData, setFormData] = useState({
    complaintType: "",
    complaintId: "",
    captcha: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    // Call API here
    // fetchComplaintStatus(formData);
  };

  return (
    <div className="complaint-status">
  <h2 className="complaint-status__title">Complaint Status</h2>

  <form className="complaint-status__form">

    <div className="complaint-status__group complaint-status__group--row">
  <label className="complaint-status__label">
    Complaint Type
  </label>

  <select className="complaint-status__input">
    <option>-- Select Type --</option>
  </select>
</div>

  <div className="complaint-status__group complaint-status__group--row">
  <label className="complaint-status__label">
    Complaint ID
  </label>

  <input
    type="text"
    className="complaint-status__input"
  />
</div>

    <div className="complaint-status__group complaint-status__group--row">
  <label className="complaint-status__label">
    CAPTCHA
  </label>

  <div className="complaint-status__captcha-wrapper">
    <div className="complaint-status__captcha-box">
      <span className="complaint-status__captcha-text">
        A7B9X
      </span>
      <button className="complaint-status__refresh-btn">↻</button>
    </div>

    <input
      type="text"
      className="complaint-status__input"
    />
  </div>
</div>

    <button className="complaint-status__submit-btn">
      Check Status
    </button>

  </form>
</div>
  );
};

export default ComplaintStatusForm;