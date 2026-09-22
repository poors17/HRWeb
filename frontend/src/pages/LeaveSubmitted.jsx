import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../styles/Layout";
import "./LeaveSubmitted.css";

const LeaveSubmitted = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data received from Apply Leave page
  const leaveData = location.state || {};

  const leaveType = leaveData.leaveType || "Casual Leave";
  const fromDate = leaveData.fromDate || "18 Nov 2026";
  const toDate = leaveData.toDate || "19 Nov 2026";
  const duration = leaveData.duration || "2 Days";
  const appliedOn = leaveData.appliedOn || "17 Sep 2026, 10:32 AM";
  const status = leaveData.status || "Pending Approval";

  // View Leave Details
  const handleViewDetails = () => {
    navigate("/leave-details", {
      state: leaveData,
    });
  };

  // Back to Employee Dashboard
  const handleBackToDashboard = () => {
    navigate("/employee-dashboard");
  };

  return (
    <Layout>

      <div className="leave-submitted-page">

        {/* =====================================================
            SUCCESS ICON
        ====================================================== */}

       <div className="leave-submitted-success-icon">

  <svg
    className="leave-submitted-check-icon"
    width="72.06"
    height="72.02"
    viewBox="0 0 72.06 72.02"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Green inner circle */}
    <circle
      cx="36.03"
      cy="36.01"
      r="36.01"
      fill="#218257"
    />

    {/* White check mark */}
    <path
      d="M16 36.5L29.5 50L57 22"
      stroke="#FFFFFF"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

</div>


        {/* =====================================================
            SUCCESS TITLE
        ====================================================== */}

        <h1 className="leave-submitted-title">
          Leave Request Submitted!
        </h1>


        {/* =====================================================
            SUCCESS DESCRIPTION
        ====================================================== */}

        <p className="leave-submitted-description">
          Your Leave request has been Submitted Successfully.
          <br />
          You will be notified once it is reviewed.
        </p>


        {/* =====================================================
            LEAVE DETAILS CARD
        ====================================================== */}

        <div className="leave-submitted-card">

          {/* LEAVE TYPE */}
          <div className="leave-submitted-row">

            <span className="leave-submitted-label">
              Leave Type
            </span>

            <span className="leave-submitted-value">
              {leaveType}
            </span>

          </div>


          {/* FROM DATE */}
          <div className="leave-submitted-row">

            <span className="leave-submitted-label">
              From Date
            </span>

            <span className="leave-submitted-value">
              {fromDate}
            </span>

          </div>


          {/* TO DATE */}
          <div className="leave-submitted-row">

            <span className="leave-submitted-label">
              To Date
            </span>

            <span className="leave-submitted-value">
              {toDate}
            </span>

          </div>


          {/* DURATION */}
          <div className="leave-submitted-row">

            <span className="leave-submitted-label">
              Duration
            </span>

            <span className="leave-submitted-value">
              {duration}
            </span>

          </div>


          {/* APPLIED ON */}
         <div className="leave-submitted-row">

  <span className="leave-submitted-label">
    Applied On
  </span>

  <span className="leave-submitted-value leave-submitted-applied-on">
    {appliedOn}
  </span>

</div>


          {/* STATUS */}
          <div className="leave-submitted-row leave-submitted-status-row">

            <span className="leave-submitted-label">
              Status
            </span>

            <span className="leave-submitted-status">
              {status}
            </span>

          </div>

        </div>


        {/* =====================================================
            ACTION BUTTONS
        ====================================================== */}

        <div className="leave-submitted-actions">

          {/* VIEW LEAVE DETAILS */}
          <button
            type="button"
            className="leave-submitted-view-button"
            onClick={handleViewDetails}
          >
            View Leave Details
          </button>


          {/* BACK TO DASHBOARD */}
          <button
            type="button"
            className="leave-submitted-dashboard-button"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    </Layout>
  );
};

export default LeaveSubmitted;