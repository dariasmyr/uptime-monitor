const ping = require('ping');

const {LoggerService} = require('../../logger/logger.service');

class PingCheckerService {
  constructor() {
    this.logger = new LoggerService('PingService');
  }

  async ping(host) {
    const result = await ping.promise.probe(host, {
      timeout: 2,
      extra: ['-c', '3']
    });

    const pingResponse = {
      isAlive: result.alive,
      timeMs: Number.parseInt(result.avg, 10)
    };

    if (pingResponse.isAlive) {
      this.logger.debug(`Host ${host} is alive. Time: ${pingResponse.timeMs} ms`);
      return pingResponse;
    } else {
      this.logger.error(`Host ${host} is dead.`);
      pingResponse.timeMs = -1;
      return pingResponse;
    }
  }
}

module.exports = {
  PingCheckerService
};
