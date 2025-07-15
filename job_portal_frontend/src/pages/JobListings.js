import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

/**
 * PUBLIC_INTERFACE
 * Main job listings/search page.
 */
export default function JobListings() {
  const { state, fetchJobs } = useAppContext();

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2>Available Jobs</h2>
      {state.isLoading ? (
        <p>Loading jobs...</p>
      ) : state.error ? (
        <p style={{ color: "crimson" }}>{state.error}</p>
      ) : state.jobs && state.jobs.length > 0 ? (
        <div className="job-list">
          {state.jobs.map((job) => (
            <div
              key={job.id}
              className="job-listing"
              style={{
                border: "1px solid #e9ecef",
                padding: 18,
                boxShadow: "0 2px 8px rgba(31,115,183,0.05)",
                marginBottom: 24,
                borderRadius: 12,
                textAlign: "left",
              }}
            >
              <h3 style={{ margin: 0, color: "#124191" }}>{job.title}</h3>
              <span><b>Company:</b> {job.company}</span>
              {" | "}
              <span><b>Location:</b> {job.location}</span>
              <div style={{ marginTop: 10 }}>{job.description}</div>
              <div style={{ marginTop: 10, color: "#1F73B7", fontSize: 13 }}>
                {job.skills && job.skills.length
                  ? "Skills: " + job.skills.join(", ")
                  : ""}
              </div>
              <a
                href={`/jobs/${job.id}`}
                className="btn"
                style={{
                  marginTop: 10,
                  float: "right",
                  background: "#22C55E",
                  color: "#fff",
                }}
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
}
