const {SslCheckerService} = require('./ssl-checker.service.js');

describe('Check SSL certificate service', () => {
  let sslCheckerService;

  beforeAll(() => {
    sslCheckerService = new SslCheckerService();
  });

  test('should show SSL certificate info', async () => {
    const certInfo = await sslCheckerService.getCertInfo('google.com');
    expect(certInfo).toBeDefined();
  });

  test('should show SSL certificate days left', async () => {
    const remainingDays = await sslCheckerService.getRemainingDays('google.com');
    console.log(remainingDays);
    expect(remainingDays).toBeGreaterThan(0);
  });
});
