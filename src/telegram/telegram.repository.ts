import axios from 'axios';
import { CheckResultsRepository } from '../check-results/check-results.repository';

import {Telegraf} from 'telegraf';
import {CheckResultsFormatterService} from "../check-results/check-results-formatter.service";
import {LoggerService} from "../logger/logger.service";

export class TelegramRepository {
  private checkResultsRepository: any;
  private logger: LoggerService;
  private readonly apiKey: string;
  private readonly chatId: string;
  private readonly dryRun: boolean;
  private bot: any;

  constructor(_checkResultsRepository: CheckResultsRepository, _apiKey: string, _chatId: string, _dryRun: boolean) {
    this.logger = new LoggerService('TelegramRepository');

    this.apiKey = _apiKey;
    this.chatId = _chatId;
    this.dryRun = _dryRun;
    this.checkResultsRepository = _checkResultsRepository;

    this.bot = new Telegraf(this.apiKey);
    this.bot.command('status', this.processStatusCommand.bind(this));

    this.bot.launch();
  }

  processStatusCommand(telegrafContext: any) {
    const results: any = this.checkResultsRepository.getResults();
    const checkResultsFormatterService = new CheckResultsFormatterService();
    return telegrafContext.reply(checkResultsFormatterService.formatResults(results));
  }

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
