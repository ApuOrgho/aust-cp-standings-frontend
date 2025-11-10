import React from "react";
import "../styles/style.css";
import "../styles/comp/LoadingSpinner.css";

export default function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner-loader" role="status" aria-label="loading" />
    </div>
  );
}
