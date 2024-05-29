import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

export const getPendingTasks = async (token: string) => {
  const decodedToken = jwt.verify(token, jwtSecret) as { userId: number };

  const { userId } = decodedToken;
  const pendingTasks = await prisma.task.findMany({
    where: {
      userId: userId,
      taskStatus: false,
    },
  });
  return pendingTasks;
};
