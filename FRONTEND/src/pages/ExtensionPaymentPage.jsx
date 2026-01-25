import { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ ADD
import "../styles/ExtensionPaymentPage.css";

const ExtensionPaymentPage = () => {
  const navigate = useNavigate();                // ✅ ADD
  const [selectedBank, setSelectedBank] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleMakePayment = () => {
    // simulate payment success
    setTimeout(() => {
      setShowSuccessPopup(true);
    }, 500);
  };

  const closePopup = () => {
    setShowSuccessPopup(false);

    // ✅ OK click chesinappudu Certification Page open avutundi
    navigate("/certificate");
  };

  return (
    <div className="epp-payment-container">
      <h2 className="epp-page-title">Payment In Process</h2>

      <div className="epp-payment-box">
        <div className="epp-payment-header">Payment Details</div>

        <div className="epp-payment-top">
          <div>
            <p><strong>Application Number :</strong> 100126160721</p>
            <p><strong>Transaction Id :</strong> 3100126004</p>
            <p><strong>APRERA GST No :</strong> 37AAAGA0918E1ZY</p>
          </div>
          <div className="epp-payment-date">
            <p><strong>Date :</strong> 24/01/2026</p>
          </div>
        </div>

        <table className="epp-payment-table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Mobile No.</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Payment For</td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>Registration Amount</strong></td>
              <td><strong>₹ 1000.00</strong></td>
            </tr>
          </tbody>
        </table>

        <div className="epp-gateway-section">
          <div className="epp-gateway-options">
            <p><strong>Select Payment Gateway :</strong></p>

            <label>
              <input
                type="radio"
                name="bank"
                onChange={() => setSelectedBank("ICICI")}
              />
              ICICI BANK
            </label>

            <label>
              <input
                type="radio"
                name="bank"
                onChange={() => setSelectedBank("AXIS")}
              />
              AXIS BANK
            </label>

            <label>
              <input
                type="radio"
                name="bank"
                onChange={() => setSelectedBank("HDFC")}
              />
              HDFC BANK
            </label>
          </div>

          <div className="epp-total-amount">
            Total Amount ₹ 1000.00
          </div>
        </div>

        {/* PAYMENT ACTION BOX */}
        {selectedBank && (
          <div className="epp-payment-action-box">
            <p>
              You have selected <strong>{selectedBank} BANK</strong>
            </p>

            <div className="epp-payment-buttons">
              <button className="epp-pay-btn" onClick={handleMakePayment}>
                Make Payment
              </button>
              <button
                className="epp-cancel-btn"
                onClick={() => setSelectedBank("")}
              >
                Cancel Payment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PAYMENT SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="epp-payment-popup">
          <div className="epp-payment-popup-box success">
            <h3>Payment Successful</h3>
            <p>Your payment has been completed successfully.</p>
            <button className="epp-pay-btn" onClick={closePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtensionPaymentPage;