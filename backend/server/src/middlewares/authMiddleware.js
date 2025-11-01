import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * @typedef {import('express').Request & { user?: any }} AuthRequest
 */

/**
 * Protect middleware - verifies JWT and attaches user to req.user
 * @param {AuthRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = /** @type {{ id?: string }} */ (
        jwt.verify(token, process.env.JWT_SECRET)
      );

      // Attach user to request (without password)
      if (decoded && decoded.id) {
        // Cast User to any to avoid editor/type-checker issues with Mongoose overloads
        req.user = await /** @type {any} */ (User).findById(decoded.id).select("-password");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;
