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
      console.log('❤️', new Date().toISOString(), '|', this.loggerName, '|', ...message);
    } else {
      console.log('❤️', this.loggerName, '|', ...message);
    }
  }

  error(...message: unknown[]) {
    if (!this.enabled) {
      return;
    }

    if (this.showTimestamp) {
      console.error('[ !!! ]', new Date().toISOString(), '|', this.loggerName, '|');
    } else {
      console.error('[ !!! ]', this.loggerName, '|', ...message);
    }
  }
}
