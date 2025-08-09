// components/HallOfShamePolicy.jsx
import React from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
export default function HallOfShamePolicy() {
  return (
    <div className="hoc-policy-message">
      <h3 className="hoc-policy-title">❗ Zero Tolerance for Cheating</h3>
      <p>
        Cheating is a serious violation of our contest policies and academic
        integrity standards. Any individual found guilty of:
      </p>
      <ul>
        <li>Plagiarizing code or logic from online sources.</li>
        <li>Using multiple accounts to manipulate rankings.</li>
        <li>Leaking or distributing contest problems/solutions.</li>
        <li>Using AI/automation in unauthorized ways.</li>
      </ul>
      <p>
        Will face <strong>permanent bans</strong> from all leaderboards, public
        exposure on this page, and potential university reporting.
      </p>
      <p className="hoc-policy-end">
        ⚠️ We track logs, submissions, and behaviors carefully. Once caught,
        there's no going back.
      </p>
    </div>
  );
}
