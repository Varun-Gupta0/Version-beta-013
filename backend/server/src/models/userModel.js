// src/models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["patient", "doctor", "lab", "admin"],
    default: "patient",
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  // optional profile fields
  profile: {
    age: Number,
    gender: String,
    address: String,
  },
}, { timestamps: true });

// Avoid model overwrite issues in dev watch mode
export default mongoose.models.User || mongoose.model("User", userSchema);
