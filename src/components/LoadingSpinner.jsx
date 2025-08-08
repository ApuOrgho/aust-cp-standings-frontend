import React from "react";
import "../styles/style.css";
import "../styles/comp/LoadingSpinner.css";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodechefRatings,
  parseCodeforcesRatings,
} from "../utils";
export default function LoadingSpinner() {
  return <div className="spinner" role="status" aria-label="loading" />;
}
