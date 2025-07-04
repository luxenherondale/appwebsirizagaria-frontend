import React from "react";
import "./Footer.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = "1.0.0";
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          © {currentYear} Sistema Editorial Siriza Agaria. Todos los derechos reservados.
        </div>
        <div className="footer-version">
          Versión {appVersion}
        </div>
      </div>
    </footer>
  );
};
