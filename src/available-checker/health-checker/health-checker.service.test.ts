import {HealthCheckerService} from './health-checker.service';

describe('Health checker', () => {
  let healthCheckerService: HealthCheckerService;

  beforeAll(() => {
    healthCheckerService = new HealthCheckerService();
  });

  test('should check site available', async () => {
    // eslint-disable-next-line no-magic-numbers
    const checkResult = await healthCheckerService.healthCheck('https://google.com', 'health', 'OK', 200);
    console.log(checkResult);
    expect(checkResult.isAlive).toBeDefined();
  });
});
