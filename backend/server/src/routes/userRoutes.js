// src/routes/userRoutes.js
import express from "express";

const router = express.Router();

// Example route for user registration
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Temporary placeholder logic
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  res.status(201).json({
    message: "User registered successfully!",
    user: { name, email },
  });
});

// Example route for fetching users (test purpose)
router.get("/", (req, res) => {
  res.json({ message: "Fetching all users..." });
});

export default router;
