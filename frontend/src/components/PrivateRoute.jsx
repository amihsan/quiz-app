// PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useAuth();

  // Check if the user is authenticated; if not, redirect to /login
  if (!isAuthenticated) {
    console.log("User is not authenticated. Redirecting to /login.");
    return <Navigate to="/login" />;
  }

  // Check if a specific role is required, and if the user has it; if not, redirect to /unauthorized
  if (requiredRole && role !== requiredRole) {
    console.log(
      "User does not have the required role:",
      requiredRole,
      ". Redirecting to /unauthorized."
    );
    return <Navigate to="/unauthorized" />;
  }

  // User is authenticated and authorized for this route
  return children;
};

export default PrivateRoute;
