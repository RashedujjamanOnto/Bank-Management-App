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
import { MonetizationOn, AccountBalance, TrendingUp, PeopleAlt } from "@mui/icons-material";
import API from "../services/api";

const AdminDashboard = () => {
  const [adminOverview, setAdminOverview] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const response = await API.get("/Dashboard/AdminDashboard");
        setAdminOverview(response.data); 
      } catch (error) {
        setError("Failed to load data"); 
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard(); 
  }, []); 

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "20%" }}>Loading...</div>; 
  }

  if (error) {
    return <div style={{ textAlign: "center", color: "red", marginTop: "20%" }}>{error}</div>; 
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#f5f5f5", minHeight: "100vh", pl:30 }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "#00796b" }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Admin Dashboard
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
                  <TrendingUp sx={{ fontSize: 40, color: "#1e88e5" }} />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Total Transactions
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#1e88e5", fontWeight: "bold" }}>
                {adminOverview.totalTransactions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ backgroundColor: "#f3e5f5", boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <IconButton>
                  <AccountBalance sx={{ fontSize: 40, color: "#8e24aa" }} />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Total Deposits
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#8e24aa", fontWeight: "bold" }}>
                ${adminOverview.totalDeposits}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ backgroundColor: "#e8f5e9", boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <IconButton>
                  <MonetizationOn sx={{ fontSize: 40, color: "#43a047" }} />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Total Loans
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#43a047", fontWeight: "bold" }}>
                ${adminOverview.totalLoans}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ backgroundColor: "#fffde7", boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <IconButton>
                  <PeopleAlt sx={{ fontSize: 40, color: "#fbc02d" }} />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Active Users
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#fbc02d", fontWeight: "bold" }}>
                {adminOverview.activeUsers}
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
            {/* Placeholder for Table or Chart */}
            <Typography variant="body1" sx={{ color: "#757575" }}>
              No transactions available at the moment.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
