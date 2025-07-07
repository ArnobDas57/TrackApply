import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
  FormControlLabel,
  Paper,
  Divider, // Still useful for separating main form from signup link if desired
  Alert,
  CircularProgress,
  Link,
  useTheme,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../App";

import { keyframes } from "@emotion/react";

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%; 
  }
  100% {
    background-position: 0% 50%; 
  }
`;

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const { handleLogin: contextHandleLogin } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("auth/signin", {
        identifier,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      contextHandleLogin({ username: res.data.username });

      navigate("/dashboard");
    } catch (err) {
      console.error("Login Failed:", err);
      const msg =
        err?.response?.data?.message ||
        "Invalid login credentials. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)",
        py: 4,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* Header Section of the Login Card */}
        <Box
          sx={{
            p: 3,
            bgcolor: theme.palette.primary.main,
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Log in to TrackApply
          </Typography>
        </Box>

        {/* Form Section */}
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            px: 4,
            pb: 4,
            pt: 4, // Added top padding back as social section is removed
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
                "linear-gradient(-45deg, #FE6B8B, #3ae2f5, #FE6B8B, #3ae2f5)",
              backgroundSize: "400% 100%",
              color: "white",
              animation: `${gradientAnimation} 4s ease infinite`, // 3s duration, ease timing, infinite loop
              "&:hover": {
                filter: "brightness(1.1)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>

          {/* Forgot Password Link */}
          <Link
            component="button"
            onClick={() => navigate("/forgot-password")}
            variant="body2"
            sx={{
              textAlign: "right",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: "bold",
              color: "#0A0FA9",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Forgot Password?
          </Link>

          {/* Sign Up Link */}
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mt: 1,
            }}
          >
            Don’t have an account?{" "}
            <Link
              component="button"
              onClick={() => navigate("/register")}
              sx={{
                cursor: "pointer",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
