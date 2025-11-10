import React from "react";
// Removed unused utility imports for a cleaner file
import "../styles/style.css";
import "../styles/comp/Announcements.css";

export default function Announcements() {
  // Format the current date
  const currentDate = "November 5, 2025";

  return (
    <div
      className="announcement-box"
      tabIndex={0}
      aria-label="Announcements"
      role="dialog"
      style={{
        maxHeight: "70vh",
        overflowY: "auto",
        overscrollBehavior: "contain",
        position: "relative",
      }}
    >
      <button
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 9999,
          background: "#fff",
          color: "#0057a0",
          border: "1px solid #e6eaf0",
          borderRadius: "50%",
          width: 32,
          height: 32,
          fontWeight: 700,
          fontSize: 18,
          boxShadow: "0 2px 8px rgba(0,87,160,0.08)",
          cursor: "pointer",
        }}
        aria-label="Close announcements"
        onClick={() => window.history.back()}
      >
        ×
      </button>
      <h1 className="announcement-title">Announcements</h1>
      <p className="announcement-intro">
        Here are the latest updates, features, and news from our community.
      </p>

      {/* --- Announcement 1 --- */}
      <div className="announcement-card">
        <h2>AUST CP Hub is Live!</h2>
        <p className="announcement-date">{currentDate}</p>
        <p>
          The centralized platform is now live! Track ratings, standings, and
          contest history across all major platforms. Explore, compete, and
          climb the leaderboard.
        </p>
      </div>

      {/* --- Announcement 2 --- */}
      <div className="announcement-card">
        <h2>Dark Mode Enabled</h2>
        <p className="announcement-date">{currentDate}</p>
        <p>
          Following the latest design trends, we've implemented a full
          light/dark mode toggle. You can switch themes using the icon in the
          navbar.
        </p>
      </div>
    </div>
  );
}
