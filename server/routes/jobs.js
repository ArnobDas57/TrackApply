import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

export const jobRouter = express.Router();
jobRouter.use(verifyToken);

// Validation and sanitization rules for job fields
const jobValidationRules = [
  body("company_name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ max: 100 })
    .withMessage("Company name too long"),
  body("job_title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ max: 100 })
    .withMessage("Job title too long"),
  body("job_location")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Job location too long"),
  body("date_applied")
    .notEmpty()
    .withMessage("Date applied is required")
    .isISO8601()
    .withMessage("Date applied must be a valid date"),
  body("salary_range")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage("Salary range too long"),
  body("application_status")
    .notEmpty()
    .withMessage("Application status is required")
    .isIn(["applied", "interview", "offer", "rejected", "withdrawn"]) // example statuses
    .withMessage("Invalid application status"),
  body("job_description_url")
    .optional({ nullable: true })
    .isURL()
    .withMessage("Job description URL must be a valid URL"),
  body("resume_version")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 50 }),
  body("cover_letter_sent")
    .optional()
    .isBoolean()
    .withMessage("Cover letter sent must be boolean"),
  body("notes")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes too long"),
  body("interview_date")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Interview date must be a valid date"),
  body("offer_date")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Offer date must be a valid date"),
  body("response_deadline")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Response deadline must be a valid date"),
  body("rejection_date")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Rejection date must be a valid date"),
];

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return all validation errors in an array
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Add a new job application
jobRouter.post("/", jobValidationRules, validate, async (req, res) => {
  try {
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

// Update a job application
jobRouter.put("/:id", jobValidationRules, validate, async (req, res) => {
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
