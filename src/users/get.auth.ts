import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getSingleUser } from "./get.user";
import { config } from "dotenv";
config();
const jwtSecret = process.env.JWT_SECRET || "";

export const getAuthUser = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decodedToken = jwt.verify(token, jwtSecret) as JwtPayload;
    const userId = decodedToken.userId;
    const user = await getSingleUser(userId);
    if (!user) {
      res.cookie("token", "", { maxAge: 0 });
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }
    // req.body.user = user;
    return res.status(200).json({ success: "Authorized Successfully" });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.cookie("token", "", { maxAge: 0 });
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
