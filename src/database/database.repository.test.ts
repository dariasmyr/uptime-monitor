// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatabaseRepository } from './database.repository';
describe('Database repository', () => {
  let databaseRepository: any;

  beforeAll(async () => {
    databaseRepository = new DatabaseRepository('./data/test.db');
    await databaseRepository.init();
  });

  test('should add some records', async () => {
    const REPORTS_COUNT = 10;
    for (let index = 0; index < REPORTS_COUNT; index++) {
      const result = await databaseRepository.saveReport(
        'https://example.com',
        true,
        'OK',
        true,
        'OK',
        true,
        1,
        true,
        // eslint-disable-next-line no-magic-numbers
        100,
      );
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
