import React, {
  useState,
} from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import "./Layout.css";

const Layout = ({ children }) => {

  const [collapsed, setCollapsed] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  return (
    <div
      className={`employee-page ${
        collapsed
          ? "sidebar-collapsed"
          : "sidebar-expanded"
      } ${
        darkMode
          ? "dark-mode"
          : "light-mode"
      }`}
    >

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />


      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="employee-right">

        {/* HEADER */}

        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
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