import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/tokens/jwt.token";
import { verifyPassword } from "../utils/secure/verify.password";
const prisma = new PrismaClient();

export const getUser = async (email: string, password: string) => {
  try {
    // Check if email is provided and valid
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Invalid email or password");
    }
    const passwordMatch = await verifyPassword(password, user.hashedPassword);

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken(user.id);
    return { user, token };
  } catch (error: any) {
    console.error("Error logging in:", error); // Log the error
    throw new Error(`Error logging in: ${error.message}`);
  }
};
