import React, { useState } from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import html2canvas from "html2canvas";
import "../styles/style.css";
import "../styles/comp/DownloadButton.css";

export default function DownloadButton({
  containerId = "atcoder-table",
  filenamePrefix = "export",
  className = "",
  children,
  ...props
}) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);

    try {
      const el = document.getElementById(containerId);
      if (!el) {
        alert("Nothing to download. Container not found.");
        setDownloading(false);
        return;
      }

      // Create clone for export
      const clone = el.cloneNode(true);
      clone.style.background = "#ffffff";
      clone.style.color = "#000000";
      clone.style.width = getComputedStyle(el).width;
      clone.style.padding = getComputedStyle(el).padding || "12px";
      
      // Put clone offscreen
      clone.style.position = "fixed";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      // cleanup
      document.body.removeChild(clone);

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${filenamePrefix}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed — see console for details.");
    } finally {
      setTimeout(() => setDownloading(false), 700);
    }
  }

  return (
    <button
      className={`download-button ${className}`}
      onClick={handleDownload}
      disabled={downloading}
      aria-label={downloading ? "Downloading..." : "Download as PNG"}
      {...props}
    >
      {downloading ? (
        <>
          <div className="download-spinner"></div>
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{children || "Download PNG"}</span>
        </>
      )}
    </button>
  );
}
