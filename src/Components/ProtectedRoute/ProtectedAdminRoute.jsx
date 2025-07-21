import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';

function ProtectedAdminRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // If not logged in or not an admin, redirect to login
  if (!user || !user.login || user.isAdmin !== true) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
