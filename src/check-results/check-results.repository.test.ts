const {CheckResultsRepository} = require('./check-results.repository');

describe('Check results repository', () => {
  let checkResultsRepository;

  beforeAll(async () => {
    checkResultsRepository = new CheckResultsRepository();
  });

  test('should save result as json', () => {
    const SITE_URL = 'https://site.com';
    const IS_ALIVE = true;
    const MESSAGE = 'some message';

    checkResultsRepository.save(SITE_URL, IS_ALIVE, MESSAGE);

    const results = checkResultsRepository.getResults();
    expect(results).toBeDefined();
  });

});
