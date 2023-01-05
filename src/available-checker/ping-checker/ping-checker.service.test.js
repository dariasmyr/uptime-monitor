const {PingCheckerService} = require('./ping-checker.service');

describe('PingService', () => {
  test('should ping-checker', async () => {
    const pingService = new PingCheckerService();
    const {isAlive, time} = await pingService.ping('google.com');
    expect(isAlive).toBeTruthy();
    expect(time).toBeGreaterThan(0);
  });
});
