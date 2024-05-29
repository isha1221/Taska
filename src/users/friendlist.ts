import { PrismaClient } from "@prisma/client";
import { FriendResponse } from "../interface/user.response";
import { getSingleUser } from "./get.user";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

export const getFriendList = async (
  token: string
): Promise<FriendResponse[]> => {
  const decodedToken = jwt.verify(token, jwtSecret) as { userId: number };

  const { userId } = decodedToken;
  const user = await getSingleUser(userId);

  const friendList = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      fullName: true,
      email: true,
      branch: true,
      profile: true,
      rank: true,
    },
    where: {
      branch: user?.branch,
      id: {
        not: user?.id,
      },
    },
  });
  if (!friendList) {
    throw new Error("friend list not found");
  }
  const friends: FriendResponse[] = friendList.map((friend) => ({
    id: friend.id,
    username: friend.username,
    fullName: friend.fullName,
    email: friend.email,
    branch: friend.branch,
    profile: friend.profile,
    rank: friend.rank,
  }));
  return friends;
};
