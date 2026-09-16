import React from "react";

import {
  Search,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  CircleUserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Header.css";

const Header = ({
  darkMode,
  setDarkMode,
}) => {

  const [profileOpen, setProfileOpen] =
    React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
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

        {/* LIGHT */}

        <button
          type="button"
          className={`header-icon-button ${
            !darkMode ? "theme-active" : ""
          }`}
          onClick={() => setDarkMode(false)}
          title="Light Mode"
        >
          <Sun
            size={24}
            strokeWidth={2}
          />
        </button>


        {/* DARK */}

        <button
          type="button"
          className={`header-icon-button ${
            darkMode ? "theme-active" : ""
          }`}
          onClick={() => setDarkMode(true)}
          title="Dark Mode"
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


        {/* DIVIDER */}

        <div className="header-divider"></div>


        {/* PROFILE */}

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
              setProfileOpen(
                (previous) => !previous
              )
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