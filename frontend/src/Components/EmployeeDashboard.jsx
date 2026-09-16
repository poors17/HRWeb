import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Search,
  Sun,
  Moon,
  Bell,
  Headphones,
  CircleUserRound,
  PanelLeftOpen,
  PanelLeftClose,
  CalendarDays,
  ArrowRight,
  Upload
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

import "./EmployeeDashboard.css";

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
import leaveIcon from "../assets/dashboard/leave-svg.svg";
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
// MENU DATA
// ============================================================

const menuSections = [
  {
    title: "MY WORK",
    items: [
      {
        label: "My Dashboard",
        icon: homeIcon,
      },
      {
        label: "My Profile",
        icon: profileIcon,
      },
      {
        label: "Attendance",
        icon: attendanceIcon,
      },
      {
        label: "Leave",
        icon: leaveIcon,
        iconClass: "leave-menu-icon",
      },
      {
        label: "Payslips",
        icon: payslipIcon,
      },
    ],
  },

  {
    title: "MY RESOURCES",
    items: [
      {
        label: "Documents",
        icon: documentIcon,
      },
      {
        label: "Assets",
        icon: assetIcon,
      },
      {
        label: "Performance",
        icon: performanceIcon,
      },
      {
        label: "Goals",
        icon: goalsIcon,
        iconClass: "goals-menu-icon",
      },
    ],
  },

  {
    title: "COMPANY",
    items: [
      {
        label: "Policies",
        icon: policiesIcon,
      },
      {
        label: "Announcement",
        icon: announcementIcon,
      },
      {
        label: "Holidays",
        icon: holidaysIcon,
      },
    ],
  },

  {
    title: "SUPPORT",
    items: [
      {
        label: "Helpdesk",
        icon: helpdeskIcon,
      },
    ],
  },
];

// ============================================================
// COMPONENT
// ============================================================

function EmployeeDashboard({ employee = null }) {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("My Dashboard");
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/dashboard/my-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (data) setLiveData(data);
      })
      .catch(() => {});
  }, []);

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [openSections, setOpenSections] = useState({
    "MY WORK": true,
    "MY RESOURCES": true,
    COMPANY: true,
    SUPPORT: true,
  });

  // ==========================================================
  // ATTENDANCE DATA
  // ==========================================================

  const attendanceData = {
    name: liveData?.name ?? employee?.name ?? "Employee Name",
    employeeId: liveData?.employeeId ?? employee?.employeeId ?? "1024",
    department: liveData?.department ?? employee?.department ?? "Department",

    date: liveData?.date ?? employee?.date ?? "Thu, 12 Sep 2026",
    today: "Today",

    status: liveData?.status ?? employee?.status ?? "Present",

    checkIn: liveData?.checkIn ?? employee?.checkIn ?? "09:02 AM",
    checkInStatus: liveData?.checkInStatus ?? employee?.checkInStatus ?? "On Time",

    checkOut: liveData?.checkOut ?? employee?.checkOut ?? "06:02 PM",
    checkOutStatus: liveData?.checkOutStatus ?? employee?.checkOutStatus ?? "On Time",

    workingHours: liveData?.workingHours ?? employee?.workingHours ?? "8h 25m",

    progress: liveData?.progress ?? employee?.progress ?? 86,

    completedHours: liveData?.completedHours ?? employee?.completedHours ?? "8h 02m",
    requiredHours: liveData?.requiredHours ?? employee?.requiredHours ?? "8h 00m",

    shiftTime: liveData?.shiftTime ?? employee?.shiftTime ?? "9:00 AM - 06:00 PM",
    shiftName: liveData?.shiftName ?? employee?.shiftName ?? "General shift",

    location: liveData?.location ?? employee?.location ?? "Office, Madurai (Main office)",

    profileImage: liveData?.profileImage ?? employee?.profileImage ?? null,
  };

  // ==========================================================
  // ATTENDANCE VARIANTS
  // ==========================================================

  const getStatusVariant = (status) =>
    status?.toLowerCase().replace(/\s+/g, "-") === "delay"
      ? "delay"
      : "on-time";

  const getProgressVariant = (progress) => {
    const value = Number(progress) || 0;

    if (value >= 80) return "progress-green";
    if (value >= 50) return "progress-blue";
    if (value >= 30) return "progress-yellow";
    return "progress-red";
  };

  // ==========================================================
  // TOGGLE SIDEBAR
  // ==========================================================

  const toggleSidebar = () => {
    setCollapsed((previous) => !previous);
  };

  // ==========================================================
  // SECTION DROPDOWN
  // ==========================================================

  const toggleSection = (title) => {
    setOpenSections((previous) => ({
      ...previous,
      [title]: !previous[title],
    }));
  };

  // ==========================================================
  // GET ICON CLASS
  // ==========================================================

  const getIconClass = (item) => {
    if (item.label === "Leave") {
      return "menu-icon leave-menu-icon";
    }

    if (item.label === "Goals") {
      return "menu-icon goals-menu-icon";
    }

    return "menu-icon";
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className={`employee-page ${
        collapsed ? "sidebar-collapsed" : "sidebar-expanded"
      } ${darkMode ? "dark-mode" : "light-mode"}`}
    >
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="employee-sidebar">
        {/* ===================================================
            LOGO
        ==================================================== */}

        <div className="sidebar-logo">
          <img src={victinetLogo} alt="Victinet" />
        </div>

        {/* ===================================================
            HRMS / EMPLOYEE PORTAL
        ==================================================== */}

        <div className="hrms-section">
          <div className="hrms-logo">
            <img src={hrmsLogo} alt="HRMS" />
          </div>

          <div className="hrms-text">
            <span className="hrms-title">HRMS</span>
            <span className="hrms-subtitle">Employee Portal</span>
          </div>

          {!collapsed && (
            <ChevronDown
              size={15}
              strokeWidth={2.2}
              className="hrms-arrow"
            />
          )}
        </div>

        {/* ===================================================
            EXPAND / COLLAPSE BUTTON
            ABOVE MY WORK
        ==================================================== */}

        <div className="sidebar-expand-row">
          <button
            type="button"
            className="sidebar-expand-button"
            onClick={toggleSidebar}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label={
              collapsed ? "Expand Sidebar" : "Collapse Sidebar"
            }
          >
            {collapsed ? (
              <PanelLeftOpen
                className="expand-icon"
                size={20}
                strokeWidth={2.5}
              />
            ) : (
              <PanelLeftClose
                className="expand-icon"
                size={20}
                strokeWidth={2.5}
              />
            )}
          </button>
        </div>

        {/* ===================================================
            MENU
        ==================================================== */}

        <div className="sidebar-menu">
          {menuSections.map((section) => {
            const isOpen = openSections[section.title];

            return (
              <div
                className="menu-section"
                key={section.title}
              >
                {/* =================================================
                    SECTION TITLE
                ================================================== */}

                <button
                  type="button"
                  className="section-title"
                  onClick={() => toggleSection(section.title)}
                >
                  <span>{section.title}</span>

                  {!collapsed && (
                    <ChevronDown
                      size={17}
                      strokeWidth={2.5}
                      className={`section-arrow ${
                        isOpen ? "open" : ""
                      }`}
                    />
                  )}
                </button>

                {/* =================================================
                    EXPANDED ITEMS
                ================================================== */}

                {!collapsed && isOpen && (
                  <div className="section-items">
                    {section.items.map((item) => {
                      const isActive =
                        activeItem === item.label;

                      return (
                        <button
                          type="button"
                          key={item.label}
                          className={`sidebar-item ${
                            isActive ? "active" : ""
                          }`}
                          onClick={() =>
                            setActiveItem(item.label)
                          }
                        >
                          <span className="menu-icon-wrapper">
                            <img
                              src={item.icon}
                              alt=""
                              className={getIconClass(item)}
                            />
                          </span>

                          <span className="menu-label">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* =================================================
                    COLLAPSED ICONS
                ================================================== */}

                {collapsed && (
                  <div className="collapsed-section-items">
                    {section.items.map((item) => {
                      const isActive =
                        activeItem === item.label;

                      return (
                        <button
                          type="button"
                          key={item.label}
                          className={`collapsed-item ${
                            isActive ? "active" : ""
                          }`}
                          onClick={() =>
                            setActiveItem(item.label)
                          }
                          title={item.label}
                        >
                          <img
                            src={item.icon}
                            alt=""
                            className={`collapsed-icon ${
                              item.label === "Leave"
                                ? "collapsed-leave-icon"
                                : item.label === "Goals"
                                ? "collapsed-goals-icon"
                                : ""
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ===================================================
            SIDEBAR BOTTOM
        ==================================================== */}

        <div className="sidebar-bottom">
          {/* NEED HELP */}

          {!collapsed && (
            <button
              type="button"
              className="help-button"
            >
              <span className="help-icon">
                <Headphones
                  size={19}
                  strokeWidth={2.5}
                />
              </span>

              <span className="help-text">
                Need Help?
              </span>
            </button>
          )}

          {/* FOOTER LINKS */}

          {!collapsed && (
            <div className="sidebar-links">
              <span>People</span>
              <span>|</span>
              <span>Technology</span>
              <span>|</span>
              <span>Growth</span>
            </div>
          )}
        </div>
      </aside>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="employee-right">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="employee-header">
          {/* SEARCH */}

          <div className="header-search">
            <Search
              size={20}
              strokeWidth={2}
            />

            <input
              type="text"
              placeholder="Search here....."
            />
          </div>

          {/* HEADER ACTIONS */}

          <div className="header-actions">
            {/* DAY LIGHT */}

            <button
              type="button"
              className={`header-icon-button ${
                !darkMode ? "theme-active" : ""
              }`}
              onClick={() => setDarkMode(false)}
              title="Light Mode"
              aria-label="Light Mode"
            >
              <Sun
                size={24}
                strokeWidth={2}
              />
            </button>

            {/* NIGHT LIGHT */}

            <button
              type="button"
              className={`header-icon-button ${
                darkMode ? "theme-active" : ""
              }`}
              onClick={() => setDarkMode(true)}
              title="Dark Mode"
              aria-label="Dark Mode"
            >
              <Moon
                size={24}
                strokeWidth={2}
              />
            </button>

            {/* NOTIFICATION */}

            <button
              type="button"
              className="header-icon-button notification"
            >
              <Bell
                size={23}
                strokeWidth={2}
              />

              <span className="notification-dot"></span>
            </button>

            <div className="header-divider"></div>

            {/* EMPLOYEE PROFILE */}

            <div className="employee-profile">
              <div className="profile-image">
                <CircleUserRound
                  size={28}
                  strokeWidth={1.8}
                />
              </div>

              <div className="profile-details">
                <div className="employee-name">
                  Employee Name
                </div>

                <div className="employee-role">
                  Employee <span>•</span> Department
                </div>
              </div>

              <button
                type="button"
                className="profile-arrow-button"
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                aria-label="Profile menu"
              >
                <ChevronDown
                  size={18}
                  strokeWidth={2.5}
                  className={`profile-arrow ${
                    profileOpen ? "open" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <button
                    type="button"
                    className="logout-button"
                    onClick={() => {
                      localStorage.removeItem("isLoggedIn");
                      localStorage.removeItem("token");
                      localStorage.removeItem("refreshToken");
                      localStorage.removeItem("empId");
                      localStorage.removeItem("role");
                      navigate("/");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ===================================================
            MAIN
        ==================================================== */}

        <main className="employee-main">
          {/* ============================================================
              WELCOME SECTION
          ============================================================ */}

          <section className="dashboard-welcome">
            <div className="welcome-content">
              <div className="welcome-small">
                Good Morning,
              </div>

              <div className="welcome-title">
                Name!
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
                  purpose. “
                </span>
              </div>
            </div>

            {/* DATE */}

            <div className="dashboard-date">
  <img
    src={calenderIcon}
    alt="Calendar"
    className="dashboard-calendar-icon"
  />

  <div className="dashboard-date-content">
    <span className="dashboard-day">
      Monday
    </span>

    <strong>
      10 Sep 2026
    </strong>

    <span className="date-gradient-line"></span>
  </div>
</div>
            
          </section>
                    {/* ==================================================
              DASHBOARD ACTION BUTTONS
          ================================================== */}
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
              className="dashboard-action add-widget"
              aria-label="Add widget"
            >
              +
            </button>

            <button
              type="button"
              className="dashboard-action export-dashboard"
            >
              <Upload size={15} strokeWidth={2.5} />
              <span>Export</span>
            </button>

          </div>

          {/* ============================================================
              DASHBOARD CARDS
          ============================================================ */}

          <section className="dashboard-cards">
           {/* ============================================================
    ATTENDANCE CARD
    ============================================================ */}

<div className="figma-attendance-card">

  {/* ============================================================
      CARD HEADER
      ============================================================ */}

  <div className="attendance-card-title">
    <h2>Attendance</h2>

    <div className="attendance-status">
      <span
        className={`status-dot ${
          attendanceData.status === "Present"
            ? "present"
            : "absent"
        }`}
      ></span>

      <span>
        {attendanceData.status}
      </span>
    </div>
  </div>


  {/* ============================================================
      EMPLOYEE INFORMATION
      ============================================================ */}

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


  {/* ============================================================
      CHECK IN / CHECK OUT
      ============================================================ */}

  <div className="attendance-check-row">

    {/* ==========================================================
        CHECK IN
        ========================================================== */}

    <div className="check-box">

      <div className="check-icon check-in-icon">

        {/* YOUR IMPORTED LOGIN ICON */}
        <img
          src={loginIcon}
          alt="Check In"
        />

      </div>

      <div className="check-content">

        <span>
          check In
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


    {/* ==========================================================
        CHECK OUT
        ========================================================== */}

    <div className="check-box">

      <div className="check-icon check-out-icon">

        {/* SAME IMPORTED LOGIN ICON
            CSS WILL INVERT IT FOR CHECK OUT */}
        <img
          src={loginIcon}
          alt="Check Out"
        />

      </div>

      <div className="check-content">

        <span>
          check Out
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


  {/* ============================================================
      WORKING HOURS
      ============================================================ */}

  <div className="working-hours">

    <div className="working-hours-icon">

      {/* YOUR IMPORTED CLOCK ICON */}
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


      {/* ========================================================
          PROGRESS
          VARIANT:
          80-100  = GREEN
          <80     = BLUE
          <50     = YELLOW
          <30     = RED
          ======================================================== */}

      <div className="progress-row">

        <div className="progress-bar">

          <div
            className={`progress-fill ${
              attendanceData.progress >= 80
                ? "progress-green"
                : attendanceData.progress >= 50
                ? "progress-blue"
                : attendanceData.progress >= 30
                ? "progress-yellow"
                : "progress-red"
            }`}
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
        {attendanceData.completedHours} /{" "}
        {attendanceData.requiredHours}
      </small>

    </div>

  </div>


  {/* ============================================================
      SHIFT TIMING
      ============================================================ */}

  <div className="shift-timing">

    <div className="shift-icon">

      {/* YOUR IMPORTED DATE-RANGE / CALENDAR ICON */}
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


  {/* ============================================================
      LOCATION
      REMOVED AS REQUESTED
      ============================================================ */}


  {/* ============================================================
      VIEW DETAILS
      ============================================================ */}

  <button
    type="button"
    className="attendance-view-details"
  >

    <span>
      View Details
    </span>

    <ArrowRight
      size={18}
    />

  </button>

</div>
          </section>
        </main>

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <footer className="employee-footer">
          <div className="copyright">
            ©2026 Victinet IT Solutions PVT. LTD.
            All Rights Reserved.
          </div>

          <div className="footer-links">
            <a href="/privacy-policy">
              Privacy Policy
            </a>

            <span>|</span>

            <a href="/terms-of-use">
              Terms of Use
            </a>

            <span>|</span>

            <a href="/support">
              Support
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default EmployeeDashboard;