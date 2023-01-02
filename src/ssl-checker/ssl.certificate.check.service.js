const tls = require('node:tls');
const {LoggerService} = require('../logger.service/logger.service');

class SslCertificateCheckService {
  constructor() {
    this.logger = new LoggerService('SslCertificateService');
  }

  async getSiteCertificate(host) {
    const socket = tls.connect({
      host: host,
      port: 443,
      servername: host
    }, () => {
      const peerCertificate = socket.getPeerCertificate();
      console.log(peerCertificate);
      const validTo = peerCertificate.valid_to;
      const validToMs = Date.parse(validTo);
      const nowMs = Date.now();
      const daysLeft = Math.round((validToMs - nowMs) / (1000 * 60 * 60 * 24));
      console.log(`DAYS LEFT: ${daysLeft}`);
      if (daysLeft <= 0) {
        this.logger.error(`SSL certificate for ${host} is expired. Valid to: ${validTo} days.`);
        return -1;
        // close socket
      } else {
        this.logger.debug(`SSL certificate for ${host} is valid. Valid to: ${validTo} days. Days left: ${daysLeft}.`);
        return daysLeft;
      }
    });
    socket.on('error', error => {
      console.log(`Error: ${ error.message}`);
    });
    socket.on('close', () => {});
  }
}


module.exports = {
  SslCertificateCheckService
};
