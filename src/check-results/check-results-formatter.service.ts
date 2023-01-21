import {LoggerService} from '../logger/logger.service';

export class CheckResultsFormatterService {
  private logger: LoggerService;
  constructor() {
    this.logger = new LoggerService('CheckResultsFormatterService');
  }
  // eslint-disable-next-line sonarjs/cognitive-complexity,complexity
  formatResults(checkResults: Map<string, any>): string {
    let formattedResults: string = '';
    for (const [url, result] of Object.entries(checkResults)) {
      formattedResults += '\n-------\n';
      formattedResults += `Host: ${url}\n`;
      formattedResults += result.checkMethods.includes('health') ? `Health check: ${result.healthResults.isAlive ? 'OK' : 'FAIL'} (${result.healthResults.body})\n` : 'Health check: disabled\n';
      formattedResults += result.checkMethods.includes('http') ? `HTTP: ${result.httpResults.isAlive ? 'OK' : 'FAIL'} (${result.httpResults.statusCode})\n` : 'HTTP: disabled\n';
      formattedResults += result.checkMethods.includes('ping') ? `Ping: ${result.pingResults.isAlive ? 'OK' : 'FAIL'} (${result.pingResults.time} ms)\n` : 'Ping: disabled\n';
      formattedResults += result.checkMethods.includes('ssl') ? `SSL: ${result.sslResults.isAlive ? 'OK' : 'FAIL'} (Certificate will expire in ${result.sslResults.remainingDays} days)` : 'SSL: disabled';
    }

    formattedResults = formattedResults.trim();

    return formattedResults;
  }
}
