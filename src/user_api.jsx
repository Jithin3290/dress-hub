// src/user_api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_PREFIX = "/api/v1/"; // adjust to your backend prefix

const api = axios.create({
  baseURL: `${API_BASE.replace(/\/$/, "")}${API_PREFIX}`,
  withCredentials: true, // if you use cookies for auth
  headers: {
    "Accept": "application/json",
  },
});

export default api;
