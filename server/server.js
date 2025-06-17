import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

/* 
import { jobRouter } from "./routes/jobs.js";
import { authRouter } from "./routes/auth.js";
*/

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());

// CORS setup
const allowedOrigins = [
  "http://localhost:5173", // Vite local dev
  process.env.CLIENT_URL,
  "https://track-apply-nodeapp.vercel.app",
  "https://track-apply-six.vercel.app", // production
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Preflight support
app.options("*", cors());

// API routes
// app.use("/api/jobs", jobRouter);
// app.use("/api/auth", authRouter);

app.get("/test", (req, res) => {
  res.send("Server works!");
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found. Please check the API documentation.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
