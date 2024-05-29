import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params; // Get the task ID from request parameters

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    // Check if the task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Delete the task
    await prisma.task.delete({
      where: { id: taskId },
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error", msg: error });
  }
};
