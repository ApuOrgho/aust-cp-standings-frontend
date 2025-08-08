import React, { useState } from "react";
import { FaUserPlus, FaInfoCircle } from "react-icons/fa";
import RegisterForm from "../components/RegisterForm";
import "../styles/style.css";
import "../styles/page/Register.css";

export default function Register() {
  const [activeTab, setActiveTab] = useState("instructions");

  return (
    <div className="page-wrapper">
      <div className="page-background bg-overall" />

      <div className="container">
        {/* Tab Navigation */}
        <div className="reg-tab-buttons">
          <button
            className={`reg-tab-btn ${
              activeTab === "instructions" ? "reg-active" : ""
            }`}
            onClick={() => setActiveTab("instructions")}
          >
            Instructions
          </button>
          <button
            className={`reg-tab-btn ${
              activeTab === "form" ? "reg-active" : ""
            }`}
            onClick={() => setActiveTab("form")}
          >
            Registration Form
          </button>
        </div>

        {/* Tab Content */}
        <div className="reg-tab-content">
          {/* Instructions Tab */}
          {activeTab === "instructions" && (
            <div className="reg-card reg-instructions-card">
              {/* Header */}
              <div className="reg-instructions-header">
                <FaUserPlus size={24} style={{ color: "#007bff" }} />
                <div>
                  <h2>Registration Instructions</h2>
                  <p className="reg-small">
                    Only AUST students are eligible to register.
                  </p>
                </div>
              </div>

              <p className="reg-small">
                If you're not appearing on the AUST leaderboard, follow one of
                the methods below to get listed:
              </p>

              {/* Preferred Method */}
              <div className="reg-instruction-section">
                <h4>
                  <li>Preferred Method — Auto Listing</li>
                </h4>
                <p className="reg-small">
                  Update your <strong>Organization / Affiliation</strong> field
                  in each platform's settings as follows:
                </p>

                <ul className="reg-small reg-register-org-list">
                  <li>
                    <strong>Codeforces:</strong> Set organization to{" "}
                    <em>AUST</em>.
                  </li>
                  <li>
                    <strong>CodeChef:</strong> Set institute to{" "}
                    <em>Ahsanullah University of Science and Technology</em>.
                  </li>
                  <li>
                    <strong>AtCoder:</strong> Set affiliation to <em>AUST</em>.
                  </li>
                </ul>

                <p className="reg-small">
                  This is the fastest and most accurate way. Your name will be
                  automatically detected and appear on the leaderboard.
                </p>
              </div>

              {/* Alternative Method */}
              <div className="reg-instruction-section">
                <h4>
                  <li>Alternative Method — Registration</li>
                </h4>
                <p className="reg-small">
                  If you're unable to update organization info, you may submit
                  the form manually with your correct details. Our team will
                  verify and list you.
                </p>
              </div>

              {/* Privacy */}
              <div className="reg-instruction-section">
                <h4>🔒 Privacy & Usage</h4>
                <p className="reg-small">
                  Your data will be used only for leaderboard tracking and
                  academic coordination. No personal information will be shared
                  or misused.
                </p>
              </div>

              {/* Action Button */}
              <div className="reg-info-buttons">
                <button
                  className="reg-btn reg-info"
                  onClick={() => setActiveTab("form")}
                >
                  <FaInfoCircle /> Go to Registration Form
                </button>
              </div>
            </div>
          )}

          {/* Registration Form Tab */}
          {activeTab === "form" && (
            <div className="reg-card reg-form-card">
              <RegisterForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
