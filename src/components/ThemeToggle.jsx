import React from "react";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi"; // Import icons
import "../styles/comp/ThemeToggle.css";
import "../styles/style.css";
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const iconSize = 20;

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn icon-button"
      aria-label={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
    >
      {/* Show Moon icon to indicate switching to Dark Mode */}
      {theme === "light" ? (
        <FiMoon size={iconSize} />
      ) : (
        // Show Sun icon to indicate switching to Light Mode
        <FiSun size={iconSize} />
      )}
    </button>
  );
};

export default ThemeToggle;
