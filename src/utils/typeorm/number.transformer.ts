export default {
  to(value) {
    return value;
  },
  from(value) {
    if (typeof value === 'string') {
      return Number(value);
    }
    return value;
  }
};
