import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

export const getTasksForUser = async (token: string) => {
  const decodedToken = jwt.verify(token, jwtSecret) as { userId: number };

  const { userId } = decodedToken;

  // Retrieve all tasks for the user
  const tasks = await prisma.task.findMany({
    where: { userId },
  });

  if (!tasks) {
    throw new Error("Internal Server Error");
  }

  return tasks;
};
