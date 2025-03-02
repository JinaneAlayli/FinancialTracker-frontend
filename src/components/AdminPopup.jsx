import { useState, useEffect } from "react";
import { TextField, Button, Alert } from "@mui/material";
import axios from "axios";
import "../styles/AdminPopup.css"; 

export default function AdminPopup({ open, onClose, selectedAdmin, refreshAdmins }) {
  const isEdit = !!selectedAdmin; 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setError(""); 
      if (isEdit) {
        setName(selectedAdmin.name);
        setEmail(selectedAdmin.email);
        setRole(selectedAdmin.role);
        setPassword("");
      } else {
        setName("");
        setEmail("");
        setRole("admin");
        setPassword("");
      }
    }
  }, [open, selectedAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");


    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:5000/admins/${selectedAdmin.id}`,
          { name, email, password: password ? password : undefined, role },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          "http://localhost:5000/users/signup",
          { name, email, password, role },
          { withCredentials: true }
        );
      }
      onClose(); 
      refreshAdmins(); 
    } catch (err) {
      console.error("Error in Request:", err.response?.data || err);
      setError(err.response?.data?.error || "Operation failed");
    }
  };

  return open ? (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>{isEdit ? "Edit Admin" : "Add New Admin"}</h2>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} margin="normal" />
          <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            placeholder={isEdit ? "Leave empty to keep current password" : ""}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <div className="popup-actions">
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? "Save Changes" : "Add Admin"}
            </Button>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}
