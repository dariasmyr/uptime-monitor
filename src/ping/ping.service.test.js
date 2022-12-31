const {PingService} = require('./ping.service');

describe('PingService', () => {
  test('should ping', async () => {
    const pingService = new PingService();
    const result = await pingService.ping('gyde.one');
    expect(result).toBeGreaterThan(0);
  });
});
