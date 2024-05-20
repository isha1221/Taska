import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export const getSingleUser = async (userId: number) => {
  try {
    // Retrieve the user details from the database
    const user = await prisma.user.findUnique({ where: { id: userId } });

    return user; // Return the user object if found
  } catch (error: any) {
    throw new Error("Error retrieving user");
  }
};
