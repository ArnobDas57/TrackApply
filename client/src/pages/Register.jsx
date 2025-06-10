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

const Register = () => {
  // Renamed the component from Login to Register
  return (
    <Paper
      elevation={6}
      sx={{
        p: 0,
        width: "100%", // Using 100% with maxWidth for responsiveness
        maxWidth: 600,
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
          Sign Up for TrackApply {/* Changed text to "Sign Up" */}
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
          p: 4,
        }}
      >
        <TextField label="Email" variant="outlined" fullWidth />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
        />
        {/* Added Confirm Password field */}
        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          fullWidth
        />

        {/* Changed "Remember me" to a terms and conditions checkbox */}
        <FormControlLabel
          control={<Checkbox defaultChecked />}
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
              background: "rgb(80, 88, 117)",
            },
          }}
        >
          Sign Up {/* Changed button text to "Sign Up" */}
        </Button>

        {/* Changed "Don't have an account? Sign Up" to "Already have an account? Login" */}
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
          Already have an account? Login {/* Link to login page */}
        </Typography>

        <Divider sx={{ my: 2 }} textAlign="center">
          <Typography
            variant="body2"
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Or sign up with {/* Changed text to "Or sign up with" */}
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
          {/* Social icons remain the same for consistency */}
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

export default Register; // Export the new component as Register
