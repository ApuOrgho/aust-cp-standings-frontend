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
      className="btn download-btn"
      onClick={handleDownload}
      disabled={downloading}
    >
      {downloading ? "Downloading..." : "Download PNG"}
    </button>
  );
}
