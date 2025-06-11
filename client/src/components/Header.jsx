import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { SiPivotaltracker } from "react-icons/si";

const Header = () => {
  return (
    <Box
      sx={{
        width: "100%", 
        display: "flex",
        justifyContent: "center", 
        alignItems: "center", 
        gap: 1.5,
        py: 3,
        mb: 4 
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
