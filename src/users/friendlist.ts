import { FriendResponse } from "../interface/user.response";
import { getSingleUser } from "./get.user";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getFriendList = async (userId: number):Promise<FriendResponse[]> => {
  const user = await getSingleUser(userId);

  const friendList = await prisma.user.findMany({
    select:{
      id: true,
      username: true,
      fullName: true,
      email: true,
      branch: true,
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
  const friends: FriendResponse[]= friendList.map((friend)=>
    ({
      id: friend.id,
      username: friend.username,
      fullName: friend.fullName,
      email: friend.email,
      branch: friend.branch,
      rank: friend.rank,
    })
  )
  return friends;
};
