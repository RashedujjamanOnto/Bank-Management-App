import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Modal,
  TextField,
  Alert,
} from "@mui/material";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const LoanApproval = () => {
  const [loans, setLoans] = useState([]);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [duration, setDuration] = useState("");
  const navigate = useNavigate();

  // Fetch loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await API.get("/Loan/GetLoans");
        setLoans(response.data);
      } catch (error) {
        console.error("Failed to fetch loans:", error);
      }
    };

    fetchLoans();
  }, []);

  // Handle modal open
  const handleOpenModal = (loan, action) => {
    setSelectedLoan({ ...loan, action });
    setOpenModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedLoan(null);
    setRemarks("");
    setInterestRate("");
    setDuration("");
  };

  const handleReview = async () => {
    if (!selectedLoan) return;

    const { loanId, action } = selectedLoan;

    try {
      const response = await API.put("/Loan/ReviewLoan", {
        loanId,
        status: action === "approve" ? "Approved" : "Rejected",
        remarks,
        interestRate: action === "approve" ? parseFloat(interestRate) : undefined,
        durationInMonths: action === "approve" ? parseInt(duration, 10) : undefined,
      });

      setMessage({ type: "success", text: response.data });
      setLoans(
        loans.map((loan) =>
          loan.loanId === loanId
            ? {
                ...loan,
                status: action === "approve" ? "Approved" : "Rejected",
                remarks,
                interestRate: action === "approve" ? parseFloat(interestRate) : undefined,
                durationInMonths: action === "approve" ? parseInt(duration, 10) : undefined,
              }
            : loan
        )
      );

      handleCloseModal();
    } catch (error) {
      setMessage({ type: "error", text: "Review failed. Please try again." });
    }
  };

  return (
    <Box sx={{ maxWidth: 1500, margin: "auto", mt: 5, pl:30 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
          Loan Applications
        </Typography>
        {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Loan Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Interest Rate (%)</TableCell>
              <TableCell>Duration (Months)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Total Repayable Amount</TableCell>
              <TableCell>Monthly Installment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.loanId}>
                <TableCell>{loan.customerName}</TableCell>
                <TableCell>{loan.loanType}</TableCell>
                <TableCell>{loan.amount}</TableCell>
                <TableCell>{loan.interestRate || "N/A"}</TableCell>
                <TableCell>{loan.durationInMonths || "N/A"}</TableCell>
                <TableCell>{loan.status}</TableCell>
                <TableCell>{loan.remarks || "N/A"}</TableCell>
                <TableCell>
                  {loan.interestRate && loan.durationInMonths
                    ? (loan.amount + (loan.amount * loan.interestRate * loan.durationInMonths) / 1200).toFixed(2)
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {loan.interestRate && loan.durationInMonths
                    ? ((loan.amount + (loan.amount * loan.interestRate * loan.durationInMonths) / 1200) / loan.durationInMonths).toFixed(2)
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {loan.status === "Pending" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleOpenModal(loan, "approve")}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleOpenModal(loan, "reject")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
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
      </Paper>

      {/* Modal for Approval/Rejection */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedLoan?.action === "approve" ? "Approve Loan" : "Reject Loan"}
          </Typography>
          {selectedLoan?.action === "approve" && (
            <>
              <TextField fullWidth label="Interest Rate (%)" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth label="Duration (Months)" value={duration} onChange={(e) => setDuration(e.target.value)} sx={{ mb: 2 }} />
            </>
          )}
          <TextField fullWidth label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} sx={{ mb: 2 }} />
          <Button variant="contained" color="primary" fullWidth onClick={handleReview}>
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default LoanApproval;
