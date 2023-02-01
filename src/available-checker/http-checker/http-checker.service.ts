import axios from 'axios';

import { LoggerService } from '../../logger/logger.service';
import { CheckResult, CheckType } from '../available-checker.service';

const logger = new LoggerService('HttpCheckerService');

export class HttpCheckerService {
  private logger: LoggerService;
  constructor() {
    this.logger = new LoggerService('HttpService');
  }
  async httpCheck(url: string): Promise<CheckResult<CheckType.HTTP>> {
    const executionStart = Date.now();
    const HTTP_STATUS_OK_MIN = 200;
    const HTTP_STATUS_OK_MAX = 299;
    // Download url and check status is 200-299
    try {
      const httpResponse = await axios.get(url);
      logger.debug(
        url,
        'OK',
        `${httpResponse.status} ${httpResponse.statusText}`,
      );
      return {
        isAlive:
          httpResponse.status >= HTTP_STATUS_OK_MIN &&
          httpResponse.status <= HTTP_STATUS_OK_MAX,
        type: CheckType.HTTP,
        receivedData: {
          statusCode: httpResponse.status,
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error(url, 'ERR', error.message);
      return {
        isAlive: false,
        type: CheckType.HTTP,
        receivedData: {
          // eslint-disable-next-line unicorn/no-null
          statusCode: null,
        },
      };
    } finally {
      const executionEnd = Date.now();
      logger.debug(url, 'Execution time', executionEnd - executionStart, 'ms');
    }
  }
}
