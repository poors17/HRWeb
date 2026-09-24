import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  CircleUserRound,
  Menu,
} from "lucide-react";

import "./Header.css";

const Header = ({ darkMode, setDarkMode, onMenuClick }) => {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = React.useState(false);
  const userName = localStorage.getItem("name") || "User";
  const userRole = localStorage.getItem("role") || "Employee";
  const department = localStorage.getItem("department") || "";

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    // Clear login information
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("empId");
    localStorage.removeItem("role");
    localStorage.removeItem("department");
    localStorage.removeItem("name");

    // Close profile menu
    setProfileOpen(false);

    // Go to login page
    navigate("/login", { replace: true });
  };

  return (
    <header className="employee-header">

      {/* ==========================================
          MOBILE MENU (visible on small screens)
      ========================================== */}

      <button
        type="button"
        className="header-menu-button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu
          size={24}
          strokeWidth={2}
        />
      </button>

      {/* ==========================================
          SEARCH
      ========================================== */}

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

      {/* ==========================================
          HEADER ACTIONS
      ========================================== */}

      <div className="header-actions">

        {/* ==========================================
            LIGHT MODE
        ========================================== */}

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

        {/* ==========================================
            DARK MODE
        ========================================== */}

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

        {/* ==========================================
            NOTIFICATION
        ========================================== */}

        <button
          type="button"
          className="header-icon-button notification"
          aria-label="Notifications"
        >
          <Bell
            size={23}
            strokeWidth={2}
          />

          <span className="notification-dot"></span>
        </button>

        {/* ==========================================
            DIVIDER
        ========================================== */}

        <div className="header-divider"></div>

        {/* ==========================================
            PROFILE
        ========================================== */}

        <div className="employee-profile">

          {/* PROFILE IMAGE */}

          <div className="profile-image">
            <CircleUserRound
              size={28}
              strokeWidth={1.8}
            />
          </div>

          {/* PROFILE DETAILS */}

          <div className="profile-details">

            <div className="employee-name">
              {userName}
            </div>

            <div className="employee-role">
              {department ? (
                <>
                  {userRole} <span>•</span> {department}
                </>
              ) : (
                userRole
              )}
            </div>

          </div>

          {/* ==========================================
              PROFILE ARROW
          ========================================== */}

          <button
            type="button"
            className="profile-arrow-button"
            onClick={() =>
              setProfileOpen(
                (previous) => !previous
              )
            }
            aria-label="Profile menu"
            aria-expanded={profileOpen}
          >
            <ChevronDown
              size={18}
              strokeWidth={2.5}
              className={`profile-arrow ${
                profileOpen ? "open" : ""
              }`}
            />
          </button>

          {/* ==========================================
              PROFILE DROPDOWN
          ========================================== */}

          {profileOpen && (
            <div className="profile-dropdown">

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Header;