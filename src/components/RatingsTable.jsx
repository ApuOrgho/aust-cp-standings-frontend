import React, { useMemo, useState } from "react";
import { getPlatformProfileUrl } from "../utils";
import RatingBadge from "./RatingBadge";
import "../styles/style.css";
import "../styles/comp/RatingsTable.css";

const BADGE_COLUMN_KEYS = new Set(["rating", "maxRating", "rating_digit"]);

export default function RatingsTable({
  title, // This now expects just the platform name (e.g., "Codeforces")
  rows = [],
  columns = [],
  containerId = "table",
  defaultPageSize = 20,
  orgName = "Ahsanullah University of Science and Technology (AUST)",
  platform, // e.g. "codeforces" | "atcoder" | "codechef" — used for rating tier badges
}) {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]); // Memoize the rows displayed on the current page

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  function gotoPage(n) {
    if (n < 1 || n > totalPages) return;
    setPage(n);
    const tableElement = document.getElementById(containerId);
    if (tableElement) {
      // Scroll to the table container's start
      tableElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Fallback scroll, perhaps to avoid navbar
      window.scrollTo({ top: 140, behavior: "smooth" });
    }
  }

  function renderCell(r, col) {
    const val = r[col.key];
    // Use the `title` prop (e.g., "Codeforces") for the link platform
    if ((col.key === "username" || col.key === "handle") && col.linkPlatform) {
      const url = getPlatformProfileUrl(col.linkPlatform, r.username || r.handle);
      return (
        <a href={url} target="_blank" rel="noreferrer" className="ratings-link">
          {r.username || r.handle || "—"}{" "}
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

  const renderPaginationPages = () => {
    // ... (Pagination logic is unchanged)
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
              className={`pagination-page ${p === page ? "active" : ""}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}{" "}
            </button>
          );
        }

        const gap1 = p === 3 && page > 4;
        const gap2 = p === totalPages - 2 && page < totalPages - 3;
        if (gap1 || gap2) {
          return (
            <span key={`gap-${p}`} className="pagination-gap">
              …{" "}
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
          {p}{" "}
        </button>
      );
    });
  };

  return (
    <div id={containerId} className="ratings-table-container">
      {/* Title Wrapper with Org Name (Reduced Spacing) */}
      <div className="ratings-table-title-wrapper">
        <div className="ratings-table-main-title">{title}</div>
        <div className="ratings-table-subtitle">{orgName}</div>
      </div>
      {/* Top Row: Meta and Page Size Control (Kept for functionality) */}
      <div className="table-top-row">
        <div className="table-meta">
          Showing {showingFrom}–{showingTo} of {total} users{" "}
        </div>
        <div className="table-controls">
          <label className="page-size-label">
            Per page:{" "}
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
      {/* Main Table */}
      <div className="table-responsive-wrapper">
        <table className="ratings-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="ratings-th">
                  {col.label}{" "}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="ratings-empty">
                  No users found for this platform.{" "}
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
                  className="ratings-row"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="ratings-td">
                      {renderCell(r, col)}{" "}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="pagination-row">
        <div className="pagination-left">
          <button
            className="pagination-btn"
            onClick={() => gotoPage(1)}
            disabled={page === 1}
          >
            First{" "}
          </button>
          <button
            className="pagination-btn"
            onClick={() => gotoPage(page - 1)}
            disabled={page === 1}
          >
            Prev{" "}
          </button>
        </div>
        <div className="pagination-pages" aria-label="Page navigation">
          {renderPaginationPages()}
        </div>
        <div className="pagination-right">
          <button
            className="pagination-btn"
            onClick={() => gotoPage(page + 1)}
            disabled={page === totalPages}
          >
            Next{" "}
          </button>
          <button
            className="pagination-btn"
            onClick={() => gotoPage(totalPages)}
            disabled={page === totalPages}
          >
            Last{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
