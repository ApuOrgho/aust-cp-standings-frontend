import React from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import "../styles/style.css";
import "../styles/comp/Modal.css";

export default function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h3 style={{ marginBottom: 12 }}>{title}</h3>}
        <div>{children}</div>
        <div style={{ marginTop: 12, textAlign: "right" }}>
          <button className="btn ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
