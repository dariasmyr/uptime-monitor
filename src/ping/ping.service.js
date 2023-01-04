const ping = require('ping');

const {LoggerService} = require('../logger/logger.service');

class PingService {
  constructor() {
    this.logger = new LoggerService('PingService');
  }

  async ping(host) {
    const result = await ping.promise.probe(host, {
      timeout: 2,
      extra: ['-c', '1'] //todo replace by 3 attempts
    });
    this.logger.debug(result);

    const pingResponse = {
      isAlive: result.alive,
      time: Number.parseInt(result.avg, 10)
    };

    if (pingResponse.isAlive) {
      this.logger.debug(`Host ${host} is alive. Time: ${pingResponse.time} ms`);
      return pingResponse;
    } else {
      this.logger.error(`Host ${host} is dead.`);
      pingResponse.time = -1;
      return pingResponse;
    }
  }
}

module.exports = {
  PingService
};
