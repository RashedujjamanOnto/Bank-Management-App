import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Grid,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState({
    accountType: "",
    balance: "",
    userId: "",
    currency: "USD",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("accountNumber");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const selfUserId = localStorage.getItem("userId");

  const navigate = useNavigate();
  const fetchUsers = async () => {
    try {
      const response = await API.get("/Account/GetUsers");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };
  const fetchAccounts = async () => {
    try {
      const response = await API.get(`/Account/GetAccounts/${selfUserId}`);
      setAccounts(response.data);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    }
  };
  useEffect(() => {

    fetchUsers();
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accountData = { ...account, userId: selectedUserId };
      if (isEdit) {
        const response = await API.put(`/Account/UpdateAccount/${account.id}`, accountData);
        setMessage({ type: "success", text: response.data });
      } else {
        const response = await API.post("/Account/CreateAccount", accountData);
        setMessage({ type: "success", text: response.data });
      }
      fetchAccounts();
      setAccount({ accountType: "", balance: "", currency: "USD" });
      setSelectedUserId("");
      setIsEdit(false);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage({ type: "error", text: "Failed to save account." });
    }
  };

  const handleEdit = (account) => {
    setAccount({
      id: account.accountId,
      accountType: account.accountType,
      balance: parseFloat(account.balance),
      userId: account.userId,
      currency: account.currency,
    });
    setSelectedUserId(account.userId);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      const response = await API.delete(`/Account/DeleteAccount/${id}`);
      setMessage({ type: "success", text: response.data });
      fetchAccounts();
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  const handleToggleActive = async (account) => {
    try {
      await API.put(`/Account/ToggleAccountStatus/${account.accountId}`, {
        isActive: !account.isActive,
      });
      fetchAccounts();
    } catch (error) {
      console.error("Failed to toggle account status:", error);
    }
  };

  const handleDetails = (id) => {
    navigate(`/account-details/${id}`);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (array) => {
    return array.sort((a, b) => {
      if (orderBy === "accountNumber") {
        return order === "asc"
          ? a.accountNumber - b.accountNumber
          : b.accountNumber - a.accountNumber;
      }
      return 0;
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedAccounts = sortData([...accounts]);
  const paginatedAccounts = sortedAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ maxWidth: 1500, margin: "auto", mt: 5, pl: 30 }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: "auto", marginBottom: 5 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          {isEdit ? "Edit Account" : "Add Account"}
        </Typography>
        {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Account Type"
                name="accountType"
                value={account.accountType}
                onChange={(e) => setAccount({ ...account, accountType: e.target.value })}
                required
              >
                <MenuItem value="Savings">Savings</MenuItem>
                <MenuItem value="Checking">Checking</MenuItem>
                <MenuItem value="Loan">Loan</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Balance"
                name="balance"
                value={account.balance}
                onChange={(e) => setAccount({ ...account, balance: parseFloat(e.target.value) || "" })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="User Name"
                name="userId"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Currency"
                name="currency"
                value={account.currency}
                onChange={(e) => setAccount({ ...account, currency: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {isEdit ? "Update Account" : "Add Account"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Account List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "accountNumber"}
                    direction={orderBy === "accountNumber" ? order : "asc"}
                    onClick={() => handleRequestSort("accountNumber")}
                  >
                    Account Number
                  </TableSortLabel>
                </TableCell>
                <TableCell>Account Type</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAccounts.map((account) => (
                <TableRow key={account.accountId} hover>
                  <TableCell>{account.accountNumber}</TableCell>
                  <TableCell>{account.accountType}</TableCell>
                  <TableCell>{account.balance}</TableCell>
                  <TableCell>{account.currency}</TableCell>
                  <TableCell>{account.userName}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(account)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(account.accountId)}
                      sx={{ mr: 1 }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleDetails(account.accountId)}
                      sx={{ mr: 1 }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      color={account.isActive ? "error" : "success"}
                      onClick={() => handleToggleActive(account)}
                    >
                      {account.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={accounts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default AccountManager;
