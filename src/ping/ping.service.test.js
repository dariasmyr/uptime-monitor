const {PingService} = require('./ping.service');

describe('PingService', () => {
  test('should ping', async () => {
    const pingService = new PingService();
    const {isAlive, time} = await pingService.ping('google.com');
    expect(isAlive).toBeTruthy();
    expect(time).toBeGreaterThan(0);
  });
});
