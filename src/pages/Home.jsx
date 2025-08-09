import React, { useState } from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import "../styles/style.css";
import "../styles/page/Home.css";
import Announcements from "../components/Announcements";

export default function Home() {
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  const handleOverlayClick = () => {
    setShowAnnouncements(false);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="page-wrapper">
      <div className="page-background bg-home" />

      {/* Announcement scroll bar */}
      <div
        className="announcement-bar"
        onClick={() => setShowAnnouncements(true)}
      >
        <marquee behavior="scroll" direction="left" scrollamount="5">
          Click here to view all announcements.
        </marquee>
      </div>

      {/* Main homepage content */}
      <div className="container hero home-content">
        <h1>AUST Contest Standings</h1>
        <p>
          Track AUST users' ratings and standings from <b>AtCoder</b>,{" "}
          <b>Codeforces</b>, and <b>CodeChef</b>.
        </p>

        <div className="home-buttons">
          <a href="/standings/overall" className="btn">
            Overall Standings
          </a>
          <a href="/standings/contest" className="btn ghost">
            Contest Search
          </a>
          <a href="/report-cheater" className="btn warn">
            Report Cheater
          </a>
        </div>
      </div>

      {showAnnouncements && (
        <div className="overlay" onClick={handleOverlayClick}>
          <div onClick={stopPropagation}>
            <Announcements />
          </div>
        </div>
      )}
    </div>
  );
}
