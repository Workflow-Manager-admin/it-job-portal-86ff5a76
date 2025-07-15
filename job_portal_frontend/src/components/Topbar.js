import React from "react";
import "./Topbar.css";

/**
 * PUBLIC_INTERFACE
 * Topbar header for page, includes theme toggle.
 */
function Topbar({ toggleTheme, theme }) {
  return (
    <header className="topbar">
      <div />
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </header>
  );
}

export default Topbar;
