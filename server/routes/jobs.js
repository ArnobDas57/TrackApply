import express from "express";
import supabase from "../db.js";
import { verifyToken } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

export const jobRouter = express.Router();
jobRouter.use(verifyToken);

// Validation and sanitization rules
const jobValidationRules = [
  body("company_name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ max: 100 }),
  body("job_title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ max: 100 }),
  body("job_location")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 }),
  body("date_applied")
    .notEmpty()
    .withMessage("Date applied is required")
    .isISO8601(),
  body("salary_range")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 50 }),
  body("application_status")
    .notEmpty()
    .isIn(["applied", "interview", "offer", "rejected", "withdrawn"]),
  body("job_description_url").optional({ nullable: true }).isURL(),
  body("resume_version")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 50 }),
  body("cover_letter_sent").optional().isBoolean(),
  body("notes").optional({ nullable: true }).trim().isLength({ max: 1000 }),
  body("interview_date").optional({ nullable: true }).isISO8601(),
  body("offer_date").optional({ nullable: true }).isISO8601(),
  body("response_deadline").optional({ nullable: true }).isISO8601(),
  body("rejection_date").optional({ nullable: true }).isISO8601(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

// POST /api/jobs
jobRouter.post("/", jobValidationRules, validate, async (req, res) => {
  const user_id = req.user.id;
  const data = { ...req.body, user_id };

  try {
    const { data: job, error } = await supabase
      .from("jobs")
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(job);
  } catch (err) {
    console.error("Error creating job:", err.message);
    res.status(500).json({ message: "Failed to create job" });
  }
});

// PUT /api/jobs/:id
jobRouter.put("/:id", jobValidationRules, validate, async (req, res) => {
  const job_id = req.params.id;
  const user_id = req.user.id;

  try {
    const { data: job, error } = await supabase
      .from("jobs")
      .update(req.body)
      .eq("job_id", job_id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(job);
  } catch (err) {
    console.error("Error updating job:", err.message);
    res.status(500).json({ message: "Failed to update job" });
  }
});

// GET /api/jobs
jobRouter.get("/", async (req, res) => {
  const user_id = req.user.id;

  try {
    const { data: jobs, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", user_id)
      .order("date_applied", { ascending: false });

    if (error) throw error;
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err.message);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// GET /api/jobs/:id
jobRouter.get("/:id", async (req, res) => {
  const job_id = req.params.id;
  const user_id = req.user.id;

  try {
    const { data: job, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("job_id", job_id)
      .eq("user_id", user_id)
      .single();

    if (error) throw error;
    res.status(200).json(job);
  } catch (err) {
    console.error("Error fetching job:", err.message);
    res.status(404).json({ message: "Job not found or unauthorized" });
  }
});

// DELETE /api/jobs/:id
jobRouter.delete("/:id", async (req, res) => {
  const job_id = req.params.id;
  const user_id = req.user.id;

  try {
    const { data: deletedJob, error } = await supabase
      .from("jobs")
      .delete()
      .eq("job_id", job_id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ message: "Job deleted", job: deletedJob });
  } catch (err) {
    console.error("Error deleting job:", err.message);
    res.status(500).json({ message: "Failed to delete job" });
  }
});
