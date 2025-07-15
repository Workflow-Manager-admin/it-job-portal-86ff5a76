import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import api from "../services/api";

/**
 * PUBLIC_INTERFACE
 * Profile/resume management page.
 */
export default function Profile() {
  const { state, fetchProfile } = useAppContext();
  const [form, setForm] = useState({ bio: "", company_info: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // prefill with loaded profile
    if (state.profile) {
      setForm({
        bio: state.profile.bio || "",
        company_info: state.profile.company_info || "",
      });
    }
  }, [state.profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSuccess(false);
    try {
      await api.updateProfile(form, resumeFile, state.token);
      setSuccess(true);
      fetchProfile();
    } catch (error) {
      setErr(error.message || "Failed to update profile");
    }
  };

  const isEmployer = state.user && state.user.role === "employer";

  return (
    <div>
      <h2>Profile Management</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
        <div>
          <label>Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="form-control"
            rows={3}
          />
        </div>
        {isEmployer && (
          <div>
            <label>Company Info</label>
            <textarea
              name="company_info"
              value={form.company_info}
              onChange={handleChange}
              className="form-control"
              rows={2}
            />
          </div>
        )}
        <div style={{ margin: "12px 0" }}>
          <label>Upload Resume (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeChange}
          />
        </div>
        <button
          type="submit"
          className="btn"
          style={{ background: "#1F73B7", color: "#fff" }}
        >
          Save Profile
        </button>
        {state.profile && state.profile.resume_url && (
          <div style={{ marginTop: 8 }}>
            <a
              href={state.profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Resume
            </a>
          </div>
        )}
        {success && (
          <div style={{ color: "green", marginTop: 5 }}>Profile updated!</div>
        )}
        {err && (
          <div style={{ color: "crimson", marginTop: 5 }}>{err}</div>
        )}
      </form>
    </div>
  );
}
