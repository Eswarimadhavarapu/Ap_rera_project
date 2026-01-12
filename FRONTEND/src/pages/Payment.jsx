import "../styles/Payment.css";

const Payment = () => {
  return (
   
      <div className="payment-main-container">

        {/* ===== BREADCRUMB ===== */}
        <div className="payment-breadcrumb-bar">
          You are here :
          <span className="payment-breadcrumb-link"> Home </span> /
          <span className="payment-breadcrumb-link"> Payment Page </span>
        </div>

        <div className="payment-content-padding">

          {/* TITLE */}
          <h2 className="payment-page-title">Payment Page</h2>

          {/* CENTER PAYMENT BOX */}
          <div className="payment-center-box">

            {/* HEADER */}
            <div className="payment-box-header">
              Payment Details
            </div>

            {/* TOP DETAILS */}
            <div className="payment-top">
              <div>
                <p><b>Application Number :</b> </p>
                <p><b>Transaction Id :</b> </p>
                <p><b>APRERA GST No. :</b> </p>
              </div>

              <div className="payment-date">
                <p><b>Date :</b> </p>
              </div>
            </div>

            {/* DETAILS TABLE */}
            <table className="payment-table">
              <tbody>
                <tr>
                  <td>Name</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Firm GST No.</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mobile No.</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Payment For</td>
                  <td>Agent Registration Fee</td>
                </tr>
                <tr>
                  <td>Registration Amount</td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            {/* TOTAL AMOUNT */}
            <div className="payment-amount">
              <b>Total Amount</b>
              <span>₹ 10000.00</span>
            </div>

            {/* GATEWAY */}
            <div className="payment-gateway">
              <p><b>Select Payment Gateway:</b></p>

              <label>
                <input type="radio" name="bank" /> ICICI BANK
              </label>

              <label>
                <input type="radio" name="bank" /> AXIS BANK
              </label>
            </div>

            {/* BUTTON */}
            <div className="payment-btn-row">
              <button className="payment-btn">
                Proceed To Pay
              </button>
            </div>

          </div>
        </div>
      </div>
  
  );
};

export default Payment;