import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL || "https://api.ruha.com"
      : "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("ruha_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("ruha_token");
      localStorage.removeItem("ruha_user");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
