import { useState } from "react";
import { Container, Typography, TextField, Button, Alert } from "@mui/material";
import axios from "axios";
import { API_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
  
    try {
      
      
      await axios.post(
        `${API_URL}/users/login`, 
        { email, password }, 
        { withCredentials: true }
      );


      const { data: userData } = await axios.get(
        `${API_URL}/users/me`, 
        { withCredentials: true }
      );

      
      login(userData); 
      navigate("/");  
    } catch (err) { 
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
        <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" />
        <Button variant="contained" color="primary" fullWidth type="submit">
          Login
        </Button>
      </form>
    </Container>
  );
}
