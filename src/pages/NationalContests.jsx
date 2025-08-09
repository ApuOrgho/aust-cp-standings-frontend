import React, { useEffect, useState } from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import Papa from "papaparse";
import html2canvas from "html2canvas";
import "../styles/page/NationalContests.css";

export default function NationalContests() {
  const [data, setData] = useState([]);
  const [activeMainTab, setActiveMainTab] = useState("contests");
  const [activeContestTab, setActiveContestTab] = useState("IUPC");
  const [view, setView] = useState("main");
  const [selectedContest, setSelectedContest] = useState(null);
  const [selectedContestTeams, setSelectedContestTeams] = useState([]);
  const [selectedContestant, setSelectedContestant] = useState(null);
  const [selectedContestantData, setSelectedContestantData] = useState([]);
  const [downloading, setDownloading] = useState(false);

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

  const openContestDetails = (c) => {
    const sorted = c.teams.sort((a, b) => a.rank - b.rank);
    setSelectedContest({ ...c, teams: sorted });
    setSelectedContestTeams(sorted);
    setView("contestDetails");
  };

  const openContestantProfile = (c) => {
    setSelectedContestant(c.name);
    setSelectedContestantData(c.contests);
    setView("contestantProfile");
  };

  const downloadAsPNG = async (elementId, filename) => {
    setDownloading(true);
    const el = document.getElementById(elementId);
    if (!el) return setDownloading(false);

    // Clone and clean element (remove buttons)
    const clone = el.cloneNode(true);
    clone.querySelectorAll("button").forEach((b) => b.remove());

    const container = document.createElement("div");
    container.style = `
      position: fixed; top: -9999px; left: -9999px;
      background: #fff; color: #000; padding: 20px;
      width: 1000px;
      border-radius: 8px;
    `;
    container.appendChild(clone);
    document.body.appendChild(container);

    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#ffffff",
    });
    const link = document.createElement("a");
    link.download = filename + ".png";
    link.href = canvas.toDataURL();
    link.click();

    document.body.removeChild(container);
    setDownloading(false);
  };

  return (
    <div className="nc-wrapper">
      <div className="nc-background" />

      <div className="nc-tab-content">
        <div className="nc-card">
          {view === "main" && (
            <>
              <div className="nc-tab-buttons">
                <button
                  className={`nc-tab-btn ${
                    activeMainTab === "contests" ? "nc-active" : ""
                  }`}
                  onClick={() => setActiveMainTab("contests")}
                >
                  List of Contests
                </button>
                <button
                  className={`nc-tab-btn ${
                    activeMainTab === "contestants" ? "nc-active" : ""
                  }`}
                  onClick={() => setActiveMainTab("contestants")}
                >
                  List of Contestants
                </button>
              </div>

              {activeMainTab === "contests" && (
                <>
                  <div className="nc-tab-buttons">
                    {["ICPC", "IUPC", "NCPC"].map((t) => (
                      <button
                        key={t}
                        className={`nc-tab-btn ${
                          activeContestTab === t ? "nc-active" : ""
                        }`}
                        onClick={() => setActiveContestTab(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="nc-table-wrapper">
                    <table className="nc-table">
                      <thead>
                        <tr>
                          <th>Serial</th>
                          <th>Title</th>
                          <th>Date</th>
                          <th>Total Teams</th>
                          <th>Top Rank</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getContestsByType(activeContestTab).map((c, i) => (
                          <tr key={c.title}>
                            <td>{i + 1}</td>
                            <td>{c.title}</td>
                            <td>{c.date}</td>
                            <td>{c.totalTeams}</td>
                            <td>{Math.min(...c.teams.map((t) => t.rank))}</td>
                            <td>
                              <button
                                className="nc-tab-btn"
                                onClick={() => openContestDetails(c)}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeMainTab === "contestants" && (
                <div className="nc-grid">
                  {getContestantsList().map((c) => (
                    <div
                      key={c.name}
                      className="nc-card-tile"
                      onClick={() => openContestantProfile(c)}
                    >
                      <div className="nc-card-name">{c.name.toUpperCase()}</div>
                      <div className="nc-card-count">
                        {c.count} Contest{c.count > 1 ? "s" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {view === "contestDetails" && selectedContest && (
            <div id="contest-details">
              <button className="nc-tab-btn" onClick={() => setView("main")}>
                ← Back
              </button>
              <div className="nc-table-wrapper">
                <table className="nc-table with-header">
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
              <div className="nc-tab-buttons no-print">
                <button
                  className="nc-tab-btn"
                  onClick={() =>
                    window.open(selectedContest.standingLink, "_blank")
                  }
                >
                  Full Standings
                </button>
                <button
                  className="nc-tab-btn"
                  onClick={() =>
                    downloadAsPNG(
                      "contest-details",
                      selectedContest.title.replace(/\W+/g, "_")
                    )
                  }
                  disabled={downloading}
                >
                  {downloading ? "Downloading..." : "Download"}
                </button>
              </div>
            </div>
          )}

          {view === "contestantProfile" && selectedContestant && (
            <div id="contestant-profile">
              <button className="nc-tab-btn" onClick={() => setView("main")}>
                ← Back
              </button>
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
    </div>
  );
}
