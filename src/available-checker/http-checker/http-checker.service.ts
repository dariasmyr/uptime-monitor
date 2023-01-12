const axios = require('axios');
import {LoggerService} from '@/logger/logger.service';

const logger = new LoggerService('HttpCheckerService');

export class HttpCheckerService {
  private logger: LoggerService;
  constructor() {
    this.logger = new LoggerService('HttpService');
  }
  async httpCheck(url: string) {
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
    } catch (error: any) {
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

