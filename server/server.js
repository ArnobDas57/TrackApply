import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jobRouter } from "./routes/jobs.js";
import { authRouter } from "./routes/auth.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// initialize middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/jobs", jobRouter);
app.use("/api/auth", authRouter);

// Check for unknown endpoints
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found. Please check the API documentation.",
  });
});

// Start our server
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
