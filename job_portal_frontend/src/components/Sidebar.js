import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { useAppContext } from "../context/AppContext";

/**
 * PUBLIC_INTERFACE
 * Sidebar for main navigation with links.
 */
function Sidebar() {
  const { state, logout } = useAppContext();
  const isAuthenticated = !!state.token && !!state.user;
  const userRole = isAuthenticated ? state.user.role : null;

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
        {/* Only show "Post Job" for employers */}
        {isAuthenticated && userRole === "employer" && (
          <NavLink to="/post-job" className="sidebar-link">
            Post Job
          </NavLink>
        )}
        {/* Dashboard/Profile for logged-in users */}
        {isAuthenticated && (
          <>
            <NavLink to="/dashboard" className="sidebar-link">
              Dashboard
            </NavLink>
            <NavLink to="/profile" className="sidebar-link">
              Profile
            </NavLink>
          </>
        )}
        {/* Show Login/Register only if not authenticated */}
        {!isAuthenticated && (
          <>
            <NavLink to="/login" className="sidebar-link">
              Login
            </NavLink>
            <NavLink to="/register" className="sidebar-link">
              Register
            </NavLink>
          </>
        )}
        {/* Show Logout if logged in */}
        {isAuthenticated && (
          <span
            role="button"
            className="sidebar-link"
            tabIndex={0}
            style={{ cursor: "pointer" }}
            onClick={logout}
          >
            Logout
          </span>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
