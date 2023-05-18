import { faker } from '@faker-js/faker';

export const validBatch = () => ({
  items: [
    {
      nf: faker.random.numeric(50),
      price: Number(faker.commerce.price()),
      qtd: Number(faker.random.numeric(2)),
      unit: 'pc'
    },
    {
      nf: faker.random.numeric(50),
      price: Number(faker.commerce.price()),
      qtd: Number(faker.random.numeric(2)),
      unit: 'pc'
    }
  ]
});

export const invalidBatch = {
  items: [
    {
      nf: faker.random.numeric(50),
      qtd: faker.random.numeric(2),
      unit: 'pc'
    },
    {
      nf: faker.random.numeric(50),
      price: faker.commerce.price()
    }
  ]
};

export const updateValidBatch = () => ({
  nf: faker.random.numeric(50).toString(),
  price: Number(faker.commerce.price()),
  qtd: Number(faker.random.numeric(2)),
  unit: 'Kg'
});

export const updateInvalidBatch = {
  nf: faker.random.numeric(10),
  price: faker.commerce.price(),
  qtd: faker.random.numeric(2),
  unit: 159
};
