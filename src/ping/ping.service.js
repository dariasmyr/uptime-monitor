const {LoggerService} = require('../logger.service/logger.service');
const {exec} = require('node:child_process');

class PingService {
  constructor() {
    this.logger = new LoggerService('PingService');
  }

  /**
   * Ping host and return ping time in ms. Returns -1 if ping failed.
   * @param host {string}
   * @param count - number of pings
   * @returns {Promise<number>} ping time in ms
   */
  async ping(host, count = 1) {
    // run ping command from console
    const command = `ping -c ${count} ${host}`;
    this.logger.debug(`Run command: ${command}`);
    const result = exec(command, (error, stdout, stderr) => {
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
    );

    // parse ping time
    const regex = /time=(\d+) ms/g;
    const stdout = await result.stdout;
    console.log('stdout', stdout);
    const matches = [...stdout.toString().matchAll(regex)];
    console.log('matches', matches);
    console.log('matches length', matches.length);
    if (matches.length === 0) {
      this.logger.error('Ping failed');
      return -1;
    }
    const pingTime = matches[matches.length - 1][1];
    this.logger.debug(`Ping time: ${pingTime} ms`);
    return pingTime;
  }
}

module.exports = {
  PingService
};
