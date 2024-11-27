import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/LoginForm";
import Users from "./components/Users";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import AccountDetails from "./pages/AccountDetails";
import Transactions from "./pages/Transactions";
import LoanApplication from "./pages/LoanApplication";
import LoanApproval from "./pages/LoanApproval";
import RepaymentSchedule from "./pages/RepaymentSchedule";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    // Watch for token changes in localStorage
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Layout with Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route
            path="dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
          />
          <Route
            path="account"
            element={isAuthenticated ? <Account /> : <Navigate to="/" replace />}
          />
          <Route
            path="transactions"
            element={isAuthenticated ? <Transactions /> : <Navigate to="/" replace />}
          />
          <Route
            path="loanapplication"
            element={isAuthenticated ? <LoanApplication /> : <Navigate to="/" replace />}
          />
          <Route
            path="loanapproval"
            element={isAuthenticated ? <LoanApproval /> : <Navigate to="/" replace />}
          />
          <Route
            path="repaymentschedule/:loanId"
            element={isAuthenticated ? <RepaymentSchedule /> : <Navigate to="/" replace />}
          />
          <Route
            path="account-details/:id"
            element={isAuthenticated ? <AccountDetails /> : <Navigate to="/" replace />}
          />
          <Route
            path="users"
            element={isAuthenticated ? <Users /> : <Navigate to="/" replace />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
