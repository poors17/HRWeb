import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../styles/Layout";
import "./LeaveDetails.css";

const LeaveDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data received from Leave Submitted page
  const leaveData = location.state || {};

  const leaveType = leaveData.leaveType || "Casual Leave";
  const fromDate = leaveData.fromDate || "18 Sep 2026 (Wed)";
  const toDate = leaveData.toDate || "19 Sep 2026 (Thu)";
  const duration = leaveData.duration || "2 Days";

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

          <span className="leave-details-breadcrumb-blue">
            Leave Management
          </span>

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

          <div>
            <h1>Leave Details</h1>

            <p>
              Complete information about the leave request,
              application details and approval status.
            </p>
          </div>

          <div className="leave-details-header-status">

            <span className="leave-id-badge">
              Leave ID: ID Number
            </span>

            <span className="approved-badge">
              ✓ Approved
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

              <span className="leave-details-card-icon">
                📅
              </span>

              <h3>Leave information</h3>

              <button type="button">
                Edit Request
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
                <strong>{fromDate}</strong>
              </div>

              <div className="leave-info-row">
                <span>To Date</span>
                <strong>{toDate}</strong>
              </div>

              <div className="leave-info-row">
                <span>Duration</span>
                <strong>{duration}</strong>
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
                  ✓ Approved
                </strong>
              </div>

            </div>

          </section>



          {/* ===================================================
              APPLY LEAVE DETAILS
              =================================================== */}

          <section className="leave-details-card">

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
                  ✓ Completed
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

                <strong className="leave-reason">
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
                ✓ Your leave has been approved.
              </span>

            </div>


            <div className="approval-timeline">


              {/* Leave Applied */}

              <div className="approval-item">

                <div className="approval-line">

                  <span className="approval-circle">
                    ✓
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


              {/* Reviewed */}

              <div className="approval-item">

                <div className="approval-line">

                  <span className="approval-circle">
                    ✓
                  </span>

                </div>

                <div className="approval-content">

                  <h4>Reviewed by Manager</h4>

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
                    <span>Employee</span>
                  </div>

                </div>

              </div>


              {/* Approved */}

              <div className="approval-item">

                <div className="approval-line">

                  <span className="approval-circle">
                    ✓
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
                    <span>Employee</span>
                  </div>

                </div>

              </div>

            </div>

          </section>

        </div>

      </div>

    </Layout>
  );
};

export default LeaveDetails;