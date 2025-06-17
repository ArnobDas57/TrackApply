import React, { useState, useContext } from "react"; // Import useContext
import { useNavigate } from "react-router-dom";
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
  CircularProgress,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import axiosInstance from "axios";
import { AuthContext } from "../App"; // Import AuthContext from App.jsx

const Login = () => {
  // No longer expecting 'onLogin' as a prop
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Consume the AuthContext to get handleLogin
  const { handleLogin: contextHandleLogin } = useContext(AuthContext); // Renamed to avoid conflict

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/auth/signin", {
        identifier,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      // Call the handleLogin function from context to update isAuthenticated in App.jsx
      contextHandleLogin({ username: res.data.username }); // Call the function from context

      navigate("/dashboard");
    } catch (err) {
      console.error("Login Failed:", err);
      // More robust error handling: check for specific status codes if needed
      const msg =
        err?.response?.data?.message ||
        "Invalid login credentials. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
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
          Log in to TrackApply
        </Typography>
      </Box>

      <Divider />

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: 5,
          borderRadius: "8px 8px 0 0",
        }}
      >
        {errorMsg && (
          <Alert severity="error" variant="filled">
            {errorMsg}
          </Alert>
        )}

        <TextField
          required
          label="Email or Username"
          placeholder="Enter your email or username"
          variant="outlined"
          fullWidth
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <TextField
          required
          label="Password"
          placeholder="Enter your password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Remember me"
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
              background: "rgb(79, 85, 107)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Login"
          )}
        </Button>

        <Typography
          onClick={() => navigate("/forgot-password")}
          variant="body2"
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
          Forgot Password?
        </Typography>

        <Typography
          onClick={() => navigate("/register")}
          variant="body2"
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
          Don’t have an account? Sign Up
        </Typography>
      </Box>
    </Paper>
  );
};

export default Login;
