import {CheckResultsRepository} from './check-results.repository';

describe('Check results repository', () => {
  let checkResultsRepository: CheckResultsRepository

  beforeAll(async () => {
    checkResultsRepository = new CheckResultsRepository();
  });

  test('should save result as json', () => {

    checkResultsRepository.save(
        {
        url: 'https://site.com',
        checkMethods: ['http', 'ping', 'ssl'],
        healthIsAlive: true,
        healthBody: 'OK',
        httpIsAlive: true,
        httpStatusCode: 200,
        pingIsAlive: true,
        pingTime: 1,
        sslIsAlive: true,
        sslRemainingDays: 100
        });

    const results = checkResultsRepository.getResults();
    expect(results).toBeDefined();
  });

});
