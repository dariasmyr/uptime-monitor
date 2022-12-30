const {PingService} = require('./ping.service');

describe('Ping service', () => {
  test('should ping', async () => {
    const pingService = new PingService();
    const result = await pingService.ping('google.com');
    expect(result).toBeTruthy();
  });
});

