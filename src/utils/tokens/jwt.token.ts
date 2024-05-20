import jwt from "jsonwebtoken";
import { config } from "dotenv"; // Import dotenv to load environment variables

config();
const jwtSecret = process.env.JWT_SECRET || "";

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "1h" }); // Token expires in 1 hour
};
