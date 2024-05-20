import bcrypt from "bcryptjs";

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw new Error("Password verification failed");
  }
};
