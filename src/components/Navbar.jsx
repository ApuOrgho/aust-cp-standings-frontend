import React, { useState } from "react";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodeforcesRatings,
  parseCodechefRatings,
} from "../utils";
import { Link, NavLink } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import "../styles/style.css";
import "../styles/comp/Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner container">
          <div className="navbar-left">
            <Link
              to="/"
              className="brand"
              onClick={() => setOpen(false)}
              aria-label="Competitive Programming AUST Home"
            >
              <img
                src="/assets/favicon.ico"
                alt="logo"
                className="brand-logo"
              />
              <div className="brand-text">
                <div className="brand-title">AUST CP</div>
                {/*<div className="brand-subtitle">Standings & Contest Hub</div>*/}
              </div>
            </Link>
          </div>

          <nav className="navbar-right">
            <div className="nav-links">
              <NavLink
                to="/"
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/standings/overall"
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                Contestants
              </NavLink>
              <NavLink
                to="/standings/contest"
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                Contests
              </NavLink>
              <NavLink
                to="/national-contests"
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                National
              </NavLink>
              <NavLink
                to="/report-cheater"
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                Report
              </NavLink>
              <NavLink
                to="/register"
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                Register
              </NavLink>
              <NavLink
                to="/hall-of-shame"
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                HallOfShame
              </NavLink>
              <NavLink
                to="/about"
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                About
              </NavLink>
            </div>

            <div
              className="menu-dots"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setOpen(!open);
                }
              }}
            >
              <FiMenu size={26} />
            </div>
          </nav>
        </div>

        {open && (
          <div className="mobile-menu">
            <NavLink to="/" className="nav-link" onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink
              to="/standings/overall"
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              Overall
            </NavLink>
            <NavLink
              to="/standings/contest"
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              Contest Search
            </NavLink>
            <NavLink
              to="/report-cheater"
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              Report Cheater
            </NavLink>
            <NavLink
              to="/register"
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              Register
            </NavLink>
            <NavLink
              to="/hall-of-shame"
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              Hall of Shame
            </NavLink>
            <NavLink
              to="/about"
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              About
            </NavLink>
          </div>
        )}
      </header>

      {/* Spacer so content is not hidden behind fixed navbar */}
      <div className="navbar-spacer" />
    </>
  );
}
