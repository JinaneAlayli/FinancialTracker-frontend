import { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button, MenuList, Popper, Paper, ClickAwayListener, Grow } from "@mui/material";
import { AccountCircle, Menu as MenuIcon, Add, Group } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [plusAnchorEl, setPlusAnchorEl] = useState(null);
  const plusOpen = Boolean(plusAnchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handlePlusClick = (event) => {
    setPlusAnchorEl(plusAnchorEl ? null : event.currentTarget);
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
        <IconButton color="inherit" onClick={handlePlusClick}>
          <Add />
        </IconButton>
        <Popper open={plusOpen} anchorEl={plusAnchorEl} role={undefined} transition disablePortal>
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <ClickAwayListener onClickAway={() => setPlusAnchorEl(null)}>
                  <MenuList autoFocusItem>
                    <MenuItem onClick={() => navigate("/expenses?add=true")}>Add Expense</MenuItem>
                    <MenuItem onClick={() => navigate("/incomes?add=true")}>Add Income</MenuItem>
                    {user?.role === "super_admin" && (
                      <MenuItem onClick={() => navigate("/manage-admins?add=true")}>Add Admin</MenuItem>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
 
        {user?.role === "super_admin" && (
          <IconButton color="inherit" onClick={() => navigate("/manage-admins")}>
            <Group />
          </IconButton>
        )}
 
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
