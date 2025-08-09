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
        const rawArr =
          ratings.ratings_all_codeforces ||
          ratings.ratings_all ||
          ratings ||
          [];
        const austUsers = rawArr
          .filter((r) => r.username && r.username.trim() !== "")
          .map((r) => r.username);
        if (!austUsers.length) throw new Error("No AUST users found");
        const austSet = new Set(austUsers.map((u) => normalizeName(u)));

        setLoadingMessage(
          "Fetching global contest standings from Codeforces..."
        );
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
    <div className="page-wrapper">
      <div className="page-background bg-contest" />
      <div className="container">
        {/* Buttons to toggle views */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <button
            className={`nc-tab-btn ${!showUpcoming ? "nc-active" : ""}`}
            onClick={() => setShowUpcoming(false)}
            type="button"
          >
            Search Standings
          </button>
          <button
            className={`nc-tab-btn ${showUpcoming ? "nc-active" : ""}`}
            onClick={() => setShowUpcoming(true)}
            type="button"
          >
            Upcoming Contests
          </button>
        </div>

        {/* Conditional rendering */}
        {!showUpcoming && (
          <>
            <form
              onSubmit={handleSearch}
              className="card"
              style={{ marginBottom: 16 }}
            >
              <h2 style={{ textAlign: "center" }}>Search Contest Standings</h2>
              <br />
              <div className="form-row">
                <div className="form-field">
                  <label>Platform</label>
                  <select
                    className="input"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  >
                    <option>AtCoder</option>
                    <option>Codeforces</option>
                    <option>CodeChef</option>
                  </select>
                </div>
                {platform === "AtCoder" && (
                  <div className="form-field">
                    <label>AtCoder contest type</label>
                    <select
                      className="input"
                      value={atType}
                      onChange={(e) => setAtType(e.target.value)}
                    >
                      <option value="abc">AtCoder Beginner Contest</option>
                      <option value="arc">AtCoder Regular Contest</option>
                      <option value="ahc">AtCoder Heuristic Contest</option>
                    </select>
                  </div>
                )}
                <div className="form-field">
                  <label>Contest ID</label>
                  <input
                    className="input"
                    value={contestId}
                    onChange={(e) => setContestId(e.target.value)}
                    placeholder={
                      platform === "AtCoder" ? "e.g. 391" : "e.g. 2129 or 197"
                    }
                  />
                </div>
              </div>
              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
              >
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? "Searching…" : "Search"}
                </button>
              </div>
            </form>

            {/* Loading/Error */}
            {loading && (
              <div className="card" style={{ textAlign: "center" }}>
                <LoadingSpinner />
                <div style={{ marginTop: 10, fontWeight: 600 }}>
                  {loadingMessage || "Loading contest standings..."}
                </div>
              </div>
            )}
            {error && (
              <div className="card">
                <div className="small">{error}</div>
              </div>
            )}

            {/* Results */}
            {!loading && !error && title && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  {getFullStandingsLink() && (
                    <a
                      href={getFullStandingsLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn secondary"
                    >
                      Full Standings
                    </a>
                  )}
                  <DownloadButton
                    containerId="contest-table"
                    filenamePrefix={`${platform.toLowerCase()}_${
                      contestId || "contest"
                    }`}
                  />
                </div>

                <ContestStandings
                  platform={platform}
                  title={
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                        {title}
                      </div>
                      <div style={{ fontSize: "0.9em", color: "#666" }}>
                        Ahsanullah University of Science and Technology
                      </div>
                    </div>
                  }
                  rows={rows}
                  columns={
                    platform === "AtCoder"
                      ? [
                          { key: "austRank", label: "AUST Rank" },
                          { key: "handle", label: "Handle" },
                          { key: "rank", label: "Rank" },
                          { key: "performance", label: "Performance" },
                          { key: "newRating", label: "New Rating" },
                        ]
                      : platform === "Codeforces"
                      ? [
                          { key: "austRank", label: "AUST Rank" },
                          { key: "handle", label: "Handle" },
                          { key: "rank", label: "Rank" },
                          { key: "points", label: "Points" },
                          { key: "penalty", label: "Penalty" },
                        ]
                      : [
                          { key: "austRank", label: "AUST Rank" },
                          { key: "username", label: "Username" },
                          { key: "Div", label: "Div" },
                          { key: "rank", label: "Rank" },
                          { key: "rating", label: "Rating" },
                          { key: "totalScore", label: "Total Score" },
                        ]
                  }
                  containerId="contest-table"
                />
              </>
            )}
          </>
        )}

        {/* Upcoming contests toggle */}
        {showUpcoming && <UpcomingContests />}
      </div>
    </div>
  );
}
