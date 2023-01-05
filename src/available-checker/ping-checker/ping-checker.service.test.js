const {PingCheckerService} = require('./ping-checker.service');

describe('PingService', () => {
  let pingService;

  beforeAll(() => {
    pingService = new PingCheckerService();
  });

  test('should ping-checker', async () => {
    const {isAlive, timeMs} = await pingService.ping('google.com');
    expect(isAlive).toBeTruthy();
    expect(timeMs).toBeGreaterThan(0);
  });
});
