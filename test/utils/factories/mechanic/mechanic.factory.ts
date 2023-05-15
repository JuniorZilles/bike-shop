import { faker } from '@faker-js/faker';

export const validMechanic = (storeId: string) => ({
  email: faker.internet.email(),
  hiringDate: '2022-11-14',
  name: 'John Doe',
  password: 'aksjdkasjmd65asd654',
  phone: '+55 12 94866-2978',
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
