import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import api from "../services/api";

/**
 * PUBLIC_INTERFACE
 * Detailed job description page.
 */
export default function JobDetails() {
  const { jobId } = useParams();
  const { state } = useAppContext();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .fetchJobById(jobId)
      .then(setJob)
      .catch(() => setError("Failed to fetch job"))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!state.token || !state.user) {
      navigate("/login");
      return;
    }
    setApplyLoading(true);
    setError("");
    try {
      await api.applyToJob(
        { job_id: job.id, user_id: state.user.id },
        resumeFile,
        state.token
      );
      setApplied(true);
    } catch (err) {
      setError(
        err.message ||
          "Application failed. (Have you already applied? Must upload a valid resume.)"
      );
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : job ? (
        <>
          <h2>Job Details</h2>
          <div style={{ textAlign: "left" }}>
            <h3 style={{ color: "#124191" }}>{job.title}</h3>
            <div>
              <b>Company:</b> {job.company}
              {" | "}
              <b>Location:</b> {job.location}
            </div>
            <div style={{ marginTop: 8 }}>Description: {job.description}</div>
            <div style={{ marginTop: 8 }}>
              <b>Skills:</b>{" "}
              {job.skills && job.skills.length ? job.skills.join(", ") : "-"}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#1F73B7" }}>
              Posted: {job.date_posted}
            </div>
          </div>
          {state.token && state.user && state.user.role === "candidate" && (
            <div style={{ marginTop: 26 }}>
              {applied ? (
                <div style={{ color: "green", fontWeight: 500 }}>
                  Successfully applied!
                </div>
              ) : (
                <form onSubmit={handleApply} style={{ maxWidth: 360 }}>
                  <label>
                    Upload Resume (PDF required):
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleResumeChange}
                      required
                      style={{ display: "block", marginTop: 8 }}
                    />
                  </label>
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      background: "#22C55E",
                      color: "#fff",
                      marginTop: 12,
                    }}
                    disabled={applyLoading}
                  >
                    {applyLoading ? "Applying..." : "Apply to Job"}
                  </button>
                  {error && (
                    <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>
                  )}
                </form>
              )}
            </div>
          )}
        </>
      ) : (
        <div>{error || "Job not found"}</div>
      )}
    </div>
  );
}
