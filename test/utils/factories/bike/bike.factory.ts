import { faker } from '@faker-js/faker';

export const validBike = (clientId: string) => ({
  displayName: faker.commerce.productName(),
  brand: faker.commerce.product(),
  clientId,
  color: faker.color.human(),
  nr: faker.random.numeric(10),
  rimSize: faker.datatype.number({ max: 29, min: 24 })
});

export const invalidBike = {
  displayName: 'HDS 2021',
  brand: 'OGGI',
  color: 'Red',
  nr: '12456798',
  rimSize: '29'
};

export const updateValidBike = (clientId: string) => ({
  displayName: faker.commerce.productName(),
  brand: faker.commerce.product(),
  clientId,
  color: faker.color.human(),
  nr: faker.random.numeric(10),
  rimSize: faker.datatype.number({ max: 29, min: 24 })
});

export const updateInvalidBike = {
  displayName: 'HDS 2021',
  brand: 'OGGI',
  color: 'Red',
  nr: '12456798',
  rimSize: '29'
};
