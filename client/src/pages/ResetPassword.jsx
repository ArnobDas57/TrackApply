import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Link as MuiLink, // Renamed to avoid conflict with react-router-dom Link if you add it later
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom"; // Import useSearchParams

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true); // State to track if token is initially valid

  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to get query parameters
  const token = searchParams.get("token"); // Get the token from the URL query string

  // Effect to validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setErrorMsg("No reset token found in the URL.");
        return;
      }
      try {
        // You might have a backend endpoint to just validate the token
        // without setting a new password yet. This is optional but good practice.
        await axios.get(
          `http://localhost:5000/api/auth/validate-reset-token?token=${token}`
        );
        setTokenValid(true);
      } catch (err) {
        console.error("Token validation failed:", err);
        setTokenValid(false);
        setErrorMsg(
          err.response?.data?.message ||
            "Invalid or expired password reset token."
        );
      }
    };

    validateToken();
  }, [token]); // Re-run if token changes (though usually it won't on this page)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (!token) {
      setErrorMsg("Password reset token is missing.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      // Basic password strength validation
      setErrorMsg("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password", // Your backend reset endpoint
        {
          token, // Send the token
          newPassword: password, // Send the new password
        }
      );

      setSuccessMsg(
        res.data.message || "Your password has been reset successfully!"
      );
      // Optionally, set a timeout to redirect after a few seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Redirect to login after 3 seconds
    } catch (err) {
      console.error("Password reset failed:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to reset password. Please try again.";
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
          Reset Password
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
        {errorMsg && (
          <Alert severity="error" variant="filled">
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" variant="filled">
            {successMsg} You will be redirected to the login page shortly.
          </Alert>
        )}

        {/* Render form only if token is valid and no success message yet */}
        {tokenValid && !successMsg ? (
          <>
            <Typography variant="body1" sx={{ textAlign: "center", mb: 2 }}>
              Enter your new password below.
            </Typography>
            <TextField
              label="New Password"
              fullWidth
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm New Password"
              fullWidth
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              fullWidth
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
                "Reset Password"
              )}
            </Button>
          </>
        ) : (
          // If token is invalid or success message is displayed, offer to go back to login
          !successMsg && ( // Don't show this if already showing success msg and redirecting
            <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
              Please return to the{" "}
              <MuiLink component="button" onClick={() => navigate("/login")}>
                Login page
              </MuiLink>{" "}
              or{" "}
              <MuiLink
                component="button"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password page
              </MuiLink>{" "}
              to request a new link.
            </Typography>
          )
        )}

        {/* Link back to login page, always visible for navigation */}
        {!successMsg && ( // Only show if not in success state
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
              mt: 2,
            }}
          >
            Go back to Login
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ResetPassword;
