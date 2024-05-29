// src/getDailyRanks.ts
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import jwt from "jsonwebtoken";

dayjs.extend(weekOfYear);

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

export const getDailyRanks = async (token: string) => {
  const decodedToken = jwt.verify(token, jwtSecret) as { userId: number };

  const { userId } = decodedToken;
  try {
    const weekStart = dayjs().startOf("week");
    const weekEnd = dayjs().endOf("week");

    const rankData = await prisma.rankData.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: weekStart.toDate(),
          lte: weekEnd.toDate(),
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const dailyRanks = Array.from({ length: 7 }, (_, i) => {
      const day = weekStart.add(i, "day");
      const recordsForDay = rankData.filter((rank) =>
        dayjs(rank.createdAt).isSame(day, "day")
      );

      if (recordsForDay.length > 0) {
        // Get the latest rank for the day
        const latestRecordForDay = recordsForDay.reduce((a, b) =>
          dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? a : b
        );
        return {
          day: day.day(), // Day number (0 for Sunday, 1 for Monday, etc.)
          rank: latestRecordForDay.rank,
        };
      } else {
        return {
          day: day.day(), // Day number (0 for Sunday, 1 for Monday, etc.)
          rank: null,
        };
      }
    });

    return dailyRanks;
  } catch (error) {
    throw new Error("Error fetching daily ranks");
  }
};
