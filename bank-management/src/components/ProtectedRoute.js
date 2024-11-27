import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token"); 

  if (!token) {
   
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token); 
    console.log("Decoded Token:", decodedToken); 

    // Extract the role claim from the token
    const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log("User Role:", userRole); 


    const currentTime = Date.now() / 1000; 
    if (decodedToken.exp < currentTime) {
      console.error("Token has expired");
      return <Navigate to="/login" />;
    }

 
    if (!allowedRoles.includes(userRole)) {
      console.error("Unauthorized: Role does not match");
      return <Navigate to="/unauthorized" />;
    }


    return children;
  } catch (error) {
    console.error("Token validation failed:", error);
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
