import {HealthCheckerService} from './health-checker.service';

describe('Health checker', () => {
  let healthCheckerService: HealthCheckerService;

  beforeAll(() => {
    healthCheckerService = new HealthCheckerService();
  });

  test('should check site available', async () => {
    // eslint-disable-next-line no-magic-numbers
    const result = await healthCheckerService.healthCheck('https://google.com', 'health', 'OK', 200);
    console.log(result);
    expect(result.isAlive).toBeDefined();
  });
});
