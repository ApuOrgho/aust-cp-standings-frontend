// src/components/ContestStandings.jsx
import React, { useMemo, useState, useEffect } from "react";
import { getPlatformProfileUrl } from "../utils";
import RatingBadge from "./RatingBadge";
import "../styles/style.css";
import "../styles/comp/ContestStandings.css";

const BADGE_COLUMN_KEYS = new Set(["rating", "newRating"]);

/**
 * ContestStandings - improved table markup for better dark/light visibility.
 * Keeps same props and pagination logic as before.
 */
export default function ContestStandings({
  title = "Standings",
  columns = [],
  rows = [],
  platform = "",
  containerId = "contest-table",
  defaultPageSize = 20,
}) {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);

  const total = Array.isArray(rows) ? rows.length : 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (rows || []).slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  function gotoPage(n) {
    if (n < 1 || n > totalPages) return;
    setPage(n);
    window.scrollTo({ top: 140, behavior: "smooth" });
  }

  function getRankValue(r) {
    // common keys for rank
    const v = r?.rank ?? r?.austRank ?? r?.position ?? r?.pos;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function renderCell(row, col) {
    const val = row?.[col.key];
    if (
      (col.key === "username" || col.key === "handle") &&
      (col.linkPlatform || platform)
    ) {
      const linkPlatform = col.linkPlatform || platform || "";
      const username = val || "";
      return (
        <a
          href={getPlatformProfileUrl(linkPlatform, username)}
          target="_blank"
          rel="noreferrer"
          className="ratings-link"
        >
          {username || "—"}
        </a>
      );
    }
    if (BADGE_COLUMN_KEYS.has(col.key) && val !== undefined && val !== null) {
      return <RatingBadge platform={platform} value={val} />;
    }
    return val !== undefined && val !== null ? String(val) : "—";
  }

  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(total, page * pageSize);

  return (
    <div id={containerId} className="card standings-card" aria-live="polite">
      <div
        className="standings-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <h3 className="ratings-title" style={{ margin: 0 }}>
            {title}
          </h3>
          {platform ? <span className="ratings-badge">{platform}</span> : null}
        </div>

        <div
          className="table-top-controls"
          style={{ display: "flex", gap: 10, alignItems: "center" }}
        >
          <div className="table-meta muted" aria-hidden>
            Showing {showingFrom}–{showingTo} of {total}
          </div>

          <label
            className="page-size-label"
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            Per page
            <select
              className="page-size-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              aria-label="Results per page"
            >
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      <div
        className="table-wrapper"
        style={{ overflowX: "auto", marginTop: 10 }}
      >
        <table
          className="ratings-table"
          role="table"
          aria-label={title}
          style={{ width: "100%", borderCollapse: "separate" }}
        >
          <caption className="sr-only">
            {title} — showing {showingFrom} to {showingTo} of {total}
          </caption>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="ratings-th"
                  scope="col"
                  role="columnheader"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="ratings-empty">
                  No users found.
                </td>
              </tr>
            ) : (
              pageRows.map((r, idx) => {
                const absoluteIndex = (page - 1) * pageSize + idx + 1;
                const rankNum = getRankValue(r) ?? absoluteIndex;
                const topClass =
                  rankNum === 1
                    ? "top-1"
                    : rankNum === 2
                    ? "top-2"
                    : rankNum === 3
                    ? "top-3"
                    : "";
                return (
                  <tr
                    key={(r.handle || r.username || r.rank || idx) + "-" + idx}
                    className={`ratings-row ${topClass}`}
                    aria-rowindex={absoluteIndex}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key + "-" + idx}
                        className="ratings-td"
                        role="cell"
                      >
                        {/* if this is rank column, show medal + number for top 3 */}
                        {col.key === "rank" ||
                        col.key === "austRank" ||
                        col.key === "position" ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            {rankNum === 1 && (
                              <span className="medal medal-gold" aria-hidden>
                                🥇
                              </span>
                            )}
                            {rankNum === 2 && (
                              <span className="medal medal-silver" aria-hidden>
                                🥈
                              </span>
                            )}
                            {rankNum === 3 && (
                              <span className="medal medal-bronze" aria-hidden>
                                🥉
                              </span>
                            )}
                            <span>{renderCell(r, col)}</span>
                          </div>
                        ) : (
                          renderCell(r, col)
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div
        className="pagination-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 12,
        }}
      >
        <div className="pagination-left" style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="btn ghost"
            onClick={() => gotoPage(1)}
            disabled={page === 1}
          >
            « First
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => gotoPage(page - 1)}
            disabled={page === 1}
          >
            ‹ Prev
          </button>
        </div>

        <div
          className="pagination-pages"
          aria-label="Page navigation"
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            const windowSize = 2;
            if (
              totalPages > 9 &&
              !(
                p === 1 ||
                p === 2 ||
                p === totalPages - 1 ||
                p === totalPages ||
                (p >= page - windowSize && p <= page + windowSize)
              )
            ) {
              if (p === 3 && page > 5)
                return (
                  <span key={`gap-${p}`} className="pagination-gap">
                    …
                  </span>
                );
              if (p === totalPages - 2 && page < totalPages - 4)
                return (
                  <span key={`gap2-${p}`} className="pagination-gap">
                    …
                  </span>
                );
              return null;
            }
            return (
              <button
                key={p}
                type="button"
                onClick={() => gotoPage(p)}
                className={`pagination-page ${p === page ? "active" : ""}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>

        <div className="pagination-right" style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="btn ghost"
            onClick={() => gotoPage(page + 1)}
            disabled={page === totalPages}
          >
            Next ›
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => gotoPage(totalPages)}
            disabled={page === totalPages}
          >
            Last »
          </button>
        </div>
      </div>
    </div>
  );
}
