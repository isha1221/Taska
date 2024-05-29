import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/tokens/jwt.token";
import { createHashedPassword } from "../utils/secure/hash.password";

const urls: string[] = [
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img1.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img2.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img3.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img4.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img5.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img6.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img7.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img8.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img9.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img10.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img11.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img12.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img13.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img14.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img15.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img16.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img17.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img18.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img19.png",
  "https://cdn-nex.s3.ap-south-1.amazonaws.com/taska-dev-server/img20.png",
];

const prisma = new PrismaClient();

export const createUser = async (
  username: string,
  fullName: string,
  email: string,
  branch: string,
  password: string,
  bio: string
) => {
  try {
    if (!username || !fullName || !email || !password) {
      throw new Error("All fields are required");
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    const hashedPassword = await createHashedPassword(password);
    const randomIndex = Math.floor(Math.random() * urls.length);
    const randomUrl = urls[randomIndex];

    const rank = await prisma.user.count();
    const newUser = await prisma.user.create({
      data: {
        username,
        fullName,
        email,
        branch,
        profile: randomUrl,
        hashedPassword,
        bio,
        totalTasks: 0,
        pendingTask: 0,
        inTimeCompletedTask: 0,
        overTimecompletedTask: 0,
        milestonesAchieved: 0,
        rank: 0,
      },
    });

    // Generate JWT token
    const token = generateToken(newUser.id);

    return { user: newUser, token };
  } catch (error: any) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};
