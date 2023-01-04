const axios = require('axios');
const {LoggerService} = require('../logger.service/logger.service');
const {Telegraf} = require('telegraf');
const {stringify} = require('../tools/tools');

class TelegramRepository {
  constructor(_checkResultsRepository, _apiKey, _chatId, _dryRun) {
    this.apiKey = _apiKey;
    this.chatId = _chatId;
    this.dryRun = _dryRun;
    this.logger = new LoggerService('TelegramRepository');
    this.bot = new Telegraf(this.apiKey);
    this.bot.command('httpstats', (context) => {
      console.log(context);
      const httpResults = _checkResultsRepository.getHttpResults();
      return context.reply(`Uptime monitor is active! \n Http check stats: ', ${stringify(httpResults)}.`);
    });
    this.bot.command('pingstats', (context) => {
      console.log(context);
      const pingResults = _checkResultsRepository.getPingResults();
      return context.reply(`Uptime monitor is active! \n Ping check stats: ', ${stringify(pingResults)}.`);
    });
    this.bot.command('sslstats', (context) => {
      console.log(context);
      const sslResults = _checkResultsRepository.getSslResults();
      return context.reply(`Uptime monitor is active! \n SSl Cert check stats: ', ${stringify(sslResults)}.`);
    });
    this.bot.launch();
  }

  async sendMessage(message) {
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


module.exports = {
  TelegramRepository
};
