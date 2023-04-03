import cleanDatabase from './utils/database/databse.clean';

global.afterEach(async () => {
  await cleanDatabase();
});
