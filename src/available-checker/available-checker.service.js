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
  async check(host, methods) {
    const siteHost = new URL(host).host;
    const checkResults =
        {
          host: siteHost,
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
        this.logger.debug(`[HTTP CHECK] Skip http check for "${host}"`);
      }

      if (methods.includes('ping')) {
        const pingResponse = await this.pingChecker.ping(siteHost);
        this.logger.debug(pingResponse.time > 0 ? `[PING CHECK] Result for host ${siteHost} : is alive. Time: ${pingResponse.time} ms` : `[PING CHECK] Result for host ${siteHost} : is dead.`);
        checkResults.pingCheck = pingResponse;
      } else {
        this.logger.debug(`[PING CHECK] Ping check is disabled for host ${siteHost}`);
      }

      if (methods.includes('ssl')) {
        try {
          const sslResponse = await this.sslChecker.getRemainingDays(siteHost);
          this.logger.debug(sslResponse > 0 ? `[SSL CHECK] Result for host ${siteHost} : is alive. Time: ${sslResponse} days` : `[SSL CHECK] Result for host ${siteHost} : is dead.`);
          checkResults.sslCheck = sslResponse;
        } catch (error) {
          this.logger.error(`[SSl CHECK] Error for host ${siteHost} : ${error.code}`);
        }
      } else {
        this.logger.debug(`[SSL CHECK] SSL check is disabled for host ${siteHost}`);
      }
    }
    return checkResults;
  }
}


module.exports = {
  AvailableCheckerService
};
