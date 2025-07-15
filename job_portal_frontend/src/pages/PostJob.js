import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import api from "../services/api";

/**
 * PUBLIC_INTERFACE
 * Post job page for employers.
 */
export default function PostJob() {
  const { state, fetchJobs } = useAppContext();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    company: "",
    skills: "",
  });
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErr("");
    setSuccess(false);
    const jobData = {
      ...form,
      posted_by: state.user.id,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => !!s),
    };
    try {
      await api.postJob(jobData, state.token);
      setSuccess(true);
      setForm({
        title: "",
        description: "",
        location: "",
        company: "",
        skills: "",
      });
      fetchJobs(); // refresh list
    } catch (error) {
      setErr(error.message || "Failed to post job");
    }
  };

  return (
    <div>
      <h2>Post a New Job</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 450, margin: "0 auto" }}>
        <div>
          <label>Job Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div>
          <label>Company</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div>
          <label>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div>
          <label>Skills (comma separated)</label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="JavaScript, Python, SQL"
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
            required
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="btn"
          style={{ marginTop: 15, background: "#1F73B7", color: "#fff" }}
        >
          Post Job
        </button>
        {success && (
          <div style={{ color: "green", marginTop: 8 }}>Job posted!</div>
        )}
        {err && (
          <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>
        )}
      </form>
    </div>
  );
}
