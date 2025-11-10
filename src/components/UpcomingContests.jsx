import React, { useEffect, useState } from "react";
import { getJSON } from "../utils";
import "../styles/style.css";
import "../styles/comp/UpcomingContests.css";

function parseDateTime(contest) {
  // Prefer explicit startDate (YYYY-MM-DD) returned by backend for CodeChef Starters.
  // If startDate is present, create a local Date at 20:30 (8:30 PM).
  if (!contest) return null;

  // If backend provides startDate (YYYY-MM-DD), use it and set time to 20:30 local
  if (contest.startDate) {
    const parts = String(contest.startDate).split("-");
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1; // month 0-indexed
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m, d, 20, 30, 0, 0);
      }
    }
  }

  // Fallback: if startTime (ISO or other) is present, try to parse it
  // If CodeChef Starters provides a "Starts in ..." string, compute the target date
  if (
    contest.platform === "CodeChef" &&
    /Starters/i.test(contest.contestName || "") &&
    typeof contest.startTime === "string" &&
    /Starts in/i.test(contest.startTime)
  ) {
    const s = contest.startTime;
    const daysMatch = s.match(/(\d+)\s*Days?/i);
    const hoursMatch = s.match(/(\d+)\s*Hrs?/i);
    const minsMatch = s.match(/(\d+)\s*Min/i);

    const days = daysMatch ? parseInt(daysMatch[1], 10) : 0;
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;

    const deltaMs = ((days * 24 + hours) * 60 + mins) * 60 * 1000;
    const base = new Date(Date.now() + deltaMs);
    // set fixed start time to 20:30 local
    base.setHours(20, 30, 0, 0);
    return base;
  }

  if (contest.startTime) {
    const dt = new Date(contest.startTime);
    if (!isNaN(dt.getTime())) return dt;
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

function generateContestLink(contest) {
  const title = contest.contestName.toLowerCase();
  if (contest.platform === "CodeChef") return contest.contestUrl;
  if (contest.platform === "Codeforces" && contest.contestId)
    return `https://codeforces.com/contests/${contest.contestId}`;
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
      if (match && match[1])
        return `https://atcoder.jp/contests/${type}${match[1]}`;
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
          // Filter: for CodeChef, accept only contests whose title includes "Starters".
          // Keep all contests from other platforms.
          const sourceContests = data.contests.filter((c) => {
            if (!c) return false;
            if (c.platform !== "CodeChef") return true;
            return /starters/i.test(c.contestName || "");
          });

          // Separate valid and invalid dates
          const valid = [];
          const invalid = [];
          for (const contest of sourceContests) {
            const dt = parseDateTime(contest);
            if (dt && !isNaN(dt.getTime())) {
              valid.push({ ...contest, _dt: dt });
            } else {
              invalid.push(contest);
            }
          }
          valid.sort((a, b) => a._dt - b._dt);
          // Remove _dt before setting state
          setContests([
            ...valid.map((c) => {
              const { _dt, ...rest } = c;
              return rest;
            }),
            ...invalid,
          ]);
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

  return (
    <section className="upc-container container" aria-live="polite">
      {loading && (
        <div className="upc-loading muted">Loading upcoming contests…</div>
      )}
      {error && <div className="upc-error">{error}</div>}

      {!loading && !error && (
        <div className="card upc-card">
          <div className="upc-card-header" role="heading" aria-level="2">
            <h2 className="h6" style={{ margin: 0 }}>
              Upcoming Contests
            </h2>
            <div className="upc-card-actions" aria-hidden>
              <span className="muted">
                {contests.length} contest{contests.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="table-wrapper">
            <table
              className="upc-table"
              role="table"
              aria-label="Upcoming contests"
            >
              <thead>
                <tr>
                  <th className="upc-th">Platform</th>
                  <th className="upc-th">Contest Title</th>
                  <th className="upc-th">Start Time (local)</th>
                  <th className="upc-th">Duration</th>
                  <th className="upc-th">Link</th>
                </tr>
              </thead>
              <tbody>
                {contests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="upc-no-data">
                      No upcoming contests found.
                    </td>
                  </tr>
                ) : (
                  contests.map((c, i) => {
                    const dt = parseDateTime(c);
                    return (
                      <tr key={`${c.platform}-${i}`} className="upc-row">
                        <td className="upc-td">{c.platform}</td>
                        <td className="upc-td upc-title">{c.contestName}</td>
                        <td className="upc-td">
                          {dt
                            ? dt.toLocaleString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </td>
                        <td className="upc-td">{formatDuration(c)}</td>
                        <td className="upc-td">
                          {generateContestLink(c) ? (
                            <a
                              className="upc-link btn btn-primary btn-sm"
                              href={generateContestLink(c)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Go
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
