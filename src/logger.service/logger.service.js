const chalk = require('chalk');

class LoggerService {
  constructor(_loggerName, _showTimestamp = true) {
    if (!_loggerName) {
      throw new Error('Logger name is required');
    }

    this.loggerName = _loggerName;
    this.showTimestamp = _showTimestamp;
    this.enabled = true;
  }

  debug(...message) {
    if (this.enabled === false) {
      return;
    }

    if (this.showTimestamp) {
      console.log(chalk.grey(new Date().toISOString()), '|', this.loggerName, '|', chalk.cyan(...message));
    } else {
      console.log(this.loggerName, '|', chalk.cyan(...message));
    }
  }

  error(...message) {
    if (this.enabled === false) {
      return;
    }

    if (this.showTimestamp) {
      console.log(chalk.grey(new Date().toISOString()), '|', this.loggerName, '|', chalk.red.bold(...message));
    } else {
      console.log(this.loggerName, '|', chalk.red.bold(...message));
    }
  }
}

module.exports = {
  LoggerService
};
