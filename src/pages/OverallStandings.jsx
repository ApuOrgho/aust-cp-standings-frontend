import React, { useEffect, useState, useRef } from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import RatingsTable from "../components/RatingsTable";
import DownloadButton from "../components/DownloadButton";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/style.css";
import "../styles/page/OverallStandings.css";

export default function OverallStandings() {
  const [active, setActive] = useState("atcoder");
  const [loading, setLoading] = useState(false);
  const [atcoderRows, setAtcoderRows] = useState([]);
  const [codeforcesRows, setCodeforcesRows] = useState([]);
  const [codechefRows, setCodechefRows] = useState([]);
  const [error, setError] = useState(null);

  const loadingMessages = [
    "This may take a few seconds...",
    "Finding AUST users...",
    "Collecting latest standings...",
    "Sorting by rating...",
    "Finalizing data — almost ready...",
  ];

  const [loadingMessage, setLoadingMessage] = useState("");
  const timeoutsRef = useRef([]);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      setError(null);
      setLoadingMessage(loadingMessages[0]);
      
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];

      let acc = 0;
      for (let i = 1; i < loadingMessages.length; i++) {
        acc += 4000;
        const idx = i;
        const t = setTimeout(() => {
          setLoadingMessage(loadingMessages[idx]);
        }, acc);
        timeoutsRef.current.push(t);
      }

      try {
        const a = await getJSON("/atcoder_ratings_all");
        const parsedA = parseAtCoderRatings(a);
        parsedA.sort(
          (x, y) =>
            Number(y.rating || 0) - Number(x.rating || 0) ||
            (x.username || "").localeCompare(y.username || "")
        );
        setAtcoderRows(parsedA);

        const cf = await getJSON("/codeforces_ratings_all");
        const parsedCF = parseCodeforcesRatings(cf);
        parsedCF.sort(
          (x, y) =>
            Number(y.rating || 0) - Number(x.rating || 0) ||
            (x.username || "").localeCompare(y.username || "")
        );
        setCodeforcesRows(parsedCF);

        const cc = await getJSON("/codechef_ratings_all");
        const parsedCC = parseCodechefRatings(cc);
        parsedCC.sort(
          (x, y) =>
            Number(y.rating_digit || 0) - Number(x.rating_digit || 0) ||
            (x.username || "").localeCompare(y.username || "")
        );
        setCodechefRows(parsedCC);
      } catch (err) {
        console.error("OverallStandings load error:", err);
        setError("Failed to load ratings. Is backend running?");
      } finally {
        timeoutsRef.current.forEach((t) => clearTimeout(t));
        timeoutsRef.current = [];
        setLoading(false);
        setLoadingMessage("");
      }
    }

    loadAll();
    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  const platformConfig = {
    atcoder: {
      rows: atcoderRows,
      columns: [
        { key: "austRank", label: "AUST Rank" },
        { key: "username", label: "Username", linkPlatform: "atcoder" },
        { key: "rating", label: "Rating" },
      ],
      containerId: "atcoder-table",
      filenamePrefix: "atcoder_overall",
      tableTitle: "AtCoder",
      fullStandingsUrl: "https://atcoder.jp/ranking/all",
      description: "Japanese competitive programming platform",
    },
    codeforces: {
      rows: codeforcesRows,
      columns: [
        { key: "austRank", label: "AUST Rank" },
        { key: "username", label: "Username", linkPlatform: "codeforces" },
        { key: "rating", label: "Rating" },
        { key: "contestParticipated", label: "Contests" },
      ],
      containerId: "codeforces-table",
      filenamePrefix: "codeforces_overall",
      tableTitle: "Codeforces",
      fullStandingsUrl: "https://codeforces.com/ratings",
      description: "Global competitive programming platform",
    },
    codechef: {
      rows: codechefRows,
      columns: [
        { key: "austRank", label: "AUST Rank" },
        { key: "username", label: "Username", linkPlatform: "codechef" },
        { key: "rating_digit", label: "Rating" },
        { key: "rating_star", label: "Star" },
        { key: "global_rank", label: "Global Rank" },
      ],
      containerId: "codechef-table",
      filenamePrefix: "codechef_overall",
      tableTitle: "CodeChef",
      fullStandingsUrl: "https://www.codechef.com/ratings",
      description: "Indian competitive programming platform",
    },
  };

  function withAustRank(rows) {
    return (rows || []).map((r, i) => ({ ...r, austRank: i + 1 }));
  }

  const cfg = platformConfig[active];
  const rowsToShow = withAustRank(cfg.rows);

  return (
    <div className="ost-wrapper">
      {/* Enhanced Background */}
      <div className="ost-background">
        <div className="ost-background-overlay"></div>
        <div className="ost-background-particles"></div>
      </div>

      {/* Main Content Container */}
      <main className="ost-container">
        {/* Header Section */}
        <div className="ost-header">
          <div className="ost-header-content">
            <h1 className="ost-title">Overall Standings</h1>
            <p className="ost-subtitle">Track AUST competitive programmers across multiple platforms</p>
          </div>
        </div>

        {/* Enhanced Platform Selection */}
        <div className="ost-platform-section">
          <div className="ost-platform-header">
            <h2 className="ost-platform-title">Select Platform</h2>
            <p className="ost-platform-subtitle">Choose a platform to view standings</p>
          </div>

          <div className="ost-platform-buttons">
            {Object.entries(platformConfig).map(([key, platform]) => (
              <button
                key={key}
                className={`ost-platform-btn ${active === key ? 'active' : ''}`}
                onClick={() => setActive(key)}
              >
                <div className="ost-platform-btn-icon">
                  {key === 'atcoder' && 'AC'}
                  {key === 'codeforces' && 'CF'}
                  {key === 'codechef' && 'CC'}
                </div>
                <div className="ost-platform-btn-content">
                  <div className="ost-platform-btn-name">{platform.tableTitle}</div>
                  <div className="ost-platform-btn-desc">{platform.description}</div>
                </div>
                <div className="ost-platform-btn-arrow">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="ost-loading-section">
            <div className="ost-loading-card">
              <LoadingSpinner />
              <div className="ost-loading-content">
                <div className="ost-loading-title">Loading Standings</div>
                <div className="ost-loading-message">{loadingMessage}</div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="ost-error-section">
            <div className="ost-error-card">
              <div className="ost-error-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              <div className="ost-error-content">
                <div className="ost-error-title">Failed to Load Data</div>
                <div className="ost-error-message">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Data Display - This will appear below the dark navbar */}
        {!loading && !error && cfg && (
          <div className="ost-data-section">
            <div className="ost-data-header">
              <div className="ost-data-info">
                <h3 className="ost-data-title">{cfg.tableTitle} Standings</h3>
                <p className="ost-data-subtitle">
                  {rowsToShow.length} AUST users • Updated in real-time
                </p>
              </div>
              
              <div className="ost-data-actions">
                <DownloadButton
                  containerId={cfg.containerId}
                  filename={cfg.filenamePrefix}
                  className="ost-download-btn"
                />
                <a
                  href={cfg.fullStandingsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ost-external-btn"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Full Rankings
                </a>
              </div>
            </div>

            <div className="ost-table-container" id={cfg.containerId}>
              <RatingsTable
                columns={cfg.columns}
                rows={rowsToShow}
                className="ost-ratings-table"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
