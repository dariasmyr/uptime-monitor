const {HttpCheckerService} = require('./http-checker/http-checker.service');
const {PingCheckerService} = require('./ping-checker/ping-checker.service');
const {SslCheckerService} = require('./ssl-checker/ssl-checker.service');
const {LoggerService} = require('../logger/logger.service');

class AvailableCheckerService {
  constructor() {
    this.logger = new LoggerService('AvailableCheckerService');
    this.httpChecker = new HttpCheckerService();
    this.pingChecker = new PingCheckerService();
    this.sslChecker = new SslCheckerService();
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity,complexity
  async check(host, methods, port, timeout) {
    const siteHost = new URL(host).host;
    const checkResults =
        {
          host: siteHost,
          checkMethods: methods,
          httpCheck: {},
          pingCheck: {},
          sslCheck: {}
        };

    // eslint-disable-next-line no-unused-vars
    for (const method of methods) {
      if (methods.includes('http')) {
        const httpResponse = await this.httpChecker.httpCheck(host);
        this.logger.debug(httpResponse.isAlive === true ? `[HTTP CHECK] Result for "${host}": is alive, message: ${httpResponse.message}` : `[HTTP CHECK] Result for "${host}": is dead, message: ${httpResponse.message}`);
        checkResults.httpCheck = httpResponse;
      } else {
        this.logger.debug(`[HTTP CHECK] HTTP check is disabled for host "${host}"`);
      }

      if (methods.includes('ping')) {
        const pingResponse = await this.pingChecker.ping(siteHost);
        this.logger.debug(pingResponse.timeMs > 0 ? `[PING CHECK] Result for host ${siteHost} : is alive. Time: ${pingResponse.timeMs} ms` : `[PING CHECK] Result for host ${siteHost} : is dead.`);
        checkResults.pingCheck = pingResponse;
      } else {
        this.logger.debug(`[PING CHECK] Ping check is disabled for host ${siteHost}`);
      }

      if (methods.includes('ssl')) {
        try {
          const sslResponse = await this.sslChecker.getRemainingDays(siteHost, port, timeout);
          this.logger.debug(sslResponse > 0 ? `[SSL CHECK] Result for host ${siteHost} : is alive. Time: ${sslResponse} days` : `[SSL CHECK] Result for host ${siteHost} : is dead.`);
          checkResults.sslCheck.isAlive = true;
          checkResults.sslCheck.daysLeft = sslResponse;
        } catch (error) {
          this.logger.error(`[SSl CHECK] Error for host ${siteHost} : ${error.code}`);
        }
      } else {
        this.logger.debug(`[SSL CHECK] SSL check is disabled for host ${siteHost}`);
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
    if (aliveChecks >= 2) {
      checkResolution.isAlive = true;
      checkResolution.message = 'Site is alive. 2 of 3 checks are alive.';
      console.log(checkResolution);
      return checkResolution;
    } else {
      checkResolution.isAlive = false;
      checkResolution.message = 'Site is dead. 2 of 3 checks are dead.';
      console.log(checkResolution);
      return checkResolution;
    }
  }
}


module.exports = {
  AvailableCheckerService
};
