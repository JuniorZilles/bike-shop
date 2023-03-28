import { hashPassword } from '../security/encription';

export default {
  async to(value) {
    const hashedPass = await hashPassword(value);
    return hashedPass;
  },
  from(value) {
    return value;
  }
};
