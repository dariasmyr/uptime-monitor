const {PingService} = require('./ping.service');

describe('PingService', () => {
  test('should ping', async () => {
    const pingService = new PingService();
    const result = await pingService.ping('google.com');
    expect(result).toBeGreaterThan(0);
  });
});
