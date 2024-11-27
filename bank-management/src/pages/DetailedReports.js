import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@mui/material";
import API from "../services/api";

const DetailedReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await API.get("/Reports/GetDetailedReports");
      setReports(response.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
          Detailed Reports
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account Number</TableCell>
              <TableCell>Total Balance</TableCell>
              <TableCell>Loan Balance</TableCell>
              <TableCell>Transaction Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.accountId}>
                <TableCell>{report.accountNumber}</TableCell>
                <TableCell>{report.totalBalance}</TableCell>
                <TableCell>{report.loanBalance}</TableCell>
                <TableCell>{report.transactionCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default DetailedReports;
