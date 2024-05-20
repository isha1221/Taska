import bcrypt from "bcryptjs";

export const createHashedPassword = async (
  password: string
): Promise<string> => {
  const saltRounds = 10; // Recommended number of salt rounds for bcrypt
  return await bcrypt.hash(password, saltRounds);
};
