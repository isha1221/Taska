import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/tokens/jwt.token";
import { verifyPassword } from "../utils/secure/verify.password";
const prisma = new PrismaClient();

export const getUser = async (email: string, password: string) => {
  try {
    // Check if email is provided and valid
    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.name = "ValidationError";
      throw error;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const error = new Error("Invalid email or password");
      error.name = "AuthenticationError";
      throw error;
    }

    const passwordMatch = await verifyPassword(password, user.hashedPassword);

    if (!passwordMatch) {
      const error = new Error("Invalid email or password");
      error.name = "AuthenticationError";
      throw error;
    }

    // Generate JWT token
    const token = generateToken(user.id);
    return { user, token };
  } catch (error: any) {
    if (
      error.name === "ValidationError" ||
      error.name === "AuthenticationError"
    ) {
      throw error;
    }
    const internalError = new Error("Error logging in");
    internalError.name = "InternalError";
    internalError.message = error.message;
    throw internalError;
  }
};
