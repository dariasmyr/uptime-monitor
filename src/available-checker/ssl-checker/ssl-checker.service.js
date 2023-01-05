const tls = require('node:tls');
const {LoggerService} = require('../../logger/logger.service');

class SslCheckerService {
  constructor() {
    this.logger = new LoggerService('SslCertificateService');
  }

  getCertInfo(_host) {
    const options = {
      host: _host,
      port: 443, // todo move to parameter
      servername: _host
    };
    const timeout = 5000; // todo move to config
    return new Promise((resolve, reject) => {
      const result = {};
      const socket = tls.connect(options);
      socket.setTimeout(timeout);

      socket.once('secureConnect', () => {
        const peerCertificate = socket.getPeerCertificate();
        result.validFrom = peerCertificate.valid_from;
        result.validTo = peerCertificate.valid_to;
        socket.destroy();
      });

      socket.once('close', () => {
        resolve(result);
      });

      socket.once('error', (error) => {
        reject(error);
      });

      socket.once('timeout', () => {
        reject(new Error(`Timeout after ${timeout} ms for ${options}`));
      });
    });
  }

  // calculate the remaining days of this certificate
  async getRemainingDays(_host) {
    const certInfo = await this.getCertInfo(_host);
    const certExpirationDate = new Date(certInfo.validTo).getTime();
    const now = Date.now();
    if (certExpirationDate < now) {
      this.logger.error('Certificate is expired');
      return -1;
    } else {
      // eslint-disable-next-line no-magic-numbers
      const MS_IN_ONE_DAY = 1000 / 60 / 60 / 24;
      const remainingDays = Math.floor((certExpirationDate - now) / MS_IN_ONE_DAY);
      this.logger.debug(`Certificate is valid for ${remainingDays} days`);
      return remainingDays;
    }
  }
}

module.exports = {
  SslCheckerService
};
