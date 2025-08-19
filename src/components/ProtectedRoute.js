import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // If there is no user, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If there is a user, render the child components
  return children;
};

export default ProtectedRoute;
