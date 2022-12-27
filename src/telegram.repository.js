const axios = require('axios');
const {LoggerService} = require('./logger.service');
const {Telegraf} = require('telegraf');
const {stringify} = require('./tools');

class TelegramRepository {
  constructor(_checkResultsRepository, _apiKey, _chatId, _dryRun) {
    this.apiKey = _apiKey;
    this.chatId = _chatId;
    this.dryRun = _dryRun;
    this.logger = new LoggerService('TelegramRepository');
    this.bot = new Telegraf(this.apiKey);
    this.bot.start((context) => {
      console.log(context);
      const results = _checkResultsRepository.getResults();
      return context.reply(`Uptime monitor is active \n', ${stringify(results)}.`);
    });
    this.bot.launch();
  }

  async sendMessage(message) {
    if (this.dryRun) {
      return this.logger.debug('[Telegram dry run message]', message);
    }
    try {
      this.logger.debug('sendMessage', message);
      const url = `https://api.telegram.org/bot${this.apiKey}/sendMessage?chat_id=${this.chatId}&text=${message}`;
      return await axios.get(url);
    } catch (error) {
      this.logger.error('Error while sending message to Telegram', error);
    }
    return false;
  }
}


module.exports = {
  TelegramRepository
};
