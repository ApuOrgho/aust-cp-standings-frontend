import React, { useMemo, useState, useEffect } from "react";
import "../styles/style.css";
import "../styles/comp/RatingsTable.css";

export default function RatingsTable({
  title,
  rows = [],
  columns = [],
  containerId = "table",
  defaultPageSize = 20,
  orgName = "Ahsanullah University of Science and Technology (AUST)",
}) {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
    const tableElement = document.getElementById(containerId);
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 140, behavior: "smooth" });
    }
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
    if ((col.key === "username" || col.key === "handle") && col.linkPlatform) {
      const url = profileUrl(col.linkPlatform, r.username || r.handle);
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="aust-cp-ratings-link"
        >
          {r.username || r.handle || "—"}
        </a>
      );
    }
    return val !== undefined && val !== null ? String(val) : "—";
  }

  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(total, page * pageSize);

  const renderPaginationPages = () => {
    return Array.from({ length: totalPages }).map((_, i) => {
      const p = i + 1;
      if (totalPages > 9) {
        const window = 2;
        const showPage =
          p === 1 ||
          p === totalPages ||
          (p >= page - window && p <= page + window);

        if (showPage) {
          return (
            <button
              key={p}
              onClick={() => gotoPage(p)}
              className={`aust-cp-pagination-page ${
                p === page ? "active" : ""
              }`}
            >
              {p}
            </button>
          );
        }

        const gap1 = p === 3 && page > 4;
        const gap2 = p === totalPages - 2 && page < totalPages - 3;
        if (gap1 || gap2) {
          return (
            <span key={`gap-${p}`} className="aust-cp-pagination-gap">
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
          className={`aust-cp-pagination-page ${p === page ? "active" : ""}`}
        >
          {p}
        </button>
      );
    });
  };

  const platformClass = (columns[1]?.linkPlatform || "").toLowerCase();
  return (
    <div
      id={containerId}
      className={`aust-cp-ratings-table-container ${platformClass}-ratings-table-container`}
    >
      <div className="aust-cp-ratings-table-title-wrapper">
        <div className="aust-cp-ratings-table-main-title">{title}</div>
        <div className="aust-cp-ratings-table-subtitle">{orgName}</div>
      </div>

      <div className="aust-cp-table-top-row">
        <div className="aust-cp-table-meta">
          Showing
          <br />
          {showingFrom}–{showingTo}
        </div>
        <div className="aust-cp-table-controls">
          <label className="aust-cp-page-size-label">
            Per page:
            <select
              className="aust-cp-page-size-select"
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

      <table className={`aust-cp-ratings-table ${platformClass}-ratings-table`}>
        <thead>
          <tr>
            {columns.map((col) => {
              let thClass = "aust-cp-ratings-th";
              if (col.key.toLowerCase().includes("rank"))
                thClass += " aust-cp-rank-col";
              if (col.key.toLowerCase().includes("rating"))
                thClass += " aust-cp-rating-col";
              if (col.key === "username" || col.key === "handle")
                thClass += " aust-cp-handle-col";

              const labelParts = col.label.split(" ");
              const shouldSplit =
                labelParts.length === 2 &&
                (col.key.toLowerCase().includes("rank") ||
                  col.key.toLowerCase().includes("max"));

              return (
                <th key={col.key} className={thClass}>
                  {shouldSplit ? (
                    <React.Fragment>
                      {labelParts[0]}
                      <br />
                      {labelParts[1]}
                    </React.Fragment>
                  ) : (
                    col.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {pageRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="aust-cp-ratings-empty">
                No users found for this platform.
              </td>
            </tr>
          ) : (
            pageRows.map((r, idx) => (
              <tr
                key={
                  (r.username || r.handle || "u") +
                  "-" +
                  ((page - 1) * pageSize + idx)
                }
                className="aust-cp-ratings-row"
              >
                {columns.map((col) => {
                  let tdClass = "aust-cp-ratings-td";
                  if (col.key.toLowerCase().includes("rank"))
                    tdClass += " aust-cp-rank-col";
                  if (col.key.toLowerCase().includes("rating"))
                    tdClass += " aust-cp-rating-col";
                  if (col.key === "username" || col.key === "handle")
                    tdClass += " aust-cp-handle-col";
                  return (
                    <td key={col.key} className={tdClass}>
                      {renderCell(r, col)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="aust-cp-pagination-row">
        <div className="aust-cp-pagination-left">
          <button
            onClick={() => gotoPage(1)}
            disabled={page === 1}
            className="aust-cp-pagination-btn"
          >
            First
          </button>
          <button
            onClick={() => gotoPage(page - 1)}
            disabled={page === 1}
            className="aust-cp-pagination-btn"
          >
            Prev
          </button>
        </div>
        <div className="aust-cp-pagination-pages">
          {renderPaginationPages()}
        </div>
        <div className="aust-cp-pagination-right">
          <button
            onClick={() => gotoPage(page + 1)}
            disabled={page === totalPages}
            className="aust-cp-pagination-btn"
          >
            Next
          </button>
          <button
            onClick={() => gotoPage(totalPages)}
            disabled={page === totalPages}
            className="aust-cp-pagination-btn"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
