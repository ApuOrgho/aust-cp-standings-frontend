import React, { useState } from "react";
import Announcements from "../components/Announcements";
import "../styles/style.css";
import "../styles/page/Home.css";

export default function Home() {
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  const handleOverlayClick = () => {
    setShowAnnouncements(false);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="hme-wrapper">
      {/* Background */}
      <div className="hme-background" />

      {/* Announcement scroll bar */}
      <div
        className="hme-announcement-bar"
        onClick={() => setShowAnnouncements(true)}
      >
        <marquee behavior="scroll" direction="left" scrollamount="5">
          Click here to view all announcements.
        </marquee>
      </div>

      {/* Main content */}
      <div className="hme-container">
        <div className="hme-hero">
          <h1 className="hme-title">AUST Contest Standings</h1>
          <p className="hme-subtitle">
            Monitor ratings, standings, and contest history of AUST competitors
            across <b>AtCoder</b>, <b>Codeforces</b>, and <b>CodeChef</b>. Stay
            updated and never miss a contest!
          </p>

          <div className="hme-buttons">
            <a href="/standings/overall" className="hme-btn primary">
              Overall Standings
            </a>
            <a href="/standings/contest" className="hme-btn secondary">
              🔍 Contest Search
            </a>
            <a href="/report-cheater" className="hme-btn danger">
              Report Cheater
            </a>
          </div>
        </div>
      </div>

      {/* Overlay announcements */}
      {showAnnouncements && (
        <div className="hme-overlay" onClick={handleOverlayClick}>
          <div onClick={stopPropagation}>
            <Announcements />
          </div>
        </div>
      )}
    </div>
  );
}
