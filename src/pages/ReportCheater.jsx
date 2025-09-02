import React, { useState } from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import { FaFlag, FaInfoCircle } from "react-icons/fa";
import ReportForm from "../components/ReportForm";
import ContactAdmin from "../components/ContactAdmin";
import "../styles/style.css";
import "../styles/page/ReportCheater.css";

export default function ReportCheater() {
  const [activeTab, setActiveTab] = useState("instructions");

  return (
    <div className="page-wrapper">
      <div className="page-background bg-report" />

      <div className="container">
        {/* Tab Navigation */}
        <div className="rc-tab-buttons">
          <button
            className={`rc-tab-btn ${
              activeTab === "instructions" ? "rc-active" : ""
            }`}
            onClick={() => setActiveTab("instructions")}
          >
            Instructions
          </button>
          <button
            className={`rc-tab-btn ${activeTab === "form" ? "rc-active" : ""}`}
            onClick={() => setActiveTab("form")}
          >
            Report Form
          </button>
          <button
            className={`rc-tab-btn ${
              activeTab === "contact" ? "rc-active" : ""
            }`}
            onClick={() => setActiveTab("contact")}
          >
            Contact Admin
          </button>
        </div>

        {/* Tab Content */}
        <div className="rc-tab-content">
          {/* Instructions Tab */}
          {activeTab === "instructions" && (
            <div className="rc-card rc-instructions-card">
              <div className="rc-instructions-header">
                <FaFlag size={22} style={{ color: "#f00b0bff" }} />
                <div>
                  <h2>Report a Cheater</h2>
                  <p className="rc-small">
                    Submit a report (11 September Onwards) — we’ll review it carefully.
                  </p>
                </div>
              </div>

              <p className="rc-small rc-blur">
                Fill the form in the Report Form tab to report suspected
                cheating or unfair conduct.
              </p>

              <div className="rc-instruction-section">
                <h4>What helps us act faster</h4>
                <ul>
                  <li>
                    Provide exact handle and platform (e.g. Codeforces, AtCoder,
                    CodeChef).
                  </li>
                  <li>
                    Include contest ID and a link or screenshot if possible.
                  </li>
                  <li>
                    Describe the incident clearly with context and timing.
                  </li>
                </ul>
              </div>

              <div className="rc-instruction-section">
                <h4>Privacy & Process</h4>
                <p>
                  All reports are reviewed manually and kept strictly confidential. If verification is needed, we may reach out to you,
                   but your identity will always remain anonymous.
                </p>
              </div>

              <div className="rc-info-buttons">
                <button
                  className="rc-btn rc-info"
                  onClick={() => setActiveTab("form")}
                >
                  <FaInfoCircle /> Fill Out Report
                </button>
                <button
                  className="rc-btn rc-contact"
                  onClick={() => setActiveTab("contact")}
                >
                  Contact Admin
                </button>
              </div>
            </div>
          )}

          {/* Report Form Tab */}
          {activeTab === "form" && (
            <div className="rc-card rc-report-form-card">
              <ReportForm />
            </div>
          )}

          {/* Contact Admin Tab */}
          {activeTab === "contact" && (
            <div className="rc-card rc-contact-card">
              <ContactAdmin />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
