import React, { useState, useEffect } from "react";
import Announcements from "../components/Announcements";
// Icons for the navigation grid
import {
  FiSearch,
  FiGlobe,
  FiInfo,
  FiAlertTriangle,
  FiUserPlus,
  FiBarChart2,
} from "react-icons/fi";
import "../styles/style.css";
import "../styles/page/Home.css";

export default function Home() {
  // current time for live tracking
  const [currentTime, setCurrentTime] = useState(new Date());

  // announcement overlay state
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleOverlayClick = () => setShowAnnouncements(false);
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="hme-wrapper">
      <header className="hme-intro" style={{ maxWidth: 980, margin: "0 auto" }}>
        <h2 className="hme-intro-title">
          Welcome to the official site of AUST Competitive Programming Community
        </h2>
        <p style={{ marginTop: "10px" }}>
          Track your competitive programming progress across multiple platforms.
        </p>
      </header>

      {/* Announcement Bar */}
      <div
        className="hme-announcement-bar"
        onClick={() => setShowAnnouncements(true)}
      >
        <span className="hme-live-tag">NEW</span>
        <marquee behavior="scroll" direction="left" scrollamount="5">
          Latest contest updates and announcements available
        </marquee>
      </div>

      {/* Main Content Container */}
      <div className="hme-container">
        <div className="hme-hero">
          {/* Hero Section */}
          <div className="hme-hero-top">
            <div className="hme-live-status">
              <span className="hme-live-dot"></span>
              Live Tracking{" "}
              <span className="hme-time">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            <h1 className="hme-title">Master Your Competitive Journey</h1>
            <p className="hme-subtitle">
              Real-time analytics for your performance across <b>AtCoder</b>,
              <b>Codeforces</b>, and <b>CodeChef</b>. Stay ahead of the curve.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="hme-stats-grid">
            <div className="hme-stat-card">
              <div className="hme-stat-value">500+</div>
              <div className="hme-stat-label">Tracked Competitors</div>
            </div>
            <div className="hme-stat-card">
              <div className="hme-stat-value">3</div>
              <div className="hme-stat-label">Integrated Platforms</div>
            </div>
            <div className="hme-stat-card">
              <div className="hme-stat-value">24/7</div>
              <div className="hme-stat-label">Data Refresh</div>
            </div>
          </div>

          {/* Integrated Platforms Section */}
          <h2 className="hme-section-title">One Hub, All Platforms</h2>
          <div className="hme-platform-grid">
            <div className="hme-platform-card">
              <div className="hme-platform-logo">AC</div>
              <div className="hme-platform-details">
                <div className="hme-platform-name">AtCoder</div>
                <div className="hme-platform-subtitle">
                  Japan’s Leading Competitive Programming Platform
                </div>
              </div>
              <div className="hme-platform-info">
                <div className="hme-platform-users">150+ Users</div>
                <div className="hme-platform-online">Online</div>
              </div>
            </div>

            <div className="hme-platform-card">
              <div className="hme-platform-logo">CF</div>
              <div className="hme-platform-details">
                <div className="hme-platform-name">Codeforces</div>
                <div className="hme-platform-subtitle">
                  A global competitive programming platform
                </div>
              </div>
              <div className="hme-platform-info">
                <div className="hme-platform-users">200+ Users</div>
                <div className="hme-platform-online">Online</div>
              </div>
            </div>

            <div className="hme-platform-card">
              <div className="hme-platform-logo">CC</div>
              <div className="hme-platform-details">
                <div className="hme-platform-name">CodeChef</div>
                <div className="hme-platform-subtitle">
                  An Indian competitive programming platform
                </div>
              </div>
              <div className="hme-platform-info">
                <div className="hme-platform-users">150+ Users</div>
                <div className="hme-platform-online">Online</div>
              </div>
            </div>
          </div>

          {/* Quick Navigation Grid */}
          <h2 className="hme-section-title">Quick Navigation</h2>
          <div className="hme-nav-grid">
            <a href="/standings/overall" className="hme-nav-card">
              <FiBarChart2 size={24} />
              <div className="hme-nav-card-text">
                <h3>View Standings</h3>
                <p>See the complete university rankings</p>
              </div>
            </a>

            <a href="/standings/contest" className="hme-nav-card">
              <FiSearch size={24} />
              <div className="hme-nav-card-text">
                <h3>Search Contests</h3>
                <p>Filter by date, name, or platform</p>
              </div>
            </a>

            <a href="/national-contests" className="hme-nav-card">
              <FiGlobe size={24} />
              <div className="hme-nav-card-text">
                <h3>National Contests</h3>
                <p>Explore ICPC & NCPC archives</p>
              </div>
            </a>

            <a href="/about" className="hme-nav-card">
              <FiInfo size={24} />
              <div className="hme-nav-card-text">
                <h3>About Us</h3>
                <p>Our mission and contributors</p>
              </div>
            </a>

            <a href="/register" className="hme-nav-card">
              <FiUserPlus size={24} />
              <div className="hme-nav-card-text">
                <h3>Get on the Board</h3>
                <p>Register your programming handles</p>
              </div>
            </a>

            <a href="/report-cheater" className="hme-nav-card danger">
              <FiAlertTriangle size={24} />
              <div className="hme-nav-card-text">
                <h3>Report a Cheater</h3>
                <p>Report suspected cheating or unfair play</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Overlay announcements */}
      {showAnnouncements && (
        <div className="hme-overlay" onClick={handleOverlayClick}>
          {/* THIS IS THE CORRECTED LINE */}
          <div className="hme-modal-content" onClick={stopPropagation}>
            <Announcements />
          </div>
        </div>
      )}
    </div>
  );
}
