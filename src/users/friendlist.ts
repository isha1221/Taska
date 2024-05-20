import { getSingleUser } from "./get.user";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getFriendList = async (userId: number) => {
  const user = await getSingleUser(userId);

  const friendList = prisma.user.findMany({
    where: {
      branch: user?.branch,
      id: {
        not: user?.id,
      },
    },
  });
  if (!friendList) {
    return Error("friend list not found");
  }
  return friendList;
};
