const {PingService} = require('./ping.service');

describe('PingService', () => {
  test('should ping', async () => {
    const pingService = new PingService();
    const result = await pingService.ping('google.com', 2);
    expect(result).toBeGreaterThan(0);
  });
});
