import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import { jobRouter } from "./routes/jobs.js";
import { authRouter } from "./routes/auth.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());

// CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev (Vite)
      "https://track-apply-nodeapp-git-main-arnobdas57s-projects.vercel.app", // preview deployment
      "https://track-apply-nodeapp.vercel.app", // production deployment
    ],
    credentials: true, // allow sending credentials like cookies/headers
  })
);

// API routes
app.use("/api/jobs", jobRouter);
app.use("/api/auth", authRouter);

// Catch-all for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Endpoint not found. Please check the API documentation.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
