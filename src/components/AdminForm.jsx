import { useState } from "react";
import { TextField, Button, Alert } from "@mui/material";
import axios from "axios";

export default function AdminForm({ title, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/users/signup", { name, email, password }, { withCredentials: true });
      onSuccess(); 
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create account");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} margin="normal" />
      <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
      <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" />
      <Button variant="contained" color="primary" fullWidth type="submit">
        Submit
      </Button>
    </form>
  );
}
