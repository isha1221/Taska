import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || '';

export const getTasksForUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token
    const decodedToken = jwt.verify(token, jwtSecret) as { userId: number };

    const { userId } = decodedToken;

    // Retrieve all tasks for the user
    const tasks = await prisma.task.findMany({
      where: { userId },
    });

    res.status(200).json({ tasks });
  } catch (error: any) {
    console.error("Error retrieving tasks for user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
