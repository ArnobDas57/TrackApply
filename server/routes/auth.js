import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../db.js";
export const authRouter = express.Router();

// Signup Route
authRouter.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists " });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($!, $2, $3) RETURNING id, username",
      [username, email, hashedPassword]
    );

    const newUser = result.rows[0];

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error " });
  }
});

// Login Route
authRouter.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $1",
      [identifier]
    );

    const user = result.rows[0];

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});
