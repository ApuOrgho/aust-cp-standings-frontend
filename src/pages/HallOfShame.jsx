import React, { useState } from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
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
            className={`hos-tab-btn ${activeTab === "instructions" ? "hos-active" : ""
              }`}
            onClick={() => setActiveTab("instructions")}
          >
            Rules & Warnings
          </button>
          
          <button
            className={`hos-tab-btn ${activeTab === "list" ? "hos-active" : ""
              }`}
            onClick={() => setActiveTab("list")}
          >
            Hall of Shame
          </button>
        </div>

        <div className="hos-tab-content">
          {activeTab === "instructions" && (
            <div className="hos-card hos-instruction-card">
              <h2 className="hos-title">Zero Tolerance for Cheating</h2>
              <p className="hos-description">
                Cheating is a serious breach of our contest policies and academic integrity standards. To uphold fair competition,
                we maintain a public record of verified instances of cheating
              </p>


              <div className="hos-section">
                <h4>Criteria for Inclusion</h4>
                <ul>
                  <li>Confirmed plagiarism, copying, or account sharing.</li>
                  <li>Evidence of collusion during contests.</li>
                  <li>False representation of teams or members.</li>
                  <li>Plagiarizing code or logic from online sources.</li>
                  <li>Using multiple accounts to manipulate rankings.</li>
                  <li>Leaking or distributing contest problems/solutions.</li>
                  <li>Using AI/automation in unauthorized ways.</li>
                </ul>
              </div>

              <p>

              </p>
              

              <div className="hos-section">
                <h4>Consequences of Misconduct</h4>
                <ul>
                  <li><strong>Permanent bans</strong> from the entire AUST Competitive Programming Community, including all future contests, events, and activities.</li>
                  <li>Exposure on AUST Programming Group with a public announcement of the violation to the entire community.</li>
                  <li>Restriction from representing AUST in any future programming competition</li>
                  <li>Any apology after cheating will not be accepted or reduce the penalty.</li>
                  <li>Added to Hall of Shame permanently.</li>
                </ul>
              </div>

              <div className="hos-section">
                <p className="hoc-policy-end">
                ⚠️ We track logs, submissions, and behaviors carefully. Once caught,
                there's no going back.
              </p>
              </div>

            </div>
          )}

          {activeTab === "list" && (
            <div className="hos-card hos-list-card">
              <h2 className="hos-title">💀 Hall of Shame</h2>
              <div className="hos-cheater-list">
                {/* Sample entries — replace with actual dynamic data */}
                <div className="hos-cheater-card">

                </div>
                <div className="hos-cheater-card">

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
