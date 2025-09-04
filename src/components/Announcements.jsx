import React from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import "../styles/style.css";
import "../styles/comp/Announcements.css";

export default function Announcements() {
  return (
    <div className="announcement-box">
      <h1 className="announcement-title">Platform Launched!</h1>
      <p className="announcement-intro">
        We're thrilled to announce the launch of our centralized competitive
        programming platform — your one-stop destination to track ratings,
        standings, and integrity reports across Codeforces, AtCoder, and
        CodeChef for AUST coders.
      </p>
      <div className="announcement-card">
        <h2>AUST CP Hub is Live!</h2>
        <p className="announcement-date">August 7, 2025</p>
        <p>
          From national rankings to contest performance history, everything is
          now under one sleek interface. Whether you're competing or just
          curious, stay informed and inspired as we grow together as a
          community. Explore. Compete. Rise.
        </p>
      </div>
    </div>
  );
}
