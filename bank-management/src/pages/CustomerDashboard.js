import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import { AccountBalanceWallet, History, TrendingUp, AccountBalance } from "@mui/icons-material";
import API from "../services/api";

const CustomerDashboard = () => {
  const [customerOverview, setCustomerOverview] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchCustomerDashboard = async () => {
      try {
        const response = await API.get(`/Dashboard/UserDashboard/${userId}`);
        setCustomerOverview(response.data); 
      } catch (error) {
        setError("Failed to load data"); 
        console.error("Error fetching customer dashboard data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchCustomerDashboard();
  }, [userId]); 

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "20%" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ textAlign: "center", color: "red", marginTop: "20%" }}>{error}</div>;
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#f5f5f5", minHeight: "100vh", pl: 30 }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Customer Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ padding: 3 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ backgroundColor: "#e3f2fd", boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <IconButton>
                  <AccountBalanceWallet sx={{ fontSize: 40, color: "#1e88e5" }} />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Current Balance
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#1e88e5", fontWeight: "bold" }}>
                ${customerOverview.currentBalance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ backgroundColor: "#e8f5e9", boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <IconButton>
                  <TrendingUp sx={{ fontSize: 40, color: "#43a047" }} />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Recent Transactions
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#43a047", fontWeight: "bold" }}>
                {customerOverview.recentTransactions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ backgroundColor: "#fffde7", boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <IconButton>
                  <History sx={{ fontSize: 40, color: "#fbc02d" }} />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Transactions History
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: "#757575", fontWeight: "bold" }}>
                Check detailed history below
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            elevation={4}
            sx={{
              padding: 3,
              backgroundColor: "#ffffff",
              borderRadius: 2,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#616161", mb: 2 }}>
              Recent Transactions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {customerOverview.recentTransactions.length > 0 ? (
              customerOverview.recentTransactions.map((transaction, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Typography variant="body1">
                    {transaction.transactionType}: ${transaction.amount} on{" "}
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body1" sx={{ color: "#757575" }}>
                No transactions available at the moment.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDashboard;
