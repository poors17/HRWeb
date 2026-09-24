import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  ArrowRight,
  Upload,
} from "lucide-react";

import Layout from "../styles/Layout";
import "./EmployeeDashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// ============================================================
// LOGO
// ============================================================

import victinetLogo from "../assets/dashboard/Victinet Logo.svg";

// ============================================================
// DASHBOARD ICONS
// ============================================================

import homeIcon from "../assets/dashboard/home-svg.svg";
import profileIcon from "../assets/dashboard/profile-svg.svg";
import attendanceIcon from "../assets/dashboard/time-svg.svg";
import leaveIcon from "../assets/dashboard/Vector.svg";
import payslipIcon from "../assets/dashboard/pay-svg.svg";

import documentIcon from "../assets/dashboard/document.svg";
import assetIcon from "../assets/dashboard/box-svg.svg";
import performanceIcon from "../assets/dashboard/performance.svg";
import goalsIcon from "../assets/dashboard/target-marketing.svg";

import policiesIcon from "../assets/dashboard/policies.svg";
import announcementIcon from "../assets/dashboard/announcement.svg";
import holidaysIcon from "../assets/dashboard/holidays.svg";

import helpdeskIcon from "../assets/dashboard/support-svg.svg";
import hrmsLogo from "../assets/dashboard/HRMS logo.svg";

// ============================================================
// ATTENDANCE CARD ICONS
// ============================================================

import clockIcon from "../assets/cards/clock.svg";
import dateRangeIcon from "../assets/cards/date-range.svg";
import locationIcon from "../assets/cards/location.svg";
import loginIcon from "../assets/cards/login.svg";
import calenderIcon from "../assets/cards/calender.png";

// ============================================================
// COMPONENT
// ============================================================

const EmployeeDashboard = ({ employee = null }) => {
  const navigate = useNavigate();
  const [leaveBalances, setLeaveBalances] = React.useState([]);
  const [leaveBalanceLoading, setLeaveBalanceLoading] = React.useState(true);
  const [leaveBalanceError, setLeaveBalanceError] = React.useState("");

  const loadLeaveBalances = React.useCallback(async () => {
    try {
      setLeaveBalanceLoading(true);
      setLeaveBalanceError("");

      const response = await fetch(`${API_URL}/api/leave/balance?year=${new Date().getFullYear()}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        setLeaveBalanceError("Your session has expired. Please sign in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to load leave balances");
      }

      const mappedBalances = Array.isArray(data)
        ? data.map((item) => ({
            id: Number(item.leave_type_id ?? item.id),
            name: item.leave_type_name || item.name || "Leave",
            totalDays: Number(item.total_days ?? 0),
            usedDays: Number(item.used_days ?? 0),
            remaining: Number(
              item.remaining ??
                (Number(item.total_days ?? 0) - Number(item.used_days ?? 0))
            ),
          }))
        : [];

      setLeaveBalances(mappedBalances);
    } catch (loadError) {
      setLeaveBalanceError(loadError.message || "Unable to load leave balances");
      setLeaveBalances([]);
    } finally {
      setLeaveBalanceLoading(false);
    }
  }, [navigate]);

  React.useEffect(() => {
    loadLeaveBalances();
  }, [loadLeaveBalances]);

  const totalRemainingDays = leaveBalances.reduce(
    (sum, item) => sum + Number(item.remaining ?? 0),
    0
  );

  // ==========================================================
  // ATTENDANCE DATA
  // ==========================================================

  const attendanceData = {
    name: employee?.name || "Employee Name",
    employeeId: employee?.employeeId || "001010",
    department:
      employee?.department ||
      "IT Department | Software Engineer",

    date:
      employee?.date ||
      "Thurs,12 Sept 2026",

    today: employee?.today || "Today",

    status: employee?.status || "Present",

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

    progress:
      employee?.progress ?? 100,

    completedHours:
      employee?.completedHours ||
      "8h 02m",

    requiredHours:
      employee?.requiredHours ||
      "8h 00m",

    shiftTime:
      employee?.shiftTime ||
      "09:00 AM - 06:00 PM",

    shiftName:
      employee?.shiftName ||
      "General shift",

    location:
      employee?.location ||
      "Office, Madurai (Main office)",

    profileImage:
      employee?.profileImage ||
      null,
  };

  // ==========================================================
  // STATUS
  // ==========================================================

  const getStatusClass = (status) => {
    return status?.toLowerCase() === "present"
      ? "present"
      : "absent";
  };

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const getProgressClass = (progress) => {
    const value = Number(progress) || 0;

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
  // VIEW ATTENDANCE DETAILS
  // ==========================================================

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const firstName = (localStorage.getItem("name") || "").trim().split(/\s+/)[0] || "there";
  const todayDay = today.toLocaleDateString("en-GB", { weekday: "long" });
  const todayDate = today.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const handleViewAttendance = () => {
    navigate("/attendance");
  };
const handleApplyLeave = () => {
  navigate("/apply-leave");
};

const handleViewLeave = () => {
  navigate("/leave-details");
};
  return (
    <Layout>

      {/* =====================================================
          MAIN EMPLOYEE DASHBOARD CONTENT
      ====================================================== */}

      <div className="employee-dashboard-content">

        {/* ====================================================
            WELCOME SECTION
        ===================================================== */}

        <section className="dashboard-welcome">

          <div className="welcome-content">

            <div className="welcome-small">
              {greeting},
            </div>

            <div className="welcome-title">
              {firstName}!
              <span className="welcome-hand">
                👋
              </span>
            </div>

            <div className="welcome-description">
              Here’s your overview for today. keep going!
            </div>

            <div className="welcome-quote">

              <span className="quote-line"></span>

              <span>
                “progress happens when consistency meets
                purpose.”
              </span>

            </div>

          </div>

          {/* ==================================================
              DATE
          =================================================== */}

          <div className="dashboard-date">

           <img
    src={calenderIcon}
    alt="Calendar"
      className="dashboard-calendar-icon"
  />

            <div className="dashboard-date-content">

              <span className="dashboard-day">
                {todayDay}
              </span>

              <strong>
                {todayDate}
              </strong>

              <span className="date-gradient-line"></span>

            </div>

          </div>

        </section>


        {/* ====================================================
            DASHBOARD ACTION BUTTONS
        ===================================================== */}

        <div className="dashboard-actions">

          <button
            type="button"
            className="dashboard-action edit-widget"
          >
            Edit widget
          </button>

          <button
            type="button"
            className="dashboard-action manage-dashboard"
          >
            Manage Dashboard
          </button>


          <button
            type="button"
            className="dashboard-action export-dashboard"
          >
            <Upload
              size={15}
              strokeWidth={2.5}
            />

            <span>
              Export
            </span>
          </button>

        </div>


        {/* ====================================================
            DASHBOARD CARDS
        ===================================================== */}

        <section className="dashboard-cards">

          {/* ==================================================
              ATTENDANCE CARD
          =================================================== */}

          <div className="figma-attendance-card">

            {/* =================================================
                CARD HEADER
            ================================================== */}

            <div className="attendance-card-title">

              <h2>
                Attendance
              </h2>

              <div className="attendance-status">

                <span
                  className={`status-dot ${getStatusClass(
                    attendanceData.status
                  )}`}
                ></span>

                <span>
                  {attendanceData.status}
                </span>

              </div>

            </div>


            {/* =================================================
                EMPLOYEE INFORMATION
            ================================================== */}

            <div className="attendance-employee">

              {/* PROFILE */}

              <div className="attendance-profile">

                {attendanceData.profileImage ? (

                  <img
                    src={attendanceData.profileImage}
                    alt="Employee"
                  />

                ) : (

                  <CircleUserRound
                    size={42}
                    strokeWidth={1.8}
                  />

                )}

              </div>


              {/* EMPLOYEE DETAILS */}

              <div className="attendance-employee-details">

                <strong>
                  {attendanceData.name}
                </strong>

                <span>
                  # {attendanceData.employeeId}
                </span>

                <small>
                  {attendanceData.department}
                </small>

              </div>


              {/* DIVIDER */}

              <div className="attendance-info-divider"></div>


              {/* DATE */}

              <div className="attendance-date">

                <img
                  src={dateRangeIcon}
                  alt="Date"
                  className="attendance-date-icon"
                />

                <div>

                  <strong>
                    {attendanceData.date}
                  </strong>

                  <span>
                    {attendanceData.today}
                  </span>

                </div>

              </div>

            </div>


            {/* =================================================
                CHECK IN / CHECK OUT
            ================================================== */}

            <div className="attendance-check-row">

              {/* CHECK IN */}

              <div className="check-box">

                <div className="check-icon check-in-icon">

                  <img
                    src={loginIcon}
                    alt="Check In"
                  />

                </div>

                <div className="check-content">

                  <span>
                    Check In
                  </span>

                  <strong>
                    {attendanceData.checkIn}
                  </strong>

                  <small
                    className={
                      attendanceData.checkInStatus === "Delay"
                        ? "delay"
                        : "on-time"
                    }
                  >
                    {attendanceData.checkInStatus}
                  </small>

                </div>

              </div>


              {/* CHECK OUT */}

              <div className="check-box">

                <div className="check-icon check-out-icon">

                  <img
                    src={loginIcon}
                    alt="Check Out"
                  />

                </div>

                <div className="check-content">

                  <span>
                    Check Out
                  </span>

                  <strong>
                    {attendanceData.checkOut}
                  </strong>

                  <small
                    className={
                      attendanceData.checkOutStatus === "Delay"
                        ? "delay"
                        : "on-time"
                    }
                  >
                    {attendanceData.checkOutStatus}
                  </small>

                </div>

              </div>

            </div>


            {/* =================================================
                WORKING HOURS
            ================================================== */}

            <div className="working-hours">

              <div className="working-hours-icon">

                <img
                  src={clockIcon}
                  alt="Working Hours"
                />

              </div>

              <div className="working-hours-content">

                <span>
                  Working Hours
                </span>

                <strong>
                  {attendanceData.workingHours}
                </strong>

                <div className="progress-row">

                  <div className="progress-bar">

                    <div
                      className={`progress-fill ${getProgressClass(
                        attendanceData.progress
                      )}`}
                      style={{
                        width: `${attendanceData.progress}%`,
                      }}
                    ></div>

                  </div>

                  <b>
                    {attendanceData.progress}%
                  </b>

                </div>

                <small>
                  {attendanceData.completedHours}
                  {" / "}
                  {attendanceData.requiredHours}
                </small>

              </div>

            </div>


            {/* =================================================
                SHIFT TIMING
            ================================================== */}

            <div className="shift-timing">

              <div className="shift-icon">

                <img
                  src={dateRangeIcon}
                  alt="Shift Timing"
                />

              </div>

              <div className="shift-content">

                <span>
                  Shift Timing
                </span>

                <strong>
                  {attendanceData.shiftTime}
                </strong>

                <small>
                  {attendanceData.shiftName}
                </small>

              </div>

            </div>


            {/* =================================================
                LOCATION
            ================================================== */}

            <div className="attendance-location">

              <img
                src={locationIcon}
                alt="Location"
                className="location-icon"
              />

              <div className="location-content">

                <span>
                  Location
                </span>

                <strong>
                  {attendanceData.location}
                </strong>

              </div>

            </div>


            {/* =================================================
                VIEW DETAILS
            ================================================== */}

            <button
              type="button"
              className="attendance-view-details"
              onClick={handleViewAttendance}
            >

              <span>
                View Details
              </span>

              <ArrowRight
                size={18}
              />

            </button>

          </div>

<div className="leave-balance-card">

  {/* HEADER */}
  <div className="leave-card-header">

    <div className="leave-card-icon">
      <img src={leaveIcon} alt="Leave" />
    </div>

    <h2 className="leave-card-title">
      Leave Balance
    </h2>

  </div>


  {/* APPLY LEAVE */}
  <div className="leave-apply-section">
  <button
    type="button"
    className="apply-leave-button"
    onClick={handleApplyLeave}
  >
    Apply Leave
  </button>
</div>


  {/* REMAINING */}
  <div className="leave-remaining-section">

    <div className="leave-remaining-days">
      {leaveBalanceLoading
        ? "Loading..."
        : leaveBalanceError
          ? "0 Days"
          : `${totalRemainingDays} ${totalRemainingDays === 1 ? "Day" : "Days"}`}
    </div>

    <div className="leave-remaining-label">
      {leaveBalanceLoading ? "Loading leave balances..." : leaveBalanceError ? "Unable to load leave balance" : "Remaining"}
    </div>

  </div>


  {/* LEAVE LEVELS */}
  <div className="leave-level-section">
    {leaveBalanceLoading ? (
      <div className="leave-balance-row">
        <span className="leave-balance-label">Loading...</span>
      </div>
    ) : leaveBalanceError ? (
      <div className="leave-balance-row">
        <span className="leave-balance-label">{leaveBalanceError}</span>
      </div>
    ) : leaveBalances.length === 0 ? (
      <div className="leave-balance-row">
        <span className="leave-balance-label">No leave balances available.</span>
      </div>
    ) : (
      leaveBalances.map((entry, index) => {
        const remaining = Number(entry.remaining ?? 0);
        const total = Number(entry.totalDays ?? 0);
        const width = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;
        const variantClass = ["variant-green", "variant-blue", "variant-cyan"][index % 3];

        return (
          <div className="leave-balance-row" key={entry.id || entry.name || index}>
            <span className="leave-balance-label">
              {entry.name}
            </span>

            <div className="leave-progress-wrapper">
              <div className="leave-progress-track">
                <div
                  className={`leave-progress-fill ${variantClass}`}
                  style={{ width: `${width}%` }}
                />
              </div>

              <span className="leave-balance-value">
                {remaining} / {total}
              </span>
            </div>
          </div>
        );
      })
    )}
  </div>


<div className="leave-card-footer">
  <button
    type="button"
    className="view-leave-button"
    onClick={handleViewLeave}
  >
    <span>View Leave</span>
    <ArrowRight
      size={28}
      strokeWidth={1.7}
    />
  </button>
</div>
</div>

        </section>

      </div>

    </Layout>
  );
};

export default EmployeeDashboard;