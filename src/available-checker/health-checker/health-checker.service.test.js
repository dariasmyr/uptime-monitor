const {HealthCheckerService} = require('./health-checker.service');

describe('Health checker', () => {
  let healthCheckerService;

  beforeAll(() => {
    healthCheckerService = new HealthCheckerService();
  });

  test('should check site available', async () => {
    const result = await healthCheckerService.healthCheck('https://google.com', 'OK', 200);
    console.log(result);
    expect(result.isAlive).toBeDefined();
  });
});
