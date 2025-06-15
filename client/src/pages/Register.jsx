import React, { useState, useContext } from "react"; // Import useContext
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
  FormControlLabel,
  Paper,
  Divider,
  Alert,
  CircularProgress, // Import CircularProgress for loading state
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App"; // Import AuthContext from App.jsx
import axiosInstance from "../utils/axiosInstance";

const Register = () => {
  // No longer expecting 'onRegister' as a prop
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  // Consume the AuthContext to get handleLogin (for auto-login after register)
  const { handleLogin: contextHandleLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    if (password !== confirmPassword) {
      setLoading(false); // Stop loading on error
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      setLoading(false);
      return setError("Password must be at least 6 characters long.");
    }

    try {
      const res = await axiosInstance.post("auth/api/signup", {
        username,
        email,
        password,
      });

      if (res.status === 201 && res.data.token) {
        localStorage.setItem("token", res.data.token);
        contextHandleLogin({ username: res.data.username });
        navigate("/dashboard");
      } else {
        setError(
          "Registration successful, but couldn't auto-login. Please log in manually."
        );
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration Failed:", err);
      const msg =
        err.response?.data?.message ||
        "Registration failed. Please try again later.";
      setError(msg);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 0,
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        mb: 5,
        borderRadius: "4px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgb(51, 117, 222)",
          p: 1.5,
          borderRadius: "4px 4px 0 0",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}
        >
          Sign Up for TrackApply
        </Typography>
      </Box>

      <Divider />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3, p: 4 }}
      >
        {error && (
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        )}

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          type="email" // Added type="email" for better mobile keyboard and basic validation
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <FormControlLabel
          control={<Checkbox required />}
          label={
            <Typography variant="body2">
              I agree to the{" "}
              <span
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                Terms and Conditions
              </span>
            </Typography>
          }
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            py: 1.5,
            background:
              "linear-gradient(to right,rgb(32, 241, 217),rgb(60, 80, 160))",
            color: "white",
            "&:hover": {
              background: "rgb(80, 88, 117)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Sign Up"
          )}
        </Button>

        <Typography
          variant="body2"
          onClick={() => navigate("/login")}
          sx={{
            textAlign: "right",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: "bold",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Already have an account? Login
        </Typography>
      </Box>
    </Paper>
  );
};

export default Register;
