import React, { useState } from "react";
import "../styles/style.css";
import "../styles/page/HallOfShame.css";

export default function HallOfShame() {
  // Cheater list is always empty now
  const [search, setSearch] = useState("");
  const filteredCheaters = [];
  const [activeTab, setActiveTab] = useState("instructions");

  return (
    <main className="hos-wrapper" aria-label="Hall of Shame Page">
      <nav className="hos-tab-buttons" aria-label="Hall of Shame Tabs">
        <button
          className={`hos-tab-btn${activeTab === "instructions" ? " hos-active" : ""}`}
          onClick={() => setActiveTab("instructions")}
          aria-selected={activeTab === "instructions"}
          aria-controls="hos-instructions-panel"
          tabIndex={activeTab === "instructions" ? 0 : -1}
        >
          Rules & Guidelines
        </button>
        <button
          className={`hos-tab-btn${activeTab === "list" ? " hos-active" : ""}`}
          onClick={() => setActiveTab("list")}
          aria-selected={activeTab === "list"}
          aria-controls="hos-list-panel"
          tabIndex={activeTab === "list" ? 0 : -1}
        >
          Hall of Shame
        </button>
      </nav>
      <section className="hos-tab-content">
        {activeTab === "instructions" && (
          <article
            className="hos-card hos-instruction-card"
            id="hos-instructions-panel"
            aria-labelledby="hos-instructions-title"
          >
            <h2 className="hos-title" id="hos-instructions-title">
              Zero Tolerance for Cheating
            </h2>
            <p>
              Cheating is a serious breach of our contest policies and academic integrity standards. To uphold fair competition, we maintain a public record of verified instances of cheating.
            </p>
            <h3>Criteria for Inclusion</h3>
            <ul>
              <li>Confirmed plagiarism, copying, or account sharing.</li>
              <li>Evidence of collusion during contests.</li>
              <li>False representation of teams or members.</li>
              <li>Plagiarizing code or logic from online sources.</li>
              <li>Using multiple accounts to manipulate rankings.</li>
              <li>Leaking or distributing contest problems/solutions.</li>
              <li>Using AI/automation in unauthorized ways.</li>
            </ul>
            <h3>Consequences of Misconduct</h3>
            <ul>
              <li>Permanent bans from the entire AUST Competitive Programming Community, including all future contests, events, and activities.</li>
              <li>Exposure on AUST Programming Group with a public announcement of the violation to the entire community.</li>
              <li>Restriction from representing AUST in any future programming competition.</li>
              <li>Any apology after cheating will not be accepted or reduce the penalty.</li>
              <li>Added to Hall of Shame permanently.</li>
            </ul>
            <p style={{color:'#d32f2f',marginTop:'1em'}}><b>⚠️ We track logs, submissions, and behaviors carefully. Once caught, there's no going back.</b></p>
          </article>
        )}
        {activeTab === "list" && (
          <article
            className="hos-card hos-list-card"
            id="hos-list-panel"
            aria-labelledby="hos-list-title"
          >
            <h2 className="hos-title" id="hos-list-title">
              💀 Hall of Shame
            </h2>
            <div style={{ marginBottom: "1.2rem" }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or reason..."
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
                aria-label="Search cheaters"
                disabled={false}
              />
            </div>
            <div className="hos-cheater-list">
              <div
                className="hos-cheater-card"
                tabIndex={0}
                aria-label="No cheaters listed"
              >
                <p style={{ textAlign: "center" }}>
                  Hall of Shame (0 entries). Guess we’re still in the Hall of Fame 🏆
                </p>
              </div>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
