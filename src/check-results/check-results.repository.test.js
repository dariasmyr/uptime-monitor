const {CheckResultsRepository} = require('./check-results.repository');

describe('Check results repository', () => {

  const checkResultsRepository = new CheckResultsRepository();

  test('should save result as json', () => {
    checkResultsRepository.save('https://site.com', 'ok', 'some message');
    const results = checkResultsRepository.getHttpResults();
    const expected = {
      'https://site.com': {
        result: 'ok',
        message: 'some message'
      }
    };
    expect(results).toMatchObject(expected);
  });

});
