import { useState, useEffect } from "react";
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, Button, Box } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminPopup from "../components/AdminPopup";
import { useSearchParams } from "react-router-dom";


export default function ManageAdmins() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
 
  useEffect(() => {
    fetchAdmins();

    if (searchParams.get("add") === "true") {
      setOpen(true);
      setSearchParams({}); 
    }

  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admins", { withCredentials: true });
      setAdmins(response.data);
    } catch (err) { 
    }
  };
 
  const handleOpen = (admin = null) => {
    setSelectedAdmin(admin);
    setOpen(true);
  };
 
  const handleClose = () => {
    setOpen(false);
    setSelectedAdmin(null);
  };


//delete
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this admin?")) return;
  
  try {
    await axios.delete(`http://localhost:5000/admins/${id}`, { withCredentials: true });
    fetchAdmins();  
  } catch (err) {
    alert(err.response?.data?.error || "Failed to delete admin");
  }
};

 
  const filteredAdmins = admins.filter(admin => filter === "all" || admin.role === filter);

  return (
    <DashboardLayout>
      <Container>
        <Typography variant="h4" mb={3}>Manage Admins</Typography>
 
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="all">All Admins</MenuItem>
            <MenuItem value="admin">Admins</MenuItem>
            <MenuItem value="super_admin">Super Admins</MenuItem>
          </Select>
 
          {user?.role === "super_admin" && (
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()}>
              New Admin
            </Button>
          )}
        </Box>
 
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.id}</TableCell>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell>
                  <Button color="primary" startIcon={<Edit />} onClick={() => handleOpen(admin)}>
                   
                  </Button>
                  {user?.role === "super_admin" && admin.role !== "super_admin" && (
                    <Button color="error" startIcon={<Delete />} onClick={() => handleDelete(admin.id)}>
                     
                    </Button>
                  )}

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> 
        <AdminPopup open={open} onClose={handleClose} selectedAdmin={selectedAdmin} refreshAdmins={fetchAdmins} />
      </Container>
    </DashboardLayout>
  );
}
