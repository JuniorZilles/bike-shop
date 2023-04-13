import { faker } from '@faker-js/faker';

export const validClient = () => ({
  email: faker.internet.email(),
  password: '^)3.Z<Hu6mRfUsXq',
  name: faker.name.fullName(),
  birthday: faker.date.birthdate(),
  phone: faker.phone.number('+55 ## #####-####')
});

export const invalidClient = {
  email: 'john.doe@mail.com',
  password: 's',
  name: 'John Doe',
  birthday: '1994-11-14',
  phone: '+55 12 94866-2978'
};

export const updateValidClient = () => ({
  name: faker.name.fullName(),
  birthday: faker.date.birthdate(),
  phone: faker.phone.number('+55 ## #####-####')
});

export const updateInvalidClient = {
  name: 'John Doe',
  birthday: '1994-1114'
};
