import React from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  LogIn,
  LogOut,
  Clock3,
  MapPin,
  BriefcaseBusiness,
  Timer,
  FileText,
} from "lucide-react";

import Layout from "../styles/Layout";
import "./AttendanceDetails.css";

// ============================================================
// COMPONENT
// ============================================================

const AttendanceDetails = ({ employee = null }) => {
  const navigate = useNavigate();

  // ==========================================================
  // ATTENDANCE DATA
  // ==========================================================

  const attendanceData = {
    name:
      employee?.name ||
      "Employee Name",

    employeeId:
      employee?.employeeId ||
      "001010",

    department:
      employee?.department ||
      "IT Department",

    designation:
      employee?.designation ||
      "Software Engineer",

    date:
      employee?.date ||
      "Thursday, 12 September 2026",

    status:
      employee?.status ||
      "Present",

    checkIn:
      employee?.checkIn ||
      "09:02 AM",

    checkInStatus:
      employee?.checkInStatus ||
      "On Time",

    checkOut:
      employee?.checkOut ||
      "06:04 PM",

    checkOutStatus:
      employee?.checkOutStatus ||
      "On Time",

    workingHours:
      employee?.workingHours ||
      "8h 02m",

    requiredHours:
      employee?.requiredHours ||
      "8h 00m",

    progress:
      employee?.progress ?? 100,

    shiftName:
      employee?.shiftName ||
      "General shift",

    shiftTime:
      employee?.shiftTime ||
      "09:00 AM - 06:00 PM",
  };

  // ==========================================================
  // BACK TO DASHBOARD
  // ==========================================================

  const handleBack = () => {
    navigate("/employee-dashboard");
  };

  return (
    <Layout>

      <div className="attendance-details-page">

        {/* ====================================================
            BACK BUTTON
        ===================================================== */}

        <button
          type="button"
          className="attendance-back-button"
          onClick={handleBack}
        >
          <ArrowLeft
            size={17}
            strokeWidth={2}
          />

          <span>
            Back to Home
          </span>
        </button>


        {/* ====================================================
            PAGE HEADING
        ===================================================== */}

        <div className="attendance-details-heading">

          <h1>
            Attendance Details
          </h1>

          <p>
            Complete attendance information for the selected date.
          </p>

        </div>


        {/* ====================================================
            EMPLOYEE SUMMARY
        ===================================================== */}

        <section className="attendance-details-employee">

          <div className="attendance-details-employee-left">

            {/* PROFILE */}

            <div className="attendance-details-profile">

              <img
                src="/src/assets/dashboard/profile-svg.svg"
                alt="Employee"
              />

            </div>


            {/* EMPLOYEE INFORMATION */}

            <div className="attendance-details-employee-info">

              <h2>
                {attendanceData.name}
              </h2>

              <p>
                # ID - {attendanceData.employeeId}
              </p>

              <span>
                {attendanceData.department}
                &nbsp;&nbsp; | &nbsp;&nbsp;
                {attendanceData.designation}
              </span>

            </div>

          </div>


          {/* DATE + STATUS */}

          <div className="attendance-details-date-section">

            <div className="attendance-details-status">

              <span></span>

              {attendanceData.status}

            </div>


            <div className="attendance-details-date">

              <CalendarDays
                size={22}
                strokeWidth={2}
              />

              <strong>
                {attendanceData.date}
              </strong>

            </div>

          </div>

        </section>


        {/* ====================================================
            TOP SUMMARY CARDS
        ===================================================== */}

        <section className="attendance-details-summary">

          {/* ==================================================
              CHECK IN
          =================================================== */}

          <div className="attendance-summary-box checkin-box">

            <div className="attendance-summary-icon checkin-icon">

              <LogIn
                size={26}
                strokeWidth={2}
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
          =================================================== */}

          <div className="attendance-summary-box checkout-box">

            <div className="attendance-summary-icon checkout-icon">

              <LogOut
                size={26}
                strokeWidth={2}
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
          =================================================== */}

          <div className="attendance-summary-box working-box">

            <div className="attendance-summary-icon working-icon">

              <Clock3
                size={27}
                strokeWidth={2}
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

            <div className="attendance-summary-percentage">

              {attendanceData.progress}%

            </div>

          </div>

        </section>


        {/* ====================================================
            INFORMATION GRID
        ===================================================== */}

        <section className="attendance-details-grid">

          {/* ==================================================
              LOGIN SOURCE
          =================================================== */}

          <div className="attendance-detail-card">

            <div className="attendance-detail-card-title">

              <div className="detail-title-icon login-detail-icon">

                <LogIn
                  size={17}
                  strokeWidth={2}
                />

              </div>

              <h3>
                Login Source
              </h3>

            </div>


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

          </div>


          {/* ==================================================
              LOCATION
          =================================================== */}

          <div className="attendance-detail-card">

            <div className="attendance-detail-card-title">

              <div className="detail-title-icon location-detail-icon">

                <MapPin
                  size={17}
                  strokeWidth={2}
                />

              </div>

              <h3>
                Location information
              </h3>

            </div>


            <div className="attendance-detail-row">

              <span>
                Location type
              </span>

              <strong>
                Office
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Office
              </span>

              <strong>
                Madurai (Main office)
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Geo Tag
              </span>

              <strong>
                12.9716 N, 80.2336 E
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Address
              </span>

              <strong className="address-value">
                NO.12 TEC Tower,
                <br />
                OMR, Chennai - 600097
              </strong>

            </div>

          </div>


          {/* ==================================================
              SHIFT INFORMATION
          =================================================== */}

          <div className="attendance-detail-card">

            <div className="attendance-detail-card-title">

              <div className="detail-title-icon shift-detail-icon">

                <BriefcaseBusiness
                  size={17}
                  strokeWidth={2}
                />

              </div>

              <h3>
                Shift Information
              </h3>

            </div>


            <div className="attendance-detail-row">

              <span>
                Shift Name
              </span>

              <strong>
                {attendanceData.shiftName}
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Shift Timing
              </span>

              <strong>
                {attendanceData.shiftTime}
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Shift Duration
              </span>

              <strong>
                8 Hours
              </strong>

            </div>


            <div className="attendance-detail-row">

              <span>
                Shift Type
              </span>

              <strong>
                Regular
              </strong>

            </div>

          </div>


          {/* ==================================================
              ATTENDANCE STATUS
          =================================================== */}

          <div className="attendance-detail-card">

            <div className="attendance-detail-card-title">

              <div className="detail-title-icon status-detail-icon">

                <Timer
                  size={17}
                  strokeWidth={2}
                />

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
          =================================================== */}

          <div className="attendance-working-progress">

            <h3>
              Working Hours Progress
            </h3>

            <div className="attendance-progress-row">

              <div className="attendance-progress-bar">

                <div
                  className="attendance-progress-fill"
                  style={{
                    width: `${attendanceData.progress}%`,
                  }}
                ></div>

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
          =================================================== */}

          <div className="attendance-remark-card">

            <div className="attendance-remark-title">

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


            <div className="attendance-remark-row">

              <span>
                Employee Remarks
              </span>

              <strong>
                -
              </strong>

            </div>


            <div className="attendance-remark-row">

              <span>
                Manager Remarks
              </span>

              <strong>
                -
              </strong>

            </div>


            <div className="attendance-remark-row">

              <span>
                Regularization Request
              </span>

              <strong>
                NO
              </strong>

            </div>


            <div className="attendance-remark-row">

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
          =================================================== */}

          <div className="attendance-timeline-card">

            <div className="attendance-timeline-title">
              Attendance Timeline
            </div>


            <div className="timeline-item">

              <span className="timeline-dot green"></span>

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


            <div className="timeline-item">

              <span className="timeline-dot gray"></span>

              <strong>
                01:00 PM
              </strong>

              <div>
                <b>
                  Break Start
                </b>
              </div>

            </div>


            <div className="timeline-item">

              <span className="timeline-dot gray"></span>

              <strong>
                02:00 PM
              </strong>

              <div>
                <b>
                  Break End
                </b>
              </div>

            </div>


            <div className="timeline-item">

              <span className="timeline-dot green"></span>

              <strong>
                06:04 PM
              </strong>

              <div>
                <b>
                  Check Out
                </b>
              </div>

            </div>

          </div>

        </section>

      </div>

    </Layout>
  );
};

export default AttendanceDetails;