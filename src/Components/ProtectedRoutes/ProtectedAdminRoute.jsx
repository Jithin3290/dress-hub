// src/Components/ProtectedRoutes/ProtectedAdminRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const auth = useSelector((s) => s.auth || {});
  let user = auth.user;

  // fallback on refresh
  if (!user) {
    try {
      const raw = sessionStorage.getItem("user");
      if (raw) user = JSON.parse(raw);
    } catch {}
  }

  const location = useLocation();

  // not logged in -> login
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // admin check
  if (user.is_staff || user.is_superuser) {
    return children;
  }

  // logged in but not admin -> redirect to home (or show 403 page if you prefer)
  return <Navigate to="/" replace />;
}
