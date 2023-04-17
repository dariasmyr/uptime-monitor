import axios from 'axios';
import { Telegraf } from 'telegraf';

import { CheckResultsRepository } from '../check-results/check-results.repository';
import { CheckResultsFormatterService } from '../check-results/check-results-formatter.service';
import { LoggerService } from '../logger/logger.service';

export class TelegramRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private checkResultsRepository: any;
  private logger: LoggerService;
  private readonly apiKey: string;
  private readonly chatId: string;
  private readonly dryRun: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private bot: any;

  constructor(
    _checkResultsRepository: CheckResultsRepository,
    _apiKey: string,
    _chatId: string,
    _dryRun: boolean,
  ) {
    this.logger = new LoggerService('TelegramRepository');

    this.apiKey = _apiKey;
    this.chatId = _chatId;
    this.dryRun = _dryRun;
    this.checkResultsRepository = _checkResultsRepository;

    this.bot = new Telegraf(this.apiKey);
    this.bot.command('status', this.processStatusCommand.bind(this));

    this.bot.launch();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processStatusCommand(telegrafContext: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any = this.checkResultsRepository.getResults();
    const checkResultsFormatterService = new CheckResultsFormatterService();
    return telegrafContext.reply(
      checkResultsFormatterService.formatResults(results),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendMessage(message: any) {
    if (this.dryRun) {
      this.logger.debug('[Telegram dry run message]', message);
      return true;
    }
    try {
      this.logger.debug('sendMessage', message);
      const url = `https://api.telegram.org/bot${this.apiKey}/sendMessage?chat_id=${this.chatId}&text=${message}`;
      const getResult = await axios.get(url);
      // eslint-disable-next-line no-magic-numbers
      if (getResult.status === 200) {
        this.logger.debug('getResult status', getResult.status);
        return true;
      } else {
        this.logger.error('Telegram error, ', getResult.status);
        return false;
      }
    } catch (error) {
      this.logger.error('Error while sending message to Telegram', error);
    }
    return false;
  }
}
