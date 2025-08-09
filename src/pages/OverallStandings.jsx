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
      fullStandingsUrl: "https://atcoder.jp/ranking/all", // Global AtCoder rankings page
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
      fullStandingsUrl: "https://codeforces.com/ratings", // Global Codeforces ratings page
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
      fullStandingsUrl: "https://www.codechef.com/ratings", // Global CodeChef ratings page
    },
  };

  function withAustRank(rows) {
    return (rows || []).map((r, i) => ({ ...r, austRank: i + 1 }));
  }

  const cfg = platformConfig[active];
  const rowsToShow = withAustRank(cfg.rows);

  return (
    <div className="page-wrapper">
      {/* Background */}
      <div className="page-background bg-contest" />

      <div className="container">
        <section className="standings-section">
          <div className="standings-inner">
            <h1 className="standings-title">Overall Standings</h1>
            <div className="standings-subtitle">
              Ahsanullah University of Science and Technology (AUST)
            </div>

            <div
              className="platform-buttons"
              role="tablist"
              aria-label="Platform selection"
            >
              <button
                className={`btn ${active === "atcoder" ? "" : "ghost"}`}
                onClick={() => setActive("atcoder")}
              >
                AtCoder
              </button>
              <button
                className={`btn ${active === "codeforces" ? "" : "ghost"}`}
                onClick={() => setActive("codeforces")}
              >
                Codeforces
              </button>
              <button
                className={`btn ${active === "codechef" ? "" : "ghost"}`}
                onClick={() => setActive("codechef")}
              >
                CodeChef
              </button>
            </div>

            {loading && (
              <div className="card" style={{ textAlign: "center" }}>
                <LoadingSpinner />
                <div style={{ marginTop: 10, fontWeight: 600 }}>
                  {loadingMessage || "Loading contest standings..."}
                </div>
              </div>
            )}

            {error && <div className="error-card">{error}</div>}

            {!loading && !error && (
              <>
                <div
                  className="download-wrapper"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginRight: "0.5rem",
                  }}
                >
                  <DownloadButton
                    containerId={cfg.containerId}
                    filenamePrefix={cfg.filenamePrefix}
                  />
                </div>

                <RatingsTable
                  title={
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                        {cfg.tableTitle}
                      </div>
                      <div className="standings-subtitle">
                        Ahsanullah University of Science and Technology (AUST)
                      </div>
                    </div>
                  }
                  rows={rowsToShow}
                  columns={cfg.columns}
                  containerId={cfg.containerId}
                  defaultPageSize={20}
                  fullStandingsUrl={cfg.fullStandingsUrl} // pass Full Standings URL here
                />
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
