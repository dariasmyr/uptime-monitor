const {PingService} = require('./ping.service');

describe('PingService', () => {
  test('should ping', async () => {
    const pingService = new PingService();
    const {time} = await pingService.ping('gyde.one');
    expect(time).toBeGreaterThan(0);
  });
});
