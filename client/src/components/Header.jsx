import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Tooltip,
  Avatar,
  Stack,
  Menu,
  MenuItem,
  AppBar, // Recommended for headers
  Toolbar, // Recommended for headers
  IconButton, // For the theme toggle button
  useTheme, // Hook to access the current theme
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // Moon icon for light mode
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Sun icon for dark mode
import { SiPivotaltracker } from "react-icons/si";
import { GrLogout } from "react-icons/gr";
import { useNavigate, Link } from "react-router-dom"; // Import Link for proper navigation
import { AuthContext, ThemeContext } from "../App"; // Ensure this path is correct

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // Consume AuthContext
  const { isAuthenticated, username, handleLogout } = useContext(AuthContext);
  // Consume ThemeContext
  const { mode, toggleColorMode } = useContext(ThemeContext);
  // Get the current theme to access palette colors
  const theme = useTheme();

  const handleAvatarClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    handleLogout();
    navigate("/login");
  };

  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    // AppBar provides better structure and default styling for headers
    <AppBar
      position="static"
      sx={{
        // Use theme palette for background
        backgroundColor: theme.palette.mode === "light" ? "#5081E2cc" : "black",
        mb: 4,
        boxShadow: theme.shadows[4], // Add a subtle shadow
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          p: 2, // Padding applied to Toolbar
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Using theme.palette for icon color for better consistency */}
          <SiPivotaltracker size="35" color={theme.palette.secondary.light} />
          <Typography
            // Using theme.palette for text color
            sx={{
              fontWeight: "bolder",
              fontSize: "2rem",
              color: theme.palette.text.primary,
            }}
          >
            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              style={{ textDecoration: "none", color: "white" }}
            >
              TrackApply
            </Link>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Theme Toggle Button */}
          <Tooltip
            title={
              mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <IconButton
              sx={{ ml: 1 }}
              onClick={toggleColorMode}
              color="inherit"
            >
              {mode === "dark" ? (
                <Brightness7Icon sx={{ color: "gold" }} />
              ) : (
                <Brightness4Icon sx={{ color: "black" }} />
              )}
            </IconButton>
          </Tooltip>

          {isAuthenticated ? (
            <Stack direction="row" spacing={4} alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography sx={{ color: "white", fontWeight: "500" }}>
                  {username}
                </Typography>
                <Avatar
                  onClick={handleAvatarClick}
                  sx={{
                    color: theme.palette.primary.contrastText, // Text color on avatar
                    backgroundColor: theme.palette.primary.main, // Avatar background color
                    cursor: "pointer",
                  }}
                >
                  {getFirstLetter(username)}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      backgroundColor: theme.palette.background.paper, // Menu background
                      color: theme.palette.text.primary, // Menu text color
                    },
                  }}
                >
                  <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                  <MenuItem onClick={handleLogoutClick}>
                    <GrLogout
                      style={{
                        marginRight: "8px",
                        color: theme.palette.text.primary,
                      }}
                    />{" "}
                    Logout
                  </MenuItem>
                </Menu>
              </Stack>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="text"
                sx={{ color: "white", fontWeight: "bold" }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="contained"
                // Use theme colors for consistent buttons
                sx={{
                  background:
                    "linear-gradient(to right, rgb(32, 241, 217), rgb(60, 80, 160))",
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": {
                    background: "rgb(84, 107, 136)",
                  },
                }}
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </Stack>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
