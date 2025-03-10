import { Drawer, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { Dashboard, Category, MonetizationOn, Payment, BarChart, TrendingUp} from "@mui/icons-material";
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
        <ListItem button component={Link} to="/reports">
          <ListItemIcon><BarChart /></ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
        <ListItem button component={Link} to="/profitgoals">
          <ListItemIcon><TrendingUp /></ListItemIcon>
          <ListItemText primary="Profit Goals" />
        </ListItem>
      </List>
    </Drawer>
  );
}
