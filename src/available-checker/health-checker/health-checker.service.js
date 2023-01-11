const axios = require('axios');
const {LoggerService} = require('../../logger/logger.service');

const logger = new LoggerService('HealthCheckerService');

class HealthCheckerService {
  constructor() {
    this.logger = new LoggerService('HttpService');
  }

  async healthCheck(url) {
    try {
      const healthRes = await axios.get(url);
      const result = healthRes.data;
      if (healthRes.data) {
        logger.debug(url, 'OK', result);
        return {
          isAlive: true,
          responseBody: 'OK'
        };
      } else {
        logger.error(url, 'ERR', 'No data in response');
        return {
          isAlive: false,
          responseBody: 'Not found'
        };
      }
    } catch (error) {
      logger.error(url, 'ERR', error.message);
      return {
        isAlive: false,
        responseBody: error.message.toString()
      };
    }
  }
}

module.exports = {
  HealthCheckerService
};
