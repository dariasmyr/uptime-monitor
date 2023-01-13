import {CheckType, CheckResult} from "@/available-checker/available-checker.service";

const axios = require('axios');
import {LoggerService} from '@/logger/logger.service';

const logger = new LoggerService('HealthCheckerService');

export class HealthCheckerService {
  private logger: LoggerService;
  constructor() {
    this.logger = new LoggerService('HttpService');
  }

  async healthCheck(url: string, healthSlug: string, responseBody: string, statusCode: number):
      Promise < CheckResult < CheckType.HEALTHCHECK >>
  {
    try {
      const healthRes = await axios.get(`${url}/${healthSlug}`);
      const resultBody = healthRes.data;
      const resultStatus = healthRes.status;
      if (resultBody === responseBody && resultStatus === statusCode) {
        logger.debug(url, 'Body', resultBody, 'Status', resultStatus);
        return {
            isAlive: true,
            type: CheckType.HEALTHCHECK,
            receivedData: {
                body: resultBody
            }
        }
      } else {
        logger.error(url, 'ERR', 'No data in response body');
        return {
            isAlive: false,
            type: CheckType.HEALTHCHECK,
            receivedData: {
                body: 'Not found'
            }
        }
      }
    } catch (error: any) {
      logger.error(url, 'ERR', error.message);
      return {
            isAlive: false,
            type: CheckType.HEALTHCHECK,
            receivedData: {
                body: error.message.toString()
            }
      }
    }
  }
}
