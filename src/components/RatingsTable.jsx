import React, { useMemo, useState } from "react";
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
    if (platform === "codeforces")
      return `https://codeforces.com/profile/${user}`;
    if (platform === "atcoder") return `https://atcoder.jp/users/${user}`;
    if (platform === "codechef")
      return `https://www.codechef.com/users/${user}`;
    return "#";
  }

  function renderCell(r, col) {
    const val = r[col.key];
    if (col.key === "username" && col.linkPlatform) {
      const url = profileUrl(col.linkPlatform, r.username);
      return (
        <a href={url} target="_blank" rel="noreferrer" className="ratings-link">
          {r.username || "—"}
        </a>
      );
    }
    return val !== undefined && val !== null ? String(val) : "—";
  }

  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(total, page * pageSize);

  return (
    <div id={containerId} className="card standings-card">
      <h3 className="ratings-title">{title}</h3>

      <div className="table-top-row">
        <div className="table-meta">
          <div>Showing</div>
          <div>
            {showingFrom}–{showingTo} of {total}
          </div>
        </div>

        <div className="table-controls" style={{ textAlign: "right" }}>
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
              <option value={100}>100</option>
            </select>
          </label>
        </div>
      </div>

      <table className="ratings-table center-align">
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
              <td
                colSpan={columns.length}
                className="ratings-empty center-align"
              >
                No users found.
              </td>
            </tr>
          ) : (
            pageRows.map((r, idx) => (
              <tr
                key={(r.username || "u") + "-" + ((page - 1) * pageSize + idx)}
                className="ratings-row"
              >
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
            if (totalPages > 9) {
              const window = 2;
              if (
                p === 1 ||
                p === 2 ||
                p === totalPages - 1 ||
                p === totalPages ||
                (p >= page - window && p <= page + window)
              ) {
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
              } else if (p === 3 && page > 5) {
                return (
                  <span key={`gap-${p}`} className="pagination-gap">
                    …
                  </span>
                );
              } else if (p === totalPages - 2 && page < totalPages - 4) {
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
