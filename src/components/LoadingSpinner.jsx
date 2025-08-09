import React from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import "../styles/style.css";
import "../styles/comp/LoadingSpinner.css";

export default function LoadingSpinner() {
  return <div className="spinner" role="status" aria-label="loading" />;
}
