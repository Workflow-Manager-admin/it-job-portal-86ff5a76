import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
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
