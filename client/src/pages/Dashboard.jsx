import React, { useState, useEffect, useContext } from "react";
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
  Modal,
  Alert,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../App";

const Dashboard = () => {
  const { handleLogout } = useContext(AuthContext);
  const [jobApplications, setJobApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  const [formData, setFormData] = useState({
    company_name: "",
    job_title: "",
    job_location: "",
    date_applied: "",
    salary_range: "",
    application_status: "Wishlist",
    job_description_url: "",
    resume_version: "",
    cover_letter_sent: false,
    notes: "",
    interview_date: "",
    offer_date: "",
    response_deadline: "",
    rejection_date: "",
  });

  const STATUSES = [
    "All",
    "Wishlist",
    "Applied",
    "Shortlisted",
    "Interviewing",
    "Offer",
    "Rejected",
  ];

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/jobs");
      setJobApplications(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch job applications.");
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredJobApplications = jobApplications.filter((job) => {
    const matchesSearch =
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || job.application_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (
      !formData.company_name ||
      !formData.job_title ||
      !formData.date_applied ||
      !formData.application_status
    ) {
      setError(
        "Company name, job title, date applied, and status are required."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post("/jobs", formData);
      setJobApplications((prev) => [...prev, res.data]);
      setSuccessMessage("Job added successfully!");
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error adding job:", err);
      setError(err.response?.data?.message || "Failed to add job application.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (
      !formData.company_name ||
      !formData.job_title ||
      !formData.date_applied ||
      !formData.application_status
    ) {
      setError(
        "Company name, job title, date applied, and status are required."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.put(
        `/jobs/${currentJob.job_id}`,
        formData
      );
      setJobApplications((prev) =>
        prev.map((job) => (job.job_id === res.data.job_id ? res.data : job))
      );
      setSuccessMessage("Job updated successfully!");
      setIsModalOpen(false);
      resetForm();
      setCurrentJob(null);
      setIsEditMode(false);
    } catch (err) {
      console.error("Error updating job:", err);
      setError(
        err.response?.data?.message || "Failed to update job application."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (
      !window.confirm("Are you sure you want to delete this job application?")
    ) {
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      setJobApplications((prev) => prev.filter((job) => job.job_id !== jobId));
      setSuccessMessage("Job deleted successfully!");
    } catch (err) {
      console.error("Error deleting job:", err);
      setError(
        err.response?.data?.message || "Failed to delete job application."
      );
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentJob(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setIsEditMode(true);
    setCurrentJob(job);
    setFormData({
      company_name: job.company_name,
      job_title: job.job_title,
      job_location: job.job_location || "",
      date_applied: job.date_applied ? job.date_applied.split("T")[0] : "",
      salary_range: job.salary_range || "",
      application_status: job.application_status,
      job_description_url: job.job_description_url || "",
      resume_version: job.resume_version || "",
      cover_letter_sent: job.cover_letter_sent || false,
      notes: job.notes || "",
      interview_date: job.interview_date
        ? job.interview_date.split("T")[0]
        : "",
      offer_date: job.offer_date ? job.offer_date.split("T")[0] : "",
      response_deadline: job.response_deadline
        ? job.response_deadline.split("T")[0]
        : "",
      rejection_date: job.rejection_date
        ? job.rejection_date.split("T")[0]
        : "",
    });
    setIsModalOpen(true);
  };

  const closeJobModal = () => {
    setIsModalOpen(false);
    resetForm();
    setCurrentJob(null);
    setIsEditMode(false);
    setError(null);
    setSuccessMessage(null);
  };

  const resetForm = () => {
    setFormData({
      company_name: "",
      job_title: "",
      job_location: "",
      date_applied: "",
      salary_range: "",
      application_status: "Wishlist",
      job_description_url: "",
      resume_version: "",
      cover_letter_sent: false,
      notes: "",
      interview_date: "",
      offer_date: "",
      response_deadline: "",
      rejection_date: "",
    });
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
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
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

      <Box sx={{ px: 3, py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

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
            sx={{ fontWeight: "bold", color: "rgb(133, 140, 247)" }}
          >
            My Applications: ({filteredJobApplications.length})
          </Typography>

          <Button
            variant="contained"
            onClick={openAddModal}
            sx={{
              fontWeight: "bold",
              backgroundColor: "rgb(44, 91, 221)",
              "&:hover": { backgroundColor: "rgb(35, 75, 190)" },
            }}
          >
            + Add Job
          </Button>
        </Box>
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
            value={searchTerm}
            onChange={handleSearchChange}
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
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
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

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && filteredJobApplications.length === 0 && (
          <Typography
            variant="body1"
            align="center"
            sx={{ mt: 4, color: "text.secondary" }}
          >
            No job applications found. Start by adding one!
          </Typography>
        )}

        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          {filteredJobApplications.map((app) => (
            <Paper
              key={app.job_id}
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
                  Status:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {app.application_status}
                  </span>
                </Typography>
                {app.salary_range && (
                  <Typography variant="body2" color="text.secondary">
                    Salary: {app.salary_range}
                  </Typography>
                )}
                {app.job_location && (
                  <Typography variant="body2" color="text.secondary">
                    Location: {app.job_location}
                  </Typography>
                )}
                {app.date_applied && (
                  <Typography variant="body2" color="text.secondary">
                    Applied: {new Date(app.date_applied).toLocaleDateString()}
                  </Typography>
                )}
                {app.job_description_url && (
                  <Typography variant="body2" color="text.secondary">
                    URL:{" "}
                    <a
                      href={app.job_description_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {app.job_description_url}
                    </a>
                  </Typography>
                )}
                {app.resume_version && (
                  <Typography variant="body2" color="text.secondary">
                    Resume Version: {app.resume_version}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Cover Letter Sent: {app.cover_letter_sent ? "Yes" : "No"}
                </Typography>
                {app.notes && (
                  <Typography variant="body2" color="text.secondary">
                    Notes: {app.notes}
                  </Typography>
                )}
                {app.interview_date && (
                  <Typography variant="body2" color="text.secondary">
                    Interview:{" "}
                    {new Date(app.interview_date).toLocaleDateString()}
                  </Typography>
                )}
                {app.offer_date && (
                  <Typography variant="body2" color="text.secondary">
                    Offer Date: {new Date(app.offer_date).toLocaleDateString()}
                  </Typography>
                )}
                {app.response_deadline && (
                  <Typography variant="body2" color="text.secondary">
                    Response Deadline:{" "}
                    {new Date(app.response_deadline).toLocaleDateString()}
                  </Typography>
                )}
                {app.rejection_date && (
                  <Typography variant="body2" color="text.secondary">
                    Rejected:{" "}
                    {new Date(app.rejection_date).toLocaleDateString()}
                  </Typography>
                )}
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => openEditModal(app)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteJob(app.job_id)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      <Modal open={isModalOpen} onClose={closeJobModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" component="h2" mb={3} align="center">
            {isEditMode ? "Edit Job Application" : "Add New Job Application"}
          </Typography>
          <Box
            component="form"
            onSubmit={isEditMode ? handleUpdateJob : handleAddJob}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              label="Job Title"
              name="job_title"
              value={formData.job_title}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              label="Job Location"
              name="job_location"
              value={formData.job_location}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Date Applied"
              type="date"
              name="date_applied"
              value={formData.date_applied}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
            <TextField
              label="Salary Range"
              name="salary_range"
              value={formData.salary_range}
              onChange={handleFormChange}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Application Status</InputLabel>
              <Select
                name="application_status"
                value={formData.application_status}
                label="Application Status"
                onChange={handleFormChange}
              >
                {STATUSES.filter((s) => s !== "All").map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Job Description URL"
              name="job_description_url"
              value={formData.job_description_url}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Resume Version"
              name="resume_version"
              value={formData.resume_version}
              onChange={handleFormChange}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="cover_letter_sent"
                  checked={formData.cover_letter_sent}
                  onChange={handleFormChange}
                />
              }
              label="Cover Letter Sent"
            />
            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Interview Date"
              type="date"
              name="interview_date"
              value={formData.interview_date}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Offer Date"
              type="date"
              name="offer_date"
              value={formData.offer_date}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Response Deadline"
              type="date"
              name="response_deadline"
              value={formData.response_deadline}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Rejection Date"
              type="date"
              name="rejection_date"
              value={formData.rejection_date}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isEditMode ? (
                "Update Job"
              ) : (
                "Add Job"
              )}
            </Button>
            <Button variant="outlined" onClick={closeJobModal} sx={{ mt: 1 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

export default Dashboard;
