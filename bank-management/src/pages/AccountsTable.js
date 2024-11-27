import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TableSortLabel,
  TablePagination,
  Box,
} from "@mui/material";
import API from "../services/api";

const AccountsTable = ({ accounts, onEdit, onDelete, onDetails }) => {
  // State for sorting and pagination
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("accountNumber");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const [accounts, setAccounts] = useState([]);

  // Sorting handler
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Sorting function
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

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get the sorted accounts
  const sortedAccounts = sortData([...accounts]);

  // Pagination slice
  const paginatedAccounts = sortedAccounts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // const fetchAccounts = async () => {
  //   try {
  //     const response = await API.get("/Account/GetAccounts");
  //     setAccounts(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch accounts:", error);
  //   }
  // };
  const handleToggleActive = async (account) => {
    try {
      await API.put(`/Account/ToggleAccountStatus/${account.accountId}`, {
        isActive: !account.isActive,
      });
      // setMessage(`User ${account.isActive ? "deactivated" : "activated"} successfully!`);
      // fetchAccounts();
    } catch (error) {
      console.error("Failed to toggle account status:", error);
    }
  };
  return (
    <>
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
                    onClick={() => onEdit(account)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => onDelete(account.accountId)}
                    sx={{ mr: 1 }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => onDetails(account.accountId)}
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

      {/* Pagination */}
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
    </>
  );
};

export default AccountsTable;
