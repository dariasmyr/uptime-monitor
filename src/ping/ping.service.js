const {LoggerService} = require('../logger.service/logger.service');
const ping = require('ping');

class PingService {
  constructor() {
    this.logger = new LoggerService('PingService');
  }

  async ping(host) {
    const result = await ping.promise.probe(host, {
      timeout: 2,
      extra: ['-c', '3']
    });
    console.log(result);
    if (result.alive) {
      this.logger.debug(`Host ${host} is alive. Time: ${result.avg} ms`);
      return Number.parseInt(result.avg, 10);
    } else {
      this.logger.debug(`Host ${host} is dead.`);
      return -1;
    }
  }
}

module.exports = {
  PingService
};
