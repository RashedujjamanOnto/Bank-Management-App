import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Container, Paper, Grid,Alert } from "@mui/material";

const LoginForm = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://localhost:44377/api/user/login", {
        email,
        password,
      });
      if (response.data.token && response.data.userId && response.data.role) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("role", response.data.role);
        // Update isAuthenticated state
        setIsAuthenticated(true);

        // Redirect based on role
        if (response.data.role === "Administrator") {
          navigate("/adminDashboard");
        } else if (response.data.role === "Customer") {
          navigate("/customerDashboard");
        } else {
          alert("Invalid role. Please contact support.");
        }
      } else {
        alert("Login response is invalid. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setMessage({ type: "error", text: "Invalid credentials. Please check your email and password." });
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 15, pl: 30 }}>
      <Paper elevation={6} sx={{ padding: 3, backgroundColor: "#f5f5f5", borderRadius: 3 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" gutterBottom color="primary">
            Welcome To
          </Typography>
          <Typography variant="h4" gutterBottom color="primary">
            Bank Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Enter your credentials to continue           
          </Typography>
          {message && <Alert severity={message.type} sx={{ my: 1 }}>{message.text}</Alert>}
        </Box>
        <Box component="form" noValidate>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#fff",
              },
              marginBottom: "15px",
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#fff",
              },
              marginBottom: "20px",
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#3f51b5",
              "&:hover": {
                backgroundColor: "#283593",
              },
              padding: "12px",
              borderRadius: "25px",
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </Paper>
      <Grid container spacing={1} justifyContent="center" sx={{ mt: 3 }}>
        <Grid item>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
            Don't have an account?{" "}
            <Button color="primary" sx={{ textTransform: "none", fontSize: "14px" }}>
              Sign Up
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginForm;
