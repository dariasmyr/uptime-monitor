import {CheckResult, CheckType} from "../available-checker.service";
import {LoggerService} from '../../logger/logger.service';

import ping from "ping";

export class PingCheckerService {
  private logger: LoggerService;
  constructor() {
    this.logger = new LoggerService('PingService');
  }

  async ping(host: string): Promise < CheckResult < CheckType.PING >>  {
    const result = await ping.promise.probe(host, {
      timeout: 2,
      extra: ['-c', '3']
    });

    const pingResponse = {
      isAlive: result.alive,
      timeMs: Number.parseInt(result.avg, 10)
    };

    if (pingResponse.isAlive) {
      this.logger.debug(`Host ${host} is alive. Time: ${pingResponse.timeMs} ms`);
      return {
        isAlive: true,
        type: CheckType.PING,
        receivedData: {
            time: pingResponse.timeMs
        }
      }
    } else {
      this.logger.error(`Host ${host} is dead.`);
      pingResponse.timeMs = -1;
      return {
        isAlive: false,
        type: CheckType.PING,
        receivedData: {
            time: pingResponse.timeMs
        }
      }
    }
  }
}

