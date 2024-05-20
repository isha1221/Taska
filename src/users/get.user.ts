import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

export const getSingleUser = async (userId: number) => {
  try {
    // Retrieve the user details from the database
    const user = await prisma.user.findUnique({ where: { id: userId } });

    return user; // Return the user object if found
  } catch (error: any) {
    throw new Error("Error retrieving user");
  }
};
