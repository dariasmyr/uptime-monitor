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

    log(...msg) {
        if (this.enabled === false) {
            return;
        }

        if (this.showTimestamp) {
            console.log(chalk.bgCyanBright(new Date().toISOString()), '|', this.loggerName, '|', chalk.magenta(...msg));
        } else {
            console.log(this.loggerName, '|', chalk.magenta(...msg));
        }
    }
}

module.exports = {
    LoggerService
}