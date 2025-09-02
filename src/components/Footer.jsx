import React from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import "../styles/style.css";
import "../styles/comp/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div>
          © {new Date().getFullYear()} 
          <div className="small">AUST Competitive Programming Community. All rights reserved.
</div>
        </div>

        <div className="navb-navbar-right">
         {
          
         }
        </div>
      </div>
    </footer>
  );
}
