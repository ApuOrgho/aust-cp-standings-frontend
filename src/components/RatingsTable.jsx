import React, { useMemo, useState } from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import "../styles/style.css";
import "../styles/comp/RatingsTable.css";

export default function RatingsTable({
  title,
  rows = [],
  columns = [],
  containerId = "table",
  defaultPageSize = 20,
}) {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
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

  function profileUrl(platform, username) {
    if (!username) return "#";
    const user = encodeURIComponent(username);
    if (platform === "codeforces") return `https://codeforces.com/profile/${user}`;
    if (platform === "atcoder") return `https://atcoder.jp/users/${user}`;
    if (platform === "codechef") return `https://www.codechef.com/users/${user}`;
    return "#";
  }

  function renderCell(r, col) {
    const val = r[col.key];
    if (col.key === "username" && col.linkPlatform) {
      const url = profileUrl(col.linkPlatform, r.username);
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ratings-link"
        >
          {r.username || "—"}
        </a>
      );
    }
    return val !== undefined && val !== null ? String(val) : "—";
  }

  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(total, page * pageSize);

  return (
    <div className="standings-card" id={containerId}>
      {title && <div className="ratings-title">{title}</div>}
      
      <div className="table-top-row">
        <div className="table-meta">
          Showing {showingFrom}–{showingTo} of {total}
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
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>
      </div>

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
              <td colSpan={columns.length} className="ratings-td no-data">
                No users found.
              </td>
            </tr>
          ) : (
            pageRows.map((r, idx) => (
              <tr key={idx} className="ratings-row">
                {columns.map((col) => (
                  <td key={col.key} className="ratings-td">
                    {renderCell(r, col)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination-row">
        <div className="pagination-left">
          <button
            className="btn ghost"
            disabled={page <= 1}
            onClick={() => gotoPage(1)}
          >
            First
          </button>
          <button
            className="btn ghost"
            disabled={page <= 1}
            onClick={() => gotoPage(page - 1)}
          >
            Prev
          </button>
        </div>

        <div className="pagination-pages">
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
                className={`pagination-page ${page === pageNum ? 'active' : ''}`}
                onClick={() => gotoPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <div className="pagination-right">
          <button
            className="btn ghost"
            disabled={page >= totalPages}
            onClick={() => gotoPage(page + 1)}
          >
            Next
          </button>
          <button
            className="btn ghost"
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
