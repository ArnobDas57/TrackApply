import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { users } from "../test_data/data.js";

export const authRouter = express.Router();

// Signup Route
authRouter.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const userExists = users.find((u) => u.username === username);

  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length,
    username,
    password: hashedPassword,
  };

  users.push(newUser);
  res.status(201).json({ message: "User registered successfully" });
});

// Login Route
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: "Invalid Credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  res.status(200).json({ token });
});
