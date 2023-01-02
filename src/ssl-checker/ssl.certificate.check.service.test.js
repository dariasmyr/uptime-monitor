const {SslCertificateCheckService} = require('./ssl.certificate.check.service.js');


describe('Check SSL certificate service', () => {
  const sslCertificateCheckService = new SslCertificateCheckService();

  test('should show SSL certificate', async () => {
    const results = await sslCertificateCheckService.getSiteCertificate('medium.com');
    expect(results).toBe(true);
  });
});
