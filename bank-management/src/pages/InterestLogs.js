import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import API from "../services/api";

const InterestLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await API.get("/Transactions/GetInterestLogs");
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch interest logs:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 5, pl:30 }}>
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Interest Logs
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account Number</TableCell>
              <TableCell>Interest Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.accountNumber}</TableCell>
                <TableCell>{log.amount}</TableCell>
                <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default InterestLogs;
