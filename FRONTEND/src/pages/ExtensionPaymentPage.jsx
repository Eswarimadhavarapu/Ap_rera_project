import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ExtensionPaymentPage.css";
import { createProjectExtension } from "../api/api";

const ExtensionPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive project data and uploaded files
  const projectData = location.state?.projectData;
  const files = location.state?.files || {};

  if (!projectData) {
    return <p>No Payment Data Found</p>;
  }

  const todayDate = new Date().toLocaleDateString("en-GB");

  const paymentDateForBackend = new Date()
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);

  const [transactionId] = useState(() => "TXN" + Date.now());

  const [selectedBank, setSelectedBank] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMakePayment = () => {
    setTimeout(() => {
      setShowSuccessPopup(true);
    }, 500);
  };

  const closePopup = async () => {
    setIsSubmitting(true);

    try {
      const payload = new FormData();

      // Project Details
      payload.append(
        "application_number",
        projectData.application_number || ""
      );

      payload.append(
        "project_id",
        projectData.project_id || ""
      );

      payload.append(
        "project_name",
        projectData.project_name || ""
      );

      payload.append(
        "promoter_email",
        projectData.promoter_email || ""
      );

      payload.append(
        "promoter_pan",
        projectData.promoter_pan || ""
      );

      payload.append(
        "project_district",
        projectData.project_district || ""
      );

      payload.append(
        "validity_from",
        projectData.validity_from || ""
      );

      payload.append(
        "validity_to",
        projectData.validity_to || ""
      );

      payload.append(
        "new_validity_from",
        projectData.new_validity_from || ""
      );

      payload.append(
        "new_validity_to",
        projectData.new_validity_to || ""
      );

      payload.append(
        "created_by",
        projectData.created_by || ""
      );

      // Required Documents
      if (files.representation_letter) {
        payload.append(
          "representation_letter",
          files.representation_letter
        );
      }

      if (files.form_b) {
        payload.append(
          "form_b",
          files.form_b
        );
      }

      if (files.consent_letter) {
        payload.append(
          "consent_letter",
          files.consent_letter
        );
      }

      if (files.form_e) {
        payload.append(
          "form_e",
          files.form_e
        );
      }

      if (files.form_p4) {
        payload.append(
          "form_p4",
          files.form_p4
        );
      }

      if (files.extension_proceeding) {
        payload.append(
          "extension_proceeding",
          files.extension_proceeding
        );
      }

      if (files.form_1) {
        payload.append(
          "form_1",
          files.form_1
        );
      }

      if (files.form_2) {
        payload.append(
          "form_2",
          files.form_2
        );
      }

      if (files.form_3) {
        payload.append(
          "form_3",
          files.form_3
        );
      }

      // Payment Details
      payload.append(
        "payment_status",
        "SUCCESS"
      );

      payload.append(
        "payment_amount",
        "1000.00"
      );

      payload.append(
        "transaction_id",
        transactionId
      );

      payload.append(
        "payment_reference_no",
        transactionId
      );

      payload.append(
        "payment_mode",
        "ONLINE"
      );

      payload.append(
        "bank_name",
        selectedBank
      );

      payload.append(
        "payment_date",
        paymentDateForBackend
      );

      payload.append(
        "gateway_response",
        "PAYMENT_SUCCESS"
      );

      payload.append(
        "current_stage",
        "SUBMITTED"
      );

      payload.append(
        "application_status",
        "PENDING"
      );

      console.log("Submitting Project Extension");

      const response = await createProjectExtension(payload);

      console.log(
        "Project Extension Saved Successfully",
        response
      );

      alert(
        "Payment Successful and Application Submitted Successfully"
      );

      navigate("/home");
    } catch (error) {
      console.error(
        "Project Extension Save Error:",
        error
      );

      alert(
        "Payment successful but application save failed.\n\n" +
          error.message
      );
    } finally {
      setShowSuccessPopup(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="epp-payment-container">
      <h2 className="epp-page-title">
        Payment In Process
      </h2>

      <div className="epp-payment-box">
        <div className="epp-payment-header">
          Payment Details
        </div>

        <div className="epp-payment-top">
          <div>
            <p>
              <strong>Application Number :</strong>{" "}
              {projectData.application_number}
            </p>

            <p>
              <strong>Transaction Id :</strong>{" "}
              {transactionId}
            </p>

            <p>
              <strong>APRERA GST No :</strong>
              {" "}37AAAGA0918E1ZY
            </p>
          </div>

          <div className="epp-payment-date">
            <p>
              <strong>Date :</strong> {todayDate}
            </p>
          </div>
        </div>

        <table className="epp-payment-table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{projectData.promoter_name}</td>
            </tr>

            <tr>
              <td>Mobile No.</td>
              <td>{projectData.promoter_mobile}</td>
            </tr>

            <tr>
              <td>Payment For</td>
              <td>Project Extension</td>
            </tr>

            <tr>
              <td>
                <strong>
                  Registration Amount
                </strong>
              </td>
              <td>
                <strong>₹ 1000.00</strong>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="epp-gateway-section">
          <div className="epp-gateway-options">
            <p>
              <strong>
                Select Payment Gateway :
              </strong>
            </p>

            <label>
              <input
                type="radio"
                name="bank"
                onChange={() =>
                  setSelectedBank("ICICI")
                }
              />
              ICICI BANK
            </label>

            <label>
              <input
                type="radio"
                name="bank"
                onChange={() =>
                  setSelectedBank("AXIS")
                }
              />
              AXIS BANK
            </label>

            <label>
              <input
                type="radio"
                name="bank"
                onChange={() =>
                  setSelectedBank("HDFC")
                }
              />
              HDFC BANK
            </label>
          </div>

          <div className="epp-total-amount">
            Total Amount ₹ 1000.00
          </div>
        </div>

        {selectedBank && (
          <div className="epp-payment-action-box">
            <p>
              You have selected{" "}
              <strong>
                {selectedBank} BANK
              </strong>
            </p>

            <div className="epp-payment-buttons">
              <button
                className="epp-pay-btn"
                onClick={handleMakePayment}
              >
                Make Payment
              </button>

              <button
                className="epp-cancel-btn"
                onClick={() =>
                  setSelectedBank("")
                }
              >
                Cancel Payment
              </button>
            </div>
          </div>
        )}
      </div>

      {showSuccessPopup && (
        <div className="epp-payment-popup">
          <div className="epp-payment-popup-box success">
            <h3>Payment Successful</h3>

            <p>
              Your payment has been completed
              successfully.
            </p>

            <button
              className="epp-pay-btn"
              onClick={closePopup}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : "OK"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtensionPaymentPage;