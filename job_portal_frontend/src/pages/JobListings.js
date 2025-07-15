import React from "react";

/**
 * PUBLIC_INTERFACE
 * Main job listings/search page.
 */
export default function JobListings() {
  return (
    <div>
      <h2>Available Jobs</h2>
      <div className="job-list-placeholder">
        {/* Jobs will be listed here */}
        <p>Job results go here (search/filter coming soon)...</p>
      </div>
    </div>
  );
}
