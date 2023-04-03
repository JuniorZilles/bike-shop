import { hash, compare } from 'bcrypt';

export const hashPassword = async (plaintextPassword: string) => {
  const hashPass = await hash(plaintextPassword, Number(process.env.PASSWORD_SALT));
  return hashPass;
};

export const comparePassword = async (plaintextPassword: string, hashPass: string) => {
  const result = await compare(plaintextPassword, hashPass);
  return result;
};
