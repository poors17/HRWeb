import React from "react";

import "./Footer.css";

const Footer = () => {
  return (
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
  );
};

export default Footer;