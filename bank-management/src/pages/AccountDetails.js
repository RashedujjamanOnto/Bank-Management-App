import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import API from "../services/api";
import { useParams } from "react-router-dom";

const AccountDetails = () => {
  const { id } = useParams(); // Get account ID from URL
  const [accountDetails, setAccountDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Account Details
  const fetchAccountDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await API.get(`/Account/GetAccountDetails/${id}`);
      if (response.status === 204 || !response.data) {
        setErrorMessage("No account found with the given ID.");
        setIsLoading(false);
        return;
      }
      setAccountDetails(response.data); // Set fetched data to state
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch account details:", error);
      setErrorMessage("Error fetching account details.");
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAccountDetails();
  }, [fetchAccountDetails]);

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading account details...</Typography>
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">{errorMessage}</Typography>
      </Box>
    );
  }

  if (!accountDetails) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography>No account data available.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 5, pl:30 }}>
      {/* Account Details Header */}
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
        Account Details
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Account Information Section */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        Account Information
      </Typography>
      <Box sx={{ mb: 3, p: 2, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
        <Typography>Account Number: {accountDetails.accountNumber}</Typography>
        <Typography>Account Type: {accountDetails.accountType}</Typography>
        <Typography>
          Balance: {accountDetails.balance} {accountDetails.currency}
        </Typography>
      </Box>

      {/* Customer Information Section */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        Customer Information
      </Typography>
      <Box sx={{ mb: 3, p: 2, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
        <Typography>Name: {accountDetails.name}</Typography>
        <Typography>Email: {accountDetails.email}</Typography>
        <Typography>Role: {accountDetails.roleName}</Typography>
      </Box>

      {/* Transaction History Section */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        Transaction History
      </Typography>
      {accountDetails.transaction && accountDetails.transaction.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction Type</TableCell>
                <TableCell>Target Account Number</TableCell>
                <TableCell>Target Bank Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Fee</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accountDetails.transaction.map((txn, index) => (
                <TableRow key={index}>
                  <TableCell>{txn.transactionType}</TableCell>
                  <TableCell>{txn.targetAccountNumber}</TableCell>
                  <TableCell>{txn.targetBankName}</TableCell>
                  <TableCell>{txn.amount}</TableCell>
                  <TableCell>{txn.fee}</TableCell>
                  <TableCell>
                    {new Date(txn.transactionDate).toLocaleString()}
                  </TableCell>
                  <TableCell>{txn.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No transactions available.</Typography>
      )}
    </Box>
  );
};

export default AccountDetails;
