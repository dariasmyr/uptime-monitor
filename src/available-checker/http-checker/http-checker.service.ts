import {CheckResult, CheckType} from "../available-checker.service";
import {LoggerService} from '../../logger/logger.service';

import axios from "axios";

const logger = new LoggerService('HttpCheckerService');

export class HttpCheckerService {
  private logger: LoggerService;
  constructor() {
    this.logger = new LoggerService('HttpService');
  }
  async httpCheck(url: string): Promise  < CheckResult < CheckType.HTTP >> {
    const executionStart = Date.now();
    const HTTP_STATUS_OK_MIN = 200;
    const HTTP_STATUS_OK_MAX = 299;
    // Download url and check status is 200-299
    try {
      const httpRes = await axios.get(url);
      logger.debug(url, 'OK', httpRes.status + ' ' + httpRes.statusText);
      return {
        isAlive: (httpRes.status >= HTTP_STATUS_OK_MIN) && (httpRes.status <= HTTP_STATUS_OK_MAX),
        type: CheckType.HTTP,
        receivedData: {
          statusCode: httpRes.status
        }
      };
    } catch (error: any) {
      logger.error(url, 'ERR', error.message);
      return {
        isAlive: false,
        type: CheckType.HTTP,
        receivedData: {
            statusCode: error.code
        }
      }
    } finally {
      const executionEnd = Date.now();
      logger.debug(url, 'Execution time', executionEnd - executionStart, 'ms');
    }
  }
}

