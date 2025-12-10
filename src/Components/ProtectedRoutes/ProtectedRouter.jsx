// src/Components/ProtectedRoutes/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const auth = useSelector((s) => s.auth || {});

  // fallback on refresh
  let user = auth.user;
  if (!user) {
    try {
      const raw = sessionStorage.getItem("user");
      if (raw) user = JSON.parse(raw);
    } catch {}
  }

  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Option: if you want admins forced to /admin, uncomment the next line:
  if (user.is_staff || user.is_superuser) return <Navigate to="/admin" replace />;

  // allow all authenticated users (including admins)
  return children;
}
