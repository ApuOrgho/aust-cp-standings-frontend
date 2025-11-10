import React, { useMemo, useState, useEffect } from "react";
import "../styles/style.css";
import "../styles/comp/ContestStandings.css";

function profileUrl(platform, username) {
  if (!username || !platform) return "#";
  const user = encodeURIComponent(String(username));
  const p = String(platform).toLowerCase();
  if (p.includes("codeforces")) return `https://codeforces.com/profile/${user}`;
  if (p.includes("atcoder")) return `https://atcoder.jp/users/${user}`;
  if (p.includes("codechef")) return `https://www.codechef.com/users/${user}`;
  return "#";
}

export default function ContestStandings({
  title = "Standings",
  org = "",
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
  }, [page, totalPages, rows]);

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
      return (
        <a
          href={profileUrl(linkPlatform, val)}
          target="_blank"
          rel="noreferrer"
          className="aust-cp-cs-link"
        >
          {val || "—"}
        </a>
      );
    }
    return val !== undefined && val !== null ? String(val) : "—";
  }

  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(total, page * pageSize);

  return (
    <div id={containerId} className="aust-cp-cs-container">
      {/* Title */}
      <div className="aust-cp-cs-header">
        <h3 className="aust-cp-cs-title">{title}</h3>
        {org && <div className="aust-cp-cs-org">{org}</div>}
        {platform && <span className="aust-cp-cs-badge">{platform}</span>}
      </div>

      {/* Meta (showing / per page) */}
      <div className="aust-cp-cs-meta">
        <div className="aust-cp-cs-meta-left">
          Showing {showingFrom}-{showingTo}
        </div>
        <div className="aust-cp-cs-meta-right">
          <label>
            Per page{" "}
            <select
              className="aust-cp-cs-select"
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

      {/* Table */}
      <div className="aust-cp-cs-table-wrapper">
        <table className="aust-cp-cs-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="aust-cp-cs-th">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="aust-cp-cs-empty">
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
                  <tr key={idx} className={`aust-cp-cs-row ${topClass}`}>
                    {columns.map((col) => (
                      <td key={col.key} className="aust-cp-cs-td">
                        {renderCell(r, col)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="aust-cp-cs-pagination">
        <button
          onClick={() => gotoPage(1)}
          disabled={page === 1}
          className="aust-cp-cs-btn"
        >
          « First
        </button>
        <button
          onClick={() => gotoPage(page - 1)}
          disabled={page === 1}
          className="aust-cp-cs-btn"
        >
          ‹ Prev
        </button>

        <div className="aust-cp-cs-pages">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            const visible =
              totalPages <= 9 ||
              p === 1 ||
              p === totalPages ||
              Math.abs(p - page) <= 2;
            return visible ? (
              <button
                key={p}
                onClick={() => gotoPage(p)}
                className={`aust-cp-cs-page ${p === page ? "active" : ""}`}
              >
                {p}
              </button>
            ) : null;
          })}
        </div>

        <button
          onClick={() => gotoPage(page + 1)}
          disabled={page === totalPages}
          className="aust-cp-cs-btn"
        >
          Next ›
        </button>
        <button
          onClick={() => gotoPage(totalPages)}
          disabled={page === totalPages}
          className="aust-cp-cs-btn"
        >
          Last »
        </button>
      </div>
    </div>
  );
}
