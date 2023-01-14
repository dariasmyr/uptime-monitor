import {CheckResultsRepository} from './check-results.repository';

describe('Check results repository', () => {
  let checkResultsRepository: CheckResultsRepository

  beforeAll(async () => {
    checkResultsRepository = new CheckResultsRepository();
  });

  test('should save result as json', () => {
    const SITE_URL = 'https://site.com';
    const IS_ALIVE = true;
    const MESSAGE = 'some message';

    checkResultsRepository.save(
        {
        url: 'https://site.com',
        checkMethods: ['http', 'ping', 'ssl'],
        healthIsAlive: true,
        healthBody: ,
        httpIsAlive: boolean,
        httpStatusCode: number,
        pingIsAlive: boolean,
        pingTime: number,
        sslIsAlive: boolean,
        sslRemainingDays: number
        };

    const results = checkResultsRepository.getResults();
    expect(results).toBeDefined();
  });

});
