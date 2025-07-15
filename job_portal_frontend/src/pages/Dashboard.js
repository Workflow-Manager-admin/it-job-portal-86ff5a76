import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

/**
 * PUBLIC_INTERFACE
 * Dashboard page for user (employer/candidate).
 */
export default function Dashboard() {
  const { state, fetchApplications, fetchJobs } = useAppContext();
  const isCandidate = state.user && state.user.role === "candidate";
  const isEmployer = state.user && state.user.role === "employer";

  useEffect(() => {
    if (isCandidate) {
      fetchApplications({ user_id: state.user.id });
    } else if (isEmployer) {
      fetchJobs();
      fetchApplications(); // all employer app view
    }
    // eslint-disable-next-line
  }, [isCandidate, isEmployer]);

  return (
    <div>
      <h2>Dashboard</h2>
      {isCandidate && (
        <>
          <h3>Applications</h3>
          {state.isLoading ? (
            <p>Loading applications...</p>
          ) : state.applications && state.applications.length > 0 ? (
            <ul>
              {state.applications.map((a) => (
                <li key={a.id}>
                  <span>
                    Job ID: {a.job_id} | Status: {a.status} | Applied:{" "}
                    {a.applied_at && a.applied_at.slice(0, 10)}
                  </span>
                  {a.resume_url && (
                    <>
                      {" - "}
                      <a
                        href={a.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#22C55E" }}
                      >
                        Resume
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No applications yet.</p>
          )}
        </>
      )}

      {isEmployer && (
        <>
          <h3>Your Posted Jobs</h3>
          {state.isLoading ? (
            <p>Loading jobs...</p>
          ) : state.jobs && state.jobs.length > 0 ? (
            <ul>
              {state.jobs
                .filter(j => j.posted_by === state.user.id)
                .map((j) => (
                  <li key={j.id}>
                    <b>{j.title}</b> | {j.company} | {j.location}{" "}
                    <span style={{ fontSize: 12, color: "#1F73B7" }}>
                      {" "}
                      (id: {j.id})
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
            <p>No jobs posted yet.</p>
          )}

          <h3 style={{ marginTop: 36 }}>Applications to Your Jobs</h3>
          {state.isLoading ? (
            <p>Loading applications...</p>
          ) : state.applications && state.applications.length > 0 ? (
            <ul>
              {state.applications.map((a) => (
                <li key={a.id}>
                  User ID: {a.user_id} | Job ID: {a.job_id} | Status: {a.status}
                  {a.resume_url && (
                    <>
                      {" - "}
                      <a
                        href={a.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#22C55E" }}
                      >
                        Resume
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No applications yet.</p>
          )}
        </>
      )}
    </div>
  );
}
