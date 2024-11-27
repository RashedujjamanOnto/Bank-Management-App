import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MonthlyStatements = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await API.get(`/Account/GetAccounts/${userId}`);
      setAccounts(response.data);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await API.get(
        `/Reports/GetTransactions?accountId=${selectedAccount}&month=${month}&year=${year}`
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const handleDownload = async (format) => {
    try {
    
        const response = await API.get(
            `/Reports/ExportTransactions?accountId=${selectedAccount}&month=${month}&year=${year}`,
            { responseType: "json" }
        );
        
        if (format === 'xlsx') {
          
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Transactions');

            worksheet.columns = [
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Description', key: 'description', width: 30 },
                { header: 'Amount', key: 'amount', width: 15 },
                { header: 'Type', key: 'type', width: 15 },
            ];

            
            response.data.forEach(txn => {
                worksheet.addRow({
                    date: txn.transactionDate,
                    description: txn.description,
                    amount: txn.amount,
                    type: txn.transactionType
                });
            });

            
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Transactions.xlsx`);
                document.body.appendChild(link);
                link.click();
            });
        } else  if (format === "pdf") {
          
          const doc = new jsPDF();
    
     
          doc.setFontSize(18);
          doc.text("Transaction Report", 10, 10);
          doc.setFontSize(12);
          doc.text(`Account: ${selectedAccount}`, 10, 20);
          doc.text(`Month: ${month}, Year: ${year}`, 10, 30);
    
        
          const headers = ["Date", "Description", "Amount", "Type"];
          const data = response.data.map((txn) => [
            txn.transactionDate,
            txn.description,
            txn.amount,
            txn.transactionType,
          ]);
    
          autoTable(doc, {
            head: [headers],
            body: data,
            startY: 40, 
            styles: { fontSize: 10, cellPadding: 4 },
          });
    
         
          doc.save("Transactions.pdf");
        }
    } catch (error) {
        console.error("Failed to download file:", error);
    }
};


  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 5, pl:30 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
          Monthly Statements
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            select
            fullWidth
            label="Select Account"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map((account) => (
              <MenuItem key={account.accountId} value={account.accountId}>
                {account.accountNumber}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Month (MM)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <TextField
            fullWidth
            label="Year (YYYY)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <Button variant="contained" onClick={fetchTransactions}>
            Fetch
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.transactionId}>
                <TableCell>
                {new Date(txn.transactionDate).toLocaleString()}
                </TableCell>
                <TableCell>{txn.description}</TableCell>
                <TableCell>{txn.amount}</TableCell>
                <TableCell>{txn.transactionType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
          <Button variant="contained" onClick={() => handleDownload("pdf")}>
            Download PDF
          </Button>
          <Button variant="contained" onClick={() => handleDownload("xlsx")}>
            Download Excel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default MonthlyStatements;
