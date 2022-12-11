const axios = require("axios");
const {LoggerService} = require("./logger.service");

class TelegramRepository {
    constructor(_apiKey, _chatId, _dryRun) {
        this.apiKey = _apiKey;
        this.chatId = _chatId;
        this.dryRun = _dryRun;
        this.logger = new LoggerService('TelegramRepository');
    }

    async sendMessage(message) {
        if (this.dryRun) {
            return this.logger.log('[Telegram dry run message]', message);
        }
        try {
            this.logger.log('sendMessage', message);
            const url = `https://api.telegram.org/bot${this.apiKey}/sendMessage?chat_id=${this.chatId}&text=${message}`;
            return await axios.get(url);
        } catch (err) {
            this.logger.log('Error while sending message to Telegram', err);
        }
    }
}

module.exports = {
    TelegramRepository
}