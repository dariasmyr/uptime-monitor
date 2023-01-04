const {SslCertificateCheckService} = require('./ssl-certificate-check.service.js');

describe('Check SSL certificate service', () => {
  let sslCertificateCheckService;

  beforeAll(() => {
    sslCertificateCheckService = new SslCertificateCheckService();
  });

  test('should show SSL certificate info', async () => {
    const certInfo = await sslCertificateCheckService.getCertInfo('google.com');
    expect(certInfo).toBeDefined();
  });

  test('should show SSL certificate days left', async () => {
    const remainingDays = await sslCertificateCheckService.getRemainingDays('google.com');
    console.log(remainingDays);
    expect(remainingDays).toBeGreaterThan(0);
  });
});
