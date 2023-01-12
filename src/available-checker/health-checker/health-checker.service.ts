const axios = require('axios');
import {LoggerService} from '@/logger/logger.service';

const logger = new LoggerService('HealthCheckerService');

export class HealthCheckerService {
  private logger: LoggerService;
  constructor() {
    this.logger = new LoggerService('HttpService');
  }

  async healthCheck(url: string, healthSlug: string, responseBody: string, statusCode: number) {
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
    } catch (error: any) {
      logger.error(url, 'ERR', error.message);
      return {
        isAlive: false,
        responseBody: error.message.toString()
      };
    }
  }
}
