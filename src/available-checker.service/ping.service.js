const ping = require('ping');
const {LoggerService} = require('../logger.service/logger.service');

class PingService {
  constructor() {
    this.logger = new LoggerService('PingService');
  }
  async ping(host) {
    ping.sys.probe(host, (isAlive) => {
      this.logger.debug(isAlive);
      const message = isAlive ? `host ${ host } is alive` : `host ${ host } is dead`;
      this.logger.debug(message);
      return isAlive;
    }, {timeout: 2, extra: ['-i', '2']});
  }
}

module.exports = {
  PingService
};
