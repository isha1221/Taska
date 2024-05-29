import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

export const userLogout = async (token: string) => {
  const decodedToken = jwt.verify(token, jwtSecret) as { userId: number };

  const { userId } = decodedToken;
  const user = await prisma.user.findUnique({
    select: {
      username: true,
    },
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return `${user.username} Logged out successfully.`;
};
