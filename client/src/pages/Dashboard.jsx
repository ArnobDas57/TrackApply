import { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  FormControlLabel,
  Paper,
  Stack,
  Select,
  Divider,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [jobApplications, setJobApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Filter by Status");
  const STATUSES = [
    "Applied",
    "In progress",
    "Shortlisted",
    "Interviewing",
    "Rejected",
    "Offer",
  ];

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs");
      setJobApplications(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <Paper
      elevation={8}
      sx={{
        p: 0,
        width: 1000,
        mx: "auto",
        mb: 5,
        borderRadius: "8px",
        backgroundColor: "rgb(184, 209, 220)",
      }}
    >
      {/* Header Component */}
      <Box
        sx={{
          backgroundColor: "rgb(51, 117, 222)",
          py: 2,
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}
        >
          Jobs you've applied to
        </Typography>
      </Box>

      <Divider />

      {/* Dashboard Content */}
      <Box sx={{ px: 3, py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "rgb(27, 32, 99)" }}
          >
            My Applications: ({jobApplications.length})
          </Typography>

          <Button
            variant="contained"
            sx={{
              fontWeight: "bold",
              backgroundColor: "rgb(44, 91, 221)",
              "&:hover": { backgroundColor: "rgb(35, 75, 190)" },
            }}
          >
            + Add Job
          </Button>
        </Box>
        {/* Search and Filter */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <TextField
            fullWidth
            label="Search by company or position..."
            variant="outlined"
            sx={{
              width: 500,
              backgroundColor: "white",
            }}
          />

          <FormControl
            sx={{
              width: 500,
              backgroundColor: "white",
            }}
          >
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilter}
            >
              {STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Divider sx={{ mt: 5 }} />

        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          {jobApplications.map((app, idx) => (
            <Paper
              key={idx}
              elevation={6}
              sx={{
                p: 3,
                width: 500,
                backgroundColor: "white",
                borderRadius: 3,
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {app.job_title}
                </Typography>
                <Typography variant="subtitle1">{app.company_name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {app.application_status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Salary: {app.salary_range}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {app.job_location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  application_url: {app.application_url}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  notes: {app.notes}
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button variant="contained" color="primary">
                  Edit
                </Button>
                <Button variant="contained" color="error">
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default Dashboard;
