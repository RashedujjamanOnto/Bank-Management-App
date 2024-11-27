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
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom"; // Import useParams
import API from "../services/api";

const RepaymentSchedule = () => {
  const { loanId } = useParams(); // Extract loanId from the URL
  const { scheduleId } = useParams(); // Extract loanId from the URL
  const [schedules, setSchedules] = useState([]);
  const [message, setMessage] = useState("");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await API.get(`/Loan/GetRepaymentScheduleWithPenalties/${loanId}`);
        setSchedules(response.data);
      } catch (error) {
        console.error("Failed to fetch repayment schedules:", error);
      }
    };

    fetchSchedules();
  }, [loanId]);

  const handlePayInstallment = async (scheduleId, loanId) => {
    try {
      const response = await API.post("/Loan/PayInstallment", {
        scheduleId: scheduleId,
        loanId: loanId
      });
      setSchedules(
        schedules.map((schedule) =>
          schedule.ScheduleId === scheduleId ? { ...schedule, IsPaid: true } : schedule
        )
      );
      setMessage({ type: "success", text: response.data });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to pay loan." });
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 5, pl: 30 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Repayment Schedule
        </Typography>
        {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Due Date</TableCell>
              <TableCell>Amount Due</TableCell>
              <TableCell>Penalty</TableCell>
              <TableCell>Status</TableCell>
              <TableCell style={{ display: userRole !== "Customer" ? "inline-block" : "none" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.scheduleId}>
                <TableCell>{new Date(schedule.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>${schedule.amountDue.toFixed(2)}</TableCell>
                <TableCell>${schedule.penalty.toFixed(2)}</TableCell>
                <TableCell>{schedule.isPaid ? "Paid" : "Pending"}</TableCell>
                <TableCell>
                  {!schedule.isPaid && (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ display: userRole !== "Customer" ? "inline-block" : "none" }}
                      onClick={() => handlePayInstallment(schedule.scheduleId, schedule.loanId)} // Make sure the correct ScheduleId is passed
                    >
                      Pay Now
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default RepaymentSchedule;
