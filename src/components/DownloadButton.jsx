import React, { useState } from "react";
import html2canvas from "html2canvas";
import "../styles/style.css";
import "../styles/comp/DownloadButton.css";

// Icon for download (using a simple SVG for consistency)
const DownloadIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className || "w-4 h-4 mr-2"}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function DownloadButton({
  containerId = "atcoder-table",
  filenamePrefix = "export",
  className = "btn-primary-ghost", // Use ghost by default as it was in CSS
}) {
  const [downloading, setDownloading] = useState(false);

  // Custom alert/message box function to replace alert()
  function showMessage(message) {
    console.error(message);
    const msgBox = document.createElement("div");
    msgBox.className = "custom-alert";
    msgBox.textContent = message;
    document.body.appendChild(msgBox);
    setTimeout(() => {
      document.body.removeChild(msgBox);
    }, 3000);
  }

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);

    try {
      const el = document.getElementById(containerId);
      if (!el) {
        showMessage("Nothing to download. Container not found.");
        setDownloading(false);
        return;
      }

      // Remove overflow:hidden to allow full capture
      el.classList.add("no-overflow");

      // 1. Clone the element
      const clone = el.cloneNode(true);

      // 2. Check the current theme of the document
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";

      // 3. Apply the current theme to the clone for accurate rendering
      clone.setAttribute("data-theme", currentTheme);

      // 4. Remove forced white background/black text, allowing CSS to control colors
      clone.style.background = "";
      clone.style.color = "";

      // Ensure clone adopts the container width before screenshotting
      clone.style.width = getComputedStyle(el).width;

      // Put clone offscreen
      clone.style.position = "fixed";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      // Cleanup
      document.body.removeChild(clone);
      el.classList.remove("no-overflow");

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${filenamePrefix}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download failed:", err);
      showMessage("Download failed — see console for details.");
    } finally {
      setTimeout(() => setDownloading(false), 700);
    }
  }

  return (
    <>
      {/* Simple style for custom alert box */}
      <style>{`
          .custom-alert {
              position: fixed;
              bottom: 20px;
              right: 20px;
              background: #ff5757;
              color: white;
              padding: 12px 20px;
              border-radius: 8px;
              z-index: 1000;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
              font-family: inherit;
          }
      `}</style>

      <button
        className={`btn download-btn ${className}`}
        onClick={handleDownload}
        disabled={downloading}
        aria-label={downloading ? "Downloading image..." : "Download as PNG"}
      >
        <DownloadIcon className="w-4 h-4 mr-2" />
        {downloading ? "Downloading..." : "Download PNG"}
      </button>
    </>
  );
}
