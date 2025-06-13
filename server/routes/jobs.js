import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/auth.js";

export const jobRouter = express.Router();
jobRouter.use(verifyToken);

// Add a new job application
jobRouter.post("/", async (req, res) => {
  try {
    const {
      company_name,
      job_title,
      job_location,
      date_applied,
      salary_range,
      application_status,
      job_description_url,
      resume_version,
      cover_letter_sent,
      notes,
      interview_date,
      offer_date,
      response_deadline,
      rejection_date,
    } = req.body;

    if (!company_name || !job_title || !date_applied || !application_status) {
      return res.status(400).json({
        message:
          "Company name, job title, date applied, and application status are required.",
      });
    }

    const user_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO jobs 
        (user_id, 
        company_name, 
        job_title, 
        job_location, 
        date_applied, 
        salary_range, 
        application_status,
        job_description_url,
        resume_version,
        cover_letter_sent,
        notes,
        interview_date,
        offer_date,
        response_deadline,
        rejection_date
      )
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        user_id,
        company_name,
        job_title,
        job_location,
        date_applied,
        salary_range,
        application_status,
        job_description_url,
        resume_version,
        cover_letter_sent,
        notes,
        interview_date,
        offer_date,
        response_deadline,
        rejection_date,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding new job application:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Get all job applications for the current user
jobRouter.get("/", async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT * FROM jobs WHERE user_id = $1 ORDER BY job_id DESC`,
      [user_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching job applications:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

jobRouter.get("/:id", async (req, res) => {
  try {
    const job_id = req.params.id;
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT * FROM jobs WHERE job_id = $1 AND user_id = $2`,
      [job_id, user_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Job application not found or unauthorized." });
    }
  } catch (error) {
    console.error(
      `Error fetching job application with ID ${req.params.id}:`,
      error.message
    );
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Update a job application
jobRouter.put("/:id", async (req, res) => {
  try {
    const job_id = req.params.id;
    const user_id = req.user.id;

    const {
      company_name,
      job_title,
      job_location,
      date_applied,
      salary_range,
      application_status,
      job_description_url,
      resume_version,
      cover_letter_sent,
      notes,
      interview_date,
      offer_date,
      response_deadline,
      rejection_date,
    } = req.body;

    const result = await pool.query(
      `UPDATE jobs SET
        company_name = $1,
        job_title = $2,
        job_location = $3,
        date_applied = $4,
        salary_range = $5,
        application_status = $6,
        job_description_url = $7,
        resume_version = $8,
        cover_letter_sent = $9,
        notes = $10,
        interview_date = $11,
        offer_date = $12,
        response_deadline = $13,
        rejection_date = $14
      WHERE job_id = $15 AND user_id = $16
      RETURNING *`,
      [
        company_name,
        job_title,
        job_location,
        date_applied,
        salary_range,
        application_status,
        job_description_url,
        resume_version,
        cover_letter_sent,
        notes,
        interview_date,
        offer_date,
        response_deadline,
        rejection_date,
        job_id,
        user_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating job application:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Delete a job application
jobRouter.delete("/:id", async (req, res) => {
  try {
    const job_id = req.params.id;
    const user_id = req.user.id;

    const result = await pool.query(
      `DELETE FROM jobs WHERE job_id = $1 AND user_id = $2 RETURNING *`,
      [job_id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.status(200).json({ message: "Job deleted", job: result.rows[0] });
  } catch (error) {
    console.error("Error deleting job application:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});
