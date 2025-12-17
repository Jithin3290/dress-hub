import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error("VITE_API_URL is not defined");
}

const adminApi = axios.create({
  baseURL: API_BASE.replace(/\/$/, "") + "/api/v1/admin/",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

export default adminApi;
