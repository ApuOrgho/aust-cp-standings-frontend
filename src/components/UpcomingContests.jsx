// src/components/UpcomingContests.jsx
import React, { useEffect, useState } from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import "../styles/comp/UpcomingContests.css";

function parseDateTime(dateStr, platform) {
  if (platform === "AtCoder") {
    return new Date(dateStr);
  } else if (platform === "Codeforces") {
    const cleaned = dateStr.replace(/\//g, " ").replace(/UTC.*/, "");
    return new Date(cleaned + " UTC");
  } else if (platform === "CodeChef") {
    if (!dateStr.startsWith("Starts in ")) return null;
    const now = new Date();
    // Convert now to Bangladesh time (UTC+6)
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000; // UTC ms
    const bdOffsetMs = 6 * 60 * 60000; // +6 hours in ms
    const bdNow = new Date(utcMs + bdOffsetMs);

    // Extract days, hours, minutes from string
    const dayMatch = dateStr.match(/(\d+)\s*Day/);
    const hourMatch = dateStr.match(/(\d+)\s*Hrs?/);
    const minMatch = dateStr.match(/(\d+)\s*Min/);

    const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;
    const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
    const mins = minMatch ? parseInt(minMatch[1], 10) : 0;

    // Add offsets to bdNow
    const futureMs = bdNow.getTime() + days * 86400000 + hours * 3600000 + mins * 60000;
    return new Date(futureMs);
  }
  return null;
}

function formatDuration(contest) {
  if (contest.length) return contest.length;
  const title = contest.contestName.toLowerCase();
  if (contest.platform === "AtCoder") {
    if (title.includes("beginner")) return "01:40";
    if (title.includes("regular")) return "02:30";
    if (title.includes("heuristic")) return "04:00";
    if (title.includes("grand")) return "03:00";
  }
  if (contest.platform === "CodeChef") {
    if (title.includes("starters")) return "02:00";
    if (title.includes("weekend dev")) return "1 Day";
  }
  return "—";
}

function calculateStartsIn(startTime, platform) {
  if (!startTime) return "—";
  if (platform === "CodeChef") {
    return startTime.replace("Starts in ", "");
  }
  const startDate = parseDateTime(startTime, platform);
  if (!startDate) return "—";

  const diffMs = startDate.getTime() - Date.now();
  if (diffMs <= 0) return "Started";

  const diffSec = Math.floor(diffMs / 1000);
  const days = Math.floor(diffSec / (3600 * 24));
  const hours = Math.floor((diffSec % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);

  let result = "";
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;

  return result.trim() || "Less than a minute";
}

function generateContestLink(contest) {
  const title = contest.contestName.toLowerCase();
  if (contest.platform === "CodeChef") {
    return `${contest.contestUrl}`;
  }
  if (contest.platform === "Codeforces" && contest.contestId) {
    return `https://codeforces.com/contests/${contest.contestId}`;
  }
  if (contest.platform === "AtCoder") {
    let type = "";
    let prefix = "";
    if (/beginner/.test(title)) {
      type = "abc";
      prefix = "beginner";
    } else if (/regular/.test(title)) {
      type = "arc";
      prefix = "regular";
    } else if (/heuristic/.test(title)) {
      type = "ahc";
      prefix = "heuristic";
    } else if (/grand/.test(title)) {
      type = "agc";
      prefix = "grand";
    }
    if (type !== "") {
      const regex = new RegExp(
        `atcoder\\s+${prefix}\\s+contest\\s+(\\d+)`,
        "i"
      );
      const match = title.match(regex);
      if (match && match[1]) {
        return `https://atcoder.jp/contests/${type}${match[1]}`;
      }
    }
  }
  return null;
}

export default function UpcomingContests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUpcoming() {
      setLoading(true);
      setError(null);
      try {
        const data = await getJSON("/upcoming_contests");
        if (data && Array.isArray(data.contests)) {
          const sorted = [...data.contests].sort((a, b) => {
            const d1 = parseDateTime(a.startTime, a.platform);
            const d2 = parseDateTime(b.startTime, b.platform);
            if (!d1 && !d2) return 0;
            if (!d1) return 1;
            if (!d2) return -1;
            return d1 - d2;
          });
          setContests(sorted);
        } else {
          setContests([]);
        }
      } catch (err) {
        setError("Failed to fetch upcoming contests.");
      } finally {
        setLoading(false);
      }
    }
    fetchUpcoming();
  }, []);

  if (loading) {
    return (
      <div className="upc-container">
        <div className="upc-loading">
          <div className="upc-loading-spinner"></div>
          <div className="upc-loading-text">Loading upcoming contests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="upc-container">
        <div className="upc-error">
          <div className="upc-error-icon">
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="upc-error-text">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="upc-container">
      <div className="upc-card">
        <div className="upc-header">
          <h2 className="upc-title">Upcoming Contests</h2>
          <p className="upc-subtitle">Stay updated with the latest competitive programming contests</p>
        </div>

        <div className="upc-table-container">
          <table className="upc-table">
            <thead>
              <tr>
                <th className="upc-th">Platform</th>
                <th className="upc-th">Contest Title</th>
                <th className="upc-th">Start Time</th>
                <th className="upc-th">Starts In</th>
                <th className="upc-th">Duration</th>
                <th className="upc-th">Contest Link</th>
              </tr>
            </thead>
            <tbody>
              {contests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="upc-no-data">
                    <div className="upc-no-data-content">
                      <div className="upc-no-data-icon">
                        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>No upcoming contests found.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                contests.map((c, idx) => (
                  <tr key={idx} className="upc-row">
                    <td className="upc-td">
                      <div className="upc-platform">
                        <div className={`upc-platform-badge ${c.platform.toLowerCase()}`}>
                          {c.platform === 'AtCoder' && 'AC'}
                          {c.platform === 'Codeforces' && 'CF'}
                          {c.platform === 'CodeChef' && 'CC'}
                        </div>
                        <span>{c.platform}</span>
                      </div>
                    </td>
                    <td className="upc-td">
                      <div className="upc-contest-name">{c.contestName}</div>
                    </td>
                    <td className="upc-td">
                      <div className="upc-start-time">
                        {(() => {
                          const dt = parseDateTime(c.startTime, c.platform);
                          return dt
                            ? dt.toLocaleString("en-GB", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                            : "—";
                        })()}
                      </div>
                    </td>
                    <td className="upc-td">
                      <div className="upc-starts-in">
                        {calculateStartsIn(c.startTime, c.platform)}
                      </div>
                    </td>
                    <td className="upc-td">
                      <div className="upc-duration">{formatDuration(c)}</div>
                    </td>
                    <td className="upc-td">
                      {generateContestLink(c) ? (
                        <a
                          href={generateContestLink(c)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="upc-link"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Contest
                        </a>
                      ) : (
                        <span className="upc-no-link">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
