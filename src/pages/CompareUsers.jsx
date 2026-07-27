import React, { useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import {
  getJSON,
  getPlatformProfileUrl,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import RatingBadge from "../components/RatingBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/style.css";
import "../styles/page/CompareUsers.css";

const PLATFORM_CONFIGS = {
  codeforces: {
    label: "Codeforces",
    apiEndpoint: "/codeforces_ratings_all",
    parser: parseCodeforcesRatings,
    ratingKey: "rating",
    sort: (a, b) =>
      Number(b.rating || 0) - Number(a.rating || 0) ||
      (a.username || "").localeCompare(b.username || ""),
  },
  atcoder: {
    label: "AtCoder",
    apiEndpoint: "/atcoder_ratings_all",
    parser: parseAtCoderRatings,
    ratingKey: "rating",
    sort: (a, b) =>
      Number(b.rating || 0) - Number(a.rating || 0) ||
      (a.username || "").localeCompare(b.username || ""),
  },
  codechef: {
    label: "CodeChef",
    apiEndpoint: "/codechef_ratings_all",
    parser: parseCodechefRatings,
    ratingKey: "rating_digit",
    sort: (a, b) =>
      Number(b.rating_digit || 0) - Number(a.rating_digit || 0) ||
      (a.username || "").localeCompare(b.username || ""),
  },
};

function normalize(s) {
  return (s || "").toString().trim().toLowerCase();
}

function UserCard({ platform, cfg, handleInput, entry, isWinner }) {
  if (!handleInput) {
    return (
      <div className="cmp-user-card cmp-user-card-empty">
        <div className="cmp-empty-hint">Enter a handle above and compare</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="cmp-user-card cmp-user-card-empty">
        <div className="cmp-handle">{handleInput}</div>
        <div className="cmp-not-found">
          "{handleInput}" isn't a registered AUST handle we track for{" "}
          {cfg.label}.
        </div>
      </div>
    );
  }

  const rating = entry[cfg.ratingKey];

  return (
    <div className={`cmp-user-card ${isWinner ? "cmp-winner" : ""}`}>
      {isWinner && (
        <div className="cmp-winner-tag">
          <FiArrowUp /> Higher rated
        </div>
      )}
      <a
        href={getPlatformProfileUrl(platform, entry.username)}
        target="_blank"
        rel="noreferrer"
        className="cmp-handle cmp-handle-link"
      >
        {entry.username}
      </a>
      <div className="cmp-rank">AUST Rank #{entry.austRank}</div>

      <div className="cmp-stat-row">
        <span className="cmp-stat-label">Rating</span>
        <RatingBadge platform={platform} value={rating} />
      </div>

      {platform === "codeforces" && (
        <div className="cmp-stat-row">
          <span className="cmp-stat-label">Max Rating</span>
          <span>{entry.maxRating || "—"}</span>
        </div>
      )}

      {platform === "codechef" && (
        <>
          <div className="cmp-stat-row">
            <span className="cmp-stat-label">Stars</span>
            <span>{entry.rating_star}</span>
          </div>
          <div className="cmp-stat-row">
            <span className="cmp-stat-label">Global Rank</span>
            <span>{entry.global_rank}</span>
          </div>
          <div className="cmp-stat-row">
            <span className="cmp-stat-label">Country Rank</span>
            <span>{entry.country_rank}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function CompareUsers() {
  const [platform, setPlatform] = useState("codeforces");
  const [handleA, setHandleA] = useState("");
  const [handleB, setHandleB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // { entryA, entryB, submittedA, submittedB }

  const cfg = PLATFORM_CONFIGS[platform];

  async function handleSubmit(e) {
    e.preventDefault();
    const submittedA = handleA.trim();
    const submittedB = handleB.trim();
    if (!submittedA || !submittedB) {
      setError("Please enter both handles.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await getJSON(cfg.apiEndpoint);
      const parsed = cfg.parser(data).slice().sort(cfg.sort);
      const ranked = parsed.map((u, i) => ({ ...u, austRank: i + 1 }));

      const entryA =
        ranked.find((u) => normalize(u.username) === normalize(submittedA)) ||
        null;
      const entryB =
        ranked.find((u) => normalize(u.username) === normalize(submittedB)) ||
        null;

      setResult({ entryA, entryB, submittedA, submittedB });
    } catch (err) {
      console.error("CompareUsers error:", err);
      setError("Failed to load ratings. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  const winner =
    result?.entryA && result?.entryB
      ? Number(result.entryA[cfg.ratingKey] || 0) >
        Number(result.entryB[cfg.ratingKey] || 0)
        ? "A"
        : Number(result.entryB[cfg.ratingKey] || 0) >
          Number(result.entryA[cfg.ratingKey] || 0)
        ? "B"
        : null
      : null;

  return (
    <div className="page-wrapper cmp-wrapper">
      <div className="container">
        <div className="cmp-header">
          <h1 className="cmp-title">Compare Users</h1>
          <p className="cmp-subtitle">
            Compare two AUST-registered handles on the same platform, side by
            side.
          </p>
        </div>

        <form className="cmp-form-card" onSubmit={handleSubmit}>
          <div className="cmp-form-row-grid">
            <div className="cmp-form-field">
              <label>Platform</label>
              <select
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value);
                  setResult(null);
                  setError(null);
                }}
              >
                <option value="codeforces">Codeforces</option>
                <option value="atcoder">AtCoder</option>
                <option value="codechef">CodeChef</option>
              </select>
            </div>
            <div className="cmp-form-field">
              <label>Handle A</label>
              <input
                value={handleA}
                onChange={(e) => setHandleA(e.target.value)}
                placeholder="e.g. tourist"
              />
            </div>
            <div className="cmp-form-field">
              <label>Handle B</label>
              <input
                value={handleB}
                onChange={(e) => setHandleB(e.target.value)}
                placeholder="e.g. jiangly"
              />
            </div>
          </div>

          <div className="cmp-form-actions">
            <button
              className="cmp-btn-submit"
              type="submit"
              disabled={loading || !handleA.trim() || !handleB.trim()}
            >
              {loading ? "Comparing..." : "Compare"}
            </button>
          </div>
        </form>

        {loading && (
          <div className="cmp-status-card">
            <LoadingSpinner />
            <div className="cmp-status-message">
              Waking up the server... this can take up to a minute on first
              load
            </div>
          </div>
        )}

        {error && (
          <div className="cmp-status-card">
            <div className="cmp-status-message cmp-error">{error}</div>
          </div>
        )}

        {!loading && !error && result && (
          <div className="cmp-results-grid">
            <UserCard
              platform={platform}
              cfg={cfg}
              handleInput={result.submittedA}
              entry={result.entryA}
              isWinner={winner === "A"}
            />
            <div className="cmp-vs">VS</div>
            <UserCard
              platform={platform}
              cfg={cfg}
              handleInput={result.submittedB}
              entry={result.entryB}
              isWinner={winner === "B"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
