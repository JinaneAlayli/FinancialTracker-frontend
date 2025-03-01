import { Drawer, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { Dashboard, Category, MonetizationOn, Payment } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><Dashboard /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/categories">
          <ListItemIcon><Category /></ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItem>
        <ListItem button component={Link} to="/incomes">
          <ListItemIcon><MonetizationOn /></ListItemIcon>
          <ListItemText primary="Income" />
        </ListItem>
        <ListItem button component={Link} to="/expenses">
          <ListItemIcon><Payment /></ListItemIcon>
          <ListItemText primary="Expenses" />
        </ListItem>
      </List>
    </Drawer>
  );
}
