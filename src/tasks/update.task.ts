import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

export const updateTask = async (
  req: Request,
  res: Response,
  token: string
) => {
  try {
    const { taskId } = req.params; // Get the task ID from request parameters
    const decodedToken = jwt.verify(token, jwtSecret) as { userId: number };

    const { userId } = decodedToken;
    const { taskTitle, taskDescription, taskStatus, startTime, endTime } =
      req.body; // The fields to update

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    // Update the task if it exists
    const updatedTask = await prisma.task.update({
      where: { id: taskId, userId },
      data: {
        id: taskId,
        userId,
        taskDescription: taskDescription,
        taskTitle: taskTitle,
        taskStatus,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      },
    });

    res.status(200).json({ task: updatedTask });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error", msg: error });
  }
};
