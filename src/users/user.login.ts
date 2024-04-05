// import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const getUser = async (
  username:string,
  password: string,
) => {
  try {
    // const hashedPassword=await verifyHashedPassword(password);
    
    const getUser = await prisma.user.findFirst({
      where:{
        username: username,
        // hashedPassword: password,
      }
    })
    
    if(!getUser){
        return console.log("errorrrrrrrrrrrrrr");
    }
    const verifyPassword =await bcrypt.compare(password, getUser.hashedPassword)
      if(verifyPassword){
        return getUser;
      }
    
  } catch (error: any) {
    
    throw new Error(`Error creating task: ${error.message}`);
  }
};

// async function  verifyHashedPassword (username:string,password: string):Promise <string> {

// const hashedPassword=await bcrypt.compare(password,password)
//   return hashedPassword;
// }