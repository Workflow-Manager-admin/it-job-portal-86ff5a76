import React, { createContext, useReducer, useContext, useEffect } from "react";
import api from "../services/api";

// --- Initial Global State ---
const initialState = {
  user: null, // logged-in user info: { id, username, email, role }
  token: null, // JWT token for authenticated requests
  jobs: [], // list of jobs
  applications: [], // applications for candidate/employer dashboard
  profile: null, // user profile info
  isLoading: false, // loading state for any async action
  error: null, // global error state
};

// --- Reducer for state transitions ---
function appReducer(state, action) {
  switch (action.type) {
    // AUTH
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload.user, token: action.payload.token, error: null };
    case "REGISTER_SUCCESS":
      return { ...state, user: action.payload.user, token: action.payload.token, error: null };
    case "LOGOUT":
      return { ...state, user: null, token: null, profile: null, applications: [], jobs: [] };
    case "SET_AUTH_ERROR":
      return { ...state, error: action.payload };
    // JOBS
    case "SET_JOBS":
      return { ...state, jobs: action.payload };
    case "ADD_JOB":
      return { ...state, jobs: [action.payload, ...state.jobs] };
    // APPLICATIONS
    case "SET_APPLICATIONS":
      return { ...state, applications: action.payload };
    // PROFILE
    case "SET_PROFILE":
      return { ...state, profile: action.payload };
    // LOADING / ERROR
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    // Default
    default:
      return state;
  }
}

// --- Context & Provider ---
const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // JWT persistence with localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      dispatch({ type: "LOGIN_SUCCESS", payload: { token, user: JSON.parse(userStr) } });
    }
  }, []);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [state.token, state.user]);

  // --- Helper actions for common flows ---
  const login = async (username, password) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { access_token, user } = await api.login(username, password);
      dispatch({ type: "LOGIN_SUCCESS", payload: { user, token: access_token } });
      dispatch({ type: "SET_LOADING", payload: false });
      return true;
    } catch (err) {
      dispatch({ type: "SET_AUTH_ERROR", payload: err.message || "Login failed" });
      dispatch({ type: "SET_LOADING", payload: false });
      return false;
    }
  };

  const register = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { user, access_token } = await api.register(userData);
      dispatch({ type: "REGISTER_SUCCESS", payload: { user, token: access_token } });
      dispatch({ type: "SET_LOADING", payload: false });
      return true;
    } catch (err) {
      dispatch({ type: "SET_AUTH_ERROR", payload: err.message || "Registration failed" });
      dispatch({ type: "SET_LOADING", payload: false });
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  // Jobs fetch
  const fetchJobs = async (filters = {}) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const jobs = await api.fetchJobs(filters);
      dispatch({ type: "SET_JOBS", payload: jobs });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch jobs" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Fetch user's applications
  const fetchApplications = async (query = {}) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await api.fetchApplications(query, state.token);
      dispatch({ type: "SET_APPLICATIONS", payload: data });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Could not fetch applications" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Fetch profile
  const fetchProfile = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const profile = await api.fetchProfile(state.token);
      dispatch({ type: "SET_PROFILE", payload: profile });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Could not fetch profile" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // --- Context value ---
  const contextValue = {
    state,
    dispatch,
    login,
    register,
    logout,
    fetchJobs,
    fetchApplications,
    fetchProfile,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
