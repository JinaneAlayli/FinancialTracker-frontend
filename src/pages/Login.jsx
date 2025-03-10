import { useState } from "react";
import { Container, Typography, TextField, Button, Alert, Box } from "@mui/material";
import axios from "axios";
import { API_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f2f5f9",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontFamily: "Times New Roman", color: "#002D46", fontWeight: "bold", mb: 2 }}>
          LOGIN
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            InputLabelProps={{ shrink: email !== "" }}
            sx={{
              backgroundColor: "#f8f8f8",
              border:"solid 2px #002D46",
              borderRadius: "10px",
              "& .MuiFilledInput-root": {
                borderRadius: "10px",
                padding: "10px",
                fontSize: "medium",
              },
              "& .MuiInputBase-root": {
                fontWeight: "bold",
                color: "#333",
              },
              "& .MuiFilledInput-root::before, & .MuiFilledInput-root::after": {
                display: "none",
              },
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="filled"
            InputLabelProps={{ shrink: password !== "" }}
            sx={{
              backgroundColor: "#f8f8f8",
              border:"solid 2px #002D46",
              borderRadius: "10px",
              "& .MuiFilledInput-root": {
                borderRadius: "10px",
                padding: "10px",
                fontSize: "medium",
              },
              "& .MuiInputBase-root": {
                fontWeight: "bold",
                color: "#333",
              },
              "& .MuiFilledInput-root::before, & .MuiFilledInput-root::after": {
                display: "none",
              },
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          />
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#002D46",
              color: "white",
              fontWeight: "bold",
              width: "50%",
              padding: "10px",
              fontSize: "medium",
              mt: 2,
              "&:hover": {
                backgroundColor: "#001a29",
              },
            }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2, fontFamily: "Times New Roman", fontWeight: "semi-bold", color: "#002D46" }}>
          Don't have an account? <Link to="/signup" style={{ color: "#E69C00", textDecoration: "none", fontWeight: "bold" }}>Register here</Link>
        </Typography>
      </Box>
    </Box>
  );
}
