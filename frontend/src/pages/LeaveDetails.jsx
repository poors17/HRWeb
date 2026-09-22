import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../styles/Layout";
import "./LeaveDetails.css";
import { Pencil } from "lucide-react";
import dateRangeIcon from "../assets/cards/date-range.svg";

const LeaveDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data received from Leave Submitted page
  const leaveData = location.state || {};

  const leaveType = leaveData.leaveType || "Casual Leave";
  const fromDate = leaveData.fromDate || "18 Sep 2026 (Wed)";
  const toDate = leaveData.toDate || "19 Sep 2026 (Thu)";
  const duration = leaveData.duration || "2 Days";
const attachments = [
  {
    name: "Leave_Request_Form.pdf",
    size: "245 KB",
    date: "15 sep 2026",
    url: "/documents/Leave_Request_Form.pdf",
  },
  {
    name: "HR_Document_Form.pdf",
    size: "245 KB",
    date: "15 sep 2026",
    url: "/documents/HR_Document_Form.pdf",
  },
  {
    name: "WFH_Request_Form.pdf",
    size: "245 KB",
    date: "15 sep 2026",
    url: "/documents/WFH_Request_Form.pdf",
  },
];
  return (
    <Layout>

      <div className="leave-details-page">

        {/* =====================================================
            TOP BREADCRUMB
            ===================================================== */}

        <div className="leave-details-breadcrumb">

          <button
            type="button"
            className="leave-details-back"
            onClick={() => navigate("/employee-dashboard")}
          >
            ←
          </button>

       <button
  type="button"
  className="leave-details-breadcrumb-blue"
  onClick={() => navigate("/employee-dashboard")}
>
  My Dashboard
</button>

          <span className="leave-details-breadcrumb-arrow">
            &gt;
          </span>

          <span className="leave-details-breadcrumb-current">
            Leave Details
          </span>

        </div>


        {/* =====================================================
            PAGE HEADER
            ===================================================== */}

        <div className="leave-details-header">

          <div className="leave-details-header-content">

            <h1>Leave Details</h1>

            <p>
              Complete information about the leave request, application
              details and approval status.
            </p>

          </div>


          <div className="leave-details-header-status">

            <span className="leave-id-badge">
              Leave ID: ID Number
            </span>

            <span className="approved-badge">

              <svg
                width="25"
                height="26"
                viewBox="0 0 25 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12.5"
                  cy="13"
                  r="12.5"
                  fill="#218257"
                />

                <path
                  d="M7 13L10.5 16.5L18 9"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              Approved

            </span>

          </div>

        </div>


        {/* =====================================================
            EMPLOYEE INFORMATION
            ===================================================== */}

        <div className="leave-details-employee">

          <div className="leave-details-profile">

            <div className="leave-details-avatar">
              <span>👤</span>
            </div>

            <div className="leave-details-employee-name">

              <h2>Employee Name</h2>

              <p>ID - 001010</p>

              <span>Software Engineer</span>

            </div>

          </div>


          <div className="leave-details-employee-info">

            <div>
              <small>Department</small>
              <strong>IT</strong>
            </div>

            <div>
              <small>Designation</small>
              <strong>Software Engineer</strong>
            </div>

            <div>
              <small>Reporting Manager</small>
              <strong>Ruthrasri</strong>
            </div>

            <div>
              <small>Date of Joining</small>
              <strong>12 Jun 2026</strong>
            </div>

          </div>

        </div>


        {/* =====================================================
            INFORMATION GRID
            ===================================================== */}

        <div className="leave-details-content">


          {/* ===================================================
              LEAVE INFORMATION
              =================================================== */}

          <section className="leave-details-card">

            <div className="leave-details-card-header">

              <img
                src={dateRangeIcon}
                alt="Date Range"
                className="leave-details-card-icon"
              />

              <h3>Leave information</h3>

              <button
                type="button"
                className="edit-request-button"
              >

                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="edit-request-icon"
                >

                  <path
                    d="M6.2 27.8L8.1 20.5L23.8 4.8C24.8 3.8 26.4 3.8 27.4 4.8L29.2 6.6C30.2 7.6 30.2 9.2 29.2 10.2L13.5 25.9L6.2 27.8Z"
                    fill="#1B70F5"
                  />

                  <path
                    d="M21.8 6.8L27.2 12.2"
                    stroke="#C6E8FA"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                </svg>

                <span>Edit Request</span>

              </button>

            </div>


            <div className="leave-info-list">

              <div className="leave-info-row">
                <span>Leave Type</span>

                <strong className="leave-type-blue">
                  {leaveType}
                </strong>
              </div>


              <div className="leave-info-row">
                <span>From Date</span>

                <strong>
                  {fromDate}
                </strong>
              </div>


              <div className="leave-info-row">
                <span>To Date</span>

                <strong>
                  {toDate}
                </strong>
              </div>


              <div className="leave-info-row">
                <span>Duration</span>

                <strong>
                  {duration}
                </strong>
              </div>


              <div className="leave-info-row">
                <span>Reason</span>

                <strong className="leave-reason">
                  Personal work at my home town
                </strong>
              </div>


              <div className="leave-info-row">
                <span>Status</span>

                <strong className="leave-approved-small">

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 25 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >

                    <circle
                      cx="12.5"
                      cy="13"
                      r="12.5"
                      fill="#218257"
                    />

                    <path
                      d="M7 13L10.5 16.5L18 9"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                  </svg>

                  <span>Approved</span>

                </strong>

              </div>

            </div>

          </section>


          {/* ===================================================
              APPLY LEAVE DETAILS
              =================================================== */}

          <section className="leave-details-card apply-leave-details-card">

            <div className="leave-details-card-header">

              <span className="leave-details-card-icon">
                📄
              </span>

              <h3>Apply Leave Details</h3>

            </div>


            <div className="leave-info-list">

              <div className="leave-info-row">
                <span>Applied On</span>

                <strong>
                  15 Sep 2026, 10:32 AM
                </strong>
              </div>


              <div className="leave-info-row">
                <span>Applied Via</span>

                <strong>
                  Employee Portal (web)
                </strong>
              </div>


              <div className="leave-info-row">
                <span>Contact During Leave</span>

                <strong>
                  +91 12345 67890
                </strong>
              </div>


              <div className="leave-info-row">
                <span>Work Handover</span>

                <strong className="leave-approved-small">

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 25 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >

                    <circle
                      cx="12.5"
                      cy="13"
                      r="12.5"
                      fill="#218257"
                    />

                    <path
                      d="M7 13L10.5 16.5L18 9"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                  </svg>

                  <span>Completed</span>

                </strong>

              </div>


              <div className="leave-info-row">
                <span>Handover To</span>

                <strong>
                  Employee Name (ID - 001010)
                </strong>
              </div>


              <div className="leave-info-row">
                <span>Remark</span>

                <strong className="apply-leave-remark">
                  I will be available on phone for urgent
                  discussions.
                </strong>
              </div>

            </div>

          </section>


          {/* ===================================================
              APPROVAL STATUS
              =================================================== */}

          <section className="leave-details-card leave-approval-card">

            <div className="leave-details-card-header">

              <span className="leave-details-card-icon">
                👥
              </span>

              <h3>Approval Status</h3>

              <span className="approval-header-text">

                <svg
                  width="17.25"
                  height="17.25"
                  viewBox="0 0 25 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="approval-header-check"
                >

                  <circle
                    cx="12.5"
                    cy="13"
                    r="12.5"
                    fill="#218257"
                  />

                  <path
                    d="M7 13L10.5 16.5L18 9"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

                <span>
                  Your leave has been approved.
                </span>

              </span>

            </div>


            <div className="approval-timeline">


              {/* =================================================
                  LEAVE APPLIED
                  ================================================= */}

              <div className="approval-item">

                <div className="approval-line">

                  <span className="approval-circle">

                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 25 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >

                      <path
                        d="M7 13L10.5 16.5L18 9"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                    </svg>

                  </span>

                </div>


                <div className="approval-content">

                  <h4>Leave Applied</h4>

                  <p>
                    15 Sep 2024&nbsp; • &nbsp;10:31 AM
                  </p>

                  <span>
                    Leave request submitted by Arun Kumar.
                  </span>

                </div>


                <div className="approval-person">

                  <div className="approval-person-avatar">
                    👤
                  </div>

                  <div>
                    <strong>Arun Kumar</strong>
                    <span>Employee</span>
                  </div>

                </div>

              </div>


              {/* =================================================
                  REVIEWED BY MANAGER
                  ================================================= */}

              <div className="approval-item">

                <div className="approval-line">

                  <span className="approval-circle">

                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 25 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >

                      <path
                        d="M7 13L10.5 16.5L18 9"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                    </svg>

                  </span>

                </div>


                <div className="approval-content">

                  <h4>
                    Reviewed by Manager
                  </h4>

                  <p>
                    15 Sep 2024&nbsp; • &nbsp;10:31 AM
                  </p>

                  <span>
                    Reviewed by Sriram Sir
                  </span>

                </div>


                <div className="approval-person">

                  <div className="approval-person-avatar">
                    👤
                  </div>

                  <div>
                    <strong>Sriram</strong>
                    <span>CEO</span>
                  </div>

                </div>

              </div>


              {/* =================================================
                  APPROVED
                  ================================================= */}

              <div className="approval-item">

                <div className="approval-line">

                  <span className="approval-circle">

                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 25 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >

                      <path
                        d="M7 13L10.5 16.5L18 9"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                    </svg>

                  </span>

                </div>


                <div className="approval-content">

                  <h4>Approved</h4>

                  <p>
                    15 Sep 2024&nbsp; • &nbsp;10:31 AM
                  </p>

                  <span>
                    Approved by Sriram Sir
                  </span>

                </div>


                <div className="approval-person">

                  <div className="approval-person-avatar">
                    👤
                  </div>

                  <div>
                    <strong>Sriram</strong>
                    <span>CEO</span>
                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* ===================================================
              LEAVE BALANCE
              =================================================== */}

          <section className="leave-details-card leave-balance-card">

            {/* Leave Balance Header */}

            <div className="leave-details-card-header leave-balance-header">

              <span className="leave-balance-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >

                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="#1B70F5"
                  />

                  <path
                    d="M12 2V12H22"
                    fill="#C6E8FA"
                  />

                </svg>
              </span>


              <h3>
                Leave Balance
              </h3>


              <span className="leave-balance-date">
                (as of 17 Sep 2026)
              </span>


              <button
                type="button"
                className="leave-balance-view-all"
              >
                View All
              </button>

            </div>


            {/* Leave Balance Content */}

            <div className="leave-balance-content">


              {/* Casual Leave */}

              <div className="leave-balance-row">

                <div className="leave-balance-row-top">

                  <span>
                    Casual Leave
                  </span>

                  <strong>
                    8 <small>/ 12 Days</small>
                  </strong>

                </div>


                <div className="leave-balance-progress">

                  <div
                    className="leave-balance-progress-fill"
                    style={{ width: "66.67%" }}
                  />

                </div>

              </div>


              {/* Sick Leave */}

              <div className="leave-balance-row">

                <div className="leave-balance-row-top">

                  <span>
                    Sick Leave
                  </span>

                  <strong>
                    6 <small>/ 10 Days</small>
                  </strong>

                </div>


                <div className="leave-balance-progress">

                  <div
                    className="leave-balance-progress-fill"
                    style={{ width: "60%" }}
                  />

                </div>

              </div>


              {/* Annual Leave */}

              <div className="leave-balance-row">

                <div className="leave-balance-row-top">

                  <span>
                    Annual Leave
                  </span>

                  <strong>
                    14 <small>/ 20 Days</small>
                  </strong>

                </div>


                <div className="leave-balance-progress">

                  <div
                    className="leave-balance-progress-fill"
                    style={{ width: "70%" }}
                  />

                </div>

              </div>


              {/* Compensatory Leave */}

              <div className="leave-balance-row">

                <div className="leave-balance-row-top">

                  <span>
                    Compensatory Leave
                  </span>

                  <strong>
                    8 <small>/ 12 Days</small>
                  </strong>

                </div>


                <div className="leave-balance-progress">

                  <div
                    className="leave-balance-progress-fill"
                    style={{ width: "66.67%" }}
                  />

                </div>

              </div>


            </div>

               </section>


          {/* ===================================================
              ATTACHMENT
              =================================================== */}

          <section className="leave-details-attachment-card">

            {/* ATTACHMENT HEADER */}

            <div className="attachment-header">

              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="attachment-header-icon"
              >
                <path
                  d="M21.44 11.05L12.25 20.24C10.3 22.19 7.14 22.19 5.19 20.24C3.24 18.29 3.24 15.13 5.19 13.18L14.38 3.99C15.69 2.68 17.81 2.68 19.12 3.99C20.43 5.3 20.43 7.42 19.12 8.73L9.93 17.92C9.28 18.57 8.22 18.57 7.57 17.92C6.92 17.27 6.92 16.21 7.57 15.56L16.05 7.08"
                  stroke="#1B70F5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <h3>Attachment</h3>

            </div>


            {/* PDF LIST */}

            <div className="attachment-list">

              {attachments.map((file, index) => (

                <div
                  className="attachment-file-card"
                  key={`${file.name}-${index}`}
                >

                  <div className="attachment-pdf-icon">
                    <span>File</span>
                  </div>


                  <div className="attachment-file-info">

                    <div className="attachment-file-name">
                      {file.name}
                    </div>

                    <div className="attachment-file-meta">
                      {file.size} | {file.date}
                    </div>

                  </div>


  <a
  href={file.url}
  download={file.name}
  className="attachment-download-button"
  aria-label={`Download ${file.name}`}
>
  <svg
    width="23"
    height="23"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="1"
      width="22"
      height="22"
      rx="5"
      fill="#C6E8FA"
    />

    <path
      d="M12 5V15"
      stroke="#1B70F5"
      strokeWidth="2"
      strokeLinecap="round"
    />

    <path
      d="M8 11L12 15L16 11"
      stroke="#1B70F5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M7 18H17"
      stroke="#1B70F5"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
</a>

                </div>

              ))}

            </div>

                    </section>


          {/* ===================================================
              LEAVE ACTION BUTTONS
              =================================================== */}

          <div className="leave-details-actions">

            <button
              type="button"
              className="download-leave-button"
            >
              <svg
                width="19"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3V15"
                  stroke="#1B70F5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <path
                  d="M7 10L12 15L17 10"
                  stroke="#1B70F5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M5 20H19"
                  stroke="#1B70F5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>

              <span>Download Leave Details</span>
            </button>


            <button
              type="button"
              className="cancel-leave-button"
            >
              <svg
                width="20.44"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6H21"
                  stroke="#D90000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <path
                  d="M9 6V4H15V6"
                  stroke="#D90000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M6 6L7 20H17L18 6"
                  stroke="#D90000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M10 10V16"
                  stroke="#D90000"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M14 10V16"
                  stroke="#D90000"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <span>Cancel Leave</span>
            </button>

          </div>


        </div>


        </div>

    </Layout>

  );
};

export default LeaveDetails;