// src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ Added user routes
import authRoutes from "./routes/authRoutes.js"; // ✅ Added auth routes
import blockchainRoutes from "./routes/blockchainRoutes.js"; // ✅ Added blockchain routes
import ipfsRoutes from "./routes/ipfsRoutes.js"; // ✅ Added IPFS routes
import blockchainService from "./services/blockchainService.js"; // ✅ Added blockchain service
import ipfsService from "./services/ipfsService.js"; // ✅ Added IPFS service

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Initialize services
blockchainService.initialize().catch(console.error);
ipfsService.initialize().catch(console.error);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running successfully!");
});

// ✅ API routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/ipfs", ipfsRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
