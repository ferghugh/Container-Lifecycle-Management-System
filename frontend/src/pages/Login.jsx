import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// Login component that handles user authentication by allowing users to enter
//  their username and password, and then sending a request to the backend for verification.
export default function Login() {
  // State for username, password and login message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Handle login
  const onLoginClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          username,
          password,
        },
      );

      // Store JWT token
      localStorage.setItem("token", response.data.token);

      // Store user role (if returned by the backend)
      if (response.data.user) {
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("role", response.data.user.role);
      }

      // Notify other components
      window.dispatchEvent(new Event("storage"));

      // Success message
      setMessage("Login successful.");

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setMessage("Invalid username or password.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 5, mt: 10 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Container Management System
        </Typography>

        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Sign in to continue
        </Typography>

        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {message && (
          <Typography
            align="center"
            color={message.includes("successful") ? "success.main" : "error"}
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button variant="contained" size="large" onClick={onLoginClick}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
