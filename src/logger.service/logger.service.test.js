const {LoggerService} = require('./logger.service');

const logger = new LoggerService('Test', true);

describe('LoggerService', () => {
  test('should create logger', () => {
    logger.debug('Debug message');
    logger.error('Error message');
    expect(logger).toBeTruthy();
  });
});


