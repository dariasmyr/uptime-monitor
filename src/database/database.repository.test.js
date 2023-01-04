const {DatabaseRepository} = require('./database.repository');
describe('Database repository', () => {
  let databaseRepository;

  beforeAll(async () => {
    databaseRepository = new DatabaseRepository('./data/test.db');
    await databaseRepository.init();
  });

  test('should add some records', async () => {
    const REPORTS_COUNT = 10;
    for (let index = 0; index < REPORTS_COUNT; index++) {
      const result = await databaseRepository.saveReport({
        url: 'https://site.com',
        result: 'error',
        message: 'some error'
      });
      expect(result).toBeTruthy();
    }
  });

  test('should delete old records', async () => {
    const COUNT_TO_KEEP = 5;
    const records = await databaseRepository.deleteOldRecords(COUNT_TO_KEEP);
    expect(records).toBe(COUNT_TO_KEEP);
  });

  afterAll(async () => {
    await databaseRepository.deleteOldRecords(0);
  });
});
