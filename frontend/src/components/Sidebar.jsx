import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ChevronDown,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";

import victinetLogo from "../assets/dashboard/Victinet Logo.svg";

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

import { Headphones } from "lucide-react";

import "./Sidebar.css";

const menuSections = [
  {
    title: "MY WORK",
    items: [
      {
        label: "My Dashboard",
        icon: homeIcon,
        path: "/employee-dashboard",
      },
      {
        label: "My Profile",
        icon: profileIcon,
      },
      {
        label: "Attendance",
        icon: attendanceIcon,
        path: "/attendance",
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

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSections, setOpenSections] = React.useState({
    "MY WORK": true,
    "MY RESOURCES": true,
    COMPANY: true,
    SUPPORT: true,
  });

  const toggleSection = (title) => {
    setOpenSections((previous) => ({
      ...previous,
      [title]: !previous[title],
    }));
  };

  const handleMenuClick = (item) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  const isActive = (item) => {
    if (item.path === "/attendance") {
      return location.pathname === "/attendance";
    }

    if (item.path === "/employee-dashboard") {
      return location.pathname === "/employee-dashboard";
    }

    return false;
  };

  const getIconClass = (item) => {
    if (item.label === "Leave") {
      return "menu-icon leave-menu-icon";
    }

    if (item.label === "Goals") {
      return "menu-icon goals-menu-icon";
    }

    return "menu-icon";
  };

  return (
    <aside
      className={`employee-sidebar ${
        collapsed ? "sidebar-collapsed" : "sidebar-expanded"
      }`}
    >

      {/* =====================================================
          LOGO
      ====================================================== */}

      <div className="sidebar-logo">
        <img src={victinetLogo} alt="Victinet" />
      </div>


      {/* =====================================================
          HRMS
      ====================================================== */}

      <div className="hrms-section">

        <div className="hrms-logo">
          <img src={hrmsLogo} alt="HRMS" />
        </div>

      <div className="hrms-text">
  <span className="hrms-title">
    HRMS
  </span>

  <span className="hrms-subtitle">
    Employee Portal
  </span>
</div>

      </div>


      {/* =====================================================
          SIDEBAR COLLAPSE BUTTON
      ====================================================== */}

      <div className="sidebar-expand-row">

        <button
          type="button"
          className="sidebar-expand-button"
          onClick={() => setCollapsed((previous) => !previous)}
          title={
            collapsed
              ? "Expand Sidebar"
              : "Collapse Sidebar"
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


      {/* =====================================================
          MENU
      ====================================================== */}

      <div className="sidebar-menu">

        {menuSections.map((section) => {

          const isOpen =
            openSections[section.title];

          return (
            <div
              className="menu-section"
              key={section.title}
            >

              {/* SECTION TITLE */}

              {!collapsed && (
                <button
                  type="button"
                  className="section-title"
                  onClick={() =>
                    toggleSection(section.title)
                  }
                >

                  <span>
                    {section.title}
                  </span>

                  <ChevronDown
                    size={17}
                    strokeWidth={2.5}
                    className={`section-arrow ${
                      isOpen ? "open" : ""
                    }`}
                  />

                </button>
              )}


              {/* EXPANDED */}

              {!collapsed && isOpen && (
                <div className="section-items">

                  {section.items.map((item) => {

                    const active =
                      isActive(item);

                    return (
                      <button
                        type="button"
                        key={item.label}
                        className={`sidebar-item ${
                          active ? "active" : ""
                        }`}
                        onClick={() =>
                          handleMenuClick(item)
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


              {/* COLLAPSED */}

              {collapsed && (
                <div className="collapsed-section-items">

                  {section.items.map((item) => {

                    const active =
                      isActive(item);

                    return (
                      <button
                        type="button"
                        key={item.label}
                        className={`collapsed-item ${
                          active ? "active" : ""
                        }`}
                        onClick={() =>
                          handleMenuClick(item)
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


      {/* =====================================================
          BOTTOM
      ====================================================== */}

      {!collapsed && (
        <div className="sidebar-bottom">

        


          {/* HELP */}

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


          {/* TEXT */}

          <div className="sidebar-links">

            <span>People</span>
            <span>|</span>
            <span>Technology</span>
            <span>|</span>
            <span>Growth</span>

          </div>

        </div>
      )}

    </aside>
  );
};

export default Sidebar;