import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Login page for user authentication.
 */
export default function Login() {
  const { login, state } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErr(null);
    const success = await login(form.username, form.password);
    if (success) {
      navigate("/dashboard");
    } else {
      setErr(state.error || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 350, margin: "0 auto" }}>
        <div>
          <label>Username</label>
          <input
            name="username"
            required
            value={form.username}
            onChange={handleChange}
            className="form-control"
            autoFocus
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Password</label>
          <input
            name="password"
            required
            type="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button
          type="submit"
          className="btn btn-large"
          style={{ marginTop: 15 }}
          disabled={state.isLoading}
        >
          {state.isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      {err && <p style={{ color: "crimson", marginTop: 8 }}>{err}</p>}
    </div>
  );
}
