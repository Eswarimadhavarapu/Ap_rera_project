import React, {
  useEffect,
  useState,
} from "react";

import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  getComplaints,
} from "../../api/api";

import LegalSidebar from "./LegalSidebar";
import LegalHeader from "./LegalHeader";

import "../../styles/legal.css";

const LegalDashboard = () => {

  const [complaints, setComplaints] =
    useState([]);

  const loadComplaints = async () => {

    try {

      const response =
        await getComplaints();

      setComplaints(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const totalComplaints =
    complaints.length;

  const pendingComplaints =
    complaints.filter(
      (c) =>
        c.status === "pending" ||
        c.status === "open"
    ).length;

  const approvedComplaints =
    complaints.filter(
      (c) =>
        c.status === "CASE_REGISTERED"
    ).length;

  const rejectedComplaints =
    complaints.filter(
      (c) =>
        c.status === "rejected"
    ).length;

  return (

    <div className="legal-page">

      {/* HEADER */}

      <LegalHeader />

      {/* BODY */}

      <div className="legal-body">

        {/* SIDEBAR */}

        <LegalSidebar />

        {/* CONTENT */}

        <div className="legal-content">

          <h1 className="legal-dashboard-heading">
            Dashboard Overview
          </h1>

          <div className="row g-4">

            {/* TOTAL */}

            <div className="col-md-6 col-xl-4">

              <div className="legal-dashboard-card">

                <div className="legal-card-top">

                  <h5 className="legal-card-title">
                    Total Complaints
                  </h5>

                  <FileText
                    size={32}
                    className="legal-card-icon"
                  />

                </div>

                <h1 className="legal-card-count">
                  {totalComplaints}
                </h1>

              </div>

            </div>

            {/* PENDING */}

            <div className="col-md-6 col-xl-4">

              <div className="legal-dashboard-card">

                <div className="legal-card-top">

                  <h5 className="legal-card-title">
                    Pending Complaints
                  </h5>

                  <Clock
                    size={32}
                    className="legal-card-icon"
                  />

                </div>

                <h1 className="legal-card-count">
                  {pendingComplaints}
                </h1>

              </div>

            </div>

            {/* APPROVED */}

            <div className="col-md-6 col-xl-4">

              <div className="legal-dashboard-card">

                <div className="legal-card-top">

                  <h5 className="legal-card-title">
                    Approved Complaints
                  </h5>

                  <CheckCircle
                    size={32}
                    className="legal-card-icon"
                  />

                </div>

                <h1 className="legal-card-count">
                  {approvedComplaints}
                </h1>

              </div>

            </div>

            {/* REJECTED */}

            <div className="col-md-6 col-xl-4">

              <div className="legal-dashboard-card">

                <div className="legal-card-top">

                  <h5 className="legal-card-title">
                    Rejected Complaints
                  </h5>

                  <XCircle
                    size={32}
                    className="legal-card-icon"
                  />

                </div>

                <h1 className="legal-card-count">
                  {rejectedComplaints}
                </h1>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default LegalDashboard;