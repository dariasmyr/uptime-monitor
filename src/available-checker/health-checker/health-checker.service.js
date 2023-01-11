const axios = require('axios');
const {LoggerService} = require('../../logger/logger.service');

const logger = new LoggerService('HealthCheckerService');

class HealthCheckerService {
  constructor() {
    this.logger = new LoggerService('HttpService');
  }

  async healthCheck(url, healthSlug, responseBody, statusCode) {
    try {
      const healthRes = await axios.get(`${url}/${healthSlug}`);
      const resultBody = healthRes.data;
      const resultStatus = healthRes.status;
      if (resultBody === responseBody && resultStatus === statusCode) {
        logger.debug(url, 'Body', resultBody, 'Status', resultStatus);
        return {
          isAlive: true,
          responseBody: resultBody
        };
      } else {
        logger.error(url, 'ERR', 'No data in response body');
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
