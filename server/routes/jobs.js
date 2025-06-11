import express from "express";
// data for test purposes
import { jobs } from "../test_data/data.js";
import { verifyToken } from "../middleware/auth.js";

export const jobRouter = express.Router();
jobRouter.use(verifyToken);

// Add a new job application
jobRouter.post("/", async (req, res) => {
  try {
    const job_app = req.body;
    console.log("Recieved job application:", req.body);

    // when using postgresql
    // const { job_id, company_name, job_title, application_status, application_url, notes } = job_application;

    jobs.push(job_app);
    res.status(200).json(jobs);
  } catch (error) {
    console.log("Error adding new job application: ", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Get all job applications
jobRouter.get("/", async (req, res) => {
  try {
    res.status(200).json(jobs);
  } catch (error) {
    console.log("Error fetching all job applications: ", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Update job application
jobRouter.put("/:id", async (req, res) => {
  try {
    const job_id = req.params.id;
    const index = jobs.findIndex((job) => String(job.job_id) === job_id);

    if (index === -1) {
      return res.status(404).json({ message: "Job not found" });
    }

    jobs[index] = { ...jobs[index], ...req.body };

    res.status(200).json(jobs);
  } catch (error) {
    console.log("Error updating job application: ", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Delete job application
jobRouter.delete("/:id", async (req, res) => {
  try {
    const job_id = req.params.id;
    const index = jobs.findIndex((job) => String(job.job_id) === job_id);

    if (index === -1) {
      return res.status(404).json({ message: "Job not found" });
    }

    jobs.splice(index, 1);
    res.status(200).json({ message: "Job application deleted", jobs });
  } catch (error) {
    console.log("Error deleting job application: ", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});
