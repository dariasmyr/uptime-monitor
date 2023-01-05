const axios = require('axios');
const {LoggerService} = require('../../logger/logger.service');

const logger = new LoggerService('HttpCheckerService');

class HttpCheckerService {
  constructor() {
    this.logger = new LoggerService('PingService');
  }
  async httpCheck(url) {
    const executionStart = Date.now();
    const HTTP_STATUS_OK_MIN = 200;
    const HTTP_STATUS_OK_MAX = 299;
    // Download url and check status is 200-299
    try {
      const httpRes = await axios.get(url);
      const result = {
        isAlive: (httpRes.status >= HTTP_STATUS_OK_MIN) && (httpRes.status <= HTTP_STATUS_OK_MAX),
        message: `HTTP status ${httpRes.status}`
      };
      logger.debug(url, 'OK', result.message);
      return result;
    } catch (error) {
      logger.error(url, 'ERR', error.message);
      return {
        isAlive: false,
        message: error.message.toString()
      };
    } finally {
      const executionEnd = Date.now();
      logger.debug(url, 'Execution time', executionEnd - executionStart, 'ms');
    }
  }
}


module.exports = {
  HttpCheckerService
};


