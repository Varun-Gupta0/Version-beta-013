// src/utils/generateToken.js
import jwt from "jsonwebtoken";

export default function generateToken(payload) {
  const secret = process.env.JWT_SECRET || "secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}
