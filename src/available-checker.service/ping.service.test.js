const {PingService} = require('./ping.service');

describe('Ping service', () => {
  test('should ping host', async () => {
    const pingService = new PingService();
    const result = await pingService.ping('192.168.1.1');
    expect(result).toBe(true);
  });
});
