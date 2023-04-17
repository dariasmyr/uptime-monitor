import { AvailableCheckerService } from './available-checker.service';

describe('Available checker service', () => {
  let availableCheckerService: AvailableCheckerService;

  beforeAll(() => {
    availableCheckerService = new AvailableCheckerService();
  });

  test('should check site available', async () => {
    // eslint-disable-next-line no-magic-numbers
    const result = await availableCheckerService.check({
      host: 'https://www.google.com/',
      methods: ['health', 'http', 'ping', 'ssl'],
      port: 443,
      timeoutSsl: 5000,
      healthSlug: 'health',
      responseBody: 'OK',
      statusCode: 200,
      timeoutPing: 10,
    });
    console.log(result);
    expect(result).toBeDefined();
  });
});
