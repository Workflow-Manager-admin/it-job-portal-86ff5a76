const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";

// --- Helper to check HTTP/JSON response ---
async function handleResponse(res) {
  if (!res.ok) {
    let errText = await res.text();
    try { errText = JSON.parse(errText).detail || errText; } catch {}
    throw new Error(errText || "Request failed");
  }
  return res.json();
}

// PUBLIC_INTERFACE
const api = {
  // ---- AUTH ----
  /**
   * Login with username/password, returns { access_token, user }
   */
  async login(username, password) {
    const url = `${API_BASE}/auth/login`;
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
    // FastAPI uses form-data for token endpoint
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const data = await handleResponse(res);
    // Now fetch user object (not included in FastAPI /token by default)
    const userRes = await fetch(`${API_BASE}/profile/`, {
      headers: { "Authorization": `Bearer ${data.access_token}` },
    });
    const userProfile = await handleResponse(userRes);
    const user = {
      id: userProfile.user_id,
      username: userProfile.username || "", // fallback if username omitted from profile
      email: userProfile.email || "",
      role: userProfile.role || "",
      ...userProfile
    };
    return { access_token: data.access_token, user };
  },

  /**
   * Register new user: returns { user, access_token }
   */
  async register(userData) {
    const url = `${API_BASE}/auth/register`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const user = await handleResponse(res);
    // Immediately login to get token
    const loginRes = await this.login(userData.username, userData.password);
    return { user, access_token: loginRes.access_token };
  },

  // ---- USERS ----
  /**
   * Fetch all users (admin/dev - not needed in prod).
   */
  async fetchUsers(token = null) {
    const url = `${API_BASE}/users/`;
    const res = await fetch(url, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    return await handleResponse(res);
  },

  // ---- JOBS ----
  /**
   * Get all jobs or filter by location/skill (GET /jobs/)
   * filters = { location, skill }
   */
  async fetchJobs(filters = {}) {
    let url = `${API_BASE}/jobs/`;
    const params = new URLSearchParams(filters);
    if ([...params].length > 0) {
      url += "?" + params.toString();
    }
    const res = await fetch(url);
    return await handleResponse(res);
  },

  /**
   * Post a new job (POST /jobs/)
   */
  async postJob(job, token) {
    const url = `${API_BASE}/jobs/`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(job),
    });
    return await handleResponse(res);
  },

  /**
   * Get one job by ID (simulate by filtering all)
   */
  async fetchJobById(jobId) {
    const jobs = await this.fetchJobs();
    return jobs.find(j => `${j.id}` === `${jobId}`) || null;
  },

  // ---- APPLICATIONS ----
  /**
   * List all applications (GET /applications/)
   */
  async fetchApplications(query = {}, token) {
    let url = `${API_BASE}/applications/`;
    const params = new URLSearchParams(query);
    if ([...params].length > 0) {
      url += "?" + params.toString();
    }
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await handleResponse(res);
  },

  /**
   * Apply to a job (POST /applications/, multipart/form)
   */
  async applyToJob(application, resumeFile, token) {
    const url = `${API_BASE}/applications/`;
    const formData = new FormData();
    Object.entries(application).forEach(([key, val]) => formData.append(key, val));
    if (resumeFile) formData.append("resume", resumeFile);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return await handleResponse(res);
  },

  // ---- PROFILE ----
  /**
   * Get own user profile (GET /profile/)
   */
  async fetchProfile(token) {
    const res = await fetch(`${API_BASE}/profile/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await handleResponse(res);
  },

  // Update/create profile (POST /profile/, multipart/form)
  async updateProfile(profileData, resumeFile, token) {
    const formData = new FormData();
    Object.entries(profileData).forEach(([key, val]) => formData.append(key, val));
    if (resumeFile) formData.append("resume", resumeFile);
    const res = await fetch(`${API_BASE}/profile/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return await handleResponse(res);
  },

  // ---- HEALTH CHECK ----
  async health() {
    const res = await fetch(`${API_BASE}/`);
    return await handleResponse(res);
  }
};

export default api;
