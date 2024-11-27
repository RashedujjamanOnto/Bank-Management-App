import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Modal,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
} from "@mui/material";
import API from "../services/api";

const Users = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get("/User/GetUsers");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await API.get("/User/GetRoles");
      setRoles(response.data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await API.put(`/User/UpdateUser/${editUserId}`, formData);
        setMessage("User updated successfully!");
      } else {
        await API.post("/User/Register", formData);
        setMessage("User added successfully!");
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to save user.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", roleId: "" });
    setIsEdit(false);
    setEditUserId(null);
  };

  const handleEdit = (user) => {
    console.log("UserId = " +user.userId);
    setFormData({
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      password: "",
    });
    setIsEdit(true);
    setEditUserId(user.userId);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/User/DeleteUser/${userId}`);
      setMessage("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await API.put(`/User/UpdateAccountStatus/${user.userId}`, {
        isActive: !user.isActive,
      });
      setMessage(`User ${user.isActive ? "deactivated" : "activated"} successfully!`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  const openPasswordModal = (userId) => {   
    setEditUserId(userId);
    setPasswordModalOpen(true);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      await API.put(`/User/ResetPassword/${editUserId}`, {
        newPassword: passwordData.newPassword,
      });
      setMessage("Password updated successfully!");
      setPasswordModalOpen(false);
    } catch (error) {
      console.error("Failed to reset password:", error);
    }
  };
  
  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 5, pl: 25 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
          {isEdit ? "Edit User" : "Add User"}
        </Typography>
        {message && <Alert severity="info" sx={{ textAlign: "center", mb: 3 }}>{message}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEdit}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Role"
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                required
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.roleName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} /> : isEdit ? "Update User" : "Add User"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* User List */}
      <Paper elevation={3} sx={{ padding: 4, mt: 3 }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
          User List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roleName}</TableCell>
                <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(user)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(user.userId)}
                    sx={{ mr: 1 }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => openPasswordModal(user.userId)}
                    sx={{ mr: 1 }}
                  >
                    Reset Password
                  </Button>
                  <Button
                    variant="contained"
                    color={user.isActive ? "error" : "success"}
                    onClick={() => handleToggleActive(user)}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Password Reset Modal */}
      <Modal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Reset Password
          </Typography>
          <TextField
            fullWidth
            label="New Password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handlePasswordChange}>
            Submit
          </Button>
        </Box>
      </Modal>
      )};
    </Box>
  );
};

export default Users;

