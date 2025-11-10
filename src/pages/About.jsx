import React, { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/style.css";
import "../styles/page/About.css";

export default function About() {
  const [activeTab, setActiveTab] = useState("mission");
  const [platformStats, setPlatformStats] = useState({
    users: 250,
    contests: 10000,
    successRate: 99,
  });
  const [loading, setLoading] = useState(false);
  // animated counters
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    contests: 0,
    successRate: 0,
  });

  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeMsg, setSubscribeMsg] = useState("");

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab !== "stats") return;
    const duration = 900;
    const frameRate = 30;
    const steps = Math.max(1, Math.floor((duration / 1000) * frameRate));
    const start = { ...animatedStats };
    const end = platformStats;
    let step = 0;
    const t = setInterval(() => {
      step += 1;
      const progress = Math.min(1, step / steps);
      setAnimatedStats({
        users: Math.floor(end.users * progress),
        contests: Math.floor(end.contests * progress),
        successRate: Math.floor(end.successRate * progress),
      });
      if (progress === 1) clearInterval(t);
    }, duration / steps);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  function copyEmail() {
    const mail = "aust.competitive.programming@gmail.com";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(mail).then(() => {
        setSubscribeMsg("Contact email copied to clipboard");
        setTimeout(() => setSubscribeMsg(""), 2500);
      });
    }
  }

  function handleSubscribe(e) {
    e.preventDefault();
    if (!subscribeEmail || !subscribeEmail.includes("@")) {
      setSubscribeMsg("Please enter a valid email");
      setTimeout(() => setSubscribeMsg(""), 2500);
      return;
    }
    setSubscribeMsg("Thanks — subscription saved (demo)");
    setSubscribeEmail("");
    setTimeout(() => setSubscribeMsg(""), 2000);
  }

  return (
    <div className="about-wrapper">
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
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="about-stats-grid">
                    <div
                      className="stat-card"
                      data-aos="fade-up"
                      data-aos-delay="100"
                    >
                      <h3>{animatedStats.users}+ </h3>
                      <p>Active AUST Users</p>
                      <div className="stat-trend positive">
                        ↑ 15% this month
                      </div>
                    </div>
                    <div
                      className="stat-card"
                      data-aos="fade-up"
                      data-aos-delay="200"
                    >
                      <h3>{animatedStats.contests}+</h3>
                      <p>Contests Tracked</p>
                      <div className="stat-trend positive">↑ 25% growth</div>
                    </div>
                    <div
                      className="stat-card"
                      data-aos="fade-up"
                      data-aos-delay="400"
                    >
                      <h3>{animatedStats.successRate}%</h3>
                      <p>Platform Uptime</p>
                      <div className="stat-trend positive">↑ Reliable</div>
                    </div>
                  </div>

                  <div
                    className="platform-highlights"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <h3>Platform Highlights</h3>
                    <div className="highlights-grid">
                      <div className="highlight-item">
                        <span className="highlight-icon">🏆</span>
                        <h4>Multi-Platform Support</h4>
                        <p>
                          Track your progress across CodeForces, AtCoder, and
                          CodeChef
                        </p>
                      </div>
                      <div className="highlight-item">
                        <span className="highlight-icon">📊</span>
                        <h4>Real-Time Analytics</h4>
                        <p>Live standings and performance metrics</p>
                      </div>
                      <div className="highlight-item">
                        <span className="highlight-icon">�</span>
                        <h4>AUST National Contestants</h4>
                        <p>
                          Record of AUST participants and their national contest
                          appearances
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Restore this section as requested */}
                  <h2>Highlight Features</h2>
                  <div className="about-scroll-cards">
                    <div className="feature-card">Live updated standings</div>
                    <div className="feature-card">
                      Rating Tracker from CF, CC & AtCoder
                    </div>
                    <div className="feature-card">Report & Ban Cheaters</div>
                    <div className="feature-card">Leaderboards</div>
                  </div>
                </>
              )}

              <div className="about-actions" style={{ marginTop: 18 }}>
                <button
                  className="btn"
                  onClick={copyEmail}
                  style={{ marginLeft: 8 }}
                >
                  Copy Contact Email
                </button>

                <form
                  className="about-subscribe"
                  onSubmit={handleSubscribe}
                  style={{ display: "inline-block", marginLeft: 12 }}
                >
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    className="about-subscribe-input"
                    aria-label="Subscribe email"
                  />
                  <button
                    className="btn"
                    type="submit"
                    style={{ marginLeft: 8 }}
                  >
                    Subscribe
                  </button>
                </form>
                {subscribeMsg && (
                  <div className="about-sub-msg">{subscribeMsg}</div>
                )}
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
                <a href="mailto:apuorgho7@gmail.com">
                  aust.competitive.programming@gmail.com
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
