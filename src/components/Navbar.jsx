import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import "../styles/comp/Navbar.css";
import "../styles/style.css";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  const menuIconColor =
    theme === "dark" ? "var(--color-text)" : "var(--color-text)";

  return (
    <>
      <header className="navb-navbar">
        <div className="navb-navbar-inner container">
          <div className="navb-navbar-left">
            <Link
              to="/"
              className="navb-brand"
              onClick={() => setOpen(false)}
              aria-label="Competitive Programming AUST Home"
            >
              <img
                src="/assets/favicon.ico"
                alt="logo"
                className="navb-brand-logo"
              />
              <div className="navb-brand-text">
                <div className="navb-brand-title">AUST CP</div>
              </div>
            </Link>
          </div>

          <nav className="navb-navbar-right">
            <div className={`navb-nav-links ${open ? "navb-open" : ""}`}>
              <div className="navb-mobile-toggle">
                <ThemeToggle />
              </div>

              <NavLink
                to="/"
                className="navb-nav-link"
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/standings/overall"
                className="navb-nav-link"
                onClick={() => setOpen(false)}
              >
                Contestants
              </NavLink>
              <NavLink
                to="/standings/contest"
                className="navb-nav-link"
                onClick={() => setOpen(false)}
              >
                Contests
              </NavLink>
              <NavLink
                to="/national-contests"
                className="navb-nav-link"
                onClick={() => setOpen(false)}
              >
                National
              </NavLink>
              <NavLink
                to="/report-cheater"
                className="navb-nav-link"
                onClick={() => setOpen(false)}
              >
                Report
              </NavLink>
              <NavLink
                to="/register"
                className="navb-nav-link"
                onClick={() => setOpen(false)}
              >
                Register
              </NavLink>
              <NavLink
                to="/hall-of-shame"
                className="navb-nav-link"
                onClick={() => setOpen(false)}
              >
                HallOfShame
              </NavLink>
              <NavLink
                to="/about"
                className="navb-nav-link"
                onClick={() => setOpen(false)}
              >
                About
              </NavLink>
            </div>

            <div className="navb-desktop-toggle">
              <ThemeToggle />
            </div>

            <div
              className="navb-menu-dots"
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
              <FiMenu size={26} color={menuIconColor} />
            </div>
          </nav>
        </div>
      </header>

      <div className="navb-navbar-spacer" />
    </>
  );
}
