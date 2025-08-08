import React, { useState } from "react";
import "../styles/style.css";
import "../styles/page/About.css";

export default function About() {
  const [activeTab, setActiveTab] = useState("mission");

  return (
    <div className="about-wrapper">
      <div className="about-background" />

      <div className="container">
        <div className="about-title-container">
          <h1 className="about-main-title">
            Empowering AUST Competitive Programmers
          </h1>
        </div>

        <div className="hos-tab-buttons about-tab-buttons">
          <button
            className={`hos-tab-btn ${
              activeTab === "mission" ? "hos-active" : ""
            }`}
            onClick={() => setActiveTab("mission")}
          >
            Mission & Values
          </button>
          <button
            className={`hos-tab-btn ${
              activeTab === "stats" ? "hos-active" : ""
            }`}
            onClick={() => setActiveTab("stats")}
          >
            Stats & Features
          </button>
          <button
            className={`hos-tab-btn ${
              activeTab === "vision" ? "hos-active" : ""
            }`}
            onClick={() => setActiveTab("vision")}
          >
            Vision & Contact
          </button>
        </div>

        <div className="hos-tab-content about-tab-content">
          {activeTab === "mission" && (
            <div className="hos-card about-card">
              <h2>Why This Platform Exists</h2>
              <p>
                The primary goal is to encourage and nurture healthy competitive
                programming among AUST students by offering transparent
                performance tracking, motivation through ranks, and strict
                anti-cheating policies.
              </p>

              <h2>Our Core Principles</h2>
              <ul>
                <li>Transparency and accurate ranking system</li>
                <li>Elevating students through honest competition</li>
                <li>Zero-tolerance policy for cheaters</li>
                <li>Automation with human accountability</li>
              </ul>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="hos-card about-card">
              <h2>Platform at a Glance</h2>
              <div className="about-stats-grid">
                <div className="stat-card">
                  <h3>250+</h3>
                  <p>Registered AUST Users</p>
                </div>
                <div className="stat-card">
                  <h3>10K+</h3>
                  <p>Contests Tracked</p>
                </div>
                <div className="stat-card">
                  <h3>99%</h3>
                  <p>Uptime</p>
                </div>
                <div className="stat-card">
                  <h3>3+</h3>
                  <p>OJ Platforms Supported</p>
                </div>
              </div>

              <h2>Highlight Features</h2>
              <div className="about-scroll-cards">
                <div className="feature-card">Live updated standings</div>
                <div className="feature-card">
                  Rating Tracker from CF, CC & AtCoder
                </div>
                <div className="feature-card">Report & Ban Cheaters</div>
                <div className="feature-card">Leaderboards</div>
              </div>
            </div>
          )}

          {activeTab === "vision" && (
            <div className="hos-card about-card">
              <h2>Long-Term Vision</h2>
              <p>
                Beyond just statistics, we aim to create a competitive
                programming hub that encourages real growth, collaboration, and
                ethical conduct. From local contests to global ones, we envision
                our students standing out for their integrity and brilliance.
              </p>

              <h2>Contact</h2>
              <p>
                Email:{" "}
                <a href="mailto:apuorgho7@gmail.com">apuorgho7@gmail.com</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
