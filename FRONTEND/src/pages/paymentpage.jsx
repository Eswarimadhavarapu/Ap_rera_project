import React, { useState } from "react";
import "../styles/paymentpage.css";

function PaymentPage({ complaintData = {}, setCurrentStep }) {
  const [gateway, setGateway] = useState("");

  const today = new Date().toLocaleDateString("en-GB");

  const handlePayNow = () => {
    if (!gateway) {
      alert("Please select a payment gateway");
      return;
    }

    // ✅ Dummy payment success
    setCurrentStep(5);
  };

  return (
    <div className="payment-container">

      <h3 className="page-title">Payment Page</h3>

      <div className="payment-box">
        <div className="payment-header">Payment Details</div>

        <div className="payment-top">
          <div>
            <p><b>Application Number :</b> 100126160721</p>
            <p><b>Transaction Id :</b> 3100126004</p>
            <p><b>APRERA GST No :</b> 37AAAGA0918E1ZY</p>
          </div>

          <div className="date-box">
            <p><b>Date :</b> {today}</p>
          </div>
        </div>

        <table className="payment-table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{complaintData.complainantName || "-"}</td>
            </tr>
            <tr>
              <td>Mobile No.</td>
              <td>{complaintData.complainantMobile || "-"}</td>
            </tr>
            <tr>
              <td>Payment For</td>
              <td>Complaint Registration Fee</td>
            </tr>
            <tr>
              <td>Registration Amount</td>
              <td>₹ 1000.00</td>
            </tr>
          </tbody>
        </table>

        <div className="amount-box">
          <b>Total Amount :</b> ₹ 1000.00
        </div>

        <div className="gateway-section">
          <p><b>Select Payment Gateway :</b></p>

          <label>
            <input
              type="radio"
              name="gateway"
              value="ICICI"
              checked={gateway === "ICICI"}
              onChange={(e) => setGateway(e.target.value)}
            />
            ICICI BANK
          </label>

          <label>
            <input
              type="radio"
              name="gateway"
              value="AXIS"
              checked={gateway === "AXIS"}
              onChange={(e) => setGateway(e.target.value)}
            />
            AXIS BANK
          </label>

          <label>
            <input
              type="radio"
              name="gateway"
              value="HDFC"
              checked={gateway === "HDFC"}
              onChange={(e) => setGateway(e.target.value)}
            />
            HDFC BANK
          </label>
        </div>

        <div className="payment-footer">
          <button onClick={() => setCurrentStep(3)}>
            Back
          </button>
          <button className="pay-btn" onClick={handlePayNow}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;