const ping = require('net-ping');
const {LoggerService} = require('../logger.service/logger.service');

class PingService {
  constructor(
  ) {
    this.session = ping.createSession();
    this.logger = new LoggerService('PingService');
  }

  async ping(target) {
    this.session.pingHost(target, (error, _target) => {
      if (error) {
        this.logger.error(`${_target}: ${error.toString()}`);
      } else {
        this.logger.debug(`${_target}: Alive`);
      }
    });
  }
}

module.exports = {
  PingService
};
