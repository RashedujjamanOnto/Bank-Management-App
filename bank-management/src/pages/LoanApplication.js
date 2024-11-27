import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Alert,
} from "@mui/material";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const LoanApplication = () => {
  const [loanType, setLoanType] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemark] = useState("");
  const [message, setMessage] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [loans, setUserLoans] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); 
  const userRole = localStorage.getItem("role"); 

  // Fetch Accounts and Loans
  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccountId) {
      fetchUserLoans(selectedAccountId);
    }
  }, [selectedAccountId]);

  const fetchAccounts = async () => {
    try {
      let response;
      if (userRole === "Administrator") {
    
        response = await API.get(`/Account/GetAllLoanAccounts`);
      } else {

        response = await API.get(`/Account/GetLoanAccount/${userId}`);
      }
      setAccounts(response.data);
  
      if (response.data.length === 1) {
        setSelectedAccountId(response.data[0].accountId);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to fetch accounts. Please try again later.",
      });
    }
  };

  const fetchUserLoans = async (accountId) => {
    try {
      const response = await API.get(`/Loan/GetUserLoans/${accountId}`);
      setUserLoans(response.data);
    } catch (error) {
      setUserLoans([]); 
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await API.post("/Loan/ApplyLoan", {
        accountId: selectedAccountId,
        loanType: parseInt(loanType, 10),
        amount: parseFloat(amount),
        remarks,
      });
      setMessage({ type: "success", text: response.data });
      fetchUserLoans(selectedAccountId);
      setLoanType("");
      setAmount("");
      setRemark("");
    } catch (error) {
      setMessage({ type: "error", text: "Failed to submit loan application." });
    }
  };

  return (
    <Box sx={{ maxWidth: 1500, margin: "auto", mt: 5, pl: 30 }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
          Apply for a Loan
        </Typography>
        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

 
        {userRole === "Administrator" ? (
          <TextField
            select
            fullWidth
            label="Select Account"
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            sx={{ mb: 3 }}
          >
            {accounts.map((acc) => (
              <MenuItem key={acc.accountId} value={acc.accountId}>
                {acc.accountNumber}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            fullWidth
            label="Your Loan Account"
            value={accounts[0]?.accountNumber || ""}
            sx={{ mb: 3 }}
            disabled
          />
        )}

        <TextField
          select
          fullWidth
          label="Loan Type"
          value={loanType}
          onChange={(e) => setLoanType(e.target.value)}
          sx={{ mb: 3 }}
        >
          <MenuItem value="0">Personal</MenuItem>
          <MenuItem value="1">Home</MenuItem>
          <MenuItem value="2">Education</MenuItem>
        </TextField>
        <TextField
          fullWidth
          type="number"
          label="Loan Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="Remark"
          value={remarks}
          onChange={(e) => setRemark(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={!selectedAccountId} 
        >
          Submit Application
        </Button>
      </Paper>

      <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Your Loan Applications
        </Typography>
        {loans.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loan Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Interest Rate (%)</TableCell>
                <TableCell>Duration (Months)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Total Repayable Amount</TableCell>
                <TableCell>Monthly Installment</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.loanId}>
                  <TableCell>{loan.loanType}</TableCell>
                  <TableCell>{loan.amount}</TableCell>
                  <TableCell>{loan.interestRate}</TableCell>
                  <TableCell>{loan.durationInMonths}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        loan.status === "Approved"
                          ? "green"
                          : loan.status === "Pending"
                            ? "orange"
                            : loan.status === "Rejected"
                              ? "red"
                              : "white",
                       
                      fontWeight: "bold", 
                      textAlign: "center", 
                    }}
                  >
                    {loan.status}
                  </TableCell>
                  <TableCell>{loan.remarks || "N/A"}</TableCell>
                  <TableCell>{loan.totalRepayableAmount}</TableCell>
                  <TableCell>
                    {Number.isFinite(loan.monthlyInstallment) ? loan.monthlyInstallment : 0}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/repaymentschedule/${loan.loanId}`)}
                    >
                      View Schedule
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No loan applications found.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default LoanApplication;
