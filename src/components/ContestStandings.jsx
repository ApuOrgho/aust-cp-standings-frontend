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
          rel="noopener noreferrer"
          className="contest-standings-link"
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
    <div className="contest-standings-card" id={containerId}>
      {title && <div className="contest-standings-title">{title}</div>}
      
      <div className="contest-table-top-row">
        <div className="contest-table-meta">
          Showing {showingFrom}–{showingTo} of {total}
        </div>
        <div className="contest-table-controls">
          <label className="contest-page-size-label">
            Per page:
            <select
              className="contest-page-size-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>
      </div>

      <div className="contest-table-container">
        <table className="contest-standings-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="contest-standings-th">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="contest-standings-td no-data">
                  <div className="contest-no-data-content">
                    <div className="contest-no-data-icon">
                      <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>No users found.</div>
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((r, idx) => (
                <tr key={idx} className="contest-standings-row">
                  {columns.map((col) => (
                    <td key={col.key} className="contest-standings-td">
                      {renderCell(r, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="contest-pagination-row">
        <div className="contest-pagination-left">
          <button
            className="btn contest-ghost"
            disabled={page <= 1}
            onClick={() => gotoPage(1)}
          >
            First
          </button>
          <button
            className="btn contest-ghost"
            disabled={page <= 1}
            onClick={() => gotoPage(page - 1)}
          >
            Prev
          </button>
        </div>

        <div className="contest-pagination-pages">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                className={`contest-pagination-page ${page === pageNum ? 'active' : ''}`}
                onClick={() => gotoPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <div className="contest-pagination-right">
          <button
            className="btn contest-ghost"
            disabled={page >= totalPages}
            onClick={() => gotoPage(page + 1)}
          >
            Next
          </button>
          <button
            className="btn contest-ghost"
            disabled={page >= totalPages}
            onClick={() => gotoPage(totalPages)}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
