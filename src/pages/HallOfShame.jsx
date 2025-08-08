import React, { useState } from "react";
import "../styles/style.css";
import "../styles/page/HallOfShame.css";

export default function HallOfShame() {
  const [activeTab, setActiveTab] = useState("instructions");

  return (
    <div className="hos-wrapper">
      <div className="hos-background" />

      <div className="container">
        <div className="hos-tab-buttons">
          <button
            className={`hos-tab-btn ${
              activeTab === "instructions" ? "hos-active" : ""
            }`}
            onClick={() => setActiveTab("instructions")}
          >
            Rules & Warnings
          </button>
          <button
            className={`hos-tab-btn ${
              activeTab === "list" ? "hos-active" : ""
            }`}
            onClick={() => setActiveTab("list")}
          >
            Hall of Shame
          </button>
        </div>

        <div className="hos-tab-content">
          {activeTab === "instructions" && (
            <div className="hos-card hos-instruction-card">
              <h2 className="hos-title">Academic Integrity First</h2>
              <p className="hos-description">
                We maintain a public list of verified cases of cheating to
                uphold the standards of fair competition.
              </p>

              <div className="hos-section">
                <h4>Consequences of Misconduct</h4>
                <ul>
                  <li>Disqualification from future contests and rankings.</li>
                  <li>Reported to university contest admins.</li>
                  <li>Added to Hall of Shame permanently (in most cases).</li>
                </ul>
              </div>

              <div className="hos-section">
                <h4>Criteria for Inclusion</h4>
                <ul>
                  <li>Confirmed plagiarism, copying, or account sharing.</li>
                  <li>Evidence of collusion during contests.</li>
                  <li>False representation of teams or members.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "list" && (
            <div className="hos-card hos-list-card">
              <h2 className="hos-title">💀 Hall of Shame</h2>
              <div className="hos-cheater-list">
                {/* Sample entries — replace with actual dynamic data */}
                <div className="hos-cheater-card">
                  <h4>RAZA BABU</h4>
                  <p>
                    Reason: Code copying from another team during Y CONTEST
                    2024.
                  </p>
                </div>
                <div className="hos-cheater-card">
                  <h4>KHAJA BABU</h4>
                  <p>Reason: Account sharing in X CONTEST 2025.</p>
                </div>
                {/* Add more dynamic cards here */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
