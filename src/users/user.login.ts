// // import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// export const getUser = async (
//   username:string,
//   password: string,
// ) => {
//   try {
//     // const hashedPassword=await verifyHashedPassword(password);
    
//     const getUser = await prisma.user.findFirst({
//       where:{
//         username: username,
//         // hashedPassword: password,
//       }
//     })
    
//     if(!getUser){
//         return console.log("errorrrrrrrrrrrrrr");
//     }
//     const verifyPassword =await bcrypt.compare(password, getUser.hashedPassword)
//       if(verifyPassword){
//         return getUser;
//       }
    
//   } catch (error: any) {
    
//     throw new Error(`Error creating task: ${error.message}`);
//   }
// };

// // async function  verifyHashedPassword (username:string,password: string):Promise <string> {

// // const hashedPassword=await bcrypt.compare(password,password)
// //   return hashedPassword;
// // }


import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv"; // Import dotenv to load environment variables

config(); // Load environment variables from .env file

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || ''; // Use environment variable for JWT secret

export const getUser = async (email: string, password: string) => {
  try {
    // Check if email is provided and valid
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return the user data and the token
    return { user, token };
  } catch (error: any) {
    console.error("Error logging in:", error); // Log the error
    throw new Error(`Error logging in: ${error.message}`);
  }
};

function generateToken(userId: number): string {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "1h" }); // Token expires in 1 hour
}
