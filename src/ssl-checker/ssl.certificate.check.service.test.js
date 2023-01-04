const {SslCertificateCheckService} = require('./ssl.certificate.check.service.js');


describe('Check SSL certificate service', () => {
  const sslCertificateCheckService = new SslCertificateCheckService();

  test('should show SSL certificate info', async () => {
    const certInfo = await sslCertificateCheckService.getCertInfo('gyde.one');
    console.log(certInfo);
    const expected = {
      validFrom: 'Dec 25 12:47:27 2022 GMT',
      validTo: 'Mar 25 12:47:26 2023 GMT'
    };
    expect(certInfo).toMatchObject(expected);
  });

  test('should show SSL certificate days left', async () => {
    const remainingDays = await sslCertificateCheckService.getRemainingDays('gyde.one');
    console.log(remainingDays);
    expect(remainingDays).toBeGreaterThan(0);
  });
});
