import { faker } from '@faker-js/faker';

export const validService = ({
  storeId,
  bikeId,
  clientId,
  mechanicId
}: {
  storeId: string;
  bikeId: string;
  clientId: string;
  mechanicId: string;
}) => ({
  bikeId,
  clientId,
  mechanicId,
  storeId,
  description: faker.lorem.paragraph(),
  additionalItens: [
    {
      description: faker.lorem.paragraph(),
      value: Number(faker.commerce.price())
    }
  ]
});

export const invalidService = {
  description: 6554654,
  additionalItens: [
    {
      description: 65464546,
      value: faker.commerce.price()
    }
  ]
};

export const updateValidService = (mechanicId: string) => ({
  mechanicId,
  description: faker.lorem.paragraph(),
  additionalItens: [
    {
      description: faker.lorem.paragraph(),
      value: Number(faker.commerce.price())
    }
  ],
  isActive: true
});

export const updateInvalidService = {
  description: 6554654,
  additionalItens: [
    {
      description: 65464546,
      value: faker.commerce.price()
    }
  ],
  isActive: 564155
};
