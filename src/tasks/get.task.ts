import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

export const getTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params; // Get the task ID from the request parameters

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    // Retrieve the task by ID
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error", msg: error });
  }
};
