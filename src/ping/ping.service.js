const icmp = require('icmp');
const {LoggerService} = require('../logger.service/logger.service');
const os = require('node:os');

const NON_ROOT_ERR_MSG = 'You must run ping service as root';

class PingService {
  constructor() {
    this.logger = new LoggerService('PingService');
    this.currentUsername = os.userInfo().username;
    if (this.currentUsername !== 'root') {
      this.logger.error(NON_ROOT_ERR_MSG);
    }
  }

  /**
   * Ping host and return ping time in ms. Returns -1 if ping failed.
   * @param host
   * @returns {Promise<number>}
   */
  async ping(host) {
    if (this.currentUsername !== 'root') {
      this.logger.error(NON_ROOT_ERR_MSG);
      return -1;
    }
    const object = await icmp.ping(host);
    return object.elapsed;
  }
}

module.exports = {
  PingService
};
