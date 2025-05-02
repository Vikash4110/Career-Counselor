import React from "react";
import { useAuth } from "../Store/auth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, isLoggedIn, role, subscribed } = useAuth();

  if (!isLoggedIn || !user) {
    return <Navigate to="/student-login" replace />;
  }

  if (role !== "student") {
    return <Navigate to="/student-login" replace />;
  }

  if (!subscribed) {
    return <Navigate to="/subscription" replace />;
  }

  return children;
};

export default ProtectedRoute;