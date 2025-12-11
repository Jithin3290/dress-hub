// src/Components/ProtectedRoutes/ProtectedAdminRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function readUserFallback() {
  try {
    const raw = sessionStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    u.is_staff = !!u.is_staff;
    u.is_superuser = !!u.is_superuser;
    return u;
  } catch {
    return null;
  }
}

export default function ProtectedAdminRoute({ children }) {
  const auth = useSelector((s) => s.auth || {});
  const user = auth.user || readUserFallback();
  const location = useLocation();
  
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const isAdmin = !!user.is_staff || !!user.is_superuser;
  if (isAdmin) return children;

  // logged in but not admin -> redirect to home (or show 403)
  return <Navigate to="/" replace />;
}
