// Rating -> color-tier helpers, one per platform, loosely modeled on each
// platform's own public rating-color conventions. Used to render RatingBadge.

const CODEFORCES_TIERS = [
  { min: 3000, label: "Legendary Grandmaster", color: "#ff0000" },
  { min: 2400, label: "Grandmaster", color: "#ff0000" },
  { min: 2100, label: "Master", color: "#ff8c00" },
  { min: 1900, label: "Candidate Master", color: "#aa00aa" },
  { min: 1600, label: "Expert", color: "#0000ff" },
  { min: 1400, label: "Specialist", color: "#03a89e" },
  { min: 1200, label: "Pupil", color: "#008000" },
  { min: -Infinity, label: "Newbie", color: "#808080" },
];

const ATCODER_TIERS = [
  { min: 2800, label: "Red", color: "#ff0000" },
  { min: 2400, label: "Orange", color: "#ff8c00" },
  { min: 2000, label: "Yellow", color: "#c0c000" },
  { min: 1600, label: "Blue", color: "#0000ff" },
  { min: 1200, label: "Cyan", color: "#03a89e" },
  { min: 800, label: "Green", color: "#008000" },
  { min: 400, label: "Brown", color: "#804000" },
  { min: -Infinity, label: "Gray", color: "#808080" },
];

// Based on CodeChef's numeric rating (rating_digit), not the pre-formatted star string.
const CODECHEF_TIERS = [
  { min: 2500, label: "7★", color: "#ff0000" },
  { min: 2200, label: "6★", color: "#ff8c00" },
  { min: 2000, label: "5★", color: "#c0c000" },
  { min: 1800, label: "4★", color: "#aa00aa" },
  { min: 1600, label: "3★", color: "#0000ff" },
  { min: 1400, label: "2★", color: "#008000" },
  { min: -Infinity, label: "1★", color: "#808080" },
];

function pickTier(tiers, value) {
  const n = Number(value) || 0;
  return tiers.find((t) => n >= t.min) || tiers[tiers.length - 1];
}

export function getCodeforcesTier(rating) {
  return pickTier(CODEFORCES_TIERS, rating);
}

export function getAtCoderTier(rating) {
  return pickTier(ATCODER_TIERS, rating);
}

export function getCodeChefTier(ratingDigit) {
  return pickTier(CODECHEF_TIERS, ratingDigit);
}

export function getTier(platform, value) {
  const p = String(platform || "").toLowerCase();
  if (p.includes("codeforces")) return getCodeforcesTier(value);
  if (p.includes("atcoder")) return getAtCoderTier(value);
  if (p.includes("codechef")) return getCodeChefTier(value);
  return { label: "", color: "#808080" };
}
