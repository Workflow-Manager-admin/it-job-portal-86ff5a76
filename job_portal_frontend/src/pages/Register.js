import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Registration page for new users.
 */
export default function Register() {
  const { register, state } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [err, setErr] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErr(null);
    const ok = await register(form);
    if (ok) {
      navigate("/dashboard");
    } else {
      setErr(state.error || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
        <div>
          <label>Username</label>
          <input
            name="username"
            required
            value={form.username}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            name="email"
            required
            type="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            name="password"
            required
            type="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            minLength={6}
          />
        </div>
        <div>
          <label>Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%" }}
          >
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-large"
          style={{ marginTop: 16 }}
          disabled={state.isLoading}
        >
          {state.isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      {err && <p style={{ color: "crimson", marginTop: 6 }}>{err}</p>}
    </div>
  );
}
