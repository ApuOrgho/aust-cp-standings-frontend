import React from "react";
import { getTier } from "../utils/ratingTiers";
import "../styles/comp/RatingBadge.css";

// Small colored pill for a rating value, tinted by platform-specific tier.
export default function RatingBadge({ platform, value }) {
  if (value === undefined || value === null || value === "—") {
    return <span>{value ?? "—"}</span>;
  }
  const { label, color } = getTier(platform, value);
  return (
    <span className="rating-badge" style={{ "--tier-color": color }} title={label}>
      {value}
    </span>
  );
}
