import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedAdminRoute({ children }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user || !user.login || user.isAdmin !== true) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
