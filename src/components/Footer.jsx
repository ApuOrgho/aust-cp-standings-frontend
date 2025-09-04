import React from "react";

import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";

import { FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaUsers } from "react-icons/fa";

import "../styles/style.css";
import "../styles/comp/Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner container">
        {/* Footer Left Content */}
        <div className="footer-left">
          <div className="footer-logo">
            <FaUsers className="footer-logo-icon" />
          </div>
          <div className="footer-text">
            <span>© </span>
            <span className="footer-year">{currentYear}</span>
            <span> Apu Das Orgho</span>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-description">
            Built for AUST students
          </div>
        </div>

        {/* Footer Right - Social Links */}
        <div className="footer-social-links">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Facebook"
            className="footer-social-link facebook"
          >
            <FaFacebook className="footer-social-icon" />
            <span>Facebook</span>
          </a>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Check our GitHub"
            className="footer-social-link github"
          >
            <FaGithub className="footer-social-icon" />
            <span>Github</span>
          </a>
          
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Connect on LinkedIn"
            className="footer-social-link linkedin"
          >
            <FaLinkedin className="footer-social-icon" />
            <span>Linkedin</span>
          </a>

          {/* Status Indicator */}
          <div className="footer-status">
            <div className="footer-status-dot"></div>
            <span className="footer-status-text">Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
