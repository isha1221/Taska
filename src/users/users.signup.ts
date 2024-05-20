import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/tokens/jwt.token";
import { createHashedPassword } from "../utils/secure/hash.password";
const prisma = new PrismaClient();

export const createUser = async (
  username: string,
  fullName: string,
  email: string,
  branch: string,
  password: string,
  bio: string
) => {
  try {
    // Basic input validation
    if (!username || !fullName || !email || !password) {
      throw new Error("All fields are required");
    }

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    const hashedPassword = await createHashedPassword(password);

    const rank = await prisma.user.count();
    console.log(rank);
    const newUser = await prisma.user.create({
      data: {
        username,
        fullName,
        email,
        branch,
        hashedPassword,
        bio,
        totalTasks: 0,
        pendingTask: 0,
        inTimeCompletedTask: 0,
        overTimecompletedTask: 0,
        milestonesAchieved: 0,
        rank: 0,
      },
    });

    // Generate JWT token
    const token = generateToken(newUser.id);

    return { user: newUser, token };
  } catch (error: any) {
    console.error("Error creating user:", error); // Log the error
    throw new Error(`Error creating user: ${error.message}`);
  }
};
