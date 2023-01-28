import { PrismaClient } from '@prisma/client';

import { DatabaseRepository } from './database.repository';
describe('Database repository', () => {
  let databaseRepository: DatabaseRepository;
  let prisma: PrismaClient;

  beforeEach(async () => {
    await prisma.uptime.deleteMany();
  });

  beforeAll(async () => {
    databaseRepository = new DatabaseRepository();
    prisma = new PrismaClient();
  });

  test('should add some records', async () => {
    const REPORTS_COUNT = 10;
    for (let index = 0; index < REPORTS_COUNT; index++) {
      const result = await databaseRepository.saveReport({
        host: 'https://example.com',
        healthCheckIsAlive: true,
        healthCheckBody: 'OK',
        httpCheckIsAlive: true,
        httpCheckStatusCode: 200,
        pingCheckIsAlive: true,
        pingCheckTimeMs: 1,
        sslCheckIsAlive: true,
        sslCheckDaysLeft: 100,
      });
      expect(result).toBeTruthy();
    }
  });

  test('should delete old records', async () => {
    // Insert some records
    const REPORTS_COUNT = 10;
    for (let index = 0; index < REPORTS_COUNT; index++) {
      await databaseRepository.saveReport({
        host: 'https://example.com',
        healthCheckIsAlive: true,
        healthCheckBody: 'OK',
        httpCheckIsAlive: true,
        httpCheckStatusCode: 200,
        pingCheckIsAlive: true,
        pingCheckTimeMs: 1,
        sslCheckIsAlive: true,
        sslCheckDaysLeft: 100,
      });
    }

    const recordsCountBefore = await prisma.uptime.count();
    const COUNT_TO_KEEP = 5;
    const result = await databaseRepository.deleteOldRecords(COUNT_TO_KEEP);
    expect(result).toBeTruthy();
    const recordsCountAfter = await prisma.uptime.count();
    console.log(recordsCountBefore, recordsCountAfter);
    expect(recordsCountBefore - recordsCountAfter).toEqual(COUNT_TO_KEEP);
  });

  afterAll(async () => {
    await databaseRepository.deleteOldRecords(0);
  });
});
