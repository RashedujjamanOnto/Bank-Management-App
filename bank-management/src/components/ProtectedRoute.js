import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Use named import instead of default import

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token"); // Get the token from localStorage

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token); // Decode JWT token using named import
    console.log("Decoded Token:", decodedToken); // Debug: Log the decoded token

    // Extract the role claim from the token
    const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log("User Role:", userRole); // Debug: Log the user role

    // Token expiration check
    const currentTime = Date.now() / 1000; // Current time in seconds
    if (decodedToken.exp < currentTime) {
      console.error("Token has expired");
      return <Navigate to="/login" />;
    }

    // Role validation
    if (!allowedRoles.includes(userRole)) {
      console.error("Unauthorized: Role does not match");
      return <Navigate to="/unauthorized" />;
    }

    // If everything passes, render the child components
    return children;
  } catch (error) {
    console.error("Token validation failed:", error);
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
