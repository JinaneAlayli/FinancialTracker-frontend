import { useState } from "react";
import { Container, Typography, TextField, Button, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users/signup", { name, email, password });
      setSuccess("Signup successful! You can now login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Signup</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} margin="normal" />
        <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
        <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" />
        <Button variant="contained" color="primary" fullWidth type="submit">
          Register
        </Button>
      </form>
    </Container>
  );
}
