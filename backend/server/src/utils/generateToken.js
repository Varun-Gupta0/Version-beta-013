import jwt from "jsonwebtoken";

/**
 * Generate a JWT for a user id
 * @param {string} id
 * @returns {string}
 */
const generateToken = (id) => {
  // process.env is typed by @types/node; ensure @types/node is installed in devDependencies
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // valid for 30 days
  });
};

export default generateToken;
