// src/utils/image.js

// Vite exposes environment variables using import.meta.env
// Make sure you created .env with:  VITE_API_URL=http://localhost:8000
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Convert relative /media/... path to full URL
export function buildImageUrl(path) {
  if (!path) return null;

  // Already full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Remove trailing slash from base
  const base = API_BASE.replace(/\/$/, "");
  // Ensure media path starts with "/"
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${base}${cleanPath}`;
}
