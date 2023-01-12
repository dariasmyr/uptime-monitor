const {SslCheckerService} = require('./ssl-checker.service.ts');

describe('Check SSL certificate service', () => {
  let sslCheckerService;

  beforeAll(() => {
    sslCheckerService = new SslCheckerService();
  });

  test('should show SSL certificate info', async () => {
    const certInfo = await sslCheckerService.getCertInfo('google.com', 443, 1000);
    expect(certInfo).toBeDefined();
  });

  test('should show SSL certificate days left', async () => {
    const remainingDays = await sslCheckerService.getRemainingDays('google.com', 443, 1000);
    console.log(remainingDays);
    expect(remainingDays).toBeGreaterThan(0);
  });
});
