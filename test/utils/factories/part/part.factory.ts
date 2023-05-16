import { faker } from '@faker-js/faker';

export const validPart = (storeId: string) => ({
  manufacturer: faker.company.name(),
  displayName: faker.commerce.productName(),
  storeId
});

export const invalidPart = {
  manufacturer: 65265153,
  displayName: 564546654
};

export const updateValidPart = (storeId) => ({
  storeId,
  manufacturer: faker.company.name(),
  displayName: faker.commerce.productName(),
  isActive: true
});

export const updateInvalidPart = {
  manufacturer: 65265153,
  displayName: 564546654,
  isActive: 5454
};
