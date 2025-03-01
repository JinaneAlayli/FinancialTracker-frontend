import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button } from "@mui/material";
import { AccountCircle, Menu as MenuIcon, Add } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onMenuToggle}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Financial Tracker
        </Typography>
 
        <Button color="inherit" startIcon={<Add />}>Add Expense</Button>
        <Button color="inherit" startIcon={<Add />}>Add Income</Button>
 
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <AccountCircle />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem>{user?.email}</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
