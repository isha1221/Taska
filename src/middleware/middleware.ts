import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getSingleUser } from "../users/get.user";

const jwtSecret = process.env.JWT_SECRET || "";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decodedToken = jwt.verify(token, jwtSecret) as JwtPayload;
    const userId = decodedToken.userId;
    const user = await getSingleUser(userId);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }
    req.body.user = user;
    next();
  } catch (error) {
    res.cookie("token", "", { maxAge: 0 });
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid token", msg: error });
  }
};
