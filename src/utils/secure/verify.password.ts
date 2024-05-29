import bcrypt from "bcryptjs";

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    throw new Error(`Password verification failed: ${error}`);
  }
};
