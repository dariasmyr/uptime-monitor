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
      console.log(
        '\u001B[32m',
        new Date().toISOString(),
        '|',
        this.loggerName,
        '|',
        ...message,
        '\u001B[0m',
      );
    } else {
      console.log('\u001B[32m', this.loggerName, '|', ...message, '\u001B[0m');
    }
  }

  error(...message: unknown[]) {
    if (!this.enabled) {
      return;
    }

    if (this.showTimestamp) {
      console.log(
        '\u001B[33m',
        new Date().toISOString(),
        '|',
        this.loggerName,
        '|',
        ...message,
        '\u001B[0m',
      );
    } else {
      console.log('\u001B[33m', this.loggerName, '|', ...message, '\u001B[0m');
    }
  }
}
