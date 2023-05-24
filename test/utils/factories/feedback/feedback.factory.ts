import { faker } from '@faker-js/faker';

export const validFeedback = (serviceId: string) => ({
  description: faker.lorem.paragraph(),
  rating: Number(faker.random.numeric(1, { bannedDigits: ['0', '6', '7', '8', '9'] })),
  serviceId
});

export const invalidFeedback = {
  description: 5463541,
  rating: '0'
};

export const updateValidFeedback = () => ({
  description: faker.lorem.paragraph(),
  rating: Number(faker.random.numeric(1, { bannedDigits: ['0', '6', '7', '8', '9'] }))
});

export const updateInvalidFeedback = {
  description: 5463541,
  rating: '0'
};
