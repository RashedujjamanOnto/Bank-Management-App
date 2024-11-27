import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import API from "../services/api";

const Transactions = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [targetAccount, setTargetAccount] = useState("");
  const [targetBankName, setTargetBankName] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Deposit");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const selfUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await API.get(`/Account/GetAccounts/${selfUserId}`);
        setAccounts(response.data);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      const fetchTransactionHistory = async () => {
        try {
          const response = await API.get(`/Transaction/GetTransactionHistory/${selectedAccount}`);
          setTransactions(response.data || []);
        } catch (error) {
          console.error("Failed to fetch transaction history:", error);
        }
      };

      fetchTransactionHistory();
    }
  }, [selectedAccount]);

  const handleTransaction = async () => {
    setLoading(true);
    try {
      let response;

      if (transactionType === "Deposit") {
        response = await API.post("/Transaction/Deposit", {
          accountId: selectedAccount,
          amount: parseFloat(amount),
          description,
        });
      } else if (transactionType === "Withdraw") {
        response = await API.post("/Transaction/Withdraw", {
          accountId: selectedAccount,
          amount: parseFloat(amount),
          description,
        });
      } else if (transactionType === "Transfer") {
        response = await API.post("/Transaction/Transfer", {
          sourceAccountId: selectedAccount,
          targetAccountNumber: targetAccount,
          amount: parseFloat(amount),
          description,
        });
      } else if (transactionType === "ExternalTransfer") {
        response = await API.post("/Transaction/ExternalTransfer", {
          fromAccountId: parseInt(selectedAccount, 10),
          targetAccountNumber: targetAccount,
          targetBankName,
          amount: parseFloat(amount),
          description,
        });
      }

      setMessage(response.data);
      await fetchTransactionHistory();
      setLoading(false);
    } catch (error) {
      console.error("Transaction failed:", error.response?.data || error.message);
      setMessage("Transaction failed.");
      setLoading(false);
    } 
  };
  const fetchTransactionHistory = async () => {
    if (selectedAccount) {
      try {
        const response = await API.get(`/Transaction/GetTransactionHistory/${selectedAccount}`);
        setTransactions(response.data || []);
      } catch (error) {
        console.error("Failed to fetch transaction history:", error);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 1500, margin: "auto", mt: 5, pl: 30 }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "auto"}}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Transactions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Transaction Type"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <MenuItem value="Deposit">Deposit</MenuItem>
              <MenuItem value="Withdraw">Withdraw</MenuItem>
              <MenuItem value="Transfer">Internal Transfer</MenuItem>
              <MenuItem value="ExternalTransfer">External Transfer</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Source Account"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              {accounts.map((account) => (
                <MenuItem key={account.accountId} value={account.accountId}>
                  {account.accountNumber}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {transactionType === "Transfer" || transactionType === "ExternalTransfer" ? (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Target Account Number"
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  required
                />
              </Grid>
              {transactionType === "ExternalTransfer" && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Target Bank Name"
                    value={targetBankName}
                    onChange={(e) => setTargetBankName(e.target.value)}
                    required
                  />
                </Grid>
              )}
            </>
          ) : null}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleTransaction}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Grid>
        </Grid>
        {message && (
          <Typography sx={{ mt: 3, textAlign: "center" }} color="textSecondary">
            {message}
          </Typography>
        )}
      </Paper>

      {/* Enlarged Transaction History */}
      <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Transaction History
        </Typography>
        {transactions.length > 0 ? (
          <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Target Account Number</TableCell>
                  <TableCell>Target Bank Name</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.transactionId}>
                    <TableCell>{transaction.transactionType}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>
                      {new Date(transaction.transactionDate).toLocaleString()}
                    </TableCell>
                    <TableCell>{transaction.fee || "N/A"}</TableCell>
                    <TableCell>{transaction.targetAccountNumber || "N/A"}</TableCell>
                    <TableCell>{transaction.targetBankName || "N/A"}</TableCell>
                    <TableCell>{transaction.description || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No transaction history available.</Typography>
        )}
      </Paper>
    </Box>
    
  );
};

export default Transactions;
