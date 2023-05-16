import { faker } from '@faker-js/faker';

export const validServiceItem = (partId: string) => ({
  partId,
  qtd: faker.random.numeric(1),
  unitPrice: faker.commerce.price()
});

export const invalidServiceItem = {
  qtd: faker.word.adjective(),
  unitPrice: faker.word.adjective()
};

export const updateValidServiceItem = () => ({
  qtd: faker.random.numeric(1),
  unitPrice: faker.commerce.price()
});

export const updateInvalidServiceItem = {
  qtd: faker.word.adjective(),
  unitPrice: faker.word.adjective()
};
