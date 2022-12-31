const {LoggerService} = require('../logger.service/logger.service');
const {exec} = require('node:child_process');

class PingService {
  constructor() {
    this.logger = new LoggerService('PingService');
  }

  /**
   * Ping host and return ping time in ms. Returns -1 if ping failed.
   * @param host {string}
   * @param count - number of pings
   * @returns {Promise<number>} ping time in ms
   */
  async ping(host, count = 1) {
    // run ping command and parse output
    const {stdout} = await exec(`ping -c ${count} ${host}`);
    const lines = stdout.split('\n');
    const lastLine = lines[lines.length - 2];
    const match = lastLine.match(/time=(\d+) ms/);
    if (match) {
      return Number.parseInt(match[1], 10);
    }
    return -1;
  }
}

module.exports = {
  PingService
};
