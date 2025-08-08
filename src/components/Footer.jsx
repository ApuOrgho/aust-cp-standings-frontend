import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import "../styles/style.css";
import "../styles/comp/Footer.css";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodechefRatings,
  parseCodeforcesRatings,
} from "../utils";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div>
          © {new Date().getFullYear()} Apu Das Orgho
          <div className="small">Built for AUST students</div>
        </div>

        <div className="footer-social-links">
          <a
            className="nav-link small"
            href="https://www.facebook.com/hr.ishso/"
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebook size={18} /> Facebook
          </a>

          <a
            className="nav-link small"
            href="https://github.com/ApuOrgho"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub size={18} /> Github
          </a>

          <a
            className="nav-link small"
            href="https://www.linkedin.com/in/apu-das-orgho-5a72a7219/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin size={18} /> LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
