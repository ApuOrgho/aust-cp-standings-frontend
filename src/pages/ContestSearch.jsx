// src/pages/ContestSearch.jsx
import React, { useState } from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import LoadingSpinner from "../components/LoadingSpinner";
import ContestStandings from "../components/ContestStandings";
import DownloadButton from "../components/DownloadButton";
import UpcomingContests from "../components/UpcomingContests";
import "../styles/style.css";
import "../styles/page/ContestSearch.css";
import "../styles/comp/RatingsTable.css";

function normalizeName(n) {
  return (n || "").toString().trim().toLowerCase();
}

function padAtCoderId(id) {
  const num = id.toString().padStart(3, "0");
  return num;
}

export default function ContestSearch() {
  const [platform, setPlatform] = useState("AtCoder");
  const [atType, setAtType] = useState("abc");
  const [contestId, setContestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState([]);
  const [showUpcoming, setShowUpcoming] = useState(false);

  const getFullStandingsLink = () => {
    if (!contestId) return null;
    if (platform === "Codeforces") {
      return `https://codeforces.com/contest/${contestId}/standings`;
    } else if (platform === "CodeChef") {
      return `https://www.codechef.com/${contestId}`;
    } else if (platform === "AtCoder") {
      const paddedId = padAtCoderId(contestId);
      return `https://atcoder.jp/contests/${atType}${paddedId}/standings`;
    }
    return null;
  };

  async function handleSearch(e) {
    e?.preventDefault();
    setError(null);
    setTitle("");
    setRows([]);
    setLoading(true);
    setLoadingMessage("Preparing search...");

    try {
      if (platform === "AtCoder") {
        setLoadingMessage("Fetching AUST AtCoder users...");
        const ratings = await getJSON("/atcoder_ratings_all");
        const raw = ratings.ratings_all_atcoder || [];
        const austHandles = raw
          .filter((r) => r.username && r.username.trim() !== "")
          .map((r) => r.username);

        if (!austHandles.length) throw new Error("No AtCoder handles found");

        const austSet = new Set(austHandles.map((h) => normalizeName(h)));
        setLoadingMessage("Requesting contest standings from AtCoder...");

        const cid = `${atType}${padAtCoderId(contestId)}`;
        const handlesParam = encodeURIComponent(austHandles.join(","));
        const data = await getJSON(
          `/atcoder_standings?contestId=${encodeURIComponent(
            cid
          )}&handles=${handlesParam}`
        );

        setTitle(data.fullContestName || data.contestId || "AtCoder Contest");

        let results = (data.results || [])
          .filter((r) => austSet.has(normalizeName(r.handle)))
          .map((r) => ({
            handle: r.handle,
            rank: Number(r.rank) || r.rank || "—",
            performance: r.performance,
            newRating: r.newRating,
            diff: r.diff,
            raw: r,
          }));

        results.sort((a, b) => {
          const ra = Number(a.rank);
          const rb = Number(b.rank);
          if (!Number.isNaN(ra) && !Number.isNaN(rb)) return ra - rb;
          return 0;
        });

        results = results.map((r, i) => ({ ...r, austRank: i + 1 }));
        setRows(results);
      } else if (platform === "Codeforces") {
        setLoadingMessage("Fetching AUST Codeforces users...");
        const ratings = await getJSON("/codeforces_ratings_all");
        const rawArr = ratings.ratings_all_codeforces || ratings.ratings_all || ratings || [];
        const austUsers = rawArr
          .filter((r) => r.username && r.username.trim() !== "")
          .map((r) => r.username);

        if (!austUsers.length) throw new Error("No AUST users found");

        const austSet = new Set(austUsers.map((u) => normalizeName(u)));
        setLoadingMessage("Fetching global contest standings from Codeforces...");

        const data = await getJSON(`/codeforces_standings/${contestId}`);
        setTitle(data.contest_name || `Codeforces ${contestId}`);

        let filtered = (data.global_standings || []).filter((r) =>
          austSet.has(normalizeName(r.handle))
        );

        let results = filtered.map((r) => ({
          handle: r.handle,
          rank: Number(r.rank) || r.rank || "—",
          points: r.points,
          penalty: r.penalty,
          raw: r,
        }));

        results.sort((a, b) => {
          const ra = Number(a.rank);
          const rb = Number(b.rank);
          if (!Number.isNaN(ra) && !Number.isNaN(rb)) return ra - rb;
          return 0;
        });

        results = results.map((r, i) => ({ ...r, austRank: i + 1 }));
        setRows(results);
      } else if (platform === "CodeChef") {
        setLoadingMessage("Fetching AUST CodeChef users...");
        const ratings = await getJSON("/codechef_ratings_all");
        const rawArr = ratings.ratings_all || ratings.ratings || [];
        const austUsers = rawArr
          .filter((r) => r.username && r.username.trim() !== "")
          .map((r) => r.username);

        if (!austUsers.length) throw new Error("No AUST users found");

        const austSet = new Set(austUsers.map((u) => normalizeName(u)));
        setLoadingMessage("Requesting contest standings from CodeChef...");

        const data = await getJSON(
          `/codechef_standings?code=${encodeURIComponent(contestId)}`
        );
        setTitle(`CodeChef ${contestId}`);

        let filtered = (data.standings || []).filter((r) =>
          austSet.has(normalizeName(r.username))
        );

        let results = filtered.map((r) => ({
          username: r.username,
          Div: r.Div,
          rank: Number(r.rank) || r.rank || "—",
          rating: r.rating,
          totalScore: r.totalScore,
          raw: r,
        }));

        results.sort((a, b) => {
          const ra = Number(a.rank);
          const rb = Number(b.rank);
          if (!Number.isNaN(ra) && !Number.isNaN(rb)) return ra - rb;
          return 0;
        });

        results = results.map((r, i) => ({ ...r, austRank: i + 1 }));
        setRows(results);
      }
    } catch (err) {
      console.error("ContestSearch error:", err);
      setError(err && err.message ? err.message : "Failed to fetch standings");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  }

  return (
    <div className="cst-wrapper">
      {/* Enhanced Background */}
      <div className="cst-background">
        <div className="cst-background-overlay"></div>
        <div className="cst-background-particles"></div>
      </div>

      {/* Main Content */}
      <main className="cst-container">
        {/* Header Section */}
        <div className="cst-header">
          <div className="cst-header-content">
            <h1 className="cst-title">Contest Search</h1>
            <p className="cst-subtitle">
              Search and analyze AUST performance in specific contests
            </p>
          </div>

          {/* Quick Actions */}
          <div className="cst-quick-actions">
            <button
              className={`cst-action-btn ${!showUpcoming ? 'active' : ''}`}
              onClick={() => setShowUpcoming(false)}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Contest Search
            </button>
            <button
              className={`cst-action-btn ${showUpcoming ? 'active' : ''}`}
              onClick={() => setShowUpcoming(true)}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Upcoming Contests
            </button>
          </div>
        </div>

        {/* Show Upcoming Contests or Search Form */}
        {showUpcoming ? (
          <div className="cst-upcoming-section">
            <UpcomingContests />
          </div>
        ) : (
          <>
            {/* Search Form */}
            <div className="cst-search-section">
              <div className="cst-search-card">
                <div className="cst-search-header">
                  <h2 className="cst-search-title">Search Contest Standings</h2>
                  <p className="cst-search-subtitle">Enter contest details to view AUST participants</p>
                </div>

                <form onSubmit={handleSearch} className="cst-search-form">
                  {/* Platform Selection */}
                  <div className="cst-form-group">
                    <label className="cst-form-label">Platform</label>
                    <div className="cst-platform-select">
                      {["AtCoder", "Codeforces", "CodeChef"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={`cst-platform-option ${platform === p ? 'active' : ''}`}
                          onClick={() => setPlatform(p)}
                        >
                          <div className="cst-platform-icon">
                            {p === 'AtCoder' && 'AC'}
                            {p === 'Codeforces' && 'CF'}
                            {p === 'CodeChef' && 'CC'}
                          </div>
                          <span>{p}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AtCoder Type Selection */}
                  {platform === "AtCoder" && (
                    <div className="cst-form-group">
                      <label className="cst-form-label">Contest Type</label>
                      <div className="cst-contest-type-select">
                        {[
                          { value: "abc", label: "ABC (Beginner)" },
                          { value: "arc", label: "ARC (Regular)" },
                          { value: "agc", label: "AGC (Grand)" }
                        ].map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            className={`cst-type-option ${atType === type.value ? 'active' : ''}`}
                            onClick={() => setAtType(type.value)}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contest ID Input */}
                  <div className="cst-form-group">
                    <label className="cst-form-label">
                      Contest ID
                      {platform === "AtCoder" && (
                        <span className="cst-form-hint">
                          (e.g., 350 for ABC350)
                        </span>
                      )}
                      {platform === "Codeforces" && (
                        <span className="cst-form-hint">
                          (e.g., 1900 for contest 1900)
                        </span>
                      )}
                      {platform === "CodeChef" && (
                        <span className="cst-form-hint">
                          (e.g., START135A)
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={contestId}
                      onChange={(e) => setContestId(e.target.value)}
                      placeholder={
                        platform === "AtCoder" ? "Enter contest number" :
                        platform === "Codeforces" ? "Enter contest ID" :
                        "Enter contest code"
                      }
                      className="cst-form-input"
                      required
                    />
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    disabled={!contestId.trim() || loading}
                    className="cst-search-btn"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="small" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Search Contest</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="cst-loading-section">
                <div className="cst-loading-card">
                  <LoadingSpinner />
                  <div className="cst-loading-content">
                    <div className="cst-loading-title">Searching Contest</div>
                    <div className="cst-loading-message">{loadingMessage}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="cst-error-section">
                <div className="cst-error-card">
                  <div className="cst-error-icon">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                  </div>
                  <div className="cst-error-content">
                    <div className="cst-error-title">Search Failed</div>
                    <div className="cst-error-message">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Section */}
            {!loading && !error && title && rows.length > 0 && (
              <div className="cst-results-section">
                <div className="cst-results-header">
                  <div className="cst-results-info">
                    <h3 className="cst-results-title">{title}</h3>
                    <p className="cst-results-subtitle">
                      {rows.length} AUST participants found
                    </p>
                  </div>
                  
                  <div className="cst-results-actions">
                    <DownloadButton
                      containerId="contest-standings-table"
                      filename={`${platform.toLowerCase()}_${contestId}_standings`}
                      className="cst-download-btn"
                    />
                    {getFullStandingsLink() && (
                      <a
                        href={getFullStandingsLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cst-external-btn"
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Full Standings
                      </a>
                    )}
                  </div>
                </div>

                <div className="cst-standings-container" id="contest-standings-table">
                  <ContestStandings
                    platform={platform}
                    rows={rows}
                    className="cst-standings-table"
                  />
                </div>
              </div>
            )}

            {/* No Results State */}
            {!loading && !error && title && rows.length === 0 && (
              <div className="cst-no-results-section">
                <div className="cst-no-results-card">
                  <div className="cst-no-results-icon">
                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="cst-no-results-content">
                    <h3 className="cst-no-results-title">No AUST Participants Found</h3>
                    <p className="cst-no-results-message">
                      No AUST students participated in {title}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
