import {
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import "./Layout.css";

// Below this width the sidebar becomes an off-canvas drawer.
const MOBILE_QUERY = "(max-width: 768px)";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = (event) => setIsMobile(event.matches);

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isMobile;
};

const Layout = ({ children }) => {

  const [collapsed, setCollapsed] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  const [mobileNavOpen, setMobileNavOpen] =
    useState(false);

  const isMobile = useIsMobile();
  const location = useLocation();

  // Close the drawer after navigating or when leaving mobile width.
  const navKey = `${location.pathname}|${isMobile}`;
  const [prevNavKey, setPrevNavKey] = useState(navKey);

  if (navKey !== prevNavKey) {
    setPrevNavKey(navKey);
    setMobileNavOpen(false);
  }

  // Close the drawer with Escape.
  useEffect(() => {
    if (!mobileNavOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen]);

  // On mobile the collapse button closes the drawer instead.
  const handleSidebarToggle = isMobile
    ? () => setMobileNavOpen(false)
    : setCollapsed;

  return (
    <div
      className={`employee-page ${
        collapsed && !isMobile
          ? "sidebar-collapsed"
          : "sidebar-expanded"
      } ${
        darkMode
          ? "dark-mode"
          : "light-mode"
      } ${
        mobileNavOpen
          ? "mobile-nav-open"
          : ""
      }`}
    >

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar
        collapsed={collapsed && !isMobile}
        setCollapsed={handleSidebarToggle}
      />

      {/* Mobile drawer backdrop */}

      {mobileNavOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}


      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="employee-right">

        {/* HEADER */}

        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onMenuClick={() => setMobileNavOpen(true)}
        />


        {/* MAIN */}

        <main className="employee-main">

          {children}

        </main>


        {/* FOOTER */}

        <Footer />

      </div>

    </div>
  );
};

export default Layout;
