import chalk from "chalk";

export class LoggerService {
  // todo migrate logger to some good NPM library
  private readonly loggerName: string;
  private readonly showTimestamp: boolean;
  private readonly enabled: boolean;

  constructor(_loggerName: string, _showTimestamp = true) {
    if (!_loggerName) {
      throw new Error('Logger name is required');
    }

    this.loggerName = _loggerName;
    this.showTimestamp = _showTimestamp;
    this.enabled = true;
  }

  debug(...message: unknown[]) {
    if (!this.enabled) {
      return;
    }

    if (this.showTimestamp) {
      console.log(chalk.grey(new Date().toISOString()), '|', this.loggerName, '|', chalk.greenBright(...message));
    } else {
      console.log(this.loggerName, '|', chalk.cyan(...message));
    }
  }

  error(...message: unknown[]) {
    if (!this.enabled) {
      return;
    }

    if (this.showTimestamp) {
      console.log(chalk.grey(new Date().toISOString()), '|', this.loggerName, '|', chalk.red.bold(...message));
    } else {
      console.log(this.loggerName, '|', chalk.red.bold(...message));
    }
  }
}
