import { SslCheckerService } from './ssl-checker.service';

describe('Check SSL certificate service', () => {
  let sslCheckerService: SslCheckerService;

  beforeAll(() => {
    sslCheckerService = new SslCheckerService();
  });

  test('should show SSL certificate info', async () => {
    const certInfo = await sslCheckerService.getCertInfo(
      'google.com',
      // eslint-disable-next-line no-magic-numbers
      443,
      // eslint-disable-next-line no-magic-numbers
      1000,
    );
    expect(certInfo).toBeDefined();
  });

  test('should show SSL certificate days left', async () => {
    const remainingDays = await sslCheckerService.getRemainingDays(
      'google.com',
      // eslint-disable-next-line no-magic-numbers
      443,
      // eslint-disable-next-line no-magic-numbers
      1000,
    );
    console.log(remainingDays);
    expect(remainingDays.receivedData.remainingDays).toBeGreaterThan(0);
  });
});
