import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminPopup from "../components/AdminPopup";
import { useSearchParams } from "react-router-dom";
import styles from "../styles/Transaction.module.css";  
import { FiEdit, FiTrash2, FiChevronDown } from "react-icons/fi";


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
      console.error("Failed to fetch admins");
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

  const handleDelete = async (id,name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
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
      <div className={styles.transactionContainer}>
        <h2 className={styles.title}>Manage Admins</h2>
 
        <div className={styles.filterContainer}>
          <div className={styles.filterWrapper}>
          <select className={styles.filterSelect} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Admins</option>
            <option value="admin">Admins</option>
            <option value="super_admin">Super Admins</option>
          </select>
          <FiChevronDown className={styles.filterIcon} />
          </div>
          {user?.role === "super_admin" && (
            <button className={styles.addButton} onClick={() => handleOpen()}>
              + New Admin
            </button>
          )}
        </div>
 
        <div className={styles.tableContainer}>
          <table className={styles.transactionTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.id}</td>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.role}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleOpen(admin)}><FiEdit /></button>
                    {user?.role === "super_admin" && admin.role !== "super_admin" && (
                      <button className={styles.deleteButton} onClick={() => handleDelete(admin.id,admin.name)}><FiTrash2 /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminPopup open={open} onClose={handleClose} selectedAdmin={selectedAdmin} refreshAdmins={fetchAdmins} />
      </div>
    </DashboardLayout>
  );
}
