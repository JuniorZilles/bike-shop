import { faker } from '@faker-js/faker';

export const validFeedback = (serviceId: string) => ({
  description: faker.lorem.paragraph(),
  rating: faker.random.numeric(1),
  serviceId
});

export const invalidFeedback = {
  description: 5463541,
  rating: '1'
};

export const updateValidFeedback = () => ({
  description: faker.lorem.paragraph(),
  rating: faker.random.numeric(1)
});

export const updateInvalidFeedback = {
  description: 5463541,
  rating: '1'
};
