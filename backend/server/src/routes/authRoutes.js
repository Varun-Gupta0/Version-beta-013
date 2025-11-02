// src/routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/auth/login", loginUser);
router.post("/auth/register", registerUser);
router.get("/profile", protect, getProfile);

export default router;
