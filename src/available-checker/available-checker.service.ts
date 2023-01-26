// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '../logger/logger.service';
import { HealthCheckerService } from './health-checker/health-checker.service';
import { HttpCheckerService } from './http-checker/http-checker.service';
import { PingCheckerService } from './ping-checker/ping-checker.service';
import { SslCheckerService } from './ssl-checker/ssl-checker.service';

export enum CheckType {
  PING = 'PING',
  SSL = 'SSL',
  HTTP = 'HTTP',
  HEALTHCHECK = 'HEALTHCHECK',
}

export interface IPingReceivedData {
  time: number;
}

export interface ISslReceivedData {
  remainingDays: number;
}

export interface IHttpReceivedData {
  statusCode: number;
}

export interface IHealthcheckReceivedData {
  body: string;
}

export class CheckResult<T extends CheckType> {
  isAlive: boolean;
  type: T;
  receivedData: T extends CheckType.PING
    ? IPingReceivedData
    : T extends CheckType.SSL
    ? ISslReceivedData
    : T extends CheckType.HTTP
    ? IHttpReceivedData
    : T extends CheckType.HEALTHCHECK
    ? IHealthcheckReceivedData
    : never;
}

export class CheckResults {
  host: string;
  checkMethods: string[];
  healthCheck: CheckResult<CheckType.HEALTHCHECK>;
  httpCheck: CheckResult<CheckType.HTTP>;
  pingCheck: CheckResult<CheckType.PING>;
  sslCheck: CheckResult<CheckType.SSL>;
}

interface CheckParameters {
  host: string;
  methods: string[];
  port: number;
  timeout: number;
  healthSlug: string;
  responseBody: string;
  statusCode: number;
}

export class AvailableCheckerService {
  private logger: LoggerService;
  private healthChecker: HealthCheckerService;
  private httpChecker: HttpCheckerService;
  private pingChecker: PingCheckerService;
  private sslChecker: SslCheckerService;

  constructor() {
    this.logger = new LoggerService('AvailableCheckerService');
    this.healthChecker = new HealthCheckerService();
    this.httpChecker = new HttpCheckerService();
    this.pingChecker = new PingCheckerService();
    this.sslChecker = new SslCheckerService();
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity,complexity
  async check(data: CheckParameters): Promise<CheckResults> {
    const siteHost = new URL(data.host).host;
    const checkResults = new CheckResults();
    checkResults.host = siteHost;
    checkResults.checkMethods = data.methods;
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    for (const method of data.methods) {
      if (data.methods.includes('health')) {
        const healthResponse = await this.healthChecker.healthCheck(
          data.host,
          data.healthSlug,
          data.responseBody,
          data.statusCode,
        );
        this.logger.debug(
          healthResponse.isAlive
            ? `Host ${siteHost} is alive via health check.`
            : `Host ${siteHost} is dead via health check.`,
        );
        console.log(healthResponse);
        checkResults.healthCheck = healthResponse;
      } else {
        this.logger.debug(
          `[HEALTH CHECK] Health check is disabled for host "${data.host}"`,
        );
        checkResults.healthCheck = {
          isAlive: false,
          type: CheckType.HEALTHCHECK,
          receivedData: {
            body: 'Check is disabled',
          },
        };
      }

      if (data.methods.includes('http')) {
        const httpResponse = await this.httpChecker.httpCheck(data.host);
        this.logger.debug(
          httpResponse.isAlive
            ? `[HTTP CHECK] Result for "${data.host}": is alive, status code: ${httpResponse.receivedData.statusCode}`
            : `[HTTP CHECK] Result for "${data.host}": is dead, status code: ${httpResponse.receivedData.statusCode}`,
        );
        checkResults.httpCheck = httpResponse;
      } else {
        this.logger.debug(
          `[HTTP CHECK] HTTP check is disabled for host "${data.host}"`,
        );
        checkResults.httpCheck = {
          isAlive: false,
          type: CheckType.HTTP,
          receivedData: {
            statusCode: 0,
          },
        };
      }

      if (data.methods.includes('ping')) {
        const pingResponse = await this.pingChecker.ping(siteHost);
        this.logger.debug(
          pingResponse.receivedData.time > 0
            ? `[PING CHECK] Result for host ${siteHost} : is alive. Time: ${pingResponse.receivedData.time} ms`
            : `[PING CHECK] Result for host ${siteHost} : is dead.`,
        );
        checkResults.pingCheck = pingResponse;
      } else {
        this.logger.debug(
          `[PING CHECK] Ping check is disabled for host ${siteHost}`,
        );
        checkResults.pingCheck = {
          isAlive: false,
          type: CheckType.PING,
          receivedData: {
            time: 0,
          },
        };
      }

      if (data.methods.includes('ssl')) {
        try {
          const sslResponse = await this.sslChecker.getRemainingDays(
            siteHost,
            data.port,
            data.timeout,
          );
          this.logger.debug(
            sslResponse.receivedData.remainingDays > 0
              ? `[SSL CHECK] Result for host ${siteHost} : is alive. Time: ${sslResponse.receivedData.remainingDays} days`
              : `[SSL CHECK] Result for host ${siteHost} : is dead.`,
          );
          checkResults.sslCheck = sslResponse;
        } catch (error: any) {
          this.logger.error(
            `[SSl CHECK] Error for host ${siteHost} : ${error.code}`,
          );
          checkResults.sslCheck = {
            isAlive: false,
            type: CheckType.SSL,
            receivedData: {
              remainingDays: 0,
            },
          };
        }
      } else {
        this.logger.debug(
          `[SSL CHECK] SSL check is disabled for host ${siteHost}`,
        );
        checkResults.sslCheck = {
          isAlive: false,
          type: CheckType.SSL,
          receivedData: {
            remainingDays: 0,
          },
        };
      }
    }
    return checkResults;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async makeResolution(checkResult: CheckResults) {
    const checkResolution = {
      host: checkResult.host,
      checkMethods: checkResult.checkMethods,
      isAlive: false,
      message: '',
    };
    let aliveChecks = 0;
    if (checkResult.healthCheck.isAlive) {
      aliveChecks++;
    } else {
      checkResolution.message += 'Health check is dead. ';
    }
    if (checkResult.httpCheck.isAlive) {
      aliveChecks++;
    } else {
      checkResolution.message += 'HTTP check is dead. ';
    }
    if (checkResult.pingCheck.isAlive) {
      aliveChecks++;
    } else {
      checkResolution.message += 'Ping check is dead. ';
    }
    if (checkResult.sslCheck.isAlive) {
      aliveChecks++;
    } else {
      checkResolution.message += 'SSL check is dead. ';
    }
    // eslint-disable-next-line no-magic-numbers
    if (aliveChecks >= 3) {
      checkResolution.isAlive = true;
      // filter methods that are alive
      checkResolution.checkMethods = checkResult.checkMethods.filter(
        (method: string) => {
          switch (method) {
            case 'health': {
              return checkResult.healthCheck.isAlive;
            }
            case 'http': {
              return checkResult.httpCheck.isAlive;
            }
            case 'ping': {
              return checkResult.pingCheck.isAlive;
            }
            case 'ssl': {
              return checkResult.sslCheck.isAlive;
            }
            default: {
              return false;
            }
          }
        },
      );
      checkResolution.message = `Site is alive. Checks (${checkResolution.checkMethods}) are alive.`;
      console.log(checkResolution);
      return checkResolution;
    } else {
      checkResolution.isAlive = false;
      // filter methods that are dead
      checkResolution.checkMethods = checkResult.checkMethods.filter(
        (method: string) => {
          switch (method) {
            case 'health': {
              return !checkResult.healthCheck.isAlive;
            }
            case 'http': {
              return !checkResult.httpCheck.isAlive;
            }
            case 'ping': {
              return !checkResult.pingCheck.isAlive;
            }
            case 'ssl': {
              return !checkResult.sslCheck.isAlive;
            }
            default: {
              return false;
            }
          }
        },
      );
      checkResolution.message = `Site is dead. Checks (${checkResolution.checkMethods}) are dead.`;
      console.log(checkResolution);
      return checkResolution;
    }
  }
}
