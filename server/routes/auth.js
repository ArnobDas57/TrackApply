import dotenv from "dotenv";
dotenv.config();

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import supabase from "../db.js";
import nodemailer from "nodemailer";

export const authRouter = express.Router();

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token not provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Failed to authenticate token." });
    req.user = decoded;
    next();
  });
};

// Signup
authRouter.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "Please enter all fields." });

  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });

  try {
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .or(`username.eq.${username},email.eq.${email}`);

    if (checkError) throw checkError;
    if (existingUser.length > 0) {
      const conflictField =
        existingUser[0].username === username ? "username" : "email";
      return res
        .status(409)
        .json({ message: `This ${conflictField} is already registered.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ username, email, password: hashedPassword }])
      .select("user_id, username")
      .single();

    if (insertError) throw insertError;

    const token = jwt.sign(
      { id: newUser.user_id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res
      .status(201)
      .json({ message: "User registered!", token, username: newUser.username });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Signin
authRouter.post("/signin", async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password)
    return res
      .status(400)
      .json({ message: "Please provide both identifier and password." });

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`username.eq.${identifier},email.eq.${identifier}`);

    if (error || !data.length)
      return res.status(400).json({ message: "Invalid credentials." });

    const user = data[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ token, username: user.username });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Get current user
authRouter.get("/me", verifyToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("user_id, username, email")
      .eq("user_id", req.user.id)
      .single();

    if (error || !user)
      return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Forgot Password
authRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: "Please provide an email." });

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(200).json({
        message: "If that email is registered, a reset link will be sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await supabase
      .from("users")
      .update({
        password_reset_token: token,
        password_reset_expires: expires,
      })
      .eq("email", email);

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: '"Job Tracker App" <no-reply@jobtracker.com>',
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset for your TrackApply account.</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link is valid for 1 hour.</p>
      `,
    });

    res.status(200).json({
      message: "If that email is registered, a reset link will be sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error sending reset email." });
  }
});

// Validate reset token
authRouter.get("/validate-reset-token", async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: "Token is required." });

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("password_reset_token", token)
      .gt("password_reset_expires", new Date().toISOString())
      .single();

    if (error || !user)
      return res.status(400).json({ message: "Invalid or expired token." });

    res.status(200).json({ message: "Token is valid." });
  } catch (err) {
    console.error("Token validation error:", err);
    res.status(500).json({ message: "Server error validating token." });
  }
});

// Reset password
authRouter.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res
      .status(400)
      .json({ message: "Token and new password are required." });

  if (newPassword.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters." });

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("password_reset_token", token)
      .gt("password_reset_expires", new Date().toISOString())
      .single();

    if (error || !user)
      return res.status(400).json({ message: "Invalid or expired token." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await supabase
      .from("users")
      .update({
        password: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
      })
      .eq("user_id", user.user_id);

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error resetting password." });
  }
});
