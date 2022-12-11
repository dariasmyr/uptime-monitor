const chalk = require("chalk");

class LoggerService {
    constructor(_loggerName, _showTimestamp = true) {
        if (!_loggerName) {
            throw new Error('Logger name is required');
        }

        this.loggerName = _loggerName;
        this.showTimestamp = _showTimestamp;
        this.enabled = true;
    }

    debug(...msg) {
        if (this.enabled === false) {
            return;
        }

        if (this.showTimestamp) {
            console.log(chalk.grey(new Date().toISOString()), '|', this.loggerName, '|', chalk.cyan(...msg));
        } else {
            console.log(this.loggerName, '|', chalk.cyan(...msg));
        }
    }

    error(...msg) {
        if (this.enabled === false) {
            return;
        }

        if (this.showTimestamp) {
            console.log(chalk.grey(new Date().toISOString()), '|', this.loggerName, '|', chalk.red.bold(...msg));
        } else {
            console.log(this.loggerName, '|', chalk.red.bold(...msg));
        }
    }
}

module.exports = {
    LoggerService
}