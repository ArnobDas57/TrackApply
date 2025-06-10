import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { SiPivotaltracker } from "react-icons/si";

const Header = () => {
  return (
    <Box
      sx={{
        width: "100%", // Ensures the header spans the full width
        display: "flex",
        justifyContent: "center", // Horizontally center the icon and text
        alignItems: "center", // Vertically center the icon and text
        gap: 1.5,
        py: 3,
        mb: 4 // Add some vertical padding for visual comfort
        // Removed mb: 5 as spacing below the header can be handled by the content area or a smaller gap
      }}
    >
      <SiPivotaltracker size="40" color="rgb(136, 227, 183)" />
      <Typography
        sx={{ fontWeight: "bolder", fontSize: "3rem", color: "#f1f1f1" }}
      >
        TrackApply
      </Typography>
    </Box>
  );
};

export default Header;
