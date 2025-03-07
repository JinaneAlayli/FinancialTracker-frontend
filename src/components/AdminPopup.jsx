import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/TransactionForm.module.css";
import { API_URL } from "../config/api";
export default function AdminPopup({ open, onClose, selectedAdmin, refreshAdmins }) {
  const isEdit = !!selectedAdmin;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setError("");
      setSuccess(false);
      setLoading(false);
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
    setLoading(true);
    setError("");

    try {
      if (isEdit) {
        await axios.put(
          `${API_URL}/admins/${selectedAdmin.id}`,
          { name, email, password: password ? password : undefined, role },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${API_URL}/users/signup`,
          { name, email, password, role },
          { withCredentials: true }
        );
      }
      setSuccess(true);
      setTimeout(() => {
        onClose();
        refreshAdmins();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed");
      setLoading(false);
    }
  };

  return open ? (
    <div className={styles.popupOverlay}>
      <div className={styles.transactionFormContainer}>
        <h2>{isEdit ? "Edit Admin" : "Add Admin"}</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p className={styles.success}>Success! Closing...</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className={styles.fullWidth}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className={styles.fullWidth}
            />
            <input
              type="password"
              placeholder={isEdit ? "Leave empty to keep current password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={styles.fullWidth}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.fullWidth}
              disabled={loading}
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton} disabled={loading}>
              {loading ? "Processing..." : isEdit ? "Save " : "add"}
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}
