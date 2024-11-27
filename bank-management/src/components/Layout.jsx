import React, { useState } from "react";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  AppBar,
  Typography,
  Menu,
  MenuItem,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Outlet, Link } from "react-router-dom";

const drawerWidth = 250; // Sidebar Width

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false); // For mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(true); // For desktop sidebar toggle
  const [anchorEl, setAnchorEl] = useState(null); // For profile menu
  const isMenuOpen = Boolean(anchorEl);
  const userRole = localStorage.getItem("role");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Desktop Sidebar toggle

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget); // Profile menu open
  const handleMenuClose = () => setAnchorEl(null); // Profile menu close

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const drawerContent = (
    <Box sx={{ backgroundColor: "#003366", height: "100%", color: "#fff" }}>
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ color: "#fff", mx: "auto" }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        {userRole === "Administrator" && (
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/users">
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>
        )}
        {userRole !== "Customer" && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/account">
              <ListItemText primary="Accounts" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/transactions">
            <ListItemText primary="Transactions" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/loanapplication">
            <ListItemText primary="Loan Application" />
          </ListItemButton>
        </ListItem>
        {userRole !== "Customer" && (
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/loanapproval">
            <ListItemText primary="Loan Approval" />
          </ListItemButton>
        </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline /> {/* For consistent styling */}

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? drawerWidth : 0, // Hide when closed
            boxSizing: "border-box",
            transition: "width 0.3s ease-in-out",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)`, // Adjust based on sidebar width
          ml: `${sidebarOpen ? drawerWidth : 0}px`, // Adjust margin-left
          transition: "width 0.3s ease-in-out, margin 0.3s ease-in-out",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Welcome to Admin Panel
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircleIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin-left 0.3s ease-in-out", // Smooth transition
        }}
      >
        <Toolbar /> {/* For spacing below the AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
