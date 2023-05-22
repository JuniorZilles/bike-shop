export default {
  to(value) {
    return value;
  },
  from(value) {
    const result = [];
    value.forEach((element) => {
      try {
        result.push(JSON.parse(element));
      } catch (error) {
        result.push(value);
      }
    });

    return result;
  }
};
