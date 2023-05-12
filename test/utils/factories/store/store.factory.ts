import { faker } from '@faker-js/faker';

export const validStore = () => ({
  city: faker.address.cityName(),
  complement: faker.address.secondaryAddress(),
  displayName: faker.company.name(),
  neighborhood: faker.address.county(),
  number: faker.address.buildingNumber(),
  street: faker.address.street(),
  phone: faker.phone.number('+55 ## #####-####'),
  state: 'RS',
  zipCode: faker.address.zipCode('#####-###'),
  latitude: Number(faker.address.latitude()),
  longitude: Number(faker.address.longitude()),
  email: faker.internet.email(),
  password: '^)3.Z<Hu6mRfUsXq'
});

export const invalidStore = {
  city: 'Dois Irmãos',
  complement: 'em frente ao posto shell',
  displayName: 'Top Bike',
  email: 'topbike',
  neighborhood: 'centro',
  number: '300',
  street: 'Av. Irineu Becker',
  phone: '+55 51 99173-',
  state: 'TU',
  zipCode: '93950-000',
  password: 's',
  latitude: -209.579,
  longitude: -510.089
};

export const updateValidStore = () => ({
  neighborhood: faker.address.county(),
  number: faker.address.buildingNumber(),
  street: faker.address.street()
});

export const updateInvalidStore = {
  street: 'Av. Irineu Becker',
  phone: '+55 51 99173-',
  state: 'TU'
};
