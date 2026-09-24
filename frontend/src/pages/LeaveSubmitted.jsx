import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../styles/Layout";
import "./LeaveSubmitted.css";

const formatDateValue = (value) => {
  if (!value) return "";

  const dateObject = new Date(value);
  if (Number.isNaN(dateObject.getTime())) return value;

  return dateObject.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "Not available";

  const dateObject = new Date(value);
  if (Number.isNaN(dateObject.getTime())) return value;

  return dateObject.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LeaveSubmitted = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const leaveRequest = location.state?.leaveRequest || null;
  const leaveData = location.state || {};

  const leaveType = leaveRequest?.leave_type_name || leaveData.leaveType || "Leave";
  const fromDate = leaveRequest?.start_date ? formatDateValue(leaveRequest.start_date) : leaveData.fromDate || "";
  const toDate = leaveRequest?.end_date ? formatDateValue(leaveRequest.end_date) : leaveData.toDate || "";
  const duration = leaveRequest?.total_days
    ? `${Number(leaveRequest.total_days)} ${Number(leaveRequest.total_days) === 1 ? "Day" : "Days"}`
    : leaveData.duration || "";
  const appliedOn = leaveRequest?.created_at ? formatDateTime(leaveRequest.created_at) : leaveData.appliedOn || "Not available";
  const status = leaveRequest?.status || leaveData.status || "Pending";

  const handleViewDetails = () => {
    navigate("/leave-details", {
      state: {
        ...leaveData,
        leaveRequest,
      },
    });
  };

  const handleBackToDashboard = () => {
    navigate("/employee-dashboard");
  };

  return (
    <Layout>
      <div className="leave-submitted-page">
        <div className="leave-submitted-success-icon">
          <svg
            className="leave-submitted-check-icon"
            width="72.06"
            height="72.02"
            viewBox="0 0 72.06 72.02"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="36.03" cy="36.01" r="36.01" fill="#218257" />
            <path
              d="M16 36.5L29.5 50L57 22"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="leave-submitted-title">Leave Request Submitted!</h1>

        <p className="leave-submitted-description">
          Your Leave request has been Submitted Successfully.
          <br />
          You will be notified once it is reviewed.
        </p>

        <div className="leave-submitted-card">
          <div className="leave-submitted-row">
            <span className="leave-submitted-label">Leave Type</span>
            <span className="leave-submitted-value">{leaveType}</span>
          </div>

          <div className="leave-submitted-row">
            <span className="leave-submitted-label">From Date</span>
            <span className="leave-submitted-value">{fromDate}</span>
          </div>

          <div className="leave-submitted-row">
            <span className="leave-submitted-label">To Date</span>
            <span className="leave-submitted-value">{toDate}</span>
          </div>

          <div className="leave-submitted-row">
            <span className="leave-submitted-label">Duration</span>
            <span className="leave-submitted-value">{duration}</span>
          </div>

          <div className="leave-submitted-row">
            <span className="leave-submitted-label">Applied On</span>
            <span className="leave-submitted-value">{appliedOn}</span>
          </div>

          <div className="leave-submitted-row leave-submitted-status-row">
            <span className="leave-submitted-label">Status</span>
            <span className="leave-submitted-status">{status}</span>
          </div>
        </div>

        <div className="leave-submitted-actions">
          <button type="button" className="leave-submitted-view-button" onClick={handleViewDetails}>
            View Leave Details
          </button>

          <button type="button" className="leave-submitted-dashboard-button" onClick={handleBackToDashboard}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveSubmitted;