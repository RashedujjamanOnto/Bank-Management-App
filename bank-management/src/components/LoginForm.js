import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Container, Paper } from "@mui/material";

const LoginForm = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

        // Redirect to Dashboard
        navigate("/dashboard");
      } else {
        alert("Login response is invalid. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 30, pl: 30 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box textAlign="center" mb={2}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Enter your email and password to login
          </Typography>
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
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
