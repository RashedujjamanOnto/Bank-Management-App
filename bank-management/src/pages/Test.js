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

  const toggleDrawer = () => setMobileOpen(!mobileOpen); // Mobile Sidebar toggle
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Desktop Sidebar toggle

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget); // Profile menu open
  const handleMenuClose = () => setAnchorEl(null); // Profile menu close

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const drawerContent = (
    <Box sx={{ backgroundColor: "#003366", height: "100%", color: "#fff" }}> {/* Sidebar color */}
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
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin">
            <ListItemText primary="Accounts" />
          </ListItemButton>
        </ListItem>
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
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/loanapproval">
            <ListItemText primary="Loan Approval" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline /> {/* For consistent styling */}

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Sidebar */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: sidebarOpen ? drawerWidth : 60, // Toggle width
            transition: "width 0.3s ease-in-out", // Smooth transition
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 60px)` },
          ml: { sm: sidebarOpen ? `${drawerWidth}px` : "60px" },
          transition: "width 0.3s ease-in-out, margin 0.3s ease-in-out", // Smooth transition
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
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 60}px)` }, // Adjust width dynamically
          maxWidth: "1200px", // Limit maximum width for large screens
          margin: "0 auto", // Center the content
          transition: "width 0.3s ease-in-out", // Smooth transition
        }}
      >
        <Toolbar /> {/* For spacing below the AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
