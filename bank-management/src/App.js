import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/LoginForm";
import Users from "./components/Users";
import Account from "./pages/Account";
import AccountDetails from "./pages/AccountDetails";
import Transactions from "./pages/Transactions";
import LoanApplication from "./pages/LoanApplication";
import LoanApproval from "./pages/LoanApproval";
import RepaymentSchedule from "./pages/RepaymentSchedule";
import SavingsPlans from './pages/SavingsPlans';
import InterestLogs from './pages/InterestLogs';
import MonthlyStatements from './pages/MonthlyStatements';
import DetailedReports from './pages/DetailedReports';
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const userRole = localStorage.getItem("role");

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
              userRole === "Administrator" ? (
                <Navigate to="/adminDashboard" replace />
              ) : userRole === "Customer" ? (
                <Navigate to="/customerDashboard" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route path="/" element={<Layout />}>
          {/* Protected Routes */}
          <Route
            path="adminDashboard"
            element={
              isAuthenticated && userRole === "Administrator" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="customerDashboard"
            element={
              isAuthenticated && userRole === "Customer" ? (
                <CustomerDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
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

          <Route
            path="savings-plans"
            element={isAuthenticated ? <SavingsPlans /> : <Navigate to="/" replace />}
          />

          <Route
            path="interest-logs"
            element={isAuthenticated ? <InterestLogs /> : <Navigate to="/" replace />}
          />

          <Route
            path="monthly-statement"
            element={isAuthenticated ? <MonthlyStatements /> : <Navigate to="/" replace />}
          />

          <Route
            path="detailed-report"
            element={isAuthenticated ? <DetailedReports /> : <Navigate to="/" replace />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
