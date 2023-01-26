import axios from 'axios';

import { LoggerService } from '../../logger/logger.service';
import { CheckResult, CheckType } from '../available-checker.service';

const logger = new LoggerService('HealthCheckerService');

export class HealthCheckerService {
  private logger: LoggerService;
  constructor() {
    this.logger = new LoggerService('HttpService');
  }

  async healthCheck(
    url: string,
    healthSlug: string,
    responseBody: string,
    statusCode: number,
  ): Promise<CheckResult<CheckType.HEALTHCHECK>> {
    try {
      const healthResponse = await axios.get(`${url}/${healthSlug}`);
      const resultBody = healthResponse.data;
      const resultStatus = healthResponse.status;
      if (resultBody === responseBody && resultStatus === statusCode) {
        logger.debug(url, 'Body', resultBody, 'Status', resultStatus);
        return {
          isAlive: true,
          type: CheckType.HEALTHCHECK,
          receivedData: {
            body: resultBody,
          },
        };
      } else {
        logger.error(url, 'ERR', 'No data in response body');
        return {
          isAlive: false,
          type: CheckType.HEALTHCHECK,
          receivedData: {
            body: 'Not found',
          },
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error(url, 'ERR', error.message);
      return {
        isAlive: false,
        type: CheckType.HEALTHCHECK,
        receivedData: {
          body: error.message.toString(),
        },
      };
    }
  }
}
