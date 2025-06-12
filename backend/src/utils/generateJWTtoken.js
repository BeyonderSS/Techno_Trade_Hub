import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use env variable in production

/**
 * Generate a JWT token for a user
 * @param {string} userId - MongoDB User ID
 * @returns {string} - Signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d", // Valid for 7 days
  });
};
