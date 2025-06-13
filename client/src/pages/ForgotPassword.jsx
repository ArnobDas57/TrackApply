import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Link,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitted(false);
    setLoading(true);

    try {
      if (!email.includes("@") || !email.includes(".")) {
        setErrorMsg("Please enter a valid email address.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email,
        }
      );

      setSubmitted(true);
    } catch (err) {
      console.error("Forgot password request failed:", err);
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
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
          Forgot Password
        </Typography>
      </Box>

      <Divider />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: 5,
          borderRadius: "8px 8px 0 0",
        }}
      >
        {errorMsg && ( // Display error messages using Alert
          <Alert severity="error" variant="filled">
            {errorMsg}
          </Alert>
        )}

        {submitted ? (
          <Alert severity="success" variant="filled">
            {" "}
            {/* Consistent success message */}
            If an account with that email exists, a password reset link has been
            sent to your inbox.
          </Alert>
        ) : (
          <>
            <Typography variant="body1" sx={{ textAlign: "center", mb: 2 }}>
              Enter your email address below to receive a password reset link.
            </Typography>
            <TextField
              label="Email"
              fullWidth
              variant="outlined" // Consistent variant
              type="email" // Added type="email" for better input handling
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading} // Disable button when loading
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
                "Send Reset Link"
              )}
            </Button>
          </>
        )}

        <Typography
          onClick={() => navigate("/login")}
          variant="body2"
          sx={{
            textAlign: "right",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: "bold",
            "&:hover": {
              textDecoration: "underline",
            },
            mt: submitted ? 2 : 0,
          }}
        >
          Remembered your password? Login
        </Typography>
      </Box>
    </Paper>
  );
};

export default ForgotPassword;
