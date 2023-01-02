const tls = require('node:tls');
const {LoggerService} = require('../logger.service/logger.service');

class SslCertificateCheckService {
  constructor() {
    this.logger = new LoggerService('PingService');
  }

  async getSiteCertificate(host) {
    const socket = tls.connect({
      host: host,
      port: 443,
      servername: host
    }, () => {
      const peerCertificate = socket.getPeerCertificate();
      console.log(peerCertificate);
      socket.destroy();
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
