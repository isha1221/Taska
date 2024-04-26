import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || '';

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params; // Get the task ID from request parameters

    const { task, status, startTime, endTime } = req.body; // The fields to update

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    // Update the task if it exists
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        task,
        status,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      },
    });

    res.status(200).json({ task: updatedTask });
  } catch (error: any) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
