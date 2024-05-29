// src/rankUsers.ts
import { PrismaClient, User } from "@prisma/client";
import { FriendResponse } from "../interface/user.response";

const prisma = new PrismaClient();

export const getAndRankUsers = async (): Promise<FriendResponse[]> => {
  try {
    // Fetch all users
    const users = await prisma.user.findMany();
    const filteredUsers = users.filter(
      (user) => user.inTimeCompletedTask > 0 || user.overTimecompletedTask > 0
    );

    // Sort users based on the criteria
    const rankedUsers = filteredUsers.sort((a, b) => {
      if (a.inTimeCompletedTask !== b.inTimeCompletedTask) {
        return b.inTimeCompletedTask - a.inTimeCompletedTask;
      }
      if (a.overTimecompletedTask !== b.overTimecompletedTask) {
        return a.overTimecompletedTask - b.overTimecompletedTask;
      }
      return b.milestonesAchieved - a.milestonesAchieved;
    });

    // Update rank for each user and record the rank history
    const updatePromises = rankedUsers.map((user, index) => {
      const newRank = index + 1;
      return prisma.$transaction(async (prisma) => {
        await prisma.user.update({
          where: { id: user.id },
          data: { rank: newRank },
        });
        await prisma.rankData.create({
          data: {
            userId: user.id,
            rank: newRank,
          },
        });
      });
    });

    await Promise.all(updatePromises);

    // Fetch users again to include those with rank 0 and sort accordingly
    const allUsers = await prisma.user.findMany();

    // Sort users by rank, placing rank 0 at the bottom
    const sortedUsers = allUsers.sort((a, b) => {
      if (a.rank === 0) return 1;
      if (b.rank === 0) return -1;
      return a.rank - b.rank;
    });

    const allRankedUser: FriendResponse[] = sortedUsers.map((user) => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      branch: user.branch,
      profile: user.profile,
      rank: user.rank,
    }));
    return allRankedUser;
  } catch (error) {
    throw new Error("Error ranking users");
  }
};
