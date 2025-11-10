import React, { useEffect, useState, useMemo } from "react";
// Assuming these are correct paths in your project
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

// Configuration data for the standings, defining platforms and titles
const PLATFORM_CONFIGS = {
  atcoder: {
    label: "AtCoder",
    parser: parseAtCoderRatings,
    columns: [
      { key: "austRank", label: "AUST Rank" },
      { key: "username", label: "Handle", linkPlatform: "atcoder" },
      { key: "rating", label: "Rating" },
    ],
    containerId: "atcoder-table",
    filenamePrefix: "atcoder_overall",
    apiEndpoint: "/atcoder_ratings_all",
  },
  codeforces: {
    label: "Codeforces",
    parser: parseCodeforcesRatings,
    columns: [
      { key: "austRank", label: "AUST Rank" },
      { key: "username", label: "Handle", linkPlatform: "codeforces" },
      { key: "rating", label: "Rating" },
      { key: "maxRating", label: "Max Rating" },
    ],
    containerId: "codeforces-table",
    filenamePrefix: "codeforces_overall",
    apiEndpoint: "/codeforces_ratings_all",
  },
  codechef: {
    label: "CodeChef",
    parser: parseCodechefRatings,
    columns: [
      { key: "austRank", label: "AUST Rank" },
      { key: "username", label: "Handle", linkPlatform: "codechef" },
      { key: "rating_digit", label: "Rating" },
      { key: "rating_star", label: "Star" },
      { key: "global_rank", label: "Global Rank" },
    ],
    containerId: "codechef-table",
    filenamePrefix: "codechef_overall",
    apiEndpoint: "/codechef_ratings_all",
  },
};

const LOADING_MESSAGES = [
  "This may take a few seconds...",
  "Finding AUST users...",
  "Collecting latest standings...",
  "Sorting by rating...",
  "Finalizing data — almost ready...",
];

// Helper: Add AUST rank based on array index
const withAustRank = (rows) =>
  (rows || []).map((r, i) => ({ ...r, austRank: i + 1 }));

// 🔑 SCROLL HIDING LOGIC: This hook should be implemented in your Layout or App component
// that renders the fixed footer element (e.g., class="fixed-mobile-nav").
const SCROLL_THRESHOLD = 5;

function useScrollDirectionHider(targetElementClass) {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const targetElement = document.querySelector(targetElementClass);
    if (!targetElement) return;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) < SCROLL_THRESHOLD) return;

      if (scrollY > lastScrollY && scrollY > 100) {
        // Scrolling down
        targetElement.classList.add("hidden");
        setIsHidden(true);
      } else {
        // Scrolling up or at the top
        targetElement.classList.remove("hidden");
        setIsHidden(false);
      }

      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [lastScrollY, targetElementClass]);

  return isHidden;
}

export default function OverallStandings() {
  const [activePlatform, setActivePlatform] = useState("codeforces");
  const [dataCache, setDataCache] = useState({
    atcoder: [],
    codeforces: [],
    codechef: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  // You would call the hook here IF the fixed footer was part of this component:
  // const isFooterHidden = useScrollDirectionHider('.fixed-mobile-nav');

  const cfg = PLATFORM_CONFIGS[activePlatform];
  const rowsToShow = useMemo(
    () => withAustRank(dataCache[activePlatform]),
    [dataCache, activePlatform]
  );

  useEffect(() => {
    const platformData = dataCache[activePlatform];
    if (platformData.length > 0) return;

    async function fetchPlatform() {
      setLoading(true);
      setError(null);

      // Cycle through loading messages
      const msgTimeouts = [];
      setLoadingMessage(LOADING_MESSAGES[0]);
      for (let i = 1; i < LOADING_MESSAGES.length; i++) {
        const timeout = setTimeout(
          () => setLoadingMessage(LOADING_MESSAGES[i]),
          i * 4000
        );
        msgTimeouts.push(timeout);
      }

      try {
        const data = await getJSON(cfg.apiEndpoint);
        let parsed = cfg.parser(data);

        // Sorting logic based on platform
        if (activePlatform === "codeforces") {
          parsed = parsed.map((u) => ({ ...u, rating: Number(u.rating || 0) }));
          parsed.sort(
            (x, y) =>
              Number(y.rating) - Number(x.rating) ||
              (x.username || "").localeCompare(y.username || "")
          );
        } else if (activePlatform === "atcoder") {
          parsed.sort(
            (x, y) =>
              Number(y.rating || 0) - Number(x.rating || 0) ||
              (x.username || "").localeCompare(y.username || "")
          );
        } else if (activePlatform === "codechef") {
          parsed.sort(
            (x, y) =>
              Number(y.rating_digit || 0) - Number(x.rating_digit || 0) ||
              (x.username || "").localeCompare(y.username || "")
          );
        }

        setDataCache((prev) => ({ ...prev, [activePlatform]: parsed }));
      } catch (err) {
        console.error(`OverallStandings ${activePlatform} load error:`, err);
        setError(`Failed to load ${cfg.label} ratings. Is backend running?`);
      } finally {
        setLoading(false);
        setLoadingMessage("");
        msgTimeouts.forEach(clearTimeout);
      }
    }

    fetchPlatform();
  }, [activePlatform, dataCache, cfg.apiEndpoint, cfg.parser]);

  // Cleaned JSX Structure with prefixed classes
  return (
    <div className="aust-cp-os-page-wrapper">
      <div className="aust-cp-os-container">
        <section className="aust-cp-os-card">
          {/* Main Title and Subtitle */}
          <div className="aust-cp-os-header">
            <h1 className="aust-cp-os-title">Overall Standings</h1>
            <p className="aust-cp-os-subtitle">
              Ahsanullah University of Science and Technology (AUST)
            </p>
          </div>

          {/* Platform Selection Tabs (Segmented Control - Centered) */}
          <div className="aust-cp-os-platform-tabs-wrapper">
            <div
              className="aust-cp-os-platform-tabs"
              role="tablist"
              aria-label="Platform selection"
            >
              {Object.keys(PLATFORM_CONFIGS).map((key) => (
                <button
                  key={key}
                  className={`aust-cp-os-platform-tab ${
                    key === activePlatform ? "active" : ""
                  }`}
                  onClick={() => setActivePlatform(key)}
                  aria-selected={key === activePlatform}
                  role="tab"
                >
                  {PLATFORM_CONFIGS[key].label}
                </button>
              ))}
            </div>
          </div>

          <div className="aust-cp-os-content">
            {/* Loading */}
            {loading && (
              <div className="aust-cp-os-loading-box">
                <LoadingSpinner />
                <div className="aust-cp-os-loading-message">
                  {loadingMessage || "Loading contest standings..."}
                </div>
              </div>
            )}

            {/* Error */}
            {error && <div className="aust-cp-os-error-box">{error}</div>}

            {/* Standings Table */}
            {!loading && !error && (
              <div className="aust-cp-os-table-wrapper">
                {/* Actions Row (Download Button) */}
                <div className="aust-cp-os-actions">
                  <DownloadButton
                    containerId={cfg.containerId}
                    filenamePrefix={cfg.filenamePrefix}
                    className="btn-primary-ghost"
                  />
                </div>

                {/* RatingsTable is used here */}
                <RatingsTable
                  title={
                    <h2 className="aust-cp-os-ratings-table-platform-title">
                      {cfg.label} Standings
                    </h2>
                  }
                  rows={rowsToShow}
                  columns={cfg.columns}
                  containerId={cfg.containerId}
                  defaultPageSize={20}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
