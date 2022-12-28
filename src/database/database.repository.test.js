const {DatabaseRepository} = require('./database.repository');
describe('Database repository', () => {
  const databaseRepository = new DatabaseRepository('./data/test.db');

  beforeAll(async () => {
    await databaseRepository.init();
  });

  test('should add some records', async () => {
    // eslint-disable-next-line no-magic-numbers
    for (let index = 0; index < 5; index++) {
      const result = await databaseRepository.saveReport({
        url: 'https://site.com',
        result: 'error',
        message: 'some error'
      });
      expect(result).toBeTruthy();
    }
  });

  test('should delete old records', async () => {
    // eslint-disable-next-line no-magic-numbers
    const records = await databaseRepository.deleteOldRecords(3);
    // eslint-disable-next-line no-magic-numbers
    expect(records).toBe(3);
  });

  afterAll(async () => {
    await databaseRepository.deleteOldRecords(0);
  });
});
