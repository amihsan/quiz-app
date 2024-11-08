// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for authentication
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage to maintain session persistence
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    // Ensure isAuthenticated is set based on token state
    setIsAuthenticated(!!token);
  }, [token]);

  const login = (jwtToken, userRole) => {
    setToken(jwtToken);
    setRole(userRole);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("role", userRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ token, role, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
