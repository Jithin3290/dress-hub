// src/admin_api.js
import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/\/$/, "") + "/api/v1/admin/" || "http://localhost:8000/api/admin/",
  withCredentials: true, // if using session cookies
  headers: {
    Accept: "application/json",
  },
});

export default adminApi;
