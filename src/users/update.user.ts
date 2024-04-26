import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || '';

export const updateUser = async (req: Request, res: Response) => {
  try {
    // Extract JWT token from request headers (assuming bearer token)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1]; // Get the token part
    const decodedToken = jwt.verify(token, jwtSecret) as { userId: number };

    const { userId } = decodedToken;

    const { fullName, email, branch, bio, password } = req.body;

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user fields, only if they are provided
    const updatedData: Partial<{ fullName: string; email: string; branch: string; bio: string; hashedPassword: string }> = {};

    if (fullName) {
      updatedData.fullName = fullName;
    }
    if (email) {
      updatedData.email = email;
    }
    if (branch) {
      updatedData.branch = branch;
    }
    if (bio) {
      updatedData.bio = bio;
    }
    if (password) {
      updatedData.hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
