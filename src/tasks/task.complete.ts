import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

export const updateTaskStatus = async (
  req: Request,
  res: Response,
  token: string
) => {
  try {
    const { taskId } = req.params;
    const decodedToken = jwt.verify(token, jwtSecret) as { userId: number };
    const { userId } = decodedToken;
    const { taskStatus } = req.body;

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    // Check if the task belongs to the user
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task || task.userId !== userId) {
      return res
        .status(404)
        .json({ error: "Task not found or you are not authorized" });
    }

    if (task.taskStatus === true && taskStatus === true) {
      return res.status(400).json({ error: "Task is already completed" });
    }

    const intime = task.endTime ? inOrOverTime(task?.endTime) : false;

    // Use a transaction to ensure atomicity
    await prisma.$transaction(async (prisma) => {
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          taskStatus: taskStatus,
          completedTime: taskStatus === true ? new Date() : null,
        },
      });

      if (task.taskStatus !== taskStatus && taskStatus === true) {
        if (intime === true) {
          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              pendingTask: {
                decrement: 1,
              },
              inTimeCompletedTask: {
                increment: 1,
              },
            },
          });
        } else if (!intime) {
          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              pendingTask: {
                decrement: 1,
              },
              overTimecompletedTask: {
                increment: 1,
              },
            },
          });
        }
      }

      res.status(200).json({ task: updatedTask });
    });
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Invalid token", msg: error });
    } else {
      res.status(500).json({ error: "Internal server error", msg: error });
    }
  }
};

const inOrOverTime = (datetime: Date): boolean => {
  return datetime >= new Date();
};
