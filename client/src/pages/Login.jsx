import React from "react";
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
  FormControlLabel,
  Paper,
  Divider,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

const Login = () => {
  return (
    <Paper
      elevation={6}
      sx={{
        p: 0,
        width: 600,
        mx: "auto",
        mb: 5,
        borderRadius: "4px",
      }}
    >
      {/* Top section with custom background */}
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

      {/* Bottom section with default background */}
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: 5,
          borderRadius: "8px 8px 0 0",
        }}
      >
        <TextField label="Email" variant="outlined" fullWidth />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
        />

        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Remember me"
        />

        <Button
          variant="contained"
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            py: 1.5,
            background:
              "linear-gradient(to right,rgb(32, 241, 217),rgb(60, 80, 160))",
            color: "white",
            transition: "background-color 0.1s ease-in-out",
            "&:hover": {
              background: "rgb(79, 85, 107)",
            },
          }}
        >
          Login
        </Button>

        <Typography
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
          Don't have an account? Sign Up
        </Typography>

        <Divider sx={{ my: 2 }} textAlign="center">
          <Typography
            variant="body2"
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Or sign in with
          </Typography>
        </Divider>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            mt: 1,
          }}
        >
          {/* Wrapped each icon in a Box with sx prop for styling */}
          <Box
            sx={{
              display: "flex", // Make sure icon is centered if padding is added
              justifyContent: "center",
              alignItems: "center",
              width: 45, // Set a fixed width/height for the hoverable area
              height: 45,
              borderRadius: "50%", // Make it circular
              cursor: "pointer",
              transition: "background-color 0.2s ease-in-out", // Smooth transition for background
              "&:hover": {
                backgroundColor: "rgb(113, 134, 137)", // Light gray on hover
              },
            }}
          >
            <FcGoogle size="30" />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 45,
              height: 45,
              borderRadius: "50%",
              cursor: "pointer",
              transition: "background-color 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgb(113, 134, 137)",
              },
            }}
          >
            <FaFacebookSquare size="30" />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 45,
              height: 45,
              borderRadius: "50%",
              cursor: "pointer",
              transition: "background-color 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgb(113, 134, 137)",
              },
            }}
          >
            <FaGithub size="30" />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 45,
              height: 45,
              borderRadius: "50%",
              cursor: "pointer",
              transition: "background-color 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgb(113, 134, 137)",
              },
            }}
          >
            <FaLinkedin size="30" />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default Login;
