const {DatabaseRepository} = require('./database.repository');

describe('Database repository', () => {
  const databaseRepository = new DatabaseRepository('./data/test.db');

  beforeAll(async () => {
    await databaseRepository.init();
  });

  test('1+2===3', async () => {
    expect(1 + 2).toBe(3);
  });

  test('should add some record', async () => {
    const result = await databaseRepository.saveReport({
      url: 'https://site.com',
      result: 'error',
      message: 'some error'
    });

    expect(result).toBeTruthy();
  });

  afterAll(async () => {
    await databaseRepository.deleteOldRecords(0);
  });
});
