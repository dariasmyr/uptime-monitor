// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckResultsFormatterService } from './check-results-formatter.service';

describe('Check results formatter', () => {
  let checkResultsFormatterService: CheckResultsFormatterService;

  beforeAll(async () => {
    checkResultsFormatterService = new CheckResultsFormatterService();
  });

  test('should format results', () => {
    const results: any = {
      'https://site.com': {
        checkMethods: ['http', 'ping', 'ssl'],
        httpResults: {
          isAlive: true,
          message: 'some message',
        },
        pingResults: {
          isAlive: true,
          time: 100,
        },
        sslResults: {
          isAlive: true,
          daysLeft: 100,
        },
      },
      'https://site2.com': {
        checkMethods: ['http', 'ping', 'ssl'],
        httpResults: {
          isAlive: true,
          message: 'some message',
        },
        pingResults: {
          isAlive: true,
          time: 100,
        },
        sslResults: {
          isAlive: true,
          daysLeft: 100,
        },
      },
    };

    const formattedResults =
      checkResultsFormatterService.formatResults(results);
    console.log(formattedResults);
    expect(formattedResults).toBeDefined();
  });
});
