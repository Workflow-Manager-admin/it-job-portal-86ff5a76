import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Home from "./pages/Home";
import JobListings from "./pages/JobListings";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { useAppContext } from "./context/AppContext";

// PUBLIC_INTERFACE
function ProtectedRoute({ children, allowedRoles = null }) {
  // Checks context for JWT token and (optionally) user role
  const { state } = useAppContext();
  if (!state.token || !state.user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(state.user.role)) {
    // If role not permitted, send home
    return <Navigate to="/" replace />;
  }
  return children;
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  // Effect to apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          <Topbar toggleTheme={toggleTheme} theme={theme} />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<JobListings />} />
              <Route path="/jobs/:jobId" element={<JobDetails />} />
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute allowedRoles={["employer"]}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["candidate", "employer"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["candidate", "employer"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
