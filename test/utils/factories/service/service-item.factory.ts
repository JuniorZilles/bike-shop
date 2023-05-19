import { faker } from '@faker-js/faker';

export const validServiceItem = (partId: string) => ({
  partId,
  qtd: Number(faker.random.numeric(1)),
  unitPrice: Number(faker.commerce.price())
});

export const invalidServiceItem = {
  qtd: faker.word.adjective(),
  unitPrice: faker.word.adjective()
};

export const updateValidServiceItem = () => ({
  qtd: Number(faker.random.numeric(1)),
  unitPrice: Number(faker.commerce.price())
});

export const updateInvalidServiceItem = {
  qtd: faker.word.adjective(),
  unitPrice: faker.word.adjective()
};
