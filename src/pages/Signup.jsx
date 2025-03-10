import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Signup.module.css";
import axios from "axios";
import { API_URL } from "../config/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (success) {
      navigate("/login");
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await axios.post(`${API_URL}/users/signup`, { name, email, password });
      setSuccess(true); 
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <h1>SING UP</h1>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>Signup successful! Redirecting...</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Processing..." : "Register"}
          </button>
        </form>
        <p className={styles.loginLink}>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
}