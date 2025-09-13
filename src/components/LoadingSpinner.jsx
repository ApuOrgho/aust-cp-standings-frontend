import React from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import "../styles/style.css";
import "../styles/comp/LoadingSpinner.css";

export default function LoadingSpinner({ 
  size = "medium", 
  color = "primary",
  className = "",
  ...props 
}) {
  return (
    <div 
      className={`spinner spinner-${size} spinner-${color} ${className}`}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}
