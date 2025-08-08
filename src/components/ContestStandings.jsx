// src/components/ContestStandings.jsx
import React, { useMemo, useState, useEffect } from "react";
import "../styles/style.css";
import "../styles/comp/ContestStandings.css";
function profileUrl(platform, username) {
  if (!username) return "#";
  const user = encodeURIComponent(username);
  if (!platform) return "#";
  const p = platform.toLowerCase();
  if (p === "codeforces") return `https://codeforces.com/profile/${user}`;
  if (p === "atcoder") return `https://atcoder.jp/users/${user}`;
  if (p === "codechef") return `https://www.codechef.com/users/${user}`;
  return "#";
}

export default function ContestStandings({
  title,
  columns = [],
  rows = [],
  platform = "",
  containerId = "contest-table",
  defaultPageSize = 20,
}) {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // safe page reset
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  function gotoPage(n) {
    if (n < 1 || n > totalPages) return;
    setPage(n);
    window.scrollTo({ top: 140, behavior: "smooth" });
  }

  function renderCell(row, col) {
    const val = row[col.key];
    // username/handle link handling: prefer explicit linkPlatform on column, else use component platform
    if (
      (col.key === "username" || col.key === "handle") &&
      (col.linkPlatform || platform)
    ) {
      const linkPlatform = (col.linkPlatform || platform).toLowerCase();
      const username = val || "";
      return (
        <a
          href={profileUrl(linkPlatform, username)}
          target="_blank"
          rel="noreferrer"
          className="ratings-link"
        >
          {username || "—"}
        </a>
      );
    }

    // austRank formatting (render as number or dash)
    if (col.key === "austRank") {
      return val !== undefined && val !== null ? String(val) : "—";
    }

    return val !== undefined && val !== null ? String(val) : "—";
  }

  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(total, page * pageSize);

  return (
    <div id={containerId} className="card standings-card">
      <h3 className="ratings-title" style={{ textAlign: "center" }}>
        {title}
      </h3>

      <div className="table-top-row">
        <div className="table-meta">
          Showing
          <br /> {showingFrom}–{showingTo} of {total}
        </div>
        <div className="table-controls">
          <label className="page-size-label">
            Per page:
            <select
              className="page-size-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      <div className="table-wrapper" style={{ overflowX: "auto" }}>
        <table className="ratings-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="ratings-th">
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
              pageRows.map((r, idx) => (
                <tr
                  key={(r.handle || r.username || r.rank || idx) + "-" + idx}
                  className="ratings-row"
                >
                  {columns.map((col) => (
                    <td key={col.key + idx} className="ratings-td">
                      {renderCell(r, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-row">
        <div className="pagination-left">
          <button
            className="btn ghost"
            onClick={() => gotoPage(1)}
            disabled={page === 1}
          >
            First
          </button>
          <button
            className="btn ghost"
            onClick={() => gotoPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
        </div>

        <div className="pagination-pages" aria-label="Page navigation">
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
              if (p === 3 && page > 5) {
                return (
                  <span key={`gap-${p}`} className="pagination-gap">
                    …
                  </span>
                );
              }
              if (p === totalPages - 2 && page < totalPages - 4) {
                return (
                  <span key={`gap2-${p}`} className="pagination-gap">
                    …
                  </span>
                );
              }
              return null;
            }
            return (
              <button
                key={p}
                onClick={() => gotoPage(p)}
                className={`pagination-page ${p === page ? "active" : ""}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>

        <div className="pagination-right">
          <button
            className="btn ghost"
            onClick={() => gotoPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
          <button
            className="btn ghost"
            onClick={() => gotoPage(totalPages)}
            disabled={page === totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
