import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/RTI/RtiPaymentPage.css";

const RtiPaymentPage = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [selectedBank, setSelectedBank] =
  useState("HDFC");

  const {
    formData,
    userData,
    documents,
  } = location.state || {};

  // =========================================
  // PAYMENT DATA
  // =========================================

  const paymentData = {

    payment_transaction_id:
      "TXN" + Date.now(),

    payment_order_id:
      "ORD" + Date.now(),

    payment_amount: "10",

    // Hidden fields for backend only

    payment_status: "SUCCESS",

    payment_mode: "UPI",

    bank_name: selectedBank,

    receipt_number:
      "REC" + Date.now(),

    gateway_response:
      "Payment Successful",

    transaction_message:
      "Transaction completed",
  };

  const [loading, setLoading] =
    useState(false);

  const handlePayment = async () => {

    try {

      setLoading(true);

      const apiFormData =
        new FormData();

      // =====================================
      // APPLICATION DETAILS
      // =====================================

      apiFormData.append(
        "application_type",
        "RTI"
      );

      apiFormData.append(
        "applicant_name",
        formData?.name || ""
      );

      apiFormData.append(
        "gender",
        formData?.gender || ""
      );

      apiFormData.append(
        "address_line1",
        formData?.address || ""
      );

      apiFormData.append(
        "address_line2",
        ""
      );

      apiFormData.append(
        "pincode",
        formData?.pincode || ""
      );

      apiFormData.append(
        "locality_type",
        formData?.location || ""
      );

      apiFormData.append(
        "education_status",
        formData?.education || ""
      );

      apiFormData.append(
        "phone_number",
        userData?.mobile || ""
      );

      apiFormData.append(
        "alter_mobile_number",
        formData?.alternativeMobile || ""
      );

      apiFormData.append(
        "email_id",
        userData?.email || ""
      );

      apiFormData.append(
        "citizenship",
        formData?.citizenship || ""
      );

      apiFormData.append(
        "mode_of_information",
        formData?.infoMode || ""
      );

      apiFormData.append(
        "below_poverty_line",
        formData?.bpl || "No"
      );

      apiFormData.append(
        "subject",
        "RTI Request"
      );

      apiFormData.append(
        "rti_request_text",
        formData?.requestDetails || ""
      );

      // =====================================
      // PAYMENT DETAILS
      // =====================================

      Object.entries(paymentData).forEach(
        ([key, value]) => {

          apiFormData.append(
            key,
            value
          );
        }
      );

      // =====================================
      // DOCUMENTS
      // =====================================

      documents?.forEach((doc) => {

        if (doc.file) {

          apiFormData.append(
            "documents",
            doc.file
          );
        }
      });

      // =====================================
      // API CALL
      // =====================================

      const response = await fetch(
        "https://n7vxv3pg-8081.inc1.devtunnels.ms/api/rti/create",
        {
          method: "POST",
          body: apiFormData,
        }
      );

      const result =
        await response.json();

      if (response.ok) {

        alert(
          "RTI Submitted Successfully"
        );


      } else {

        alert(
          result.message ||
          "Submission Failed"
        );
      }

    } catch (error) {

      console.error(error);

      alert("Something went wrong");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="rti-payment-wrapper">

      <div className="rti-payment-container">

        {/* HEADER */}

        <div className="rti-payment-header">

          <h2>
            Payment Details
          </h2>

        </div>

        {/* TOP DETAILS */}

        <div className="rti-payment-top-details">

          <div className="rti-payment-left-details">

            

            <p>

              <strong>
                Transaction Id :
              </strong>

              {" "}

              {
                paymentData
                  .payment_transaction_id
              }

            </p>

            <p>

              <strong>
                APRERA GST No. :
              </strong>

              {" "}

              37AAAGA0918EZY

            </p>

          </div>

          <div className="rti-payment-right-details">

            <p>

              <strong>
                Date :
              </strong>

              {" "}

              {
                new Date()
                  .toLocaleDateString()
              }

            </p>

          </div>

        </div>

        {/* TABLE */}

        <div className="rti-payment-table-container">

          <table className="rti-payment-table">

            <tbody>

              <tr>
                <td>Name</td>

                <td>
                  {formData?.name}
                </td>
              </tr>

              <tr>
                <td>
                  Mobile No.
                </td>

                <td>
                  {userData?.mobile}
                </td>
              </tr>

              <tr>
                <td>
                  Payment For
                </td>

                <td>
                  RTI Application Fee
                </td>
              </tr>

              <tr>
                <td>
                  Transaction Id
                </td>

                <td>
                  {
                    paymentData
                      .payment_transaction_id
                  }
                </td>
              </tr>

              <tr>
                <td>
                  Amount
                </td>

                <td>
                  ₹
                  {
                    paymentData
                      .payment_amount
                  }
                  .00
                </td>
              </tr>

            </tbody>

          </table>

        </div>

        {/* TOTAL */}

        <div className="rti-payment-total-section">

          <span>
            Total Amount
          </span>

          <span>

            ₹
            {
              paymentData
                .payment_amount
            }
            .00

          </span>

        </div>

        {/* BUTTON */}

       {/* BUTTON + BANK SELECT */}

<div className="rti-payment-btn-container">

  {/* LEFT SIDE BANK SELECT */}

  <div className="rti-bank-select-wrapper">

    <label>
      Select Bank
    </label>

    <select
      value={selectedBank}
      onChange={(e) =>
        setSelectedBank(
          e.target.value
        )
      }
      className="rti-bank-select"
    >

      <option value="HDFC">
        HDFC
      </option>

      <option value="AXIS">
        AXIS
      </option>

      <option value="SBI">
        SBI
      </option>

    </select>

  </div>

  {/* RIGHT SIDE BUTTON */}

  <button
    className="rti-payment-proceed-btn"
    onClick={handlePayment}
    disabled={loading}
  >

    {
      loading
        ? "Processing..."
        : "Proceed To Pay"
    }

  </button>

</div>

      </div>

    </div>
  );
};

export default RtiPaymentPage;