import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
function ProtectedRoute({ children }) {
  const auth = useSelector((s) => s.auth || {});
  const user = auth.user;
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.isAdmin) {
    return <Navigate to="/admin" replace={true} />;
  }

  return children;
}

export default ProtectedRoute;
