import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaDownload, FaTrophy, FaUsers } from "react-icons/fa";
import Papa from "papaparse";
import html2canvas from "html2canvas";
import "../styles/page/NationalContests.css";
import "../styles/style.css";
export default function NationalContests() {
  // Existing state
  const [data, setData] = useState([]);
  const [activeMainTab, setActiveMainTab] = useState("contests");
  const [activeContestTab, setActiveContestTab] = useState("IUPC");
  const [view, setView] = useState("main");
  const [selectedContest, setSelectedContest] = useState(null);
  const [selectedContestTeams, setSelectedContestTeams] = useState([]);
  const [selectedContestant, setSelectedContestant] = useState(null);
  const [selectedContestantData, setSelectedContestantData] = useState([]);
  const [downloading, setDownloading] = useState(false);

  // SEARCH: separate inputs per tab so they don't interfere
  const [searchContests, setSearchContests] = useState("");
  const [searchContestants, setSearchContestants] = useState("");

  // Existing sheet URL and data fetching
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/18ELO0dweSmyJyfb4BFlNkNc9SxcsdCblYmwd6Gg-Q2w/export?format=csv";

  useEffect(() => {
    Papa.parse(sheetURL, {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data.filter((row) => row.contestTitle));
      },
    });
  }, []);

  // Existing helper functions
  const getContestsByType = (type) => {
    const contests = {};
    data
      .filter((row) => row.contestType?.trim() === type)
      .forEach((row) => {
        const key = row.contestTitle;
        if (!contests[key]) {
          contests[key] = {
            title: row.contestTitle,
            date: row.contestDate,
            totalTeams: row.totalParticipatingTeam,
            standingLink: row.standingLink,
            teams: [],
          };
        }
        contests[key].teams.push(row);
      });
    return Object.values(contests).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  };

  const getContestantsList = () => {
    const map = {};
    data.forEach((row) => {
      [row.member1, row.member2, row.member3].forEach((m) => {
        if (m?.trim()) {
          const norm = m.trim().toUpperCase();
          map[norm] ||= { original: m.trim(), contests: [] };
          map[norm].contests.push(row);
        }
      });
    });
    return Object.entries(map)
      .map(([norm, { original, contests }]) => ({
        name: original,
        count: contests.length,
        contests: contests.sort(
          (a, b) => new Date(b.contestDate) - new Date(a.contestDate)
        ),
      }))
      .sort((a, b) => b.count - a.count);
  };

  // Utility: case-insensitive substring match
  const contains = (text = "", q = "") =>
    text.toString().toLowerCase().includes(q.toString().toLowerCase());

  // --- NEW: open detail handlers ---
  const openContestDetails = (contest) => {
    if (!contest) return;
    setSelectedContest(contest);
    const teams = (contest.teams || []).slice().sort((a, b) => {
      const ra = Number(a.rank) || Infinity;
      const rb = Number(b.rank) || Infinity;
      return ra - rb;
    });
    setSelectedContestTeams(teams);
    setView("contestDetails");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openContestantProfile = (contestantObj) => {
    if (!contestantObj) return;
    const nameNorm = (contestantObj.name || "").trim().toUpperCase();
    // find all rows where any member matches this name
    const items = data
      .filter((row) =>
        [row.member1, row.member2, row.member3].some(
          (m) => (m || "").trim().toUpperCase() === nameNorm
        )
      )
      .map((row) => ({
        teamName: row.teamName || "",
        contestTitle: row.contestTitle || "",
        contestDate: row.contestDate || "",
        rank: row.rank || "",
      }))
      .sort((a, b) => new Date(b.contestDate) - new Date(a.contestDate));

    setSelectedContestant(contestantObj.name);
    setSelectedContestantData(items);
    setView("contestantProfile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtered lists (live filtering while typing; Enter / Search button also trims)
  const contestsForType = getContestsByType(activeContestTab);
  const filteredContests = contestsForType.filter((c) => {
    const q = searchContests.trim().toLowerCase();
    if (!q) return true;
    if (contains(c.title, q)) return true;
    // also match team names inside the contest
    return c.teams?.some((t) => contains(t.teamName || "", q));
  });

  const contestantsList = getContestantsList();
  const filteredContestants = contestantsList.filter((p) => {
    const q = searchContestants.trim().toLowerCase();
    if (!q) return true;
    return contains(p.name, q);
  });

  // Called by Search button or Enter key — just trim the current input (live filter already applied)
  const handleSearchSubmit = () => {
    if (activeMainTab === "contests") setSearchContests((s) => s.trim());
    else setSearchContestants((s) => s.trim());
  };

  // Clear only the active tab's search input
  const handleClearSearch = () => {
    if (activeMainTab === "contests") {
      setSearchContests("");
    } else {
      setSearchContestants("");
    }
  };

  // Existing download function: respects current theme / variables so PNG renders correctly for dark and light
  const downloadAsPNG = async (elementId, filename) => {
    setDownloading(true);
    const el = document.getElementById(elementId);
    if (!el) {
      setDownloading(false);
      return;
    }

    // Clone and clean element (remove interactive controls that shouldn't appear)
    const clone = el.cloneNode(true);
    clone
      .querySelectorAll("button, a, input, select")
      .forEach((b) => b.remove());

    // Get computed theme colors (fall back to sensible defaults)
    const rootStyles = getComputedStyle(document.documentElement);
    const prefersDark =
      document.documentElement?.getAttribute("data-theme") === "dark" ||
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;

    const bgVar =
      rootStyles.getPropertyValue("--nc-surface") ||
      rootStyles.getPropertyValue("--upc-surface") ||
      rootStyles.getPropertyValue("--color-surface") ||
      (prefersDark ? "#0f1720" : "#ffffff");

    const textVar =
      rootStyles.getPropertyValue("--nc-text") ||
      rootStyles.getPropertyValue("--upc-text") ||
      rootStyles.getPropertyValue("--color-text") ||
      (prefersDark ? "#e2e8f0" : "#0b2233");

    const bg = bgVar ? bgVar.trim() : prefersDark ? "#0f1720" : "#ffffff";
    const color = textVar
      ? textVar.trim()
      : prefersDark
      ? "#e2e8f0"
      : "#0b2233";

    // Create offscreen container with same background/color so html2canvas renders identical look
    const container = document.createElement("div");
    // On mobile, use parent container's offsetWidth, with a reasonable min width
    let sourceWidth = Math.max(el.offsetWidth, 320);
    if (window.innerWidth <= 768) {
      sourceWidth = Math.max(el.offsetWidth + 32, 352);
    } else {
      sourceWidth = Math.max(el.offsetWidth, 760);
    }
    container.style.cssText =
      "position: fixed; top: -9999px; left: -9999px; background: " +
      bg +
      "; color: " +
      color +
      "; padding: 20px; width: " +
      sourceWidth +
      "px; border-radius: 8px;";
    // If page uses data-theme attributes, propagate it so any [data-theme="dark"] selectors apply inside the container
    const pageTheme = document.documentElement.getAttribute("data-theme");
    if (pageTheme) container.setAttribute("data-theme", pageTheme);

    container.appendChild(clone);
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: bg, // ensure same background
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = filename + ".png";
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      // fallback: attempt transparent background
      console.error("html2canvas error:", err);
    } finally {
      document.body.removeChild(container);
      setDownloading(false);
    }
  };

  return (
    <div className="nc-wrapper">
      <div className="nc-card">
        {/* Top-level back button (single one for all nested views) */}
        {view !== "main" && (
          <button className="nc-back-btn" onClick={() => setView("main")}>
            <FaArrowLeft /> Back to List
          </button>
        )}

        {view === "main" && (
          <>
            {/* Main navigation */}
            <div className="nc-tab-buttons">
              <button
                className={`nc-tab-btn ${
                  activeMainTab === "contests" ? "nc-active" : ""
                }`}
                onClick={() => setActiveMainTab("contests")}
              >
                <FaTrophy /> Contests
              </button>
              <button
                className={`nc-tab-btn ${
                  activeMainTab === "contestants" ? "nc-active" : ""
                }`}
                onClick={() => setActiveMainTab("contestants")}
              >
                <FaUsers /> Contestants
              </button>
            </div>

            {/* Search bar - uses separate state depending on active tab */}
            <div className="nc-search-bar">
              <input
                type="text"
                placeholder={
                  activeMainTab === "contests"
                    ? "Search contests (title or team name)..."
                    : "Search contestants (name)..."
                }
                value={
                  activeMainTab === "contests"
                    ? searchContests
                    : searchContestants
                }
                onChange={(e) =>
                  activeMainTab === "contests"
                    ? setSearchContests(e.target.value)
                    : setSearchContestants(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                className="nc-search-input"
                aria-label="Search contests or contestants"
              />
              <button
                type="button"
                className="nc-search-btn"
                onClick={handleSearchSubmit}
                aria-label="Search"
              >
                Search
              </button>
              <button
                type="button"
                className="nc-clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                Clear
              </button>
            </div>

            {activeMainTab === "contests" && (
              <>
                <div className="nc-tab-buttons secondary">
                  {["ICPC", "IUPC", "NCPC"].map((type) => (
                    <button
                      key={type}
                      className={`nc-tab-btn ${
                        activeContestTab === type ? "nc-active" : ""
                      }`}
                      onClick={() => {
                        setActiveContestTab(type);
                        // reset contest search when switching type (optional)
                        setSearchContests("");
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="nc-table-wrapper">
                  <table className="nc-table">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Total Teams</th>
                        <th>Top Rank</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContests.map((c, i) => (
                        <tr key={c.title}>
                          <td>{i + 1}</td>
                          <td>{c.title}</td>
                          <td>{c.date}</td>
                          <td>{c.totalTeams}</td>
                          <td>
                            {Math.min(
                              ...c.teams.map((t) => Number(t.rank) || Infinity)
                            )}
                          </td>
                          <td>
                            <button
                              className="nc-tab-btn"
                              onClick={() => openContestDetails(c)}
                              style={{
                                lineHeight: "1.1",
                                padding: "6px 8px",
                                fontSize: "0.9em",
                                whiteSpace: "pre-line",
                              }}
                            >
                              {`VIEW\nTEAMS`}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredContests.length === 0 && (
                        <tr>
                          <td
                            colSpan="6"
                            style={{
                              textAlign: "center",
                              padding: "20px",
                            }}
                          >
                            Loading...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeMainTab === "contestants" && (
              <div className="nc-grid">
                {filteredContestants.map((c) => (
                  <div
                    key={c.name}
                    className="nc-card-tile"
                    onClick={() => openContestantProfile(c)}
                  >
                    <div className="nc-card-name">{c.name}</div>
                    <div className="nc-card-count">
                      {c.count} Contest{c.count > 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
                {filteredContestants.length === 0 && (
                  <div
                    style={{
                      gridColumn: "1/-1",
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    No contestants found.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Contest Details View */}
        {view === "contestDetails" && selectedContest && (
          <div id="contest-details" className="nc-detail-view">
            <h2 className="nc-detail-title">{selectedContest.title}</h2>
            <div className="nc-detail-meta">
              <span>Date: {selectedContest.date}</span>
              <span>Total Teams: {selectedContest.totalTeams}</span>
            </div>

            <div className="nc-table-wrapper">
              <table className="nc-table">
                <thead>
                  <tr>
                    <th colSpan="5" className="nc-table-title">
                      {selectedContest.title}
                    </th>
                  </tr>
                  <tr>
                    <th>Rank</th>
                    <th>Team Name</th>
                    <th>Solved</th>
                    <th>Penalty</th>
                    <th>Members</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedContestTeams.map((t, i) => (
                    <tr key={i}>
                      <td>{t.rank}</td>
                      <td>{t.teamName}</td>
                      <td>{t.totalSolved}</td>
                      <td>{t.penalty}</td>
                      <td>
                        {[t.member1, t.member2, t.member3]
                          .filter((m) => m && m.trim())
                          .map((m, idx) => (
                            <div key={idx}>{m}</div>
                          ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="nc-actions">
              <button
                className="nc-action-btn"
                onClick={() =>
                  window.open(selectedContest.standingLink, "_blank")
                }
              >
                View Full Standings
              </button>
              <button
                className="nc-action-btn"
                onClick={() =>
                  downloadAsPNG(
                    "contest-details",
                    selectedContest.title.replace(/\W+/g, "_")
                  )
                }
                disabled={downloading}
              >
                {downloading ? "Downloading..." : "Download Results"}
              </button>
            </div>
          </div>
        )}

        {/* Contestant Profile View */}
        {view === "contestantProfile" && selectedContestant && (
          <div id="contestant-profile" className="nc-detail-view">
            {/* removed duplicate internal back button (top-level back button handles it) */}
            <div className="nc-table-wrapper">
              <table className="nc-table with-header">
                <thead>
                  <tr>
                    <th colSpan="5" className="nc-table-title">
                      National Contest Profile of{" "}
                      {selectedContestant.toUpperCase()}
                    </th>
                  </tr>
                  <tr>
                    <th>Serial</th>
                    <th>Team</th>
                    <th>Contest</th>
                    <th>Date</th>
                    <th>Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedContestantData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.teamName}</td>
                      <td>{item.contestTitle}</td>
                      <td>{item.contestDate}</td>
                      <td>{item.rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="nc-tab-buttons no-print">
              <button
                className="nc-tab-btn"
                onClick={() =>
                  downloadAsPNG(
                    "contestant-profile",
                    selectedContestant.replace(/\W+/g, "_")
                  )
                }
                disabled={downloading}
              >
                {downloading ? "Downloading..." : "Download"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
