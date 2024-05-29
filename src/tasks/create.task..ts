// import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

export const createTask = async (
  token: string,
  taskTitle: string,
  taskDescription: string,
  startTime: Date,
  endTime: Date
) => {
  const decodedToken = jwt.verify(token, jwtSecret) as { userId: number };
  const { userId } = decodedToken;
  try {
    const newTask = await prisma.task.create({
      data: {
        userId,
        taskDescription: taskDescription,
        taskTitle: taskTitle,
        startTime: startTime,
        endTime: endTime,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalTasks: {
          increment: 1,
        },
        pendingTask: {
          increment: 1,
        },
      },
    });

    // Send the newly created task in the response
    return newTask;
  } catch (error: any) {
    // Handle errors
    throw new Error(`Error creating task: ${error.message}`);
  }
};
