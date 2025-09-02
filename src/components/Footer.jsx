import React from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import "../styles/style.css";
import "../styles/comp/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div>
          © {new Date().getFullYear()} AUST Competitive Programming
          <div className="small">Built for AUST students</div>
        </div>

        <div className="navb-navbar-right">
          <a
            className="nav-link small"
            href="https://www.facebook.com/profile.php?id=61579667431366"
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebook size={18} /> Page
          </a>

           <a
            className="nav-link small"
            href="https://www.facebook.com/groups/169147366481409"
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebook size={18} /> Group
          </a>

          <a
            className="nav-link small"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=aust.competitive.programming@gmail.com&su=Subject%20Here&body=Hello%2C%20"
            target="_blank"
            rel="noreferrer"
          >
            <FaEnvelope size={18} /> Email
          </a>



        </div>
      </div>
    </footer>
  );
}
