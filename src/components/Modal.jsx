import React from "react";
import "../styles/style.css";
import "../styles/comp/Modal.css";

export default function Modal({ show, onClose, children, title }) {
  if (!show) return null;

  React.useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Remove title for Contest ID modal */}
        <div className="modal-content">{children}</div>
        <div className="modal-footer">
          <button
            className="btn ghost"
            onClick={onClose}
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
