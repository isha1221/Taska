// import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const createUser = async (
  username:string,
  fullName:string,
  email:string,
  branch:string,
  password: string,
  bio:string,
 

) => {
  try {
    const hashedPassword=await createHashedPassword(password);
    
    const newUser = await prisma.user.create({
      data: {
       username: username,
       fullName: fullName,
       email: email,
       branch: branch,
       hashedPassword: hashedPassword,
       bio: bio,
       totalTasks:0,
       completedTasks: 0,
       numberOfMilestones: 0
      },
    });

    // Send the newly created task in the response
    return newUser;
  } catch (error: any) {
    // Handle errors
    throw new Error(`Error creating task: ${error.message}`);
  }
};

async function  createHashedPassword (password: string):Promise <string> {

const saltRounds=10;
const hashedPassword=await bcrypt.hash(password,saltRounds)
  return hashedPassword;
}