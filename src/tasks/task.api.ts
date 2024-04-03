import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTask = async (
  userId: number,
  task: string,
  status: string
) => {
  try {
    // Check if userId is provided in the request body

    // Create the task using Prisma
    const newTask = await prisma.task.create({
      data: {
        userId: userId,
        task: task,
        status: status,
        startTime: new Date(Date.now()),
        endTime: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // Send the newly created task in the response
    return newTask;
  } catch (error: any) {
    // Handle errors
    throw new Error(`Error creating task: ${error.message}`);
  }
};
