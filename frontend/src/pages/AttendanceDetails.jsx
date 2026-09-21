import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  History,
  Eye,
} from "lucide-react";

import Layout from "../styles/Layout";
import "./AttendanceDetails.css";

// ============================================================
// EXISTING PROJECT ICON ASSETS
// ============================================================

import loginIcon from "../assets/cards/login.svg";
import locationIcon from "../assets/cards/location.svg";
import calendarIcon from "../assets/cards/calender.png";
import clockIcon from "../assets/cards/clock.svg";
import dateRangeIcon from "../assets/cards/date-range.svg";

// ============================================================
// ATTENDANCE DETAILS COMPONENT
// ============================================================

const AttendanceDetails = ({ employee = null }) => {
  const navigate = useNavigate();

  // ==========================================================
  // ATTENDANCE DATA
  // ==========================================================

  const attendanceData = {
    name: employee?.name || "Employee Name",

    employeeId:
      employee?.employeeId || "001010",

    department:
      employee?.department || "IT Department",

    designation:
      employee?.designation || "Software Engineer",

    date:
      employee?.date || "Thursday, 12 September 2026",

    status:
      employee?.status || "Present",

    checkIn:
      employee?.checkIn || "09:02 AM",

    checkInStatus:
      employee?.checkInStatus || "On Time",

    checkOut:
      employee?.checkOut || "06:04 PM",

    checkOutStatus:
      employee?.checkOutStatus || "On Time",

    workingHours:
      employee?.workingHours || "8h 02m",

    requiredHours:
      employee?.requiredHours || "8h 00m",

    progress:
      employee?.progress ?? 100,

    shiftName:
      employee?.shiftName || "General shift",

    shiftTime:
      employee?.shiftTime || "09:00 AM - 06:00 PM",
  };


  // ==========================================================
  // FIGMA STATUS VARIANT
  // Present  -> Green
  // Absent   -> Red
  // ==========================================================

  const getAttendanceStatusVariant = (status) => {
    const value = String(status || "").toLowerCase().trim();

    if (
      value === "present" ||
      value === "on time"
    ) {
      return "status-present";
    }

    if (
      value === "absent" ||
      value === "delay"
    ) {
      return "status-absent";
    }

    return "status-default";
  };


  // ==========================================================
  // FIGMA PROGRESS VARIANT
  //
  // 80 - 100% -> Green
  // 50 - <80% -> Blue
  // 30 - <50% -> Yellow
  // <30%      -> Red
  // ==========================================================

  const getProgressVariant = (percentage) => {
    const value = Number(percentage);

    if (value >= 80) {
      return "progress-green";
    }

    if (value >= 50) {
      return "progress-blue";
    }

    if (value >= 30) {
      return "progress-yellow";
    }

    return "progress-red";
  };


  // ==========================================================
  // BACK TO HOME
  // ==========================================================

  const handleBack = () => {
    navigate("/employee-dashboard");
  };


  // ==========================================================
  // CURRENT VARIANTS
  // ==========================================================

  const statusVariant =
    getAttendanceStatusVariant(
      attendanceData.status
    );

  const progressVariant =
    getProgressVariant(
      attendanceData.progress
    );


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <Layout>

      <div className="attendance-details-page">

  


        {/* ====================================================
            PAGE HEADING
        ==================================================== */}

        <div className="attendance-details-heading">

  <button
    type="button"
    className="attendance-back-button"
    onClick={handleBack}
  >
    <ArrowLeft
      size={18}
      strokeWidth={2}
    />

    <span>
      Back to Home
    </span>
  </button>

  <h1>
    Attendance Details
  </h1>

  <p>
    Complete attendance information for the selected date.
  </p>

</div>

        {/* ====================================================
            EMPLOYEE INFORMATION
        ==================================================== */}

        <section className="attendance-details-employee">

          {/* LEFT SIDE */}

          <div className="attendance-details-employee-left">

            {/* EMPLOYEE IMAGE */}

            <div className="attendance-details-profile">

              <img
                src="/src/assets/dashboard/profile-svg.svg"
                alt="Employee"
              />

            </div>


            {/* EMPLOYEE DETAILS */}

            <div className="attendance-details-employee-info">

              <h2>
                {attendanceData.name}
              </h2>

              <p>
                # ID - {attendanceData.employeeId}
              </p>

              <span>

                {attendanceData.department}

                <b className="employee-info-separator">
                  |
                </b>

                {attendanceData.designation}

              </span>

            </div>

          </div>


          {/* RIGHT SIDE */}

          <div className="attendance-details-date-section">

            {/* STATUS */}

            <div
              className={`attendance-details-status ${statusVariant}`}
            >

              <span />

              {attendanceData.status}

            </div>


            {/* DATE */}

           <div className="attendance-details-date">

  <img
    src={dateRangeIcon}
    alt="Date"
  />

  <strong>
    {attendanceData.date}
  </strong>

</div>

          </div>

        </section>


        {/* ====================================================
            SUMMARY CARDS
        ==================================================== */}

        <section className="attendance-details-summary">


          {/* ==================================================
              CHECK IN
          ================================================== */}

          <div className="attendance-summary-box checkin-box">

            <div className="attendance-summary-icon checkin-icon">

              <img
                src={loginIcon}
                alt="Check In"
              />

            </div>


            <div className="attendance-summary-content">

              <span>
                Check In
              </span>

              <strong>
                {attendanceData.checkIn}
              </strong>

              <small>
                {attendanceData.checkInStatus}
              </small>

            </div>

          </div>


          {/* ==================================================
              CHECK OUT
              SAME LOGIN ICON
              ROTATED 180 DEG
          ================================================== */}

          <div className="attendance-summary-box checkout-box">

            <div className="attendance-summary-icon checkout-icon">

              <img
                src={loginIcon}
                alt="Check Out"
              />

            </div>


            <div className="attendance-summary-content">

              <span>
                Check Out
              </span>

              <strong>
                {attendanceData.checkOut}
              </strong>

              <small>
                {attendanceData.checkOutStatus}
              </small>

            </div>

          </div>


          {/* ==================================================
              WORKING HOURS
          ================================================== */}

          <div className="attendance-summary-box working-box">

            <div className="attendance-summary-icon working-icon">

              <img
                src={clockIcon}
                alt="Working Hours"
              />

            </div>


            <div className="attendance-summary-content">

              <span>
                Working Hours
              </span>

              <strong>
                {attendanceData.workingHours}
              </strong>

              <small>
                of {attendanceData.requiredHours}
              </small>

            </div>


            {/* PROGRESS BADGE */}

            <div
              className={`attendance-summary-percentage ${progressVariant}`}
            >
              {attendanceData.progress}%
            </div>

          </div>

        </section>


        {/* ====================================================
            INFORMATION GRID
        ==================================================== */}

        <section className="attendance-details-grid">


          {/* ==================================================
              LOGIN SOURCE
          ================================================== */}

       <div className="attendance-detail-card attendance-login-card">

  {/* LOGIN SOURCE HEADER */}
  <div className="attendance-detail-card-title">

    <div className="detail-title-icon login-detail-icon">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="6"
          y="2.5"
          width="12"
          height="19"
          rx="2"
          stroke="#159CD0"
          strokeWidth="2"
        />

        <circle
          cx="12"
          cy="18"
          r="0.8"
          fill="#159CD0"
        />
      </svg>
    </div>

    <h3>
      Login Source
    </h3>

  </div>


  {/* LOGIN SOURCE CONTENT */}
  <div className="login-source-content">

    <div className="attendance-detail-row">

      <span>
        Source
      </span>

      <strong>
        Biometric
      </strong>

    </div>


    <div className="attendance-detail-row">

      <span>
        Device
      </span>

      <strong>
        Office Device
      </strong>

    </div>


    <div className="attendance-detail-row">

      <span>
        IP Address
      </span>

      <strong>
        192.168.1.25
      </strong>

    </div>


    <div className="attendance-detail-row">

      <span>
        Platform
      </span>

      <strong>
        -
      </strong>

    </div>

  </div>

</div>

{/* ==================================================
    LOCATION INFORMATION
================================================== */}

<div className="attendance-detail-card location-card">

  <div className="attendance-detail-card-title">

    <div className="detail-title-icon location-detail-icon">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 10.5C20 15.5 12 21 12 21C12 21 4 15.5 4 10.5C4 6.91 7.58 4 12 4C16.42 4 20 6.91 20 10.5Z"
          stroke="#075B4F"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx="12"
          cy="10.5"
          r="2.8"
          stroke="#075B4F"
          strokeWidth="2.2"
        />
      </svg>
    </div>

    <h3>Location information</h3>

  </div>


  <div className="attendance-detail-row">

    <span>Location type</span>

    <strong>Office</strong>

  </div>


  <div className="attendance-detail-row">

    <span>Office</span>

    <strong>Madurai (Main office)</strong>

  </div>


  <div className="attendance-detail-row">

    <span>Geo Tag</span>

    <strong>12.9716 N, 80.2336 E</strong>

  </div>


  <div className="attendance-detail-row">

    <span>Address</span>

    <strong className="address-value">
      NO.12 TEC Tower,
      <br />
      OMR, Chennai - 600097
    </strong>

  </div>

</div>
          {/* ==================================================
              SHIFT INFORMATION
          ================================================== */}

          <div className="attendance-detail-card shift-card">

            <div className="attendance-detail-card-title">

              <div className="detail-title-icon shift-detail-icon">
  <img
    src={dateRangeIcon}
    alt="Shift Information"
  />
</div>

              <h3>
                Shift Information 
              </h3>

            </div>


            <div className="attendance-detail-row">

              <span>
                Shift Name :
              </span>

              <strong>
                {attendanceData.shiftName}
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Shift Timing :
              </span>

              <strong>
                {attendanceData.shiftTime}
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Shift Duration :
              </span>

              <strong>
                8 hours
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Shift Type :
              </span>

              <strong>
                Regular
              </strong>

            </div>

          </div>


          {/* ==================================================
              ATTENDANCE STATUS
          ================================================== */}

          <div className="attendance-detail-card status-card">

            <div className="attendance-detail-card-title">

              <div className="detail-title-icon status-detail-icon">
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="8"
      stroke="#F59A38"
      strokeWidth="2.5"
    />

    <path
      d="M12 7V12L15 14"
      stroke="#F59A38"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>

              <h3>
                Attendance Status
              </h3>

            </div>


            <div className="attendance-detail-row">

              <span>
                Overall Status
              </span>

              <strong className="green-status">
                {attendanceData.status}
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Check-in Status
              </span>

              <strong className="green-status">
                {attendanceData.checkInStatus}
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Check-out Status
              </span>

              <strong className="green-status">
                {attendanceData.checkOutStatus}
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Late By
              </span>

              <strong>
                -
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Early Check-in
              </span>

              <strong>
                -
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Early Check-out
              </span>

              <strong>
                -
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Overtime
              </span>

              <strong>
                -
              </strong>

            </div>

          </div>


          {/* ==================================================
              WORKING HOURS PROGRESS
          ================================================== */}

          <div className="attendance-working-progress">

            <h3>
              Working Hours Progress
            </h3>


            <div className="attendance-progress-row">

              <div className="attendance-progress-bar">

                <div
                  className={`attendance-progress-fill ${progressVariant}`}
                  style={{
                    width: `${Math.min(
                      attendanceData.progress,
                      100
                    )}%`,
                  }}
                />

              </div>


              <strong>
                {attendanceData.progress}%
              </strong>

            </div>


            <span>

              {attendanceData.workingHours}

              {" / "}

              {attendanceData.requiredHours}

            </span>

          </div>


          {/* ==================================================
              REMARK
          ================================================== */}

          <div className="attendance-remark-card">

            <div className="attendance-bottom-card-title remark-title">

              <div className="remark-title-icon">

                <FileText
                  size={17}
                  strokeWidth={2}
                />

              </div>

              <h3>
                Remark
              </h3>

            </div>


            <div className="remark-row">

              <span>
                Employee Remarks
              </span>

              <strong>
                -
              </strong>

            </div>


            <div className="remark-row">

              <span>
                Manager Remarks
              </span>

              <strong>
                -
              </strong>

            </div>


            <div className="remark-row">

              <span>
                Regularization Request
              </span>

              <strong>
                NO
              </strong>

            </div>


            <div className="remark-row">

              <span>
                Approval Status
              </span>

              <strong>
                -
              </strong>

            </div>

          </div>


          {/* ==================================================
              ATTENDANCE TIMELINE
          ================================================== */}

          <div className="attendance-timeline-card">

            <div className="attendance-bottom-card-title timeline-title">

             

              <h3>
                Attendance Timeline
              </h3>

            </div>


            {/* CHECK IN */}

            <div className="timeline-item">

              <span className="timeline-dot green" />

              <strong>
                9:02 AM
              </strong>

              <div>

                <b>
                  Check In
                </b>

                <small>
                  Biometric - Office
                </small>

              </div>

            </div>


            {/* BREAK START */}

            <div className="timeline-item">

              <span className="timeline-dot gray" />

              <strong>
                01:00 PM
              </strong>

              <div>

                <b>
                  Break Start
                </b>

              </div>

            </div>


            {/* BREAK END */}

            <div className="timeline-item">

              <span className="timeline-dot gray" />

              <strong>
                02:00 PM
              </strong>

              <div>

                <b>
                  Break End
                </b>

              </div>

            </div>


            {/* CHECK OUT */}

            <div className="timeline-item">

              <span className="timeline-dot green" />

              <strong>
                06:04 PM
              </strong>

              <div>

                <b>
                  Check Out
                </b>

                <small>
                  Biometric - Office
                </small>

              </div>

            </div>

          </div>


          {/* ==================================================
              ATTENDANCE HISTORY
          ================================================== */}

          <div className="attendance-history-card">

            {/* HISTORY HEADER */}

            <div className="attendance-history-header">

              <div className="attendance-history-heading">

                <div className="history-title-icon">

                  <History
                    size={17}
                    strokeWidth={2}
                  />

                </div>


                <div>

                  <h3>
                    Attendance History
                  </h3>

                  <p>
                    View important changes, regularization requests,
                    and audit trail for this attendance record.
                  </p>

                </div>

              </div>


              {/* VIEW ALL */}

              <button
                type="button"
                className="view-history-button"
              >

                View All History

                <Eye
                  size={13}
                  strokeWidth={2}
                />

              </button>

            </div>


            {/* HISTORY TABLE */}

            <div className="attendance-history-table-wrap">

              <table className="attendance-history-table">

                <thead>

                  <tr>

                    <th>
                      DATE &amp; TIME
                    </th>

                    <th>
                      ACTION
                    </th>

                    <th>
                      DETAILS
                    </th>

                    <th>
                      REASON
                    </th>


                  </tr>

                </thead>


                <tbody>

                  <tr>

                    <td>
                      12 Sep 2026, 08:30 AM
                    </td>

                    <td>
                      Regularization requested
                    </td>

                    <td>
                      Check-in time: 09:02 AM
                    </td>

                  

                    <td>
                      Forgot to check-in
                    </td>

                   

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </div>

    </Layout>
  );
};

export default AttendanceDetails;