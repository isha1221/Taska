// // import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// export const createUser = async (
//   username:string,
//   fullName:string,
//   email:string,
//   branch:string,
//   password: string,
//   bio:string,
 

// ) => {
//   try {
//     const hashedPassword=await createHashedPassword(password);
    
//     const newUser = await prisma.user.create({
//       data: {
//        username: username,
//        fullName: fullName,
//        email: email,
//        branch: branch,
//        hashedPassword: hashedPassword,
//        bio: bio,
//        totalTasks:0,
//        completedTasks: 0,
//        numberOfMilestones: 0
//       },
//     });

//     // Send the newly created task in the response
//     return newUser;
//   } catch (error: any) {
//     // Handle errors
//     throw new Error(`Error creating task: ${error.message}`);
//   }
// };

// async function  createHashedPassword (password: string):Promise <string> {

// const saltRounds=10;
// const hashedPassword=await bcrypt.hash(password,saltRounds)
//   return hashedPassword;
// }
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv"; // Import dotenv to load environment variables

config(); // Load environment variables from .env file

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || ''; // Use environment variable for JWT secret

export const createUser = async (
  username: string,
  fullName: string,
  email: string,
  branch: string,
  password: string,
  bio: string
) => {
  try {
    // Basic input validation
    if (!username || !fullName || !email || !password) {
      throw new Error("All fields are required");
    }

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    const hashedPassword = await createHashedPassword(password);

    const newUser = await prisma.user.create({
      data: {
        username,
        fullName,
        email,
        branch,
        hashedPassword,
        bio,
        totalTasks: 0,
        completedTasks: 0,
        numberOfMilestones: 0,
      },
    });

    // Generate JWT token
    const token = generateToken(newUser.id);

    return { user: newUser, token };
  } catch (error: any) {
    console.error("Error creating user:", error); // Log the error
    throw new Error(`Error creating user: ${error.message}`);
  }
};

async function createHashedPassword(password: string): Promise<string> {
  const saltRounds = 10; // Recommended number of salt rounds for bcrypt
  return await bcrypt.hash(password, saltRounds);
}

function generateToken(userId: number): string {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "1h" }); // Token expires in 1 hour
}
