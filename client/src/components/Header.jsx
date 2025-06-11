import { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Tooltip,
  Avatar,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";
import { SiPivotaltracker } from "react-icons/si";
import { GrLogout } from "react-icons/gr";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1.5,
        p: 2,
        mb: 4,
        backgroundColor: "rgb(37, 50, 88)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <SiPivotaltracker size="35" color="rgb(136, 227, 183)" />
        <Typography
          sx={{ fontWeight: "bolder", fontSize: "2rem", color: "#f1f1f1" }}
        >
          TrackApply
        </Typography>
      </Box>

      <Stack direction="row" spacing={4} alignItems="center">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography sx={{ color: "white", fontWeight: "500" }}>
            Name Last
          </Typography>
          <Avatar
            onClick={handleAvatarClick}
            sx={{ color: "blue", backgroundColor: "white" }}
          >
            {"N"}
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Stack>

        <Tooltip title="Log Out">
          <Button>
            <GrLogout color="white" size="30" />
          </Button>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default Header;
