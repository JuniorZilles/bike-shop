import { faker } from '@faker-js/faker';

export const validMechanic = (storeId: string) => ({
  email: faker.internet.email(),
  hiringDate: faker.date.recent(),
  name: faker.name.fullName(),
  password: '^)3.Z<Hu6mRfUsXq',
  phone: faker.phone.number('+55 ## #####-####'),
  storeId
});

export const invalidMechanic = {
  hiringDate: '2022-11',
  email: 'john.doe',
  password: 's',
  name: 'John Doe',
  phone: '+55 12 94866'
};

export const updateValidMechanic = (storeId: string) => ({
  storeId,
  phone: faker.phone.number('+55 ## #####-####')
});

export const updateInvalidMechanic = {
  phone: '+55 12 94866',
  hiringDate: '1994-1114'
};
