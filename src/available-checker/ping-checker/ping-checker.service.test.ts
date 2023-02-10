import { PingCheckerService } from './ping-checker.service';

describe('PingService', () => {
  let pingService: PingCheckerService;

  beforeAll(() => {
    pingService = new PingCheckerService();
  });

  test('should ping-checker', async () => {
    const { isAlive, receivedData } = await pingService.ping('www.youtube.com');
    expect(isAlive).toBeTruthy();
    expect(receivedData.time).toBeGreaterThan(0);
  });
});
