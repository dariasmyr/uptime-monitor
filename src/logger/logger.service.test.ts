import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  test('should create logger', () => {
    const logger = new LoggerService('Test', true);
    logger.debug('Debug message');
    logger.error('Error message');
    expect(logger).toBeDefined();
  });
});
