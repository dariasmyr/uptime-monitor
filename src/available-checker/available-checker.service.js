const {HealthCheckerService} = require('./health-checker/health-checker.service');
const {HttpCheckerService} = require('./http-checker/http-checker.service');
const {PingCheckerService} = require('./ping-checker/ping-checker.service');
const {SslCheckerService} = require('./ssl-checker/ssl-checker.service');
const {LoggerService} = require('../logger/logger.service');

class AvailableCheckerService {
  constructor() {
    this.logger = new LoggerService('AvailableCheckerService');
    this.healthChecker = new HealthCheckerService();
    this.httpChecker = new HttpCheckerService();
    this.pingChecker = new PingCheckerService();
    this.sslChecker = new SslCheckerService();
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity,complexity
  async check(host, methods, port, timeout, healthSlug, responseBody, statusCode) {
    const siteHost = new URL(host).host;
    const checkResults =
        {
          host: siteHost,
          checkMethods: methods,
          healthCheck: {},
          httpCheck: {},
          pingCheck: {},
          sslCheck: {}
        };

    // eslint-disable-next-line no-unused-vars
    for (const method of methods) {
      if (methods.includes('health')) {
        const healthResponse = await this.healthChecker.healthCheck(host, healthSlug, responseBody, statusCode);
        this.logger.debug(healthResponse.isAlive === true ? `Host ${siteHost} is alive via health check.` : `Host ${siteHost} is dead via health check.`);
        console.log(healthResponse);
        checkResults.healthCheck = healthResponse;
      } else {
        this.logger.debug(`[HEALTH CHECK] Health check is disabled for host "${host}"`);
        checkResults.healthCheck = {
          isAlive: 'disabled',
          responseBody: 'Health check is disabled'
        };
      }

      if (methods.includes('http')) {
        const httpResponse = await this.httpChecker.httpCheck(host);
        this.logger.debug(httpResponse.isAlive === true ? `[HTTP CHECK] Result for "${host}": is alive, message: ${httpResponse.message}` : `[HTTP CHECK] Result for "${host}": is dead, message: ${httpResponse.message}`);
        checkResults.httpCheck = httpResponse;
      } else {
        this.logger.debug(`[HTTP CHECK] HTTP check is disabled for host "${host}"`);
        checkResults.httpCheck = {
          isAlive: 'disabled',
          message: 'HTTP check is disabled'
        };
      }

      if (methods.includes('ping')) {
        const pingResponse = await this.pingChecker.ping(siteHost);
        this.logger.debug(pingResponse.timeMs > 0 ? `[PING CHECK] Result for host ${siteHost} : is alive. Time: ${pingResponse.timeMs} ms` : `[PING CHECK] Result for host ${siteHost} : is dead.`);
        checkResults.pingCheck = pingResponse;
      } else {
        this.logger.debug(`[PING CHECK] Ping check is disabled for host ${siteHost}`);
        checkResults.pingCheck = {
          isAlive: 'disabled',
          message: 'Ping check is disabled'
        };
      }

      if (methods.includes('ssl')) {
        try {
          const sslResponse = await this.sslChecker.getRemainingDays(siteHost, port, timeout);
          this.logger.debug(sslResponse > 0 ? `[SSL CHECK] Result for host ${siteHost} : is alive. Time: ${sslResponse} days` : `[SSL CHECK] Result for host ${siteHost} : is dead.`);
          checkResults.sslCheck.isAlive = true;
          checkResults.sslCheck.daysLeft = sslResponse;
        } catch (error) {
          this.logger.error(`[SSl CHECK] Error for host ${siteHost} : ${error.code}`);
          checkResults.sslCheck = {
            isAlive: 'undefined',
            daysLeft: -1
          };
        }
      } else {
        this.logger.debug(`[SSL CHECK] SSL check is disabled for host ${siteHost}`);
        checkResults.sslCheck = {
          isAlive: 'disabled',
          daysLeft: -1
        };
      }
    }
    return checkResults;
  }

  async makeResolution(checkResult) {
    const checkResolution = {
      host: checkResult.host,
      isAlive: false,
      message: ''
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
      checkResolution.checkMethods = checkResult.checkMethods.filter(method => checkResult[`${method}Check`].isAlive);
      checkResolution.message = `Site is alive. Checks (${checkResolution.checkMethods}) are alive.`;
      console.log(checkResolution);
      return checkResolution;
    } else {
      checkResolution.isAlive = false;
      // filter methods that are dead
      checkResolution.checkMethods = checkResult.checkMethods.filter(method => !checkResult[`${method}Check`].isAlive);
      checkResolution.message = `Site is dead. Checks (${checkResolution.checkMethods}) are dead.`;
      console.log(checkResolution);
      return checkResolution;
    }
  }
}


module.exports = {
  AvailableCheckerService
};
