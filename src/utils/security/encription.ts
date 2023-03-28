import bcrypt from 'bcrypt';

export const hashPassword = async (plaintextPassword: string) => {
  const hash = await bcrypt.hash(plaintextPassword, process.env.PASSWORD_SALT);
  return hash;
};

export const comparePassword = async (plaintextPassword: string, hash: string) => {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
};
