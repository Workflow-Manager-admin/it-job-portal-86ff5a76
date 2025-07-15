import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

/**
 * PUBLIC_INTERFACE
 * Sidebar for main navigation with links.
 */
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">IT Job Portal</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className="sidebar-link">
          Home
        </NavLink>
        <NavLink to="/jobs" className="sidebar-link">
          Job Listings
        </NavLink>
        <NavLink to="/post-job" className="sidebar-link">
          Post Job
        </NavLink>
        <NavLink to="/dashboard" className="sidebar-link">
          Dashboard
        </NavLink>
        <NavLink to="/profile" className="sidebar-link">
          Profile
        </NavLink>
        <NavLink to="/login" className="sidebar-link">
          Login
        </NavLink>
        <NavLink to="/register" className="sidebar-link">
          Register
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
