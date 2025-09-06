import html2canvas from "html2canvas";
import axios from "axios";

//export const BACKEND_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const BACKEND_BASE = "https://cp-standings-be.austpic.com";

export async function getJSON(path, config = {}) {
  try {
    const res = await axios.get(`${BACKEND_BASE}${path}`, config);
    return res.data;
  } catch (err) {
    console.error("HTTP GET error:", path, err?.response?.data || err.message);
    throw err;
  }
}

export function parseAtCoderRatings(data) {
  if (!data || !Array.isArray(data.ratings_all_atcoder)) return [];
  return data.ratings_all_atcoder
    .filter((entry) => entry.username && entry.username.trim() !== "")
    .map((entry) => ({
      username: entry.username,
      rating: Number(String(entry.rating).replace(/\D/g, "")) || 0,
      raw: entry,
    }));
}

export function parseCodeforcesRatings(data) {
  if (!data || !Array.isArray(data.ratings_all_codeforces)) return [];
  return data.ratings_all_codeforces.map((entry) => ({
    username: entry.username,
    rating: Number(String(entry.rating).replace(/\D/g, "")) || 0,
    contestParticipated: entry.contestParticipated || 0,
    raw: entry,
  }));
}

// Generic parse for CodeChef ratings
export function parseCodechefRatings(data) {
  if (!data || !Array.isArray(data.ratings_all)) return [];
  return data.ratings_all.map((entry) => ({
    username: entry.username,
    global_rank: entry.global_rank || "—",
    country_rank: entry.country_rank || "—",
    rating_digit: Number(String(entry.rating_digit).replace(/\D/g, "")) || 0,
    rating_star: entry.rating_star || "—",
    raw: entry,
  }));
}

export async function exportElementToPng(
  element,
  filename = "standings.png",
  scale = 3
) {
  if (!element) return;
  // clone to a new element to avoid problems with fixed backgrounds / overlays
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
  });
  const dataURL = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
