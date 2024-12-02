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
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ApprovalIcon from "@mui/icons-material/ThumbUp";
import SavingsIcon from "@mui/icons-material/Savings";
import InterestIcon from "@mui/icons-material/Percent";
import { Outlet, Link } from "react-router-dom";
import { CenterFocusStrong } from "@mui/icons-material";

const drawerWidth = 250;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const userRole = localStorage.getItem("role");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  const drawerContent = (
    <Box sx={{ backgroundColor: "#024d8f", height: "100%", color: "#fff" }}>
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ color: "#fff", mx: "auto" }}>
          Bank Management
        </Typography>
      </Toolbar>
      <List>
        {userRole === "Administrator" && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/adminDashboard">
              <ListItemIcon>
                <DashboardIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        )}
        {userRole === "Customer" && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/customerDashboard">
              <ListItemIcon>
                <DashboardIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        )}
        {userRole === "Administrator" && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/users">
              <ListItemIcon>
                <PeopleIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>
        )}
        {userRole !== "Customer" && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/account">
              <ListItemIcon>
                <AccountBalanceIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Accounts" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/transactions">
            <ListItemIcon>
              <MonetizationOnIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Transactions" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/loanapplication">
            <ListItemIcon>
              <AssignmentIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Loan Application" />
          </ListItemButton>
        </ListItem>
        {userRole !== "Customer" && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/loanapproval">
              <ListItemIcon>
                <ApprovalIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Loan Approval" />
            </ListItemButton>
          </ListItem>
        )}

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/savings-plans">
            <ListItemIcon>
              <SavingsIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Savings Plans" />
          </ListItemButton>
        </ListItem>

        {userRole !== "Customer" && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/interest-logs">
              <ListItemIcon>
                <InterestIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Interest Logs" />
            </ListItemButton>
          </ListItem>
        )}


        <ListItem disablePadding>
          <ListItemButton component={Link} to="/monthly-statement">
            <ListItemIcon>
              <AssignmentIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Monthly Statements" />
          </ListItemButton>
        </ListItem>

        {userRole !== "Customer" && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/detailed-report">
              <ListItemIcon>
                <AssignmentIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Detailed Reports" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? drawerWidth : 0,
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
          width: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)`,
          ml: `${sidebarOpen ? drawerWidth : 0}px`,
          transition: "width 0.3s ease-in-out, margin 0.3s ease-in-out",
          backgroundColor: "#1565C0",
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
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, textAlign: "center" }}>
            Welcome to Bank Management
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircleIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
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
          transition: "margin-left 0.3s ease-in-out",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
