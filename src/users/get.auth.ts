import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getSingleUser } from "./get.user";
import { config } from "dotenv";
import { UserResponse } from "../interface/user.response";
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
    const userResponse: UserResponse = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      branch: user.branch,
      profile: user.profile,
      bio: user.bio,
      totalTasks: user.totalTasks,
      pendingTask: user.pendingTask,
      inTimeCompletdTask: user.inTimeCompletedTask,
      overTimecompletedTask: user.overTimecompletedTask,
      milestonesAchieved: user.milestonesAchieved,
      rank: user.rank,
    };
    // req.body.user = user;
    return res.status(200).json(userResponse);
  } catch (error) {
    res.cookie("token", "", { maxAge: 0 });
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
