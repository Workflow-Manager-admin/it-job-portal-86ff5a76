import React from "react";
import { useParams } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Detailed job description page.
 */
export default function JobDetails() {
  const { jobId } = useParams();
  return (
    <div>
      <h2>Job Details</h2>
      <div>
        <p>Job ID: {jobId}</p>
        <p>Details and apply/resume upload go here...</p>
      </div>
    </div>
  );
}
